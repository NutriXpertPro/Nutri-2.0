import os

base_dir = r'C:\Users\ander\Downloads\nutri_backup_extracted'

def find_db():
    print(f"Searching in {base_dir}...")
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.sqlite3'):
                full_path = os.path.join(root, file)
                size = os.path.getsize(full_path)
                print(f"Found: {full_path} | Size: {size} bytes")

find_db()
