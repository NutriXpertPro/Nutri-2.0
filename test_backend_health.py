import requests

url = "http://127.0.0.1:8000/api/v1/health/"
try:
    print(f"Testing connectivity to {url}...")
    response = requests.get(url, timeout=5)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error connecting to backend: {e}")

url_root = "http://127.0.0.1:8000/"
try:
    print(f"\nTesting connectivity to {url_root}...")
    response = requests.get(url_root, timeout=5)
    print(f"Status Code: {response.status_code}")
except Exception as e:
    print(f"Error connecting to root: {e}")
