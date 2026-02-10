import pymysql

dbs = ['nutri__xpert_dev', 'nutri_db', 'nutrixpert_db', 'nutri_xpert_dev']
password = '900113Acps@'

for db in dbs:
    try:
        conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        tables = [t[0] for t in cursor.fetchall()]
        if 'patients_patient' in tables:
            cursor.execute("SELECT COUNT(*) FROM patients_patient")
            count = cursor.fetchone()[0]
            print(f"DATABASE: {db} | TABLE patients_patient: YES | COUNT: {count}")
            
            # If count > 0, show representative data
            if count > 0:
                cursor.execute("SELECT id, name FROM patients_patient LIMIT 3")
                patients = cursor.fetchall()
                for p in patients:
                    print(f"  - Patient: {p[1]} (ID: {p[0]})")
        else:
            print(f"DATABASE: {db} | TABLE patients_patient: NO")
        conn.close()
    except Exception as e:
        print(f"DATABASE: {db} | ERROR: {e}")
