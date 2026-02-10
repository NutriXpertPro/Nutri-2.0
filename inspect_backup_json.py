import json

file_path = r"c:\Nutri 4.0\_SECURITY_VAULT_\database_backup.json"
try:
    with open(file_path, 'r', encoding='utf-16le') as f:
        data = f.read()
        print(f"File Size: {len(data)}")
        
        targets = ['Elizabeth', 'Angela', 'Elisabeth', 'Portes']
        for t in targets:
            count = data.lower().count(t.lower())
            print(f"Occurrences of '{t}': {count}")
            
    # Try parsing as JSON to find specific tables
    with open(file_path, 'r', encoding='utf-16le') as f:
        obj = json.load(f)
        if isinstance(obj, list):
            print(f"JSON is a list with {len(obj)} items.")
            # Search for anamnesis related models
            anam_items = [i for i in obj if 'anamnesis' in i.get('model', '').lower()]
            print(f"Anamnesis items in JSON: {len(anam_items)}")
            
            # Search for specific patients in the backup
            beth_items = [i for i in obj if i.get('fields', {}).get('name') and ('Elizabeth' in i['fields']['name'] or 'Elisabeth' in i['fields']['name'])]
            print(f"Elizabeth items in fields: {len(beth_items)}")
            
except Exception as e:
    print(f"Error: {e}")
