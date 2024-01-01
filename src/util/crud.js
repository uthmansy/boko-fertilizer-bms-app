import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
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
  startAfter,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { moneyStringToNumber } from "./functions";
import { companyFullName } from "../constants/company";

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
  const transportFeeUsageCollection = collection(db, "transport_fee_usage");
  const accountsCollection = collection(db, "accounts");
  const transactionsCollection = collection(db, "transactions");

  try {
    const numericPaidTransport = moneyStringToNumber(payload.transportFeePaid);
    if (numericPaidTransport) {
      const q1 = query(accountsCollection, where("name", "==", "transportFee"));
      const querySnapshot = await getDocs(q1);
      const accountDoc = querySnapshot.docs[0];
      const accountDocRef = doc(db, "accounts", accountDoc.id);
      batchWrite.update(accountDocRef, {
        totalUsed: increment(numericPaidTransport),
      });
      const transportFeeUsageRef = doc(transportFeeUsageCollection);
      const { truckNumber, waybillNumber, dateLoaded, dispatchOfficer } =
        payload;
      batchWrite.set(transportFeeUsageRef, {
        truckNumber,
        waybillNumber,
        dateLoaded,
        dispatchOfficer,
        transportFeePaid: numericPaidTransport,
        createdAt: serverTimestamp(),
      });
    }

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
    return truckDocRef.id;
  } catch (error) {
    console.error("Error creating a new truck document:", error);
    throw error;
  }
};

export const createNewSaleDispatch = async (payload) => {
  const batchWrite = writeBatch(db);
  const trucksCollection = collection(db, "trucks");
  const transportFeeUsageCollection = collection(db, "transport_fee_usage");
  const accountsCollection = collection(db, "accounts");
  const transactionsCollection = collection(db, "transactions");

  try {
    const numericPaidTransport = moneyStringToNumber(payload.transportFeePaid);
    if (numericPaidTransport) {
      const q = query(accountsCollection, where("name", "==", "transportFee"));
      const querySnapshot = await getDocs(q);
      const accountDoc = querySnapshot.docs[0];
      const accountDocRef = doc(db, "accounts", accountDoc.id);
      batchWrite.update(accountDocRef, {
        totalUsed: increment(numericPaidTransport),
      });
      const transportFeeUsageRef = doc(transportFeeUsageCollection);
      const { truckNumber, waybillNumber, dateLoaded, dispatchOfficer } =
        payload;
      batchWrite.set(transportFeeUsageRef, {
        truckNumber,
        waybillNumber,
        dateLoaded,
        dispatchOfficer,
        transportFeePaid: numericPaidTransport,
        createdAt: serverTimestamp(),
      });
    }

    // Create a new document reference with an auto-generated unique ID
    const truckDocRef = doc(trucksCollection);

    // Set the data for the truck document
    batchWrite.set(truckDocRef, payload);

    if (payload.origin === companyFullName)
      batchWrite.update(doc(db, "items", payload.item), {
        dispatched: increment(payload.qtyBagsDispatched),
        balance: increment(-payload.qtyBagsDispatched),
      });

    const { orderNumber, item, qtyBagsDispatched } = payload;
    const q = query(
      transactionsCollection,
      where("orderNumber", "==", orderNumber),
      limit(1)
    );

    const transactionQuerySnapshot = await getDocs(q);

    if (!transactionQuerySnapshot.empty) {
      const transactionDoc = transactionQuerySnapshot.docs[0];
      const { itemsSold } = transactionDoc.data();

      const itemIndex = itemsSold.findIndex(
        (itemData) => itemData.itemId === item
      );

      if (itemIndex !== -1) {
        itemsSold[itemIndex].taken += parseInt(qtyBagsDispatched);

        const transactionRef = doc(db, "transactions", transactionDoc.id);
        batchWrite.update(transactionRef, { itemsSold });
      } else {
        throw new Error(`Item with itemId ${item} not found in itemsSold.`);
      }
    } else {
      throw new Error("Transaction document not found.");
    }

    // Commit batch write
    await batchWrite.commit();
    return truckDocRef.id;
  } catch (error) {
    console.error("Error creating a new truck document:", error);
    throw error;
  }
};

export const getTrucksWithFilter = async (
  filterField,
  filterValue,
  order = "dateLoaded",
  pageParam
) => {
  try {
    const trucksRef = collection(db, "trucks");
    const q = pageParam
      ? query(
          trucksRef,
          where(filterField, "==", filterValue),
          orderBy(order, "desc"),
          startAfter(pageParam),
          limit(25)
        )
      : query(
          trucksRef,
          where(filterField, "==", filterValue),
          orderBy(order, "desc"),
          limit(25)
        );

    const querySnapshot = await getDocs(q);

    const trucks = [];
    querySnapshot.forEach((doc) => {
      trucks.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    const lastDoc = trucks[trucks.length - 1];
    const newNextPageToken = lastDoc ? lastDoc[order] : null;
    console.log(trucks);

    return { data: trucks, nextPageToken: newNextPageToken };
  } catch (error) {
    console.error("Error getting filtered trucks:", error);
    throw error;
  }
};

export const getTruckById = async (truckId) => {
  const truckRef = doc(db, "trucks", truckId);

  try {
    const truck = await getDoc(truckRef);

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

export const receiveTruck = async (truckId, payload, destination) => {
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
    item: itemId,
  } = payload;

  const truckRef = doc(db, "trucks", truckId);
  const itemRef = doc(db, "items", itemId);
  const batchWrite = writeBatch(db);

  try {
    batchWrite.update(truckRef, {
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
    if (destination === companyFullName) {
      batchWrite.update(itemRef, {
        balance: increment(qtyBagsReceived),
        received: increment(qtyBagsReceived),
      });
    }

    await batchWrite.commit();
  } catch (error) {
    throw error;
  }
};

export const updateInventoryRecord = async (item, action, quantity) => {
  try {
    const itemRef = doc(db, "items", item);
    await updateDoc(itemRef, {
      balance: increment(action === "received" ? quantity : -quantity),
      received: increment(action === "received" ? quantity : 0),
      dispatched: increment(action === "dispatched" ? quantity : 0),
    });
  } catch (error) {
    console.error(`Error updating ${item} inventory: ${error}`);
    throw error;
  }
};

export const getItemTotalInventory = async (item) => {
  try {
    const itemRef = doc(db, "items", item);
    const itemSnap = await getDoc(itemRef);

    if (itemSnap.exists()) {
      return itemSnap.data();
    } else {
      throw new Error("Error getting item total inventory");
    }
  } catch (error) {
    throw error;
  }
};

export const addMaterialRequest = async (requestData) => {
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
  console.log(approver);
  console.log(requestId);
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
    return requestId;
  } catch (error) {
    console.error("Error approving production request:", error);
    throw error;
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

      const quantityProduced = Number(data.quantityProduced);

      // Update the finished product document within the transaction.
      transaction.update(finishedProductRef, {
        quantityProduced: increment(quantityProduced),
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
      console.error("Failed to add production run to Firestore.");
      throw new Error("Failed to add production run to Firestore");
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllProductionRuns = async (pageParam) => {
  try {
    const productionRunsCollection = collection(db, "production runs");

    let q;
    if (pageParam) {
      q = query(
        productionRunsCollection,
        orderBy("createdAt", "desc"),
        startAfter(pageParam),
        limit(5)
      );
    } else {
      q = query(
        productionRunsCollection,
        orderBy("createdAt", "desc"),
        limit(5)
      );
    }

    const querySnapshot = await getDocs(q);

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

    const lastDoc = productionRuns[productionRuns.length - 1];
    const newNextPageToken = lastDoc ? lastDoc.createdAt : null;

    console.log(newNextPageToken);

    return { data: productionRuns, nextPageToken: newNextPageToken };
  } catch (error) {
    console.error("Error fetching production runs:", error);
    throw error; // Rethrow the error for higher-level error handling.
  }
};

export const getAllMaterialRequests = async (pageParam) => {
  try {
    const requestsCollection = collection(db, "requests");

    let q;
    if (pageParam) {
      q = query(
        requestsCollection,
        orderBy("requestDate", "desc"),
        startAfter(pageParam),
        limit(5)
      );
    } else {
      q = query(requestsCollection, orderBy("requestDate", "desc"), limit(5));
    }

    const querySnapshot = await getDocs(q);

    const requests = [];

    querySnapshot.forEach((doc) => {
      const requestData = doc.data();
      // Include the document ID as well.
      const request = {
        id: doc.id,
        ...requestData,
      };
      requests.push(request);
    });

    const lastDoc = requests[requests.length - 1];
    const newNextPageToken = lastDoc ? lastDoc.requestDate : null;
    return { data: requests, nextPageToken: newNextPageToken };
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
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

export const getProductSubmissions = async (nextPageToken) => {
  console.log(nextPageToken);
  try {
    const submissionsCollection = collection(db, "submissions");

    const submissionQuery = nextPageToken
      ? query(
          submissionsCollection,
          orderBy("date", "desc"),
          startAfter(nextPageToken),
          limit(10)
        )
      : query(submissionsCollection, orderBy("date", "desc"), limit(10));

    const querySnapshot = await getDocs(submissionQuery);

    const submissions = [];

    querySnapshot.forEach((doc) => {
      submissions.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    const lastDoc = submissions[submissions.length - 1];
    const newNextPageToken = lastDoc ? lastDoc.date : null;

    return { data: submissions, nextPageToken: newNextPageToken };
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

    return submissionId;
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
      const { name, code, type } = doc.data();
      const id = doc.id;
      if (name && code && type) {
        items.push({ name: id, code, type });
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
        orderBy("date", "desc")
      );
    }

    if (status && type === null) {
      transactionsQuery = query(
        transactionsCollection,
        where("status", "==", status),
        orderBy("date", "desc")
      );
    }

    if (status && type) {
      transactionsQuery = query(
        transactionsCollection,
        where("status", "==", status),
        where("type", "==", type),
        orderBy("date", "desc")
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
export const getDispatchTransactions = async (
  pickUpLocation = null,
  status = null
) => {
  try {
    // Create a reference to the "transactions" collection
    const transactionsCollection = collection(db, "transactions");

    // Create a query with optional filters for type and status
    let transactionsQuery = query(transactionsCollection);

    if (pickUpLocation && status === null) {
      transactionsQuery = query(
        transactionsCollection,
        where("pickUpLocation", "==", pickUpLocation),
        orderBy("createdAt", "desc")
      );
    }

    if (status && pickUpLocation === null) {
      transactionsQuery = query(
        transactionsCollection,
        where("status", "==", status),
        orderBy("createdAt", "desc")
      );
    }

    if (status && pickUpLocation) {
      transactionsQuery = query(
        transactionsCollection,
        where("status", "==", status),
        where("pickUpLocation", "==", pickUpLocation),
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

export const getItemById = async (docId) => {
  try {
    if (!docId) {
      throw new Error("Document ID is required.");
    }

    // Reference to the document in the "items" collection
    const itemRef = doc(db, "items", docId);

    // Fetch the document snapshot using getDoc
    const docSnap = await getDoc(itemRef);

    // Check if the document exists
    if (docSnap.exists()) {
      // Extract data from the document
      const itemData = docSnap.data();
      return itemData;
    } else {
      throw new Error("Document does not exist.");
    }
  } catch (error) {
    console.error("Error getting document:", error.message);
    throw error; // Re-throw the error to be caught by the calling code if needed
  }
};

export const updateTruckData = async (docId, payload) => {
  try {
    const truckRef = doc(db, "trucks", docId);
    await updateDoc(truckRef, { ...payload, upadatedAt: serverTimestamp() });
  } catch (error) {
    console.error("Error updating truck data:", error);
    throw error;
  }
};

export const deleteTruckData = async (
  docId,
  qtyBagsDispatched,
  item,
  orderNumber
) => {
  try {
    if (!docId || !qtyBagsDispatched || !item || !orderNumber) {
      throw new Error("All parameters are required for the operation.");
    }

    const batch = writeBatch(db);

    const truckRef = doc(db, "trucks", docId);
    batch.delete(truckRef);

    const transactionsRef = collection(db, "transactions");
    const transactionQuery = query(
      transactionsRef,
      where("orderNumber", "==", orderNumber),
      limit(1)
    );
    const transactionSnapshot = await getDocs(transactionQuery);

    if (transactionSnapshot.size > 0) {
      const transactionData = transactionSnapshot.docs[0].data();
      const transactionId = transactionSnapshot.docs[0].id;

      const itemsField = orderNumber.startsWith("P")
        ? "itemsPurchased"
        : "itemsSold";

      const updatedItems = transactionData[itemsField].map(
        (transactionItem) => {
          if (transactionItem.itemId === item) {
            const updatedTaken = transactionItem.taken - qtyBagsDispatched;
            return { ...transactionItem, taken: updatedTaken };
          }
          return transactionItem;
        }
      );

      const updatedTransactionRef = doc(transactionsRef, transactionId);
      batch.update(updatedTransactionRef, {
        [itemsField]: updatedItems,
      });
    } else {
      console.error(
        `Transaction data with order number ${orderNumber} not found.`
      );
    }

    await batch.commit();
  } catch (error) {
    console.error("Error deleting truck data:", error.message);
    throw error;
  }
};

export const addSalary = async (salaryData) => {
  try {
    const salaryExists = await getSalariesByYearAndMonth(
      salaryData.year,
      salaryData.month
    );
    console.log(salaryExists);
    if (salaryExists.length === 0) {
      const salariesCollection = collection(db, "salaries");
      const docRef = await addDoc(salariesCollection, {
        ...salaryData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } else {
      throw new Error("The Salary For this Month Already Exists");
    }
  } catch (error) {
    console.error("Error adding salary to Firestore: ", error.message);
    throw error; // Re-throwing the error for further handling
  }
};

export const getAllSalaries = async () => {
  try {
    const salariesCollection = collection(db, "salaries");

    const q = query(salariesCollection, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);

    const salaries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return salaries;
  } catch (error) {
    console.error("Error fetching salaries from Firestore: ", error.message);
    throw error;
  }
};

export const getSalaryById = async (salaryId) => {
  try {
    const salaryDocRef = doc(db, "salaries", salaryId);
    const docSnapshot = await getDoc(salaryDocRef);
    if (docSnapshot.exists()) {
      const salaryData = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      };
      return salaryData;
    } else {
      console.error("Salary document not found.");
      throw new Error("Salary not found");
    }
  } catch (error) {
    console.error(
      "Error fetching salary by ID from Firestore: ",
      error.message
    );
    throw error;
  }
};

export const addStaff = async (payload) => {
  try {
    const staffsCollection = collection(db, "staffs");
    const docRef = await addDoc(staffsCollection, {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return docRef.id; // Returning the document ID if needed
  } catch (error) {
    console.error("Error adding staff: ", error.message);
    throw error; // Re-throwing the error for further handling
  }
};

export const getAllStaffs = async () => {
  try {
    const staffsCollection = collection(db, "staffs");

    const q = query(staffsCollection, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const staffs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return staffs;
  } catch (error) {
    console.error("Error fetching staffs: ", error.message);
    throw error;
  }
};

export const getSalaryPaymentsByYearAndMonth = async (year, month) => {
  try {
    const salaryPaymentsCollection = collection(db, "salaryPayments");
    const q = query(
      salaryPaymentsCollection,
      where("year", "==", year),
      where("month", "==", month),
      orderBy("createdAt")
    );

    const querySnapshot = await getDocs(q);
    const salaryPayments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return salaryPayments;
  } catch (error) {
    console.error(
      "Error fetching salary payments from Firestore: ",
      error.message
    );
    throw error;
  }
};

export const getSalariesByYearAndMonth = async (year, month) => {
  try {
    const salariesCollection = collection(db, "salaries");
    const q = query(
      salariesCollection,
      where("year", "==", year),
      where("month", "==", month),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const salaries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return salaries;
  } catch (error) {
    console.error("Error fetching salaries: ", error.message);
    throw error;
  }
};

export const addSalaryPayment = async (payload) => {
  try {
    const salaryPaymentsCollection = collection(db, "salaryPayments");
    const docRef = await addDoc(salaryPaymentsCollection, {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    console.error("Error adding salary payment to Firestore:", error.message);
    throw error;
  }
};

export const addTransportFeePayment = async (payload) => {
  const batch = writeBatch(db);
  try {
    const paymentsCollection = collection(db, "transport_fee_payments");
    const paymentRef = doc(paymentsCollection);
    batch.set(paymentRef, { ...payload, createdAt: serverTimestamp() });
    const accountsCollection = collection(db, "accounts");
    const q = query(accountsCollection, where("name", "==", "transportFee"));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const accountDoc = querySnapshot.docs[0];
      const accountDocRef = doc(db, "accounts", accountDoc.id);
      batch.update(accountDocRef, {
        totalPaid: increment(payload.amount),
      });
      await batch.commit();
    } else {
      console.error(
        "TransportFee document does not exist in the accounts collection."
      );
      throw new Error("Failed to update TotalPaid: Document not found");
    }
  } catch (error) {
    console.error("Error adding payment to Firestore:", error.message);
    throw new Error("Failed to add payment to Firestore");
  }
};

export const getTransportFeeInfo = async () => {
  try {
    const accountsCollection = collection(db, "accounts");
    const q = query(accountsCollection, where("name", "==", "transportFee"));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const accountDoc = querySnapshot.docs[0];
      return accountDoc.data();
    } else {
      throw new Error("Failed to get transport fee info");
    }
  } catch (error) {
    console.error("Error getting transport fee info:", error.message);
    throw error;
  }
};

export const getAllTransportFeePayments = async () => {
  try {
    const paymentsCollection = collection(db, "transport_fee_payments");

    const q = query(paymentsCollection, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);

    const payments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return payments;
  } catch (error) {
    console.error("Error fetching payments: ", error.message);
    throw error;
  }
};

export const getAllTransportFeeUsage = async () => {
  try {
    const usageCollection = collection(db, "transport_fee_usage");

    const q = query(usageCollection, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);

    const usage = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return usage;
  } catch (error) {
    console.error("Error fetching Usage Data: ", error.message);
    throw error;
  }
};

export const deleteProductionRunById = async (documentId) => {
  const batch = writeBatch(db);

  try {
    const productionRunRef = doc(db, "production runs", documentId);
    const docSnap = await getDoc(productionRunRef);
    const { finishedProduct, quantityProduced, rawMaterialsUsed } =
      docSnap.data();
    const finishedProductRef = doc(db, "items", finishedProduct);

    // decrement product produced
    batch.update(finishedProductRef, {
      quantityProduced: increment(-quantityProduced),
      availableInProduction: increment(-quantityProduced),
    });

    // decrement raw materials

    for (const rawMaterial of rawMaterialsUsed) {
      const materialRef = doc(db, "items", rawMaterial.material);
      const quantity = Number(rawMaterial.quantity);

      batch.update(materialRef, {
        availableInProduction: increment(+quantity),
        totalUtilization: increment(-quantity),
      });
    }

    batch.delete(productionRunRef);
    await batch.commit();
    return documentId;
  } catch (error) {
    console.error("Error deleting production run:", error);
    throw error;
  }
};

export const getProductionRunById = async (id) => {
  try {
    const runRef = doc(db, "production runs", id);
    const docSnapshot = await getDoc(runRef);
    if (docSnapshot.exists()) {
      const runData = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      };
      return runData;
    } else {
      console.error("Production Run not found.");
      throw new Error("Production not found");
    }
  } catch (error) {
    console.error("Error fetching Production: ", error.message);
    throw error;
  }
};

export const getRequestById = async (id) => {
  try {
    const requestRef = doc(db, "requests", id);
    const docSnapshot = await getDoc(requestRef);
    if (docSnapshot.exists()) {
      const requestData = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      };
      return requestData;
    } else {
      console.error("Request not found.");
      throw new Error("Request not found");
    }
  } catch (error) {
    console.error("Error fetching Production: ", error.message);
    throw error;
  }
};

export const rejectMaterialRequest = async (id, user) => {
  try {
    const requestRef = doc(db, "requests", id);
    await updateDoc(requestRef, { status: "rejected", rejectedBy: user.name });
    return id;
  } catch (error) {
    console.error("Error Rejecting Request:", error);
    throw error;
  }
};

export const rejectProductSubmission = async (id, user) => {
  try {
    const submissionRef = doc(db, "submissions", id);
    await updateDoc(submissionRef, { status: "rejected", rejectedBy: user });
    return id;
  } catch (error) {
    console.error("Error Rejecting Submission:", error);
    throw error;
  }
};

export const getSubmissionById = async (id) => {
  try {
    const submissionRef = doc(db, "submissions", id);
    const docSnapshot = await getDoc(submissionRef);
    if (docSnapshot.exists()) {
      const submissionData = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      };
      return submissionData;
    } else {
      console.error("Submission not found.");
      throw new Error("Submission not found");
    }
  } catch (error) {
    console.error("Error fetching Submission: ", error.message);
    throw error;
  }
};

export const searchTruck = async (truckNumber, status) => {
  try {
    const trucksCollection = collection(db, "trucks");
    const q = query(
      trucksCollection,
      where("truckNumber", "==", truckNumber),
      where("status", "==", status)
    );
    const querySnapshot = await getDocs(q);
    const trucks = [];

    querySnapshot.docs.forEach((snapshot) =>
      trucks.push({ id: snapshot.id, ...snapshot.data() })
    );
    return trucks;
  } catch (error) {
    console.error("Error searching for truck:", error.message);
    throw error;
  }
};

export const getStaffById = async (id) => {
  const staffRef = doc(db, "staffs", id);

  try {
    const staff = await getDoc(staffRef);

    if (staff.exists()) {
      return { id, ...staff.data() };
    } else {
      throw new Error("Staff Not Found");
    }
  } catch (error) {
    throw error;
  }
};

export const updateStaff = async (id, payload) => {
  try {
    const staffRef = doc(db, "staffs", id);
    await updateDoc(staffRef, { ...payload, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error(`Error updating Staff: ${error}`);
    throw error;
  }
};
