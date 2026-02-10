---
name: nutri40-practices
description: Práticas específicas e padrões do sistema Nutri 4.0. Inclui padrões nutricionais, segurança de dados, isolamento entre nutricionistas e integração com bases de dados nutricionais.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Práticas do Nutri 4.0

> **Práticas específicas e padrões do sistema Nutri 4.0.**
> **Aprenda a pensar com base nos padrões do Nutri 4.0, não em práticas genéricas.**

---

## ⚠️ Princípio Central

- **Segurança de dados é fundamental**: Isolamento entre nutricionistas é obrigatório
- **Dados nutricionais precisos são essenciais**: Baseados em TACO/TBCA/USDA/IBGE
- **Experiência do usuário é prioritária**: Intuitivo para nutricionistas e pacientes
- **Conformidade é crítica**: Cumprir com LGPD e normas de proteção de dados
- **Integração é importante**: Conectar bases de dados nutricionais com precisão

---

## 1. Segurança e Isolamento de Dados

### Princípio de Isolamento
```
Cada nutricionista só deve ver:
├── Seus próprios pacientes
├── Dietas criadas por ele
├── Anamneses de seus pacientes
├── Avaliações físicas de seus pacientes
└── Dados de substituição que ele criou

NUNCA deve ver:
├── Pacientes de outros nutricionistas
├── Dietas de outros nutricionistas
└── Dados de outros nutricionistas
```

### Implementação de Segurança
| Componente | Requisito |
|------------|-----------|
| **Modelos de dados** | Relacionar tudo ao nutricionista responsável |
| **Queries** | Sempre filtrar por `nutritionist=request.user` |
| **Views** | Verificar propriedade antes de retornar dados |
| **Permissões** | Validar acesso antes de qualquer operação |
| **Serializers** | Só retornar dados do nutricionista logado |

### Verificação de Segurança
- [ ] Todas as queries incluem filtro por nutricionista?
- [ ] Views verificam propriedade dos dados?
- [ ] Serializers não expõem dados de outros nutricionistas?
- [ ] Permissões são verificadas antes de cada operação?
- [ ] Não há acesso direto a dados sem verificação?

---

## 2. Dados Nutricionais e Bases de Dados

### Fontes de Dados Nutricionais
| Fonte | Uso | Prioridade |
|-------|-----|------------|
| **TACO** | Tabela de Composição de Alimentos | Alta |
| **TBCA** | Tabela Brasileira de Composição de Alimentos | Alta |
| **USDA** | Base americana, dados adicionais | Média |
| **IBGE** | Medidas caseiras e conversões | Alta |
| **Personalizados** | Alimentos criados pelo nutricionista | Baixa |

### Validação de Dados Nutricionais
```
Ao trabalhar com dados nutricionais:
├── Verificar fonte oficial (TACO/TBCA/USDA/IBGE)
├── Validar valores plausíveis
├── Considerar densidade e preparação
├── Manter consistência entre macros
└── Documentar fonte dos dados
```

### Cálculos Nutricionais
| Cálculo | Fórmula Padrão |
|---------|----------------|
| **TMB (Mifflin-St Jeor)** | (10×peso) + (6.25×altura) - (5×idade) + Ajuste |
| **GCDT** | TMB × Multiplicador de atividade |
| **Proteínas** | 1.2-2.2g/kg conforme objetivo |
| **Gorduras** | 0.8-1.2g/kg de peso |
| **Carboidratos** | Restante das calorias |

---

## 3. Substituições de Alimentos

### Critérios de Similaridade
| Macro | Limite de Diferença |
|-------|-------------------|
| **Calorias** | ≤ 10% do valor original |
| **Proteínas** | ≤ 15% do valor original |
| **Carboidratos** | ≤ 15% do valor original |
| **Gorduras** | ≤ 15% do valor original |

### Regras de Substituição
```
Ao criar regras de substituição:
├── Considerar macro predominante
├── Verificar similaridade nutricional
├── Calcular fator de conversão adequado
├── Considerar densidade e preparação
└── Validar aceitabilidade do paciente
```

---

## 4. Medidas Caseiras IBGE

### Medidas Padrão IBGE
| Medida | Equivalência Aproximada |
|--------|----------------------|
| **1 xícara de chá** | ~200ml (volume) / ~150-200g (alimento) |
| **1 xícara de café** | ~100ml (volume) / ~75-100g (alimento) |
| **1 colher de sopa** | ~15ml / ~10-15g (alimento) |
| **1 colher de chá** | ~5ml / ~3-5g (alimento) |
| **1 copo americano** | ~240ml |

### Conversão Baseada em IBGE
- Sempre consultar dados oficiais da Pesquisa de Orçamentos Familiares (POF)
- Considerar densidade do alimento específico
- Ajustar por preparação (cru, cozido, assado)
- Documentar fonte da equivalência

---

## 5. Anamneses e Dados Clínicos

### Estrutura da Anamnese
| Seção | Conteúdo |
|-------|----------|
| **Identificação** | Dados pessoais e de contato |
| **Rotina** | Sono, atividade física, horários |
| **Hábitos alimentares** | Padrões de ingestão, preferências |
| **Histórico de saúde** | Condições médicas, medicamentos |
| **Objetivos** | Metas e expectativas |
| **Medidas** | Dados antropométricos |
| **Fotos** | Documentação de progresso |

### Validação de Anamneses
- [ ] Dados antropométricos completos?
- [ ] Condições médicas relevantes identificadas?
- [ ] Objetivos claros e realistas?
- [ ] Restrições alimentares documentadas?
- [ ] Hábitos alimentares descritos?

---

## 6. Presets de Refeições

### Estratégia de Presets
```
Ao criar presets de refeições:
├── Considerar tipo de refeição (café, almoço, etc.)
├── Manter equilíbrio nutricional
├── Considerar palatabilidade
├── Ajustar por objetivo nutricional
└── Permitir variações dentro do preset
```

### Tipos de Presets
| Refeição | Características |
|----------|----------------|
| **Café da manhã** | Energético, saciante, baixo IG |
| **Almoço** | Equilibrado, proteína + carboidrato + vegetais |
| **Jantar** | Mais leve, foco em proteína e vegetais |
| **Lanches** | Saciantes, nutritivos |

---

## 7. Integrações e APIs

### Integração com Google Calendar
- OAuth 2.0 com escopos limitados
- Sincronização bidirecional opcional
- Tratamento de conflitos de agenda
- Proteção de dados do paciente

### APIs Nutricionais
- Autenticação segura
- Cache de dados para performance
- Tratamento de erros e fallbacks
- Registro de uso para auditoria

---

## 8. Padrões de Codificação Nutri 4.0

### Modelos Django
```python
# Exemplo de modelo com isolamento de nutricionista
class PatientProfile(models.Model):
    nutritionist = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        limit_choices_to={"user_type": "nutricionista"}
    )
    # outros campos...
    
    def save(self, *args, **kwargs):
        # sanitização de dados
        if self.name:
            self.name = sanitize_string(self.name)
        super().save(*args, **kwargs)
```

### Queries Seguras
```python
# SEMPRE filtrar por nutricionista
patients = PatientProfile.objects.filter(nutritionist=request.user)

# NUNCA fazer isso
all_patients = PatientProfile.objects.all()  # Perigo!
```

### Serializers com Segurança
```python
class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = '__all__'
    
    def get_queryset(self):
        # Garantir que só retorna dados do nutricionista
        return self.queryset.filter(nutritionist=self.context['request'].user)
```

---

## 9. Checklist de Desenvolvimento Nutri 4.0

### Antes de Começar
- [ ] Requisito respeita isolamento de dados?
- [ ] Necessita de dados nutricionais?
- [ ] Afeta segurança ou privacidade?
- [ ] Precisa de validação nutricional?

### Durante Desenvolvimento
- [ ] Dados são filtrados por nutricionista?
- [ ] Validação nutricional está implementada?
- [ ] Segurança de dados está garantida?
- [ ] Experiência do usuário é considerada?

### Após Desenvolvimento
- [ ] Testes de isolamento passaram?
- [ ] Validação nutricional está correta?
- [ ] Não há vazamento de dados entre nutricionistas?
- [ ] Código segue padrões do Nutri 4.0?

---

## 10. Anti-Padrões Nutri 4.0

| ❌ NUNCA Faça | ✅ Faça Corretamente |
|---------------|-------------------|
| Acessar dados sem filtrar por nutricionista | Sempre filtrar por `nutritionist=request.user` |
| Criar alimentos sem validar fonte | Consultar TACO/TBCA/USDA/IBGE |
| Permitir acesso cruzado entre nutricionistas | Implementar controle de acesso rigoroso |
| Armazenar dados nutricionais sem fonte | Documentar origem dos dados |
| Criar substituições sem similaridade | Validar equivalência nutricional |
| Ignorar medidas IBGE | Utilizar dados oficiais da POF |
| Expor dados sensíveis | Proteger conforme LGPD |

---

## 11. Scripts de Verificação (OBRIGATÓRIOS)

### Script de Segurança de Dados
```bash
python .agent/skills/nutri40-practices/scripts/security_checker.py .
```

### Script de Qualidade Nutricional
```bash
python .agent/skills/nutri40-practices/scripts/nutrition_validator.py .
```

### Script de Conformidade LGPD
```bash
python .agent/skills/nutri40-practices/scripts/lgpd_compliance.py .
```

---

> **Lembre-se:** O Nutri 4.0 tem requisitos específicos de segurança, nutrição e experiência do usuário. Siga estes padrões para garantir qualidade e conformidade.