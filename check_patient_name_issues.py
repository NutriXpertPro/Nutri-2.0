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

def check_patient_name_issues():
    print("Checking for potential issues with patient name...")
    
    # Get the patient
    patient = PatientProfile.objects.filter(
        user__name__icontains='Angela Cristina Portes de Sant ana'
    ).first()
    
    if patient:
        print(f"Patient name: '{patient.user.name}'")
        print(f"Length: {len(patient.user.name)}")
        print(f"Has extra spaces: {'  ' in patient.user.name}")
        print(f"Has special characters: {any(ord(c) > 127 for c in patient.user.name)}")
        print(f"Character codes: {[ord(c) for c in patient.user.name]}")
        
        # Check if there are similar names that might be expected
        all_patients = PatientProfile.objects.all()
        for p in all_patients:
            if 'Angela' in p.user.name or 'Cristina' in p.user.name or 'Sant' in p.user.name:
                print(f"Similar name found: '{p.user.name}' for patient {p.id}")
    
    # Check if there might be a search issue due to the space in "Sant ana"
    print("\nTesting various search patterns:")
    patterns = [
        "Angela Cristina Portes de Santana",  # Expected name
        "Angela Cristina Portes de Sant ana",  # Actual name in DB
        "Angela Cristina Portes de Sant",     # Partial match
        "Sant ana",                          # The problematic part
        "Santana"                            # What user might search for
    ]
    
    for pattern in patterns:
        matches = PatientProfile.objects.filter(user__name__icontains=pattern)
        print(f"'{pattern}': {matches.count()} matches")
        for m in matches:
            print(f"  - {m.user.name}")

if __name__ == '__main__':
    check_patient_name_issues()