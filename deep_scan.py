import pymysql

password = '900113Acps@'

def scan_all_dbs():
    try:
        conn = pymysql.connect(host='localhost', user='root', password=password)
        cursor = conn.cursor()
        cursor.execute("SHOW DATABASES")
        databases = [d[0] for d in cursor.fetchall()]
        
        for db in databases:
            if db in ['information_schema', 'mysql', 'performance_schema', 'sys']:
                continue
            
            try:
                cursor.execute(f"USE {db}")
                cursor.execute("SHOW TABLES")
                tables = [t[0] for t in cursor.fetchall()]
                
                patient_tables = [t for t in tables if 'patient' in t.lower() or 'paciente' in t.lower()]
                anamnesis_tables = [t for t in tables if 'anamnesis' in t.lower() or 'anamnese' in t.lower()]
                photo_tables = [t for t in tables if 'photo' in t.lower() or 'foto' in t.lower() or 'image' in t.lower() or 'imagem' in t.lower()]
                
                if patient_tables or anamnesis_tables:
                    print(f"\n[DATABASE: {db}]")
                    for t in patient_tables:
                        cursor.execute(f"SELECT COUNT(*) FROM {t}")
                        count = cursor.fetchone()[0]
                        print(f"  - Patient Table: {t} | Count: {count}")
                    
                    for t in anamnesis_tables:
                        cursor.execute(f"SELECT COUNT(*) FROM {t}")
                        count = cursor.fetchone()[0]
                        print(f"  - Anamnesis Table: {t} | Count: {count}")

                    for t in photo_tables:
                        try:
                            cursor.execute(f"SELECT COUNT(*) FROM {t}")
                            count = cursor.fetchone()[0]
                            print(f"  - Potential Photo Table: {t} | Count: {count}")
                        except: pass
            except: pass
        conn.close()
    except Exception as e:
        print(f"Global Error: {e}")

scan_all_dbs()
