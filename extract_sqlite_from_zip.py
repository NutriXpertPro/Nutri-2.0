import zipfile
import os

zip_path = r'C:\Users\ander\Downloads\cópia Nutri-3.0 (2).zip'
extract_path = r'C:\Users\ander\Downloads\nutri_backup_extracted'
db_in_zip = 'cópia Nutri-3.0/db.sqlite3'

try:
    if not os.path.exists(extract_path):
        os.makedirs(extract_path)
        
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        print(f"Extracting {db_in_zip}...")
        zip_ref.extract(db_in_zip, extract_path)
        print("Done.")

except Exception as e:
    print(f"Error: {e}")
