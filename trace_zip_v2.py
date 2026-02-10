import zipfile
import os

zip_path = r'C:\Users\ander\Downloads\cópia Nutri-3.0 (2).zip'

try:
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        items = zip_ref.namelist()
        print(f"Total items: {len(items)}")
        
        # Search for anything with 'media'
        media_items = [i for i in items if 'media' in i.lower()]
        print(f"\nMedia items (first 10): {media_items[:10]}")
        
        # Search for backups
        backup_items = [i for i in items if i.endswith('.sql') or i.endswith('.json') or 'backup' in i.lower()]
        print(f"\nBackup items (all): {backup_items}")

except Exception as e:
    print(f"Error: {e}")
