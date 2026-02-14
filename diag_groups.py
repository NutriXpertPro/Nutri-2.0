
import os
import django
import sys

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from diets.models import AlimentoTACO, AlimentoTBCA, AlimentoUSDA, CustomFood

def list_groups():
    results = {}
    
    print("=== Coletando Grupos ===")
    results['TACO'] = sorted(list(AlimentoTACO.objects.values_list('grupo', flat=True).distinct()))
    results['TBCA'] = sorted(list(AlimentoTBCA.objects.values_list('grupo', flat=True).distinct()))
    results['USDA'] = sorted(list(AlimentoUSDA.objects.values_list('categoria', flat=True).distinct()))
    results['Custom'] = sorted(list(CustomFood.objects.values_list('grupo', flat=True).distinct()))
    
    for source, groups in results.items():
        print(f"\n[{source}]:")
        for g in groups:
            if g:
                print(f"  - {g}")

if __name__ == "__main__":
    list_groups()
