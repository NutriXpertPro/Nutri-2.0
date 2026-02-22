#!/usr/bin/env python
# test-substitution-service.py
# Testa o serviço de substituição com os parâmetros que causavam 500

import sys
sys.path.insert(0, 'backend')

from diets.services import calculate_suggestion_service

def main():
    # Parâmetros exatos do erro do navegador
    params = {
        "food_id": "TACO_1",
        "food_name": "Arroz, integral, cozido",
        "food_source": "TACO",
        "original_quantity": 100,
        "diet_type": "normocalorica",
        "t_ptn": "2.59",
        "t_cho": "25.81",
        "t_fat": "1.00"
    }

    try:
        results, group_name, status_code = calculate_suggestion_service(**params)
        print(f"✅ Success: status={status_code}, group='{group_name}'")
        if results:
            print(f"   Found {len(results)} substitutions")
            for i, r in enumerate(results[:3]):
                print(f"   [{i+1}] {r.get('nome', '?')} | ptn={r.get('proteina_g', '?')}")
        else:
            print("   No results (but no error)")
    except Exception as e:
        print(f"❌ Exception: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()