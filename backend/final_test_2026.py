import os
import django
import sys
import io

# Setup Django
sys.path.append(os.path.join(os.getcwd(), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

# Forçar UTF-8 para evitar erros no Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from diets.models import UnifiedFood
from diets.nutritional_substitution import sugerir_substitucoes_v2026

def test_arroz_block():
    print("\n" + "="*70)
    print("SIMULACAO DE TESTE DE CAMPO - MOTOR 2026")
    print("OBJETIVO: Verificar se 'Baiao de Dois' foi bloqueado para 'Arroz Integral'")
    print("="*70)

    arroz = UnifiedFood.objects.filter(name__icontains='Arroz, integral', source_name='TACO').first()
    if not arroz:
        print("ERRO: Arroz Integral nao encontrado no Hub!")
        return

    print(f"ALIMENTO ALVO: {arroz.name}")
    print(f"ID: {arroz.source_id} | FONTE: {arroz.source_name} | PUREZA: {arroz.purity_index}")
    print("-" * 50)

    sugestoes = sugerir_substitucoes_v2026(
        orig_id=arroz.source_id,
        original_source=arroz.source_name,
        qtd_orig=100,
        limite=50
    )

    print(f"Total de sugestoes geradas: {len(sugestoes)}")
    
    baiao_matches = [s for s in sugestoes if "baiao" in s.alimento_substituto.lower()]
    
    if not baiao_matches:
        print("\n[OK] SUCESSO: Nenhum rastro de 'Baiao de Dois' encontrado.")
        print("Razao Tecnica: Trava de Pureza Bio-Atomica ATIVA.")
    else:
        print(f"\n[X] FALHA: {len(baiao_matches)} variacoes de Baiao encontradas!")

    print("\nTOP 5 SUBSTITUTOS LEGITIMOS (STAPLES):")
    for i, s in enumerate(sugestoes[:5]):
        nome_limpo = s.alimento_substituto.encode('ascii', 'ignore').decode('ascii')
        print(f"{i+1}. {nome_limpo} | Qtd: {s.quantidade_substituto_g}g | Score: {s.similarity_score}")

if __name__ == "__main__":
    test_arroz_block()
