import pymysql
try:
    conn = pymysql.connect(
        host='localhost', 
        user='root', 
        password='900113Acps@', 
        database='nutri_xpert_dev'
    )
    cursor = conn.cursor()
    cursor.execute("SELECT email, is_active FROM users_user WHERE email='anderson_28vp@hotmail.com'")
    row = cursor.fetchone()
    if row:
        print(f"USUARIO_ENCONTRADO: Email={row[0]}, Ativo={row[1]}")
    else:
        print("USUARIO_NAO_ENCONTRADO")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"ERRO: {e}")
