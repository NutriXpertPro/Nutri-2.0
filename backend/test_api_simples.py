import requests
import json

BASE_URL = "http://localhost:8000/api/v1"


def test_login_and_patients():
    print("=" * 60)
    print("TESTE DA API REST")
    print("=" * 60)

    # 1. Login
    print("\n1. Fazendo login...")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login/",
            json={"email": "andersoncarlosvp@gmail.com", "password": "Nutri@123"},
            timeout=10,
        )
        print(f"   Status: {response.status_code}")

        if response.status_code != 200:
            print(f"   ERRO: {response.text}")
            return

        data = response.json()
        access_token = data.get("access")
        refresh_token = data.get("refresh")
        print(f"   Token obtido: {access_token[:50]}...")

    except Exception as e:
        print(f"   ERRO: {e}")
        return

    # 2. Buscar pacientes
    print("\n2. Buscando pacientes...")
    try:
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(f"{BASE_URL}/patients/", headers=headers, timeout=10)
        print(f"   Status: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print(f"\n   Resposta completa:")
            print(json.dumps(data, indent=2, ensure_ascii=False))

            # Verificar se é paginado
            if isinstance(data, dict) and "results" in data:
                patients = data["results"]
                print(f"\n   Total (paginado): {data.get('count', len(patients))}")
            elif isinstance(data, list):
                patients = data
                print(f"\n   Total (lista): {len(patients)}")
            else:
                patients = []

            print(f"\n   Pacientes encontrados:")
            for p in patients:
                print(f"   - ID: {p.get('id')}, Nome: {p.get('name')}")

            # Verificar Angela
            angela = [p for p in patients if "Angela" in p.get("name", "")]
            if angela:
                print(f"\n   ✅ ANGELA ENCONTRADA NA API!")
            else:
                print(f"\n   ❌ Angela NAO encontrada na API")
        else:
            print(f"   ERRO: {response.text}")

    except Exception as e:
        print(f"   ERRO: {e}")


if __name__ == "__main__":
    test_login_and_patients()
