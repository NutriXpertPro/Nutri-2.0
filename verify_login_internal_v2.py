
import paramiko

def verify_login_internal_v2():
    host = '187.77.32.191'
    user = 'root'
    password = '900113Acps@senharoot'

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, 22, user, password)

    verification_script = """
import requests
try:
    url = 'http://localhost:8000/health/'
    # data = {'email':'andersoncarlosvp@gmail.com', 'password':'Nutri@123'}
    data = {}
    headers = {'X-Forwarded-Proto': 'https', 'Host': 'localhost'} 
    
    print(f"Testing health to {url} with headers")
    res = requests.get(url, headers=headers, allow_redirects=False) # GET for health
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.text[:500]}") # truncated
    print(f"History: {res.history}")
except Exception as e:
    print(f"ERROR: {e}")
"""
    with open('verify_internal_v2.py', 'w', encoding='utf-8') as f:
        f.write(verification_script)

    print("Uploading verification script v2...")
    with ssh.open_sftp() as sftp:
        sftp.put('verify_internal_v2.py', '/root/nutrixpertpro/verify_internal_v2.py')

    print("Executing script inside container...")
    cmd = "cat /root/nutrixpertpro/verify_internal_v2.py | docker exec -i nutrixpert-backend python"
    
    stdin, stdout, stderr = ssh.exec_command(cmd)
    
    out = stdout.read().decode()
    err = stderr.read().decode()
    
    print("--- Output ---")
    print(out)
    print("--- Error ---")
    print(err)
    
    ssh.close()
    import os
    os.remove('verify_internal_v2.py')

if __name__ == "__main__":
    verify_login_internal_v2()
