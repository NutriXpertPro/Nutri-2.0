import paramiko


def check_users():
    host = "187.77.32.191"
    user = "root"
    password = "900113Acps@senharoot"

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, 22, user, password)

    cmd = "docker exec nutrixpert-db mysql -u nutri_user -pnutri_password nutrixpert_db -e 'SELECT id, email, user_type, is_active FROM users_user;'"

    stdin, stdout, stderr = ssh.exec_command(cmd)

    print("=== Users in database ===")
    print(stdout.read().decode())
    print("=== Errors ===")
    print(stderr.read().decode())

    ssh.close()


if __name__ == "__main__":
    check_users()
