
import paramiko

def debug_login():
    host = '187.77.32.191'
    user = 'root'
    password = '900113Acps@senharoot'

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, 22, user, password)

    # Command to check user
    # We use single quotes for SQL to avoid bash interference
    sql_query = "SELECT id, email, is_active, user_type FROM users_user WHERE email='andersoncarlosvp@gmail.com';"
    cmd = f'docker exec nutrixpert-db mysql -u nutri_user -pnutri_password nutrixpert_db -e "{sql_query}"'
    
    print(f"Executing: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    
    out = stdout.read().decode()
    err = stderr.read().decode()
    
    print("--- Output ---")
    print(out)
    print("--- Error ---")
    print(err)
    
    ssh.close()

if __name__ == "__main__":
    debug_login()
