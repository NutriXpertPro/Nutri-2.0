import zipfile
import os

zip_path = r'C:\Users\ander\Downloads\cópia Nutri-3.0 (2).zip'

try:
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        items = zip_ref.namelist()
        
        # Look for folders containing 'media' or 'profile_pics'
        media_paths = [i for i in items if 'profile_pics/' in i or 'progress_photos/' in i]
        print(f"Total media items found: {len(media_paths)}")
        if media_paths:
            print("Examples:")
            for m in media_paths[:20]:
                print(f"  {m}")
        
        # Look for database files
        db_files = [i for i in items if i.endswith('.sqlite3') or i.endswith('.sql') or i.endswith('.json') and 'backup' in i.lower()]
        print(f"\nPotential database files: {len(db_files)}")
        for dbf in db_files:
            print(f"  {dbf}")

except Exception as e:
    print(f"Error: {e}")
