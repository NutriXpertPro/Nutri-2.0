#!/usr/bin/env python3
"""
Script para verificar o status do usuário da paciente
"""

import subprocess
import sys
import os

def check_user_status():
    """
    Verifica o status do usuário ID 78 (Angela Cristina Portes de Sant ana)
    """
    # Script para verificar o status do usuário
    script_content = '''
import pymysql
import os

def check_user_status():
    """
    Verifica o status do usuário ID 78
    """
    password = '900113Acps@'
    db = 'nutrixpert_db'
    
    try:
        conn = pymysql.connect(
            host='localhost',
            user='root',
            password=password,
            database=db,
            charset='utf8mb4'
        )
        cursor = conn.cursor()
        
        print("=== Verificação do Status do Usuário ===\\n")
        
        # Verificar o status do usuário ID 78
        cursor.execute("SELECT id, name, email, is_active FROM users_user WHERE id = 78")
        user = cursor.fetchone()
        
        if user:
            print(f"Usuário (ID 78):")
            print(f"  - Nome: {user[1]}")
            print(f"  - Email: {user[2]}")
            print(f"  - is_active: {user[3]}")
            
            if user[3] == 1:
                print("\\nSTATUS: O usuário está ATIVO")
                print("O campo 'status' no frontend deve mostrar como ativo")
            else:
                print("\\nSTATUS: O usuário está INATIVO")
                print("ESTE É O PROBLEMA! O usuário está inativo, então o campo 'status' no frontend é falso")
        else:
            print("ERRO: Usuário (ID 78) não encontrado!")
        
        # Verificar também o status do nutricionista ID 76
        cursor.execute("SELECT id, name, email, is_active FROM users_user WHERE id = 76")
        nutritionist = cursor.fetchone()
        
        if nutritionist:
            print(f"\\nNutricionista (ID 76):")
            print(f"  - Nome: {nutritionist[1]}")
            print(f"  - Email: {nutritionist[2]}")
            print(f"  - is_active: {nutritionist[3]}")
        
        print("\\n=== Verificação Concluída ===")
        
    except Exception as e:
        print(f"Erro ao conectar ao banco de dados: {str(e)}")
    finally:
        if 'conn' in locals() and conn:
            conn.close()

if __name__ == "__main__":
    check_user_status()
'''

    # Escrever o script temporário
    with open('temp_check_user_status.py', 'w', encoding='utf-8') as f:
        f.write(script_content)
    
    # Executar o script com o Python do ambiente virtual
    try:
        result = subprocess.run([
            r'C:\Nutri 4.0\backend\.venv\Scripts\python.exe',
            'temp_check_user_status.py'
        ], capture_output=True, text=True, cwd=os.getcwd())
        
        print("Saída do script:")
        print(result.stdout)
        if result.stderr:
            print("Erros:")
            print(result.stderr)
            
    except Exception as e:
        print(f"Erro ao executar o script: {str(e)}")
    finally:
        # Remover o script temporário
        if os.path.exists('temp_check_user_status.py'):
            os.remove('temp_check_user_status.py')

if __name__ == "__main__":
    check_user_status()