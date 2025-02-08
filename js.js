import fs from "fs";
import path from "path";

// Function to normalize phone numbers
function normalizePhoneNumber(phone) {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // Ensure the number starts with +1 for US numbers
  if (digits.length === 10) {
    return `+1${digits}`;
  } else if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  } else {
    return phone; // Return original if unable to normalize
  }
}

// Function to sort records by postcode
function sortByPostcode(records) {
  return records.sort((a, b) => {
    const postcodeA = a["Postcode"] || "";
    const postcodeB = b["Postcode"] || "";
    return postcodeA.localeCompare(postcodeB, undefined, { numeric: true });
  });
}

// Main function to process JSON files in a specific range
async function processJsonFilesInRange(
  inputDirectory,
  outputFileWithEmail,
  outputFileWithoutEmail,
  outputFileAllUnique,
  startIndex,
  endIndex
) {
  let allRecords = [];
  let totalInputRecords = 0;
  let filesProcessed = 0;

  try {
    // Read all JSON files in the input directory
    const files = await fs.promises.readdir(inputDirectory);

    // Filter files by range based on the numbers in their filenames
    const filteredFiles = files
      .filter((file) => {
        const match = file.match(/business_data_(\d+)/);
        if (match) {
          const fileNumber = parseInt(match[1], 10);
          return fileNumber >= startIndex && fileNumber <= endIndex;
        }
        return false;
      })
      .sort(); // Ensure files are processed in order

    for (const file of filteredFiles) {
      const filePath = path.join(inputDirectory, file);
      const data = JSON.parse(await fs.promises.readFile(filePath, "utf8"));

      if (Array.isArray(data)) {
        allRecords.push(...data);
        totalInputRecords += data.length;
      } else if (typeof data === "object" && data !== null) {
        allRecords.push(data);
        totalInputRecords += 1;
      }
      filesProcessed++;
    }

    console.log(
      `Processed ${filesProcessed} files with a total of ${totalInputRecords} records.`
    );

    // Normalize phone numbers and create a unique identifier for each record
    const normalizedRecords = new Map();
    for (const record of allRecords) {
      if (record["Phone Number"]) {
        record["Phone Number"] = normalizePhoneNumber(record["Phone Number"]);
      }

      // Create a unique identifier using business name and normalized phone number
      const uniqueId = `${record["Business Name"] || ""}_${
        record["Phone Number"] || ""
      }`;

      // Keep the record with email if duplicate is found
      if (record["Emails"] || !normalizedRecords.has(uniqueId)) {
        normalizedRecords.set(uniqueId, record);
      }
    }

    // Separate records with and without emails
    const recordsWithEmail = [];
    const recordsWithoutEmail = [];
    const allUniqueRecords = Array.from(normalizedRecords.values());

    for (const record of allUniqueRecords) {
      if (record["Emails"] && record["Emails"].length > 0) {
        recordsWithEmail.push(record);
      } else {
        recordsWithoutEmail.push(record);
      }
    }

    // Sort records by postcode
    const sortedRecordsWithEmail = sortByPostcode(recordsWithEmail);
    const sortedRecordsWithoutEmail = sortByPostcode(recordsWithoutEmail);
    const sortedAllUniqueRecords = sortByPostcode(allUniqueRecords);

    // Write output files
    await fs.promises.writeFile(
      outputFileWithEmail,
      JSON.stringify(sortedRecordsWithEmail, null, 2)
    );
    await fs.promises.writeFile(
      outputFileWithoutEmail,
      JSON.stringify(sortedRecordsWithoutEmail, null, 2)
    );
    await fs.promises.writeFile(
      outputFileAllUnique,
      JSON.stringify(sortedAllUniqueRecords, null, 2)
    );

    // Print statistics
    console.log(`Total input records: ${totalInputRecords}`);
    console.log(
      `Unique records after deduplication: ${normalizedRecords.size}`
    );
    console.log(`Records with email: ${sortedRecordsWithEmail.length}`);
    console.log(`Records without email: ${sortedRecordsWithoutEmail.length}`);
    console.log(
      `Duplicates removed: ${totalInputRecords - normalizedRecords.size}`
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Usage
const inputDirectory = "C:\\Users\\Roshaan Ali Mehar\\Desktop\\test-scraper\\GoogleMaps\\v2\\data";
const outputFileWithEmail = "records_with_email.json";
const outputFileWithoutEmail = "records_without_email.json";
const outputFileAllUnique = "all_unique_records.json";
const startIndex = 32003; // Replace with the starting file number
const endIndex = 34997; // Replace with the ending file number

processJsonFilesInRange(
  inputDirectory,
  outputFileWithEmail,
  outputFileWithoutEmail,
  outputFileAllUnique,
  startIndex,
  endIndex
);
