import requests
import os

BASE_URL = "http://localhost:8000/api/v1/"
LOGIN_URL = "http://localhost:8000/api/token/"
USER_ME_URL = BASE_URL + "users/me/"

# Credentials from user
EMAIL = "andersoncarlosvp@gmail.com"
PASSWORD = "Nutri@123"

def test_profile_update():
    print(f"1. Attempting login as {EMAIL}...")
    login_data = {"email": EMAIL, "password": PASSWORD}
    response = requests.post(LOGIN_URL, json=login_data)
    
    if response.status_code != 200:
        print(f"FAILED LOGIN: {response.status_code}")
        print(response.text)
        return

    tokens = response.json()
    access_token = tokens["access"]
    print("Login successful.")

    headers = {"Authorization": f"Bearer {access_token}"}

    # Prepare a mock image file
    print("2. Preparing image upload...")
    image_path = "test_avatar.png"
    # Create a small valid PNG
    from PIL import Image
    img = Image.new('RGB', (100, 100), color = 'red')
    img.save(image_path)

    # Simulate FormData request like the frontend
    files = {
        'profile_picture': ('test_avatar.png', open(image_path, 'rb'), 'image/png')
    }
    data = {
        'name': 'Anderson Carlos Updated',
        'settings.theme': 'dark'
    }

    print("3. Sending PATCH request with FormData...")
    patch_response = requests.patch(USER_ME_URL, headers=headers, data=data, files=files)
    
    print(f"PATCH Response Status: {patch_response.status_code}")
    # print(patch_response.json())

    print("4. Verifying with GET request...")
    get_response = requests.get(USER_ME_URL, headers=headers)
    print(f"GET Response Status: {get_response.status_code}")
    resp_data = get_response.json()
    print(f"Name: {resp_data.get('name')}")
    print(f"Profile Picture URL: {resp_data.get('profile_picture')}")
    print(f"Avatar URL: {resp_data.get('avatar')}")
    print(f"Settings Theme: {resp_data.get('settings', {}).get('theme')}")

    print("Done with request.")

if __name__ == "__main__":
    test_profile_update()
