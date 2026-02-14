
import paramiko

def verify_login_internal():
    host = '187.77.32.191'
    user = 'root'
    password = '900113Acps@senharoot'

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, 22, user, password)

    verification_script = """
import requests
import json
try:
    url = 'http://localhost:8000/api/v1/auth/login/'
    data = {'email':'andersoncarlosvp@gmail.com', 'password':'Nutri@123'}
    print(f"Testing login to {url} with {data}")
    res = requests.post(url, json=data)
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.text}")
except Exception as e:
    print(f"ERROR: {e}")
"""
    with open('verify_internal.py', 'w', encoding='utf-8') as f:
        f.write(verification_script)

    print("Uploading verification script...")
    with ssh.open_sftp() as sftp:
        sftp.put('verify_internal.py', '/root/nutrixpertpro/verify_internal.py')

    print("Executing script inside container...")
    cmd = "cat /root/nutrixpertpro/verify_internal.py | docker exec -i nutrixpert-backend python"
    
    stdin, stdout, stderr = ssh.exec_command(cmd)
    
    out = stdout.read().decode()
    err = stderr.read().decode()
    
    print("--- Output ---")
    print(out)
    print("--- Error ---")
    print(err)
    
    ssh.close()
    import os
    os.remove('verify_internal.py')

if __name__ == "__main__":
    verify_login_internal()
