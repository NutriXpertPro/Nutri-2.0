from django.core.management.base import BaseCommand
from diets.models import AlimentoTACO, AlimentoTBCA, AlimentoUSDA
import json
import os

class Command(BaseCommand):
    help = 'Carrega dados de alimentos (TACO, TBCA, USDA) no banco de dados a partir de arquivos JSON'

    def handle(self, *args, **options):
        # Caminho para os arquivos JSON de alimentos
        data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')
        
        # Carregar dados TACO
        taco_path = os.path.join(data_dir, 'taco_data.json')
        if os.path.exists(taco_path):
            self.load_taco_data(taco_path)
        else:
            self.stdout.write(
                self.style.WARNING(
                    f'Arquivo TACO não encontrado: {taco_path}'
                )
            )
        
        # Carregar dados TBCA
        tbca_path = os.path.join(data_dir, 'tbca_data.json')
        if os.path.exists(tbca_path):
            self.load_tbca_data(tbca_path)
        else:
            self.stdout.write(
                self.style.WARNING(
                    f'Arquivo TBCA não encontrado: {tbca_path}'
                )
            )
        
        # Carregar dados USDA
        usda_path = os.path.join(data_dir, 'usda_data.json')
        if os.path.exists(usda_path):
            self.load_usda_data(usda_path)
        else:
            self.stdout.write(
                self.style.WARNING(
                    f'Arquivo USDA não encontrado: {usda_path}'
                )
            )

    def load_taco_data(self, filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                taco_data = json.load(f)
            
            created_count = 0
            for item in taco_data:
                _, created = AlimentoTACO.objects.get_or_create(
                    codigo=item.get('codigo', ''),
                    defaults={
                        'nome': item.get('nome', ''),
                        'grupo': item.get('grupo', ''),
                        'energia_kcal': float(item.get('energia_kcal', 0)),
                        'proteina_g': float(item.get('proteina_g', 0)),
                        'lipidios_g': float(item.get('lipidios_g', 0)),
                        'carboidrato_g': float(item.get('carboidrato_g', 0)),
                        'fibra_g': float(item.get('fibra_g', 0)),
                        'calcio_mg': float(item.get('calcio_mg', 0)),
                        'ferro_mg': float(item.get('ferro_mg', 0)),
                        'sodio_mg': float(item.get('sodio_mg', 0)),
                        'vitamina_c_mg': float(item.get('vitamina_c_mg', 0)),
                        'unidade_caseira': item.get('unidade_caseira', ''),
                        'peso_unidade_caseira_g': float(item.get('peso_unidade_caseira_g', 0)),
                    }
                )
                if created:
                    created_count += 1
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'TACO: {created_count} alimentos criados.'
                )
            )
        except FileNotFoundError:
            self.stdout.write(
                self.style.ERROR(
                    f'Arquivo TACO não encontrado: {filepath}'
                )
            )
        except json.JSONDecodeError:
            self.stdout.write(
                self.style.ERROR(
                    'Erro ao decodificar o arquivo TACO JSON'
                )
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(
                    f'Erro ao carregar dados TACO: {str(e)}'
                )
            )

    def load_tbca_data(self, filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                tbca_data = json.load(f)
            
            created_count = 0
            for item in tbca_data:
                _, created = AlimentoTBCA.objects.get_or_create(
                    codigo=item.get('codigo', ''),
                    defaults={
                        'nome': item.get('nome', ''),
                        'grupo': item.get('grupo', ''),
                        'energia_kcal': float(item.get('energia_kcal', 0)),
                        'proteina_g': float(item.get('proteina_g', 0)),
                        'lipidios_g': float(item.get('lipidios_g', 0)),
                        'carboidrato_g': float(item.get('carboidrato_g', 0)),
                        'fibra_g': float(item.get('fibra_g', 0)),
                        'calcio_mg': float(item.get('calcio_mg', 0)),
                        'ferro_mg': float(item.get('ferro_mg', 0)),
                        'sodio_mg': float(item.get('sodio_mg', 0)),
                        'vitamina_c_mg': float(item.get('vitamina_c_mg', 0)),
                        'vitamina_a_mcg': float(item.get('vitamina_a_mcg', 0)),
                        'unidade_caseira': item.get('unidade_caseira', ''),
                        'peso_unidade_caseira_g': float(item.get('peso_unidade_caseira_g', 0)),
                    }
                )
                if created:
                    created_count += 1
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'TBCA: {created_count} alimentos criados.'
                )
            )
        except FileNotFoundError:
            self.stdout.write(
                self.style.ERROR(
                    f'Arquivo TBCA não encontrado: {filepath}'
                )
            )
        except json.JSONDecodeError:
            self.stdout.write(
                self.style.ERROR(
                    'Erro ao decodificar o arquivo TBCA JSON'
                )
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(
                    f'Erro ao carregar dados TBCA: {str(e)}'
                )
            )

    def load_usda_data(self, filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                usda_data = json.load(f)
            
            created_count = 0
            for item in usda_data:
                _, created = AlimentoUSDA.objects.get_or_create(
                    fdc_id=item.get('fdc_id', ''),
                    defaults={
                        'nome': item.get('nome', ''),
                        'categoria': item.get('categoria', ''),
                        'energia_kcal': float(item.get('energia_kcal', 0)),
                        'proteina_g': float(item.get('proteina_g', 0)),
                        'lipidios_g': float(item.get('lipidios_g', 0)),
                        'carboidrato_g': float(item.get('carboidrato_g', 0)),
                        'fibra_g': float(item.get('fibra_g', 0)),
                        'calcio_mg': float(item.get('calcio_mg', 0)),
                        'ferro_mg': float(item.get('ferro_mg', 0)),
                        'sodio_mg': float(item.get('sodio_mg', 0)),
                        'vitamina_c_mg': float(item.get('vitamina_c_mg', 0)),
                        'vitamina_a_mcg': float(item.get('vitamina_a_mcg', 0)),
                        'vitamina_d_mcg': float(item.get('vitamina_d_mcg', 0)),
                        'porcao_padrao_g': float(item.get('porcao_padrao_g', 0)),
                    }
                )
                if created:
                    created_count += 1
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'USDA: {created_count} alimentos criados.'
                )
            )
        except FileNotFoundError:
            self.stdout.write(
                self.style.ERROR(
                    f'Arquivo USDA não encontrado: {filepath}'
                )
            )
        except json.JSONDecodeError:
            self.stdout.write(
                self.style.ERROR(
                    'Erro ao decodificar o arquivo USDA JSON'
                )
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(
                    f'Erro ao carregar dados USDA: {str(e)}'
                )
            )