import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export const getUserByUID = async (uid) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userId", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    }
    // Assuming there's only one user with a given UID, you can directly access the first document.
    const userDoc = querySnapshot.docs[0];

    // Access user data
    const userData = userDoc.data();
    return userData;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const getLastWaybillSequence = async (itemName) => {
  try {
    const trucksRef = collection(db, "trucks");
    const q = query(
      trucksRef,
      where("item", "==", itemName),
      orderBy("sequenceNumber", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return 0;
    }
    // Assuming there's only one doc with a given UID, you can directly access the first document.
    const truckDoc = querySnapshot.docs[0];
    console.log(truckDoc);

    // Access user data
    const sequenceNumber = truckDoc.data().sequenceNumber || 0;
    return sequenceNumber;
  } catch (error) {
    console.error("Error getting truck sequence number:", error);
    throw error;
  }
};

export const createNewDispatch = async (payload) => {
  const batchWrite = writeBatch(db);
  const trucksCollection = collection(db, "trucks");
  const transactionsCollection = collection(db, "transactions");

  try {
    // Create a new document reference with an auto-generated unique ID
    const truckDocRef = doc(trucksCollection);

    // Set the data for the truck document
    batchWrite.set(truckDocRef, payload);

    const { orderNumber, item, qtyBagsDispatched } = payload;
    const q = query(
      transactionsCollection,
      where("orderNumber", "==", orderNumber),
      limit(1)
    );

    const transactionQuerySnapshot = await getDocs(q);

    if (!transactionQuerySnapshot.empty) {
      const transactionDoc = transactionQuerySnapshot.docs[0];
      const { itemsPurchased } = transactionDoc.data();

      const itemIndex = itemsPurchased.findIndex(
        (itemData) => itemData.itemId === item
      );

      if (itemIndex !== -1) {
        itemsPurchased[itemIndex].taken += parseInt(qtyBagsDispatched);

        const transactionRef = doc(db, "transactions", transactionDoc.id);
        batchWrite.update(transactionRef, { itemsPurchased });
      } else {
        throw new Error(
          `Item with itemId ${item} not found in itemsPurchased.`
        );
      }
    } else {
      throw new Error("Transaction document not found.");
    }

    // Commit batch write
    await batchWrite.commit();
  } catch (error) {
    console.error("Error creating a new truck document:", error);
    throw error;
  }
};

export const getTrucksWithFilter = async (
  filterField,
  filterValue,
  order = "dateLoaded"
) => {
  try {
    const trucksRef = collection(db, "trucks");
    const q = query(
      trucksRef,
      where(filterField, "==", filterValue),
      orderBy(order, "desc")
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents for.");
      return [];
    }
    const trucks = [];
    querySnapshot.forEach((doc) => {
      trucks.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return trucks;
  } catch (error) {
    console.error("Error getting filtered trucks:", error);
    throw error;
  }
};

export const getTruckById = async (truckId) => {
  const truckRef = doc(db, "trucks", truckId);
  const truck = await getDoc(truckRef);

  try {
    if (truck.exists()) {
      return truck.data();
    } else {
      // truck.data() will be undefined in this case
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const receiveTruck = async (truckId, payload) => {
  const truckRef = doc(db, "trucks", truckId);

  const {
    qtyBagsReceived,
    qtyMtsReceived,
    dateReceived,
    shortage,
    receivingOfficer,
    transportFeeFinalBalanceNumeric,
    transportFeeFinalBalance,
    transportFeePaidOnReceived,
    transportFeePaidStatus,
  } = payload;
  // const dateReceived = await Timestamp.now();

  try {
    await updateDoc(truckRef, {
      status: "received",
      qtyBagsReceived,
      qtyMtsReceived,
      shortage,
      receivingOfficer,
      dateReceived,
      transportFeeFinalBalanceNumeric,
      transportFeeFinalBalance,
      transportFeePaidOnReceived,
      transportFeePaidStatus,
    });
    return getDoc(truckRef);
  } catch (error) {
    throw error;
  }
};

export const updateInventoryRecord = async (item, action, quantity) => {
  const collectionName = "items";
  const documentId = item;
  const quantityMts = (50 * parseInt(quantity)) / 1000;
  console.log(quantityMts);

  try {
    const itemRef = doc(db, collectionName, documentId);
    const dbItem = await getDoc(itemRef);

    if (dbItem.exists) {
      const currentData = dbItem.data();

      if (action === "received") {
        currentData.balance += parseInt(quantity);
        currentData.balanceMts += quantityMts;
        currentData.received += parseInt(quantity);
        currentData.receivedMts += quantityMts;
      } else if (action === "dispatched") {
        currentData.balance -= parseInt(quantity);
        currentData.balanceMts -= quantityMts;
        currentData.dispatched += parseInt(quantity);
        currentData.dispatchedMts += quantityMts;
      }

      await updateDoc(itemRef, currentData);
      console.log(`Successfully updated ${item} inventory.`);
    } else {
      console.error(`${item} document does not exist.`);
    }
  } catch (error) {
    console.error(`Error updating ${item} inventory: ${error}`);
  }
};

export const getItemTotalInventory = async (item) => {
  try {
    const itemRef = doc(db, "items", item);
    const itemSnap = await getDoc(itemRef);

    if (itemSnap.exists()) {
      return itemSnap.data();
    } else {
      // itemSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting filtered trucks:", error);
    throw error;
  }
};

export const addRawMaterialRequestToFirestore = async (requestData) => {
  try {
    const inventoryDocs = await getDocs(collection(db, "items"));
    const inventoryData = {};

    inventoryDocs.forEach((doc) => {
      inventoryData[doc.id] = doc.data();
    });

    const result = await runTransaction(db, async (transaction) => {
      // Check if the requested materials are available in the inventory
      for (const rawMaterial of requestData.rawMaterials) {
        const inventoryItem = inventoryData[rawMaterial.material];
        if (!inventoryItem || inventoryItem.balance < rawMaterial.quantity) {
          throw new Error(
            `Not enough ${rawMaterial.material} available in inventory.`
          );
        }
      }

      // All requested materials are available, so add the request to the request collection
      const requestCollection = collection(db, "requests");
      const newRequestRef = doc(requestCollection);

      // Use the setDoc method to add the request data to the document
      transaction.set(newRequestRef, requestData);

      return newRequestRef; // Return the reference to the newly created request
    });

    // After the transaction is completed, fetch and return the new request data
    const newRequestSnapshot = await getDoc(result);
    const newRequestData = newRequestSnapshot.data();

    return newRequestData; // Return the newly created request data
  } catch (error) {
    throw error.message;
  }
};

export const getAllRequestsFromFirestore = async () => {
  try {
    const requestsCollection = collection(db, "requests"); // Replace "requests" with the name of your Firestore collection
    let queryFilter;
    queryFilter = query(requestsCollection, orderBy("requestDate", "desc"));

    const querySnapshot = await getDocs(queryFilter);

    const requests = [];

    querySnapshot.forEach((doc) => {
      // Access data for each document
      const requestData = doc.data();
      requests.push(requestData);
    });

    return requests;
  } catch (error) {
    // Handle any potential errors, e.g., network issues or Firestore setup problems
    console.error("Error fetching requests:", error);
    throw error.message;
  }
};

export const getProductionRequests = async (statusFilter = "all") => {
  try {
    const requestsCollection = collection(db, "requests");
    let queryFilter;

    if (statusFilter === "pending") {
      queryFilter = query(
        requestsCollection,
        where("status", "==", "pending"),
        orderBy("requestDate", "desc")
      );
    } else if (statusFilter === "approved") {
      queryFilter = query(
        requestsCollection,
        where("status", "==", "approved"),
        orderBy("requestDate", "desc")
      );
    } else {
      // Default to 'all' (no additional filter)
      queryFilter = query(requestsCollection, orderBy("requestDate", "desc"));
    }

    const querySnapshot = await getDocs(queryFilter);

    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });

    return requests;
  } catch (error) {
    // Handle and log the error
    console.error("Error fetching production requests:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};

export const approveProductionRequest = async (requestId, approver) => {
  const requestRef = doc(db, "requests", requestId);

  try {
    await runTransaction(db, async (transaction) => {
      const requestDoc = await transaction.get(requestRef);

      if (!requestDoc.exists()) {
        throw new Error("Request not found");
      }

      const requestData = requestDoc.data();
      const inventoryRef = collection(db, "items");
      const materialReads = {};

      // Perform all read operations first
      for (const material of requestData.rawMaterials) {
        const materialName = material.material;
        materialReads[materialName] = await transaction.get(
          doc(inventoryRef, materialName)
        );
      }

      // Then, perform write operations
      for (const material of requestData.rawMaterials) {
        const materialName = material.material;
        const materialData = materialReads[materialName];
        const requestedQuantity = material.quantity;

        if (!materialData.exists()) {
          throw new Error(`Material "${materialName}" not found in inventory`);
        }

        if (materialData.data().balance < requestedQuantity) {
          throw new Error(`Not enough "${materialName}" in inventory`);
        }

        transaction.update(doc(inventoryRef, materialName), {
          balance: materialData.data().balance - requestedQuantity,
          dispatched: materialData.data().dispatched + requestedQuantity,
          dispatchedToProduction: increment(requestedQuantity),
          availableInProduction: increment(requestedQuantity),
        });
      }

      // Update the request status to "approved"

      transaction.update(requestRef, {
        status: "approved",
        approver: approver.name,
        approverId: approver.userId,
      });
    });

    console.log(
      `Request with ID ${requestId} has been approved for production.`
    );
  } catch (error) {
    console.error("Error approving production request:", error);
    throw new Error(error.message);
  }
};

export const createProductionRun = async (data) => {
  const productionRunsCollection = collection(db, "production runs");

  // Perform validation checks for raw materials and finished product
  for (const rawMaterial of data.rawMaterialsUsed) {
    const materialRef = doc(db, "items", rawMaterial.material);
    const materialDoc = await getDoc(materialRef);

    if (!materialDoc.exists()) {
      throw new Error(
        `Material ${rawMaterial.material} not found in inventory.`
      );
    }

    const availableQuantity = materialDoc.data().availableInProduction;
    const requestedQuantity = Number(rawMaterial.quantity);

    if (availableQuantity < requestedQuantity) {
      throw new Error(
        `Insufficient quantity of material ${rawMaterial.material} in inventory.`
      );
    }
  }

  const finishedProductRef = doc(db, "items", data.finishedProduct);
  const finishedProductDoc = await getDoc(finishedProductRef);

  if (!finishedProductDoc.exists()) {
    throw new Error(
      `Finished product with ID ${data.finishedProduct} not found.`
    );
  }

  try {
    // If all validation checks pass, start a Firestore transaction
    const result = await runTransaction(db, async (transaction) => {
      // Add the data to the Firestore collection within the transaction
      const docRef = await addDoc(
        productionRunsCollection,
        { ...data, createdAt: serverTimestamp() },
        transaction
      );

      // Calculate the new quantityProduced and balance values.
      const quantityProduced = Number(data.quantityProduced);
      const currentQuantityProduced =
        finishedProductDoc.data().quantityProduced || 0;
      const currentBalance = finishedProductDoc.data().balance || 0;
      const newQuantityProduced = currentQuantityProduced + quantityProduced;
      const newBalance = currentBalance + quantityProduced;

      // Update the finished product document within the transaction.
      transaction.update(finishedProductRef, {
        quantityProduced: newQuantityProduced,
        balance: newBalance,
        availableInProduction: increment(quantityProduced),
      });

      for (const rawMaterial of data.rawMaterialsUsed) {
        const materialRef = doc(db, "items", rawMaterial.material);
        const requestedQuantity = Number(rawMaterial.quantity);

        transaction.update(materialRef, {
          availableInProduction: increment(-requestedQuantity),
          totalUtilization: increment(requestedQuantity),
        });
      }

      return docRef.id; // Return the ID of the inserted production run document
    });

    if (result) {
      console.log(`Production run with ID ${result} added to Firestore.`);
      return result;
    } else {
      console.log("Failed to add production run to Firestore.");
      return null;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllProductionRuns = async () => {
  try {
    const productionRunsCollection = collection(db, "production runs");
    const querySnapshot = await getDocs(
      query(productionRunsCollection, orderBy("createdAt", "desc"))
    );

    const productionRuns = [];

    querySnapshot.forEach((doc) => {
      const productionRunData = doc.data();
      // Include the document ID as well.
      const productionRun = {
        id: doc.id,
        ...productionRunData,
      };
      productionRuns.push(productionRun);
    });

    return productionRuns;
  } catch (error) {
    console.error("Error fetching production runs:", error);
    throw error; // Rethrow the error for higher-level error handling.
  }
};

export const createProductSubmission = async (data) => {
  const { productType, quantity } = data;

  try {
    // Run a transaction to ensure data consistency
    const submissionRef = doc(collection(db, "submissions"));
    const itemRef = doc(db, "items", productType);

    const submissionResult = await runTransaction(db, async (transaction) => {
      const itemDoc = await transaction.get(itemRef);

      if (!itemDoc.exists) {
        throw new Error('Product type not found in the "items" collection.');
      }

      const itemData = itemDoc.data();

      if (itemData.availableInProduction < quantity) {
        throw new Error("Requested quantity exceeds available quantity.");
      }

      transaction.set(submissionRef, data);

      return { documentId: submissionRef.id };
    });

    return submissionResult;
  } catch (error) {
    throw error;
  }
};

export const getProductSubmissions = async (filter) => {
  try {
    const submissionsCollection = collection(db, "submissions");

    let submissionsQuery = submissionsCollection;

    if (filter === "pending") {
      submissionsQuery = query(
        submissionsCollection,
        where("status", "==", "pending")
      );
    } else if (filter === "approved") {
      submissionsQuery = query(
        submissionsCollection,
        where("status", "==", "approved")
      );
    }

    const querySnapshot = await getDocs(submissionsQuery);

    const submissions = [];

    querySnapshot.forEach((doc) => {
      submissions.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return submissions;
  } catch (error) {
    throw error;
  }
};

export const approveProductReception = async (
  submissionId,
  productType,
  approver
) => {
  try {
    const submissionRef = doc(db, "submissions", submissionId);
    const itemRef = doc(db, "items", productType); // Assuming submissionId corresponds to productType

    await runTransaction(db, async (transaction) => {
      // Get the submission document
      const submissionDoc = await transaction.get(submissionRef);

      if (!submissionDoc.exists) {
        throw new Error("Submission document not found.");
      }

      // Get the item (productType) document
      const itemDoc = await transaction.get(itemRef);

      if (!itemDoc.exists) {
        throw new Error("Item (productType) document not found.");
      }

      if (
        submissionDoc.data().quantity > itemDoc.data().availableInProduction
      ) {
        throw new Error("Not Enought of this item in Production");
      }

      // Update the status to 'approved'
      transaction.update(submissionRef, {
        status: "approved",
        approver: approver,
      });

      transaction.update(itemRef, {
        availableInProduction: increment(-submissionDoc.data().quantity),
        deliveredToStore: increment(submissionDoc.data().quantity),
        balance: increment(submissionDoc.data().quantity),
      });
    });

    return "Submission is approved.";
  } catch (error) {
    throw error;
  }
};

export const getInventoryItems = async (filter = "all") => {
  try {
    const itemsCollection = collection(db, "items");
    let itemsQuery;

    if (filter === "all") {
      // No filter, retrieve all items
      itemsQuery = query(itemsCollection);
    } else if (filter === "raw" || filter === "product") {
      // Filter by the 'type' field
      itemsQuery = query(itemsCollection, where("type", "==", filter));
    } else {
      throw new Error("Invalid filter option");
    }

    const querySnapshot = await getDocs(itemsQuery);
    const items = [];

    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const fetchAllItems = async () => {
  const items = [];

  try {
    const querySnapshot = await getDocs(collection(db, "items"));

    querySnapshot.forEach((doc) => {
      const { name, code } = doc.data();
      if (name && code) {
        items.push({ name, code });
      }
    });

    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const createTransaction = async (payload) => {
  try {
    if (!payload) {
      throw new Error("Payload is required.");
    }

    // Add a new document with a generated ID to the "transactions" collection
    const docRef = await addDoc(collection(db, "transactions"), {
      ...payload,
      createdAt: serverTimestamp(),
    });

    if (!docRef.id) {
      throw new Error("Document ID was not generated.");
    }

    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error; // Re-throw the error for higher-level error handling, if needed.
  }
};

export const getTransactionById = async (transactionId) => {
  try {
    // Create a reference to the specific transaction document
    const transactionRef = doc(db, "transactions", transactionId);

    // Fetch the document data
    const transactionSnapshot = await getDoc(transactionRef);

    if (transactionSnapshot.exists()) {
      // Transaction document found, return its data

      const paymentsCollectionRef = collection(db, "payments");
      const paymentsRefs = transactionSnapshot
        .data()
        .payments.map((docId) => doc(paymentsCollectionRef, docId));

      const paymentsSnapshots = await Promise.all(
        paymentsRefs.map((docRef) => getDoc(docRef))
      );
      // Extract data from snapshots and store in an array
      const payments = paymentsSnapshots.map((snapshot) => snapshot.data());
      console.log(payments);

      const transaction = {
        id: transactionSnapshot.id,
        ...transactionSnapshot.data(),
      };
      transaction.payments = payments;

      return transaction;
    } else {
      // Transaction document not found
      throw new Error("Transaction not found");
    }
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw error; // Re-throw the error for higher-level error handling, if needed.
  }
};

export const getTransactions = async (type = null, status = null) => {
  try {
    // Create a reference to the "transactions" collection
    const transactionsCollection = collection(db, "transactions");

    // Create a query with optional filters for type and status
    let transactionsQuery = query(transactionsCollection);

    if (type && status === null) {
      transactionsQuery = query(
        transactionsCollection,
        where("type", "==", type),
        orderBy("createdAt", "desc")
      );
    }

    if (status && type === null) {
      transactionsQuery = query(
        transactionsCollection,
        where("status", "==", status),
        orderBy("createdAt", "desc")
      );
    }

    if (status && type) {
      transactionsQuery = query(
        transactionsCollection,
        where("status", "==", status),
        where("type", "==", type),
        orderBy("createdAt", "desc")
      );
    }

    // Fetch documents based on the query
    const querySnapshot = await getDocs(transactionsQuery);

    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });

    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error; // Re-throw the error for higher-level error handling, if needed.
  }
};

export const createPayment = async (payload) => {
  try {
    const paymentRef = await addDoc(collection(db, "payments"), {
      ...payload,
      createdAt: serverTimestamp(),
    });

    const transactionRef = doc(db, "transactions", payload.transactionId);

    // Fetch the transaction document
    const transactionDoc = await getDoc(transactionRef);

    if (!transactionDoc.exists()) {
      throw new Error("Transaction does not exist");
    }

    // Update the transaction with the new payment ID and totalPaid
    await updateDoc(transactionRef, {
      payments: arrayUnion(paymentRef.id),
      totalPaid: increment(payload.amount),
    });
    const totalCost = transactionDoc.data().totalCost;

    const balanceCheck =
      totalCost - (transactionDoc.data().totalPaid + payload.amount) === 0;

    // Check if totalCost minus totalPaid is zero
    if (balanceCheck) {
      // Update the status of the transaction to 'completed'
      await updateDoc(transactionRef, { status: "completed" });
    }
  } catch (error) {
    throw error; // Throw any caught error
  }
};

export const getLastTransactionSequence = async (type) => {
  try {
    const transactionRef = collection(db, "transactions");
    const q = query(
      transactionRef,
      where("type", "==", type),
      orderBy("sequenceNumber", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return 0;
    }
    // Assuming there's only one doc with a given UID, you can directly access the first document.
    const transactionDoc = querySnapshot.docs[0];
    const sequenceNumber = transactionDoc.data().sequenceNumber || 0;
    return sequenceNumber;
  } catch (error) {
    console.error("Error getting truck sequence number:", error);
    throw error;
  }
};

export const getItems = async () => {
  try {
    const itemsCollection = collection(db, "items");
    const querySnapshot = await getDocs(itemsCollection);

    const items = [];

    querySnapshot.forEach((doc) => {
      const { name, code, type } = doc.data();
      items.push({ name, code, type });
    });

    return items;
  } catch (error) {
    throw new Error(`Error getting items: ${error.message}`);
  }
};

export const createNewItem = async (name, type) => {
  try {
    // Validate type
    if (type !== "raw" && type !== "product") {
      throw new Error(
        'Invalid item type. Type must be either "raw" or "product".'
      );
    }

    // Check for duplicate document ID
    const existingItemQuery = query(
      collection(db, "items"),
      where("name", "==", name)
    );

    const existingItemSnapshot = await getDocs(existingItemQuery);

    if (!existingItemSnapshot.empty) {
      throw new Error("An item with the same name already exists.");
    }

    // Get the last code number based on type
    const codeQuery = query(
      collection(db, "items"),
      where("type", "==", type),
      orderBy("code", "desc"),
      limit(1)
    );
    const codeSnapshot = await getDocs(codeQuery);

    let lastCode = "00"; // Default starting code

    if (!codeSnapshot.empty) {
      const lastItem = codeSnapshot.docs[0].data();
      lastCode = lastItem.code;
    }

    // Increment the code for the new item
    const newCode = (parseInt(lastCode, 10) + 1).toString().padStart(2, "0");

    // Create the new item
    const newItem = {
      name: name,
      balance: 0,
      availableInProduction: 0,
      dispatched: 0,
      dispatchedToProduction: 0,
      received: 0,
      totalUtilization: 0,
      quantityProduced: 0,
      deliveredToStore: 0,
      code:
        type === "raw"
          ? newCode
          : String.fromCharCode(lastCode.charCodeAt(0) + 1) +
            String.fromCharCode(lastCode.charCodeAt(1) + 1),
      type,
    };

    // Add the new item to the "items" collection
    await setDoc(doc(db, "items", name), newItem);
  } catch (error) {
    throw new Error(`Error creating new item: ${error.message}`);
  }
};
