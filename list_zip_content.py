import zipfile
import os

zip_path = r'C:\Users\ander\Downloads\cópia Nutri-3.0 (2).zip'
extract_path = r'C:\Users\ander\Downloads\nutri_backup_extracted'

try:
    if not os.path.exists(extract_path):
        os.makedirs(extract_path)
    
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        # List items first
        items = zip_ref.namelist()
        print(f"Total items in zip: {len(items)}")
        # Print only first 20 items to avoid spam
        for item in items[:20]:
            print(f"  {item}")
            
    print("\nExtraction skipped for now to save space, but content listed.")
except Exception as e:
    print(f"Error: {e}")
