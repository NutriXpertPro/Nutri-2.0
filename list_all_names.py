import pymysql

password = '900113Acps@'
dbs = ['nutrixpert_db', 'nutri_xpert_pro', 'nutrixpert']

def get_name_col(cursor, table):
    cursor.execute(f"DESCRIBE {table}")
    cols = [c[0] for c in cursor.fetchall()]
    return next((c for c in cols if 'name' in c.lower() or 'nome' in c.lower() or 'full_name' in c.lower()), None)

for db in dbs:
    try:
        conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
        cursor = conn.cursor()
        print(f"\n--- {db} ---")
        
        cursor.execute("SHOW TABLES")
        tables = [t[0] for t in cursor.fetchall()]
        
        # Check patients_patient
        if 'patients_patient' in tables:
            ncol = get_name_col(cursor, 'patients_patient')
            if ncol:
                cursor.execute(f"SELECT {ncol} FROM patients_patient")
                names = [n[0] for n in cursor.fetchall()]
                print(f"  patients_patient: {names}")
        
        # Check patient_profiles
        if 'patient_profiles' in tables:
            ncol = get_name_col(cursor, 'patient_profiles')
            if ncol:
                cursor.execute(f"SELECT {ncol} FROM patient_profiles")
                names = [n[0] for n in cursor.fetchall()]
                print(f"  patient_profiles: {names}")
                
        conn.close()
    except Exception as e:
        print(f"Error in {db}: {e}")
