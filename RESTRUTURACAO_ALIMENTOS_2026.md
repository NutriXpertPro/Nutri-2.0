# Arquitetura UUFT 2026 (Unified Universal Food Taxonomy)

Esta arquitetura resolve definitivamente o erro de 15 dias nas substituições alimentares. Em vez de "adivinhar" nomes, o sistema passa a trabalhar com **Atributos de Natureza**.

## 1. Nova Tabela: `UnifiedFood`
Substitui a lógica de busca fragmentada por um Hub Centralizado.

| Campo | Descrição | Exemplo |
| :--- | :--- | :--- |
| `prep_method` | Enumera o estado físico | `RAW`, `GRILLED`, `BOILED`, `ROASTED` |
| `purity_index` | Separa alimentos puros de pratos compostos | `STAPLE` (Arroz), `COMPOSITE` (Baião) |
| `processing_level` | Nível 1 a 4 (Escala NOVA) | `1` (Ovo), `4` (Salsicha/Açúcar) |
| `anchor_macro` | Define qual macro manda na substituição | `PROTEIN` (Frango), `CARB` (Batata) |

## 2. Por que o "Grelhado" não falhará mais?
Na lógica antiga, buscávamos "Frango Grelhado" por texto. Na nova:
- O sistema identifica que o paciente deve comer algo `COOKED` ou `GRILLED`.
- Ele filtra o banco por `prep_method` em ['GRILLED', 'BOILED', 'ROASTED'].
- Se houver um "Frango Cru" no banco, ele é **ignorado fisicamente** pela query SQL, antes mesmo de chegar no cálculo.

## 3. Por que o "Baião de 2" sumirá do Arroz?
- Arroz Integral -> `purity_index = STAPLE`.
- Baião de 2 -> `purity_index = COMPOSITE`.
- **Regra de Motor de 2026:** Substituições de `STAPLE` só aceitam `STAPLE`. O Baião é filtrado por ser uma receita composta.

## 4. Bloqueio de Industriais e Açúcar
- Adicionaremos o campo `is_junk` ou filtraremos por `processing_level >= 3`.
- O sistema terá um interruptor global: `ALLOW_ULTRAPROCESSED = False`.

## Próximo Passo
1. Criar Migration para esta tabela.
2. Script de IA para categorizar os 5.000+ alimentos atuais nestes novos campos (usando processamento em lote).
3. Atualizar o frontend para refletir estas novas opções.
