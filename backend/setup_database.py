#!/usr/bin/env python
"""
Script para verificar e corrigir a configuração do banco de dados
"""
import os
import sys
import subprocess

def check_and_create_database():
    """Verifica se o banco de dados existe e cria se necessário"""
    try:
        # Tenta conectar ao MySQL e verificar se o banco existe
        result = subprocess.run([
            'mysql', '-u', 'root', '-p900113Acps@', '-e', 
            'SHOW DATABASES LIKE "nutri_xpert_dev";'
        ], capture_output=True, text=True, cwd=r'C:\Nutri 4.0\backend')
        
        if 'nutri_xpert_dev' not in result.stdout:
            print("Banco de dados nutri_xpert_dev não encontrado. Criando...")
            # Cria o banco de dados
            subprocess.run([
                'mysql', '-u', 'root', '-p900113Acps@', '-e', 
                'CREATE DATABASE IF NOT EXISTS nutri_xpert_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'
            ], check=True, cwd=r'C:\Nutri 4.0\backend')
            
            # Cria o usuário se não existir
            subprocess.run([
                'mysql', '-u', 'root', '-p900113Acps@', '-e', 
                "CREATE USER IF NOT EXISTS 'nutri_user'@'localhost' IDENTIFIED BY 'nutri_password';"
            ], check=True, cwd=r'C:\Nutri 4.0\backend')
            
            # Concede permissões
            subprocess.run([
                'mysql', '-u', 'root', '-p900113Acps@', '-e', 
                "GRANT ALL PRIVILEGES ON nutri_xpert_dev.* TO 'nutri_user'@'localhost';"
            ], check=True, cwd=r'C:\Nutri 4.0\backend')
            
            subprocess.run([
                'mysql', '-u', 'root', '-p900113Acps@', '-e', 
                "FLUSH PRIVILEGES;"
            ], check=True, cwd=r'C:\Nutri 4.0\backend')
            
            print("Banco de dados e usuário criados com sucesso!")
        else:
            print("Banco de dados nutri_xpert_dev já existe.")
            
    except FileNotFoundError:
        print("MySQL não encontrado. Verifique se o MySQL está instalado e no PATH.")
        return False
    except subprocess.CalledProcessError as e:
        print(f"Erro ao executar comando MySQL: {e}")
        return False
    
    return True

def run_migrations():
    """Executa as migrações do Django"""
    try:
        result = subprocess.run([
            'py', 'manage.py', 'migrate'
        ], check=True, capture_output=True, text=True, cwd=r'C:\Nutri 4.0\backend')
        
        print("Migrações executadas com sucesso!")
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Erro ao executar migrações: {e}")
        print(e.stderr)
        return False

def load_food_data():
    """Carrega os dados de alimentos no banco de dados"""
    try:
        result = subprocess.run([
            'py', 'manage.py', 'load_all_food_data'
        ], check=True, capture_output=True, text=True, cwd=r'C:\Nutri 4.0\backend')
        
        print("Dados de alimentos carregados com sucesso!")
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Erro ao carregar dados de alimentos: {e}")
        print(e.stderr)
        return False

if __name__ == "__main__":
    print("Verificando e configurando banco de dados...")
    
    if check_and_create_database():
        if run_migrations():
            if load_food_data():
                print("\n✓ Configuração completa do banco de dados concluída com sucesso!")
                print("✓ Todos os dados de alimentos e suplementos estão no banco de dados")
                print("✓ Botão 'TODOS' na interface está pronto para funcionar")
            else:
                print("\n⚠ Dados de alimentos não puderam ser carregados")
        else:
            print("\n⚠ Migrações não puderam ser executadas")
    else:
        print("\n⚠ Banco de dados não pôde ser configurado")