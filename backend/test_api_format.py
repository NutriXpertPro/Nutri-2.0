import os
import django

def test_api_response():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
    try:
        django.setup()
    except Exception as e:
        print(f"Setup error: {e}")
        return
    
    from django.contrib.auth import get_user_model
    from rest_framework.test import APIRequestFactory, force_authenticate
    from patients.views import PatientListView
    
    User = get_user_model()
    email = 'andersoncarlosvp@gmail.com'
    nutrix = User.objects.filter(email=email).first()
    
    if not nutrix:
        print(f"User with email {email} not found.")
        return

    factory = APIRequestFactory()
    view = PatientListView.as_view()
    
    # Simula autenticação
    request = factory.get('/patients/')
    force_authenticate(request, user=nutrix)
    response = view(request)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response data type: {type(response.data)}")
    if isinstance(response.data, dict):
        print(f"Response data content keys: {list(response.data.keys())}")
        if 'results' in response.data:
            print(f"Number of results: {len(response.data['results'])}")
    elif isinstance(response.data, list):
        print(f"Response is a LIST of length: {len(response.data)}")
    
    print(f"Response data: {response.data}")

if __name__ == "__main__":
    test_api_response()
