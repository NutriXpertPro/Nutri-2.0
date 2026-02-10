import os
import django
import time
from django.core.mail import send_mail
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

def test_email():
    print(f"DEBUG mode: {settings.DEBUG}")
    print(f"Email Backend: {settings.EMAIL_BACKEND}")
    print(f"Celery Eager: {settings.CELERY_TASK_ALWAYS_EAGER}")
    
    start = time.time()
    print("Testing send_mail...")
    send_mail(
        'Test Subject',
        'Test Message',
        'noreply@test.com',
        ['test@example.com'],
        fail_silently=False,
    )
    end = time.time()
    print(f"send_mail took: {end - start:.2f}s")

def test_task():
    from patients.tasks import send_welcome_email_task
    from utils.tasks import dispatch_task
    from django.contrib.auth import get_user_model
    User = get_user_model()
    user = User.objects.first()
    if not user:
        print("No user found to test task.")
        return
        
    start = time.time()
    print(f"Testing dispatch_task for user {user.email}...")
    # This should be synchronous and fast without broker connection
    dispatch_task(send_welcome_email_task, user.id, "Teste Nutri")
    end = time.time()
    duration = end - start
    print(f"dispatch_task took: {duration:.4f}s")
    if duration < 1.0:
        print("SUCCESS: Timeout issues resolved!")
    else:
        print("WARNING: Task still taking too long.")

if __name__ == "__main__":
    test_email()
    test_task()
