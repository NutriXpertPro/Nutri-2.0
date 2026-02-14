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

def check_patient_and_nutritionist():
    print("Checking patient and nutritionist relationship...")
    
    # Get the patient
    patient = PatientProfile.objects.filter(
        user__name__icontains='Angela Cristina Portes de Sant ana'
    ).first()
    
    if patient:
        print(f"Patient found: {patient.user.name} (ID: {patient.id})")
        print(f"Associated with nutritionist: {patient.nutritionist.name} (ID: {patient.nutritionist.id})")
        print(f"Email: {patient.user.email}")
        print(f"Active: {patient.is_active}")
        print(f"Created: {patient.created_at}")
        
        # Check if the nutritionist exists and get details
        nutritionist = patient.nutritionist
        print(f"\nNutritionist details:")
        print(f"  Name: {nutritionist.name}")
        print(f"  Email: {nutritionist.email}")
        print(f"  Type: {nutritionist.user_type}")
        
        # Check all patients for this nutritionist
        patients_for_nutri = PatientProfile.objects.filter(nutritionist=nutritionist)
        print(f"\nTotal patients for {nutritionist.name}: {patients_for_nutri.count()}")
        for p in patients_for_nutri:
            print(f"  - {p.user.name} (Active: {p.is_active})")
    else:
        print("Patient not found!")

if __name__ == '__main__':
    check_patient_and_nutritionist()