import { format } from "date-fns-tz";
import { Timestamp } from "firebase/firestore";
import { DateTime } from "luxon";

export const generateWaybillNumber = ({
  origin,
  destination,
  item,
  sequenceNumber,
  allItems,
}) => {
  const itemsMap = {};
  for (const item of allItems) {
    itemsMap[item.name] = item.code;
  }
  // Define code mappings for origin, destination, and items
  const codeMappings = {
    origin: {
      "Port Harcourt": "PH",
      "Boko Fertilizer": "BKF",
      Lagos: "LG",
      Abuja: "AB",
      Others: "OTH",
      // Add more mappings as needed
    },
    destination: {
      "Boko Fertilizer": "BKF",
      Others: "OTH",
      // Add more mappings as needed
    },
    items: {
      ...itemsMap,
    },
  };

  // Use a switch statement to get the codes for origin and destination
  const originCode = codeMappings.origin[origin] || "GNR";
  const destinationCode = codeMappings.destination[destination] || "GNR";

  const year = new Date().getFullYear().toString().slice(-2); // Extract the last two digits of the year

  // Ensure the item code is two digits
  const itemCode = codeMappings.items[item] || "00"; // Defaults to '00' if item is not found

  // Ensure the sequential number is three digits
  const formattedSequenceNumber = sequenceNumber.toString().padStart(3, "0");

  const waybill = `${originCode}-${destinationCode}-${itemCode}-${year}-${formattedSequenceNumber}`;
  return waybill;
};

export const bagsToMetricTonnes = (bagsAsString) => {
  // Parse the string to a number
  const bags = parseFloat(bagsAsString);

  // Check if the conversion was successful
  if (isNaN(bags)) {
    return 0;
  }

  // Convert bags to metric tonnes (1 metric tonne = 1000 kg)
  const metricTonnes = (bags * 50) / 1000;

  return metricTonnes;
};

export const formatTimestamp = (timestamp) => {
  let convertedTimestamp = timestamp;
  if (typeof timestamp === "string") {
    convertedTimestamp = new Date(timestamp);
  } else {
    convertedTimestamp = timestamp.toDate();
  }
  const nigeriaTime = new Date(
    convertedTimestamp.getTime() + 12 * 60 * 60 * 1000
  ); // Adding 12 hours for the time difference

  const stringDate = format(nigeriaTime, "dd/MM/yyyy", {
    timeZone: "Africa/Lagos",
  });
  return stringDate;
};

export const moneyStringToNumber = (moneyString) => {
  // Remove the currency symbol (₦) and any commas from the string
  const numberString = moneyString.replace(/[₦,]/g, "");

  // Parse the remaining string as a float or integer, depending on the presence of decimal points
  const number = parseFloat(numberString);

  // Check if the result is a valid number
  if (!isNaN(number)) {
    return number;
  } else {
    return null; // or you can return some default value or handle the error accordingly
  }
};

export const getDateTimestamp = (date) => {
  const timeZone = "Africa/Lagos";
  const dateTime = DateTime.fromISO(date, { zone: timeZone });
  const seconds = Math.floor(dateTime.toMillis() / 1000);
  const nanoseconds = dateTime.millisecond * 1000000;
  const firestoreTimestamp = new Timestamp(seconds, nanoseconds);
  return firestoreTimestamp;
};

export const formatMoney = (value) => {
  //value is a number, convert to string
  value = value + "";
  if (value === "") return value; // Return empty string if value is empty

  // Remove any existing commas and non-numeric characters
  const numericValue = value.replace(/[^0-9.]/g, "");

  // Split the value into whole and decimal parts
  const parts = numericValue.split(".");
  const wholePart = parts[0];
  const decimalPart = parts[1] || "";

  // Add commas to the whole part
  const formattedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Combine the whole and decimal parts with a naira sign
  const formattedValue = `₦${formattedWholePart}${
    decimalPart ? `.${decimalPart}` : ""
  }`;

  return formattedValue;
};

export const generateTransactionOrderNumber = (
  sequenceNumber,
  type = "purchase"
) => {
  const year = new Date().getFullYear().toString().slice(-2); // Extract the last two digits of the year

  // Ensure the sequential number is four digits
  const formattedSequenceNumber = sequenceNumber.toString().padStart(4, "0");

  const orderNumber = `${
    type === "purchase" ? "P" : "S"
  }-${year}-${formattedSequenceNumber}`;
  return orderNumber;
};

export const disableArrowKeys = (event) => {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
  }
};

export const disableScroll = (event) => {
  event.currentTarget.blur();
};
