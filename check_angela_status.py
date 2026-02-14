import pymysql

password = '900113Acps@'
db = 'nutrixpert_db'

conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
cursor = conn.cursor()

# Check if Angela is inactive
cursor.execute('SELECT id, user_id, is_active FROM patient_profiles WHERE id = 47')
result = cursor.fetchone()
print(f'Angela (ID: 47) is_active status: {result[2]}')

# Check all patients for Anderson that are active
cursor.execute('SELECT pp.id, uu.name, pp.is_active FROM patient_profiles pp JOIN users_user uu ON pp.user_id = uu.id WHERE pp.nutritionist_id = 76 AND pp.is_active = 1')
active_patients = cursor.fetchall()
print(f'Active patients for Anderson (ID: 76):')
for patient in active_patients:
    print(f'  - Patient ID: {patient[0]}, Name: {patient[1]}, Active: {patient[2]}')

conn.close()