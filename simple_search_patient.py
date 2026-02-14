import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')

# Setup Django
django.setup()

from users.models import User
from patients.models import PatientProfile

def search_for_patient():
    print("Searching for Angela Cristina Portes de Santana in the database...")
    
    # Search in User model
    users = User.objects.filter(name__icontains='Angela Cristina Portes de Santana')
    print(f"\nFound {users.count()} user(s) with name 'Angela Cristina Portes de Santana':")
    for user in users:
        print(f"  - ID: {user.id}, Name: {user.name}, Email: {user.email}, Type: {user.user_type}")
    
    # Search with partial matching
    name_parts = 'Angela Cristina Portes de Santana'.split()
    if len(name_parts) >= 2:
        partial_users = User.objects.filter(
            name__icontains=name_parts[0]
        ) & User.objects.filter(
            name__icontains=name_parts[-1]
        )
        print(f"\nFound {partial_users.count()} user(s) with partial name matching:")
        for user in partial_users:
            print(f"  - ID: {user.id}, Name: {user.name}, Email: {user.email}, Type: {user.user_type}")
    
    # Search in PatientProfile model
    patients = PatientProfile.objects.filter(
        user__name__icontains='Angela Cristina Portes de Santana'
    )
    print(f"\nFound {patients.count()} patient profile(s) with name 'Angela Cristina Portes de Santana':")
    for patient in patients:
        print(f"  - ID: {patient.id}, Name: {patient.user.name}, Email: {patient.user.email}, Active: {patient.is_active}")
        print(f"    Nutritionist: {patient.nutritionist.name if patient.nutritionist else 'None'}")
        print(f"    Created: {patient.created_at}")
    
    # Search in PatientProfile with partial matching
    partial_patients = PatientProfile.objects.filter(
        user__name__icontains=name_parts[0]
    ) & PatientProfile.objects.filter(
        user__name__icontains=name_parts[-1]
    )
    print(f"\nFound {partial_patients.count()} patient profile(s) with partial name matching:")
    for patient in partial_patients:
        print(f"  - ID: {patient.id}, Name: {patient.user.name}, Email: {patient.user.email}, Active: {patient.is_active}")
        print(f"    Nutritionist: {patient.nutritionist.name if patient.nutritionist else 'None'}")
        print(f"    Created: {patient.created_at}")
    
    # Check for inactive patients that might not appear in the list
    inactive_patients = PatientProfile.objects.filter(
        user__name__icontains='Angela Cristina Portes de Santana',
        is_active=False
    )
    print(f"\nFound {inactive_patients.count()} INACTIVE patient profile(s) with name 'Angela Cristina Portes de Santana':")
    for patient in inactive_patients:
        print(f"  - ID: {patient.id}, Name: {patient.user.name}, Email: {patient.user.email}, Active: {patient.is_active}")
        print(f"    Nutritionist: {patient.nutritionist.name if patient.nutritionist else 'None'}")
        print(f"    Created: {patient.created_at}")

if __name__ == '__main__':
    search_for_patient()