import zipfile
import os

zip_path = r'C:\Users\ander\Downloads\cópia Nutri-3.0 (2).zip'
extract_path = r'C:\Users\ander\Downloads\nutri_backup_extracted'

def extract_media():
    try:
        if not os.path.exists(extract_path):
            os.makedirs(extract_path)
            
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            # Extract only media files
            media_files = [f for f in zip_ref.namelist() if 'media/' in f]
            print(f"Extracting {len(media_files)} media files...")
            for f in media_files:
                zip_ref.extract(f, extract_path)
            
            print("\nMedia files extracted.")
            
            # Check for SQL or JSON backups
            backups = [f for f in zip_ref.namelist() if f.endswith('.sql') or f.endswith('.json')]
            print(f"\nPotential backups found: {backups}")
            for b in backups:
                zip_ref.extract(b, extract_path)

    except Exception as e:
        print(f"Error: {e}")

extract_media()
