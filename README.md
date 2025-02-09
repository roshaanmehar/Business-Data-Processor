# Business Data Processor

This repository contains scripts for processing business data from JSON files. The scripts handle phone number normalization, deduplication, and sorting while generating separate output files for records with and without emails. There are implementations in both Python and JavaScript, allowing flexibility based on the preferred runtime environment.

## Features
- **Phone Number Normalization:** Standardizes phone numbers to a unified format.
- **Deduplication:** Identifies and removes duplicate records based on business name and phone number.
- **Email-based Filtering:** Segregates records into those with and without email addresses.
- **Sorting:** The JavaScript version sorts records by postcode.
- **Batch Processing:** The JavaScript version processes files within a given numerical range.

## Files Overview

### Python Implementation
- `py.py`: Reads JSON files, normalizes phone numbers, removes duplicates, and writes separate JSON files for records with and without emails.

### JavaScript Implementation
- `js.js`: Similar to the Python version but includes additional functionality for batch processing and sorting by postcode.

### Output Files
- `records_with_email.json`: Contains records that include an email address.
- `records_without_email.json`: Contains records that do not have an email address.
- `all_unique_records.json`: Contains all unique records after deduplication.

## This is data before processing in one of more than three thousand files:
<img src="https://github.com/roshaanmehar/Business-Data-Processor/blob/main/Screenshot%202025-02-09%20000410.png" width="600">

## This is data in the `allrecordswithoutemails.json` file:
<img src="https://github.com/roshaanmehar/Business-Data-Processor/blob/main/Screenshot%202025-02-09%20000618.png" width="600">

## This is data after the procesing is done and the duplicates are removed and all attributes for every record are combined on the basis of phone number:
<img src="https://github.com/roshaanmehar/Business-Data-Processor/blob/main/Screenshot%202025-02-09%20000728.png" width="600">

## When you run the scrpit and do not encounter any fatal errors, you should see output like this on your terminal:
<img src="https://github.com/roshaanmehar/Business-Data-Processor/blob/main/Screenshot%202025-02-09%20000827.png" width="">
- The errors are just warnings. None of them are fatal errors or breaking errors. So, no need to worry about them.
## Usage

### Python Script
1. Install dependencies (if required):
   ```sh
   pip install json
   ```
2. Run the script:
   ```sh
   python py.py
   ```
   Modify the `input_directory` variable to specify the directory containing JSON files.

### JavaScript Script
1. Install dependencies (if required):
   ```sh
   npm install
   ```
2. Run the script:
   ```sh
   node js.js
   ```
   Modify the `inputDirectory`, `startIndex`, and `endIndex` variables as needed.

## Contributions
Feel free to open issues or submit pull requests for improvements or additional features.

## License
This project is open-source and available under the MIT License.

