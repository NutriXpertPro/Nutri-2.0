from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from diets.models import CustomFood, AlimentoTACO, AlimentoTBCA, AlimentoUSDA
import json
import os

User = get_user_model()

class Command(BaseCommand):
    help = 'Carrega todos os dados de alimentos e suplementos no banco de dados'

    def handle(self, *args, **options):
        # Caminho para o arquivo JSON de suplementos no frontend
        frontend_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '..', '..', 'frontend', 'src', 'services', 'supplement-data.json')
        
        try:
            with open(frontend_path, 'r', encoding='utf-8') as f:
                supplement_data = json.load(f)
            
            # Encontrar ou criar um usuário admin/nutricionista para associar os suplementos
            nutritionist = User.objects.filter(user_type='nutricionista').first()
            if not nutritionist:
                # Se não encontrar um nutricionista, criar um usuário genérico
                nutritionist, created = User.objects.get_or_create(
                    email='admin@nutrixpertpro.com',
                    defaults={
                        'name': 'Administrador de Suplementos',
                        'user_type': 'nutricionista'
                    }
                )
            
            # Contadores
            created_count = 0
            skipped_count = 0
            
            for supplement in supplement_data:
                # Verificar se já existe um suplemento com o mesmo nome
                existing = CustomFood.objects.filter(
                    nome__icontains=supplement['nome'],
                    grupo__icontains=supplement.get('grupo', ''),
                    nutritionist=nutritionist
                ).first()
                
                if not existing:
                    # Converter porção para peso em gramas se possível
                    porcao = supplement.get('porcao', '30g')
                    peso_g = 30.0  # Valor padrão
                    
                    # Tentar extrair valor numérico da porção
                    if porcao:
                        import re
                        numbers = re.findall(r'\d+', porcao)
                        if numbers:
                            try:
                                peso_g = float(numbers[0])
                            except ValueError:
                                peso_g = 30.0
                    
                    custom_food = CustomFood.objects.create(
                        nutritionist=nutritionist,
                        nome=f"{supplement.get('marca', '')} - {supplement['nome']}".strip(' -'),
                        grupo=supplement.get('grupo', 'Suplementos'),
                        energia_kcal=float(supplement.get('energia_kcal', 0)),
                        proteina_g=float(supplement.get('proteina_g', 0)),
                        carboidrato_g=float(supplement.get('carboidrato_g', 0)),
                        lipidios_g=float(supplement.get('lipidios_g', 0)),
                        fibra_g=float(supplement.get('fibra_g', 0)) if supplement.get('fibra_g') else 0.0,
                        unidade_caseira=porcao,
                        peso_unidade_caseira_g=peso_g,
                        is_active=True
                    )
                    created_count += 1
                    self.stdout.write(f'Criado: {custom_food.nome}')
                else:
                    skipped_count += 1
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Sucesso! {created_count} suplementos criados, {skipped_count} já existiam.'
                )
            )
            
        except FileNotFoundError:
            self.stdout.write(
                self.style.ERROR(
                    f'Arquivo não encontrado: {frontend_path}'
                )
            )
        except json.JSONDecodeError:
            self.stdout.write(
                self.style.ERROR(
                    'Erro ao decodificar o arquivo JSON'
                )
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(
                    f'Erro ao carregar suplementos: {str(e)}'
                )
            )