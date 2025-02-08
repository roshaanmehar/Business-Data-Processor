import os
import json
import re
import glob
from collections import defaultdict

def normalize_phone_number(phone):
    """
    Normalize phone numbers to a standard format: +1XXXXXXXXXX
    """
    # Remove all non-digit characters
    digits = re.sub(r'\D', '', phone)
    
    # Ensure the number starts with +1 for US numbers
    if len(digits) == 10:
        return f"+1{digits}"
    elif len(digits) == 11 and digits.startswith('1'):
        return f"+{digits}"
    else:
        return phone  # Return original if unable to normalize

def process_json_files(input_directory, output_file_with_email, output_file_without_email, output_file_all_unique):
    """
    Process all JSON files in the input directory and create three output files
    """
    all_records = []
    total_input_records = 0
    files_processed = 0

    # Read all JSON files in the input directory
    for filename in glob.glob(os.path.join(input_directory, '*.json')):
        with open(filename, 'r') as file:
            data = json.load(file)
            if isinstance(data, list):
                all_records.extend(data)
            elif isinstance(data, dict):
                all_records.append(data)
            total_input_records += len(data) if isinstance(data, list) else 1
            files_processed += 1

    print(f"Processed {files_processed} files with a total of {total_input_records} records.")

    # Normalize phone numbers and create a unique identifier for each record
    normalized_records = defaultdict(dict)
    for record in all_records:
        if "Phone Number" in record:
            record["Phone Number"] = normalize_phone_number(record["Phone Number"])
        
        # Create a unique identifier using business name and normalized phone number
        unique_id = f"{record.get('Business Name', '')}_{record.get('Phone Number', '')}"
        
        # Keep the record with email if duplicate is found
        if "Emails" in record or unique_id not in normalized_records:
            normalized_records[unique_id] = record

    # Separate records with and without emails
    records_with_email = []
    records_without_email = []
    all_unique_records = list(normalized_records.values())

    for record in all_unique_records:
        if "Emails" in record and record["Emails"]:
            records_with_email.append(record)
        else:
            records_without_email.append(record)

    # Write output files
    with open(output_file_with_email, 'w') as f:
        json.dump(records_with_email, f, indent=2)

    with open(output_file_without_email, 'w') as f:
        json.dump(records_without_email, f, indent=2)

    with open(output_file_all_unique, 'w') as f:
        json.dump(all_unique_records, f, indent=2)

    # Print statistics
    print(f"Total input records: {total_input_records}")
    print(f"Unique records after deduplication: {len(normalized_records)}")
    print(f"Records with email: {len(records_with_email)}")
    print(f"Records without email: {len(records_without_email)}")
    print(f"Duplicates removed: {total_input_records - len(normalized_records)}")

# Usage
input_directory = "path/to/your/input/json/files"
output_file_with_email = "records_with_email.json"
output_file_without_email = "records_without_email.json"
output_file_all_unique = "all_unique_records.json"

process_json_files(input_directory, output_file_with_email, output_file_without_email, output_file_all_unique)