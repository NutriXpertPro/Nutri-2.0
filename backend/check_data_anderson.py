import os
import django
from django.contrib.auth import get_user_model

def check_data():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
    django.setup()
    
    from patients.models import PatientProfile
    User = get_user_model()
    
    email = 'andersoncarlosvp@gmail.com'
    nutrix = User.objects.filter(email=email).first()
    
    print(f"Nutri: {nutrix}")
    if not nutrix:
        print(f"User with email {email} not found.")
        return

    patients = PatientProfile.objects.filter(nutritionist=nutrix)
    print(f"Total patients for Nutri (all): {patients.count()}")
    
    active_patients = patients.filter(is_active=True)
    print(f"Active patients for Nutri: {active_patients.count()}")
    
    for p in patients:
        print(f"Patient ID: {p.id}")
        print(f"Name: {p.user.name}")
        print(f"Email: {p.user.email}")
        print(f"Patient Active: {p.is_active}")
        print(f"User Active: {p.user.is_active}")
        print("-" * 20)

if __name__ == "__main__":
    check_data()
