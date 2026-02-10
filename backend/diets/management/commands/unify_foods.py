from django.core.management.base import BaseCommand
from diets.models import AlimentoTACO, AlimentoTBCA, AlimentoUSDA, UnifiedFood
from unidecode import unidecode
from django import db

class Command(BaseCommand):
    def identificar_cla(self, nome):
        n = unidecode(nome.lower())
        
        # PRIORIDADE 1: JUNK (Banimento Biológico)
        # Usar apenas strings minúsculas e sem acento para match com unidecode(n)
        junk_list = [
            "doce", "bombom", "pudim", "geladinho", "fios de ovos", "chocolate", "sorvete", 
            "bala ", "pirulito", "biscoito", "bolacha", "bolo ", "mousse", "gelatina", 
            "canjica", "pamonha", "curau", "achocolatado", "nectar", "refresco", "refrigerante",
            "miojo", "hamburguer", "nuggets", "salsicha", "bisnaguinha", "sucrilhos", "froot loops",
            "vitamina", "shake", "mingau", "papa de", "creme de", "sobremesa", "flan ", "pavlova"
        ]
        if any(k in n for k in junk_list):
            return 'JUNK_FOOD'

        # PRIORIDADE 2: Clãs Puros
        if any(k in n for k in ["arroz", "batata", "mandioca", "aipim", "macaxeira", "inhame", "pao", "macarrao", "fuba", "milho", "aveia", "trigo", "farinha", "cereal", "torrada", "couscous", "quinoa"]):
            return 'CEREAL_TUBER'
        
        if any(k in n for k in ["frango", "boi", "vaca", "carne", "peixe", "tilapia", "atum", "sardinha", "ovo", "porco", "lombo", "peru", "presunto", "queijo", "leite", "yogurte", "iogurte", "camarao", "pescada", "merluza", "corvina"]):
            return 'PROTEIN_ANIMAL'
            
        if any(k in n for k in ["feijao", "lentilha", "grao-de-bico", "ervilha", "soja", "tofu", "grao de bico"]):
            return 'LEGUME'
            
        if any(k in n for k in ["azeite", "oleo", "manteiga", "margarina", "castanha", "nozes", "amendoim", "abacate", "coco", "banha"]):
            return 'FAT_SOURCE'
            
        if any(k in n for k in ["suco", "cha", "cafe", "bebida", "shoyu", "molho", "condimento", "vinagre", "sal ", "tempero", "acucar"]):
            return 'BEVERAGE_CONDIMENT'
            
        return 'O_PLANT_FRUIT'

    def identificar_purity(self, nome, cla):
        n = unidecode(nome.lower())
        if cla == 'JUNK_FOOD' or cla == 'BEVERAGE_CONDIMENT':
            return 'INDUSTRIAL', 4
            
        # Filtro de Receitas (Composite) - Muito mais agressivo
        composite_terms = [
            " com ", " ao ", " a ", " molho", " recheio", " sanduiche", " lasanha", 
            " pizza", " mix de", " baiao", " refogado", " frito", " empanado", 
            " milanesa", " ensopado", " bolonhesa", " c/ ", " s/ "
        ]
        if any(k in n for k in composite_terms):
            return 'COMPOSITE', 2
            
        return 'STAPLE', 1

    def handle(self, *args, **options):
        UnifiedFood.objects.all().delete()
        total = 0
        
        def save_food(label, item):
            nonlocal total
            try:
                en = float(item.energia_kcal or 0)
                p = float(item.proteina_g or 0)
                c = float(item.carboidrato_g or 0)
                f = float(item.lipidios_g or 0)
                
                n_low = unidecode(item.nome.lower())
                cl = self.identificar_cla(item.nome)
                
                # --- RECOVERY v5 (AUDITORIA EXTREMA) ---
                if cl != 'JUNK_FOOD' and en > 15:
                    # Recuperação de Cereais
                    if cl == 'CEREAL_TUBER' and c < (en * 0.4 / 4):
                        c = max((en - (p * 4) - (f * 9)) / 4, 1.0)
                    # Recuperação de Proteínas
                    elif cl == 'PROTEIN_ANIMAL' and p < (en * 0.3 / 4):
                         p = max((en - (c * 4) - (f * 9)) / 4, 1.0)
                
                # Âncora Dinâmica Real
                pk, ck, fk = p*4, c*4, f*9
                if pk > ck and pk > fk: anch = 'PROTEIN'
                elif ck > pk and ck > fk: anch = 'CARBS'
                elif fk > pk and fk > ck: anch = 'FAT'
                else: anch = 'CALORIES'

                pu, lv = self.identificar_purity(item.nome, cl)

                UnifiedFood.objects.create(
                    name=item.nome, energy_kcal=en, protein_g=p, carbs_g=c, fat_g=f,
                    fiber_g=float(getattr(item, 'fibra_g', 0) or 0),
                    prep_method='GRILLED' if 'grelhado' in n_low else 'RAW' if 'cru' in n_low else 'BOILED',
                    purity_index=pu, processing_level=lv, anchor_macro=anch, custom_category=cl,
                    source_name=label, source_id=str(getattr(item, 'id', getattr(item, 'fdc_id', '')))
                )
                total += 1
            except: pass

        self.stdout.write("RE-SINCRONIZAÇÃO DE SEGURANÇA...")
        for it in AlimentoTACO.objects.all(): save_food("TACO", it)
        for it in AlimentoTBCA.objects.all(): save_food("TBCA", it)
        for it in AlimentoUSDA.objects.all(): save_food("USDA", it)
        
        self.stdout.write(f"Concluido: {total} alimentos blindados.")
