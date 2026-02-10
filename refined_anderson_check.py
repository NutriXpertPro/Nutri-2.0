import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'
anderson_pid = 14

try:
    conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
    cursor = conn.cursor()
    
    # Check Anamnesis
    cursor.execute("SELECT * FROM anamnesis_anamnesis WHERE patient_id = 14")
    anam = cursor.fetchone()
    if anam:
        print("Anamnesis record found for Anderson.")
        # Print non-null values to see if it's "answered"
        cursor.execute("DESCRIBE anamnesis_anamnesis")
        cols = [c[0] for c in cursor.fetchall()]
        data = dict(zip(cols, anam))
        answered = {k: v for k, v in data.items() if v and v != 'None' and v != ''}
        print(f"Answered fields: {list(answered.keys())[:10]}... total: {len(answered)}")
    else:
        print("No Anamnesis record found for Anderson.")

    # Check for Responses
    cursor.execute("SHOW TABLES LIKE 'anamnesis_anamnesisresponse'")
    if cursor.fetchone():
        cursor.execute("SELECT COUNT(*) FROM anamnesis_anamnesisresponse")
        print(f"Total entries in anamnesis_anamnesisresponse: {cursor.fetchone()[0]}")
    
    # Check for Photos
    cursor.execute("SELECT COUNT(*) FROM progress_photos WHERE patient_id = 14")
    print(f"Anderson's progress photos count: {cursor.fetchone()[0]}")

    conn.close()
except Exception as e:
    print(f"Error: {e}")
