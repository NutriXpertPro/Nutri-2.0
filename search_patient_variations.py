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

def search_for_patient_variations():
    print("Searching for variations of Angela Cristina Portes de Santana in the database...")
    
    # Search for variations of the name
    name_variations = [
        'Angela Cristina',
        'Angela Portes',
        'Angela Santana',
        'Cristina Portes',
        'Cristina Santana',
        'Portes de Santana',
        'Angela',
        'Cristina',
        'Santana'
    ]
    
    for variation in name_variations:
        print(f"\n--- Searching for: '{variation}' ---")
        
        # Search in User model
        users = User.objects.filter(name__icontains=variation)
        print(f"Users found: {users.count()}")
        for user in users:
            print(f"  - ID: {user.id}, Name: {user.name}, Email: {user.email}, Type: {user.user_type}")
        
        # Search in PatientProfile model
        patients = PatientProfile.objects.filter(
            user__name__icontains=variation
        )
        print(f"Patient profiles found: {patients.count()}")
        for patient in patients:
            print(f"  - ID: {patient.id}, Name: {patient.user.name}, Email: {patient.user.email}, Active: {patient.is_active}")
            print(f"    Nutritionist: {patient.nutritionist.name if patient.nutritionist else 'None'}")
            print(f"    Created: {patient.created_at}")

    # Also check for any patient profiles that might have been created recently
    print(f"\n--- Checking for all recent patient profiles ---")
    recent_patients = PatientProfile.objects.order_by('-created_at')[:20]
    for patient in recent_patients:
        print(f"  - ID: {patient.id}, Name: {patient.user.name}, Email: {patient.user.email}, Active: {patient.is_active}")
        print(f"    Nutritionist: {patient.nutritionist.name if patient.nutritionist else 'None'}")
        print(f"    Created: {patient.created_at}")

if __name__ == '__main__':
    search_for_patient_variations()