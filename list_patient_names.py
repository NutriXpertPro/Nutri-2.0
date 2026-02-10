import pymysql

password = '900113Acps@'

dbs = ['nutri_xpert_pro', 'nutrixpert_db', 'nutri_db', 'nutrixpert']

print("--- PATIENT LIST ---")
for db in dbs:
    try:
        conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        tables = [t[0] for t in cursor.fetchall()]
        
        for table in tables:
            if 'patient' in table.lower() and 'profile' in table.lower():
                cursor.execute(f"SELECT name FROM {table}")
                names = [n[0] for n in cursor.fetchall()]
                print(f"DATABASE: {db} | TABLE: {table} | COUNT: {len(names)}")
                print(f"  Names: {names}")
            elif table == 'patients_patient':
                cursor.execute(f"SELECT name FROM {table}")
                names = [n[0] for n in cursor.fetchall()]
                print(f"DATABASE: {db} | TABLE: {table} | COUNT: {len(names)}")
                print(f"  Names: {names}")
        conn.close()
    except Exception as e:
        print(f"DATABASE: {db} | ERROR: {e}")
