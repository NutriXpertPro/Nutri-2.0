import os
import django
import sys
from django.db.models import Q
from unidecode import unidecode

# Configuração do ambiente Django
sys.path.append(os.path.join(os.getcwd(), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from diets.models import AlimentoTACO, AlimentoTBCA, AlimentoUSDA, UnifiedFood

def identificar_purity(nome):
    n = unidecode(nome.lower())
    composite_kws = [" com ", " ao ", " a ", " molho ", " recheado ", " acompanhado ", " e ", "baiao", "mexido"]
    industrial_kws = ["acucar", "nectar", "salsicha", "mortadela", "salame", "nugget", "steak", "hamburguer", "refrigerante", "biscoito", "bolacha"]
    
    if any(k in n for k in industrial_kws): return 'INDUSTRIAL', 4
    if any(k in n for k in composite_kws): return 'COMPOSITE', 2
    return 'STAPLE', 1

def identificar_prep(nome):
    n = unidecode(nome.lower())
    if "grelhado" in n: return 'GRILLED'
    if "assado" in n or "forno" in n: return 'ROASTED'
    if "cozido" in n or "vapor" in n: return 'BOILED'
    if "frito" in n: return 'FRIED'
    if "cru" in n or "in natura" in n or "fresco" in n: return 'RAW'
    return 'OTHER'

def identificar_anchor(p, c, f):
    if p > c and p > f: return 'PROTEIN'
    if c > p and c > f: return 'CARBS'
    if f > p and f > c: return 'FAT'
    return 'CALORIES'

def migrate_source(model_class, source_name):
    print(f"Migrando {source_name} com Otimização Bulk...")
    items = model_class.objects.all()
    batch = []
    count = 0
    
    for item in items:
        purity, level = identificar_purity(item.nome)
        prep = identificar_prep(item.nome)
        anchor = identificar_anchor(item.proteina_g, item.carboidrato_g, item.lipidios_g)
        sid = str(getattr(item, 'id', getattr(item, 'fdc_id', '')))
        
        batch.append(UnifiedFood(
            source_name=source_name,
            source_id=sid,
            name=item.nome,
            energy_kcal=item.energia_kcal,
            protein_g=item.proteina_g,
            carbs_g=item.carboidrato_g,
            fat_g=item.lipidios_g,
            fiber_g=getattr(item, 'fibra_g', 0) or 0,
            prep_method=prep,
            purity_index=purity,
            processing_level=level,
            anchor_macro=anchor,
            is_cooked=prep not in ['RAW']
        ))
        
        if len(batch) >= 500:
            UnifiedFood.objects.bulk_create(batch)
            count += len(batch)
            batch = []
    
    if batch:
        UnifiedFood.objects.bulk_create(batch)
        count += len(batch)
        
    print(f"Finalizado {source_name}: {count} itens.")

if __name__ == "__main__":
    UnifiedFood.objects.all().delete()
    migrate_source(AlimentoTACO, "TACO")
    migrate_source(AlimentoTBCA, "TBCA")
    migrate_source(AlimentoUSDA, "USDA")
    
    print("\nPROVA DE SUCESSO:")
    print(f"Grelhados no Hub: {UnifiedFood.objects.filter(prep_method='GRILLED').count()}")
    print(f"Comida de Verdade (Staples): {UnifiedFood.objects.filter(purity_index='STAPLE').count()}")
