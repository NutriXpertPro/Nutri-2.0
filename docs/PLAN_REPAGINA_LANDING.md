# Plano de Repaginação da Landing Page - Nutri Xpert Pro

## Visão Geral

Este documento apresenta o plano detalhado para repaginar a landing page do Nutri Xpert Pro (localhost:3000/). O objetivo é transformar a página atual em uma ferramenta de conversão de alto impacto, conectando a identidade visual verde esmeralda (#10b981) e destacando os 11 recursos principais do sistema.

---

## 0. Identidade Visual - GUIA COMPLETO DE ESTILO

### 0.1 Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| **Primária (Emerald)** | `#10b981` | Logo, CTAs principais, highlights |
| **Primária Escura** | `#059669` | Hover states, ênfase |
| **Primária Clara** | `#34D399` | Borders, detalhes sutis |
| **Fundo Principal** | `#020804` | Background geral (quase preto com tom verde) |
| **Fundo Secundário** | `#050505` | Cards, seções alternativas |
| **Fundo Terciário** | `#0A0A0A` | Elementos elevados |
| **Texto Principal** | `#FFFFFF` | Títulos, texto em destaque |
| **Texto Secundário** | `#A1A1AA` | Subtítulos, descrições |
| **Texto Tertiary** | `#71717A` | Labels, hints |
| **Accent Purple** | `#8B5CF6` | Gradientes, elementos decorativos |
| **Accent Cyan** | `#06B6D4` | Elementos de destaque |
| **Accent Amber** | `#F59E0B` | Warnings, badges |
| **Erro** | `#EF4444` | Erros, alertas |
| **Sucesso** | `#10B981` | Sucesso, checkmarks |

---

### 0.2 Sistema de Gradientes

| Nome | Composição | Uso |
|------|------------|-----|
| **Emerald Glow** | `linear-gradient(135deg, #10b981 0%, #059669 100%)` | Botões primários |
| **Midnight Emerald** | `linear-gradient(180deg, #020804 0%, #050505 100%)` | Backgrounds |
| **Purple Haze** | `linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)` | Elementos decorativos |
| **Card Shine** | `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)` | Hover em cards |
| **Button Shine** | `linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)` | Botões com brilho |

---

### 0.3 Tipografia

| Elemento | Fonte | Tamanho | Peso |
|----------|-------|---------|------|
| **H1 (Hero)** | Inter | 48-64px | 800 (ExtraBold) |
| **H2 (Seções)** | Inter | 36-48px | 700 (Bold) |
| **H3 (Títulos)** | Inter | 24-32px | 600 (SemiBold) |
| **Body** | Inter | 16-18px | 400 (Regular) |
| **Small** | Inter | 14px | 400 (Regular) |
| **Caption** | Inter | 12px | 500 (Medium) |

---

### 0.4 Efeitos Visuais

| Efeito | Código | Uso |
|--------|--------|-----|
| **Glassmorphism** | `backdrop-blur-xl bg-white/5` | Header, modais |
| **Card Glow** | `shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]` | Cards em destaque |
| **Button Glow** | `shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)]` | CTAs principais |
| **Border Glow** | `border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]` | Hover em cards |
| **Text Glow** | `drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]` | Texto em destaque |
| **Gradient Text** | `bg-clip-text text-transparent bg-gradient-to-r` | Títulos especiais |

---

### 0.5 Formatos e Bordas

| Elemento | Border Radius | Border |
|----------|--------------|--------|
| **Botões** | `rounded-full` (pill) | none ou border-white/10 |
| **Cards** | `rounded-2xl` | border-white/10 |
| **Inputs** | `rounded-xl` | border-white/20 |
| **Imagens** | `rounded-2xl` | none |
| **Badges** | `rounded-full` | none |

---

### 0.6 Transições e Animações

| Tipo | Duração | Easing | Uso |
|------|---------|--------|-----|
| **Fast** | 150ms | ease-out | Hover states |
| **Normal** | 300ms | ease-in-out | Transições padrão |
| **Slow** | 500ms | ease-in-out | Entrada de elementos |
| **Stagger** | 100ms delay | ease-out | Listas animadas |

**Animações recomendadas:**
- `fade-in-up` - Elementos surgindo de baixo
- `fade-in` - Elementos surgindo
- `scale-in` - Elementos aumentando
- `slide-in` - Elementos deslizando
- `pulse-glow` - Brilho pulsante em CTAs

---

### 0.7 Biblioteca UX/UI

| Biblioteca | Versão | Uso |
|------------|--------|-----|
| **Framer Motion** | ^11.x | Animações complexas |
| **Tailwind CSS** | ^3.x | Estilização |
| **Lucide React** | ^0.x | Ícones |
| **clsx / tailwind-merge** | latest | Condicional classes |

---

### 0.8 Responsividade - BREAKPOINTS

| Dispositivo | Largura | Layout |
|-------------|---------|--------|
| **Mobile Small** | 320-375px | 1 coluna, texto menor |
| **Mobile** | 375-428px | 1 coluna |
| **Mobile Large** | 428-768px | 1 coluna |
| **Tablet** | 768-1024px | 2 colunas |
| **Desktop** | 1024-1440px | 2-3 colunas |
| **Desktop Large** | 1440px+ | Container 1280px max |

**Regras Mobile-First:**
1. Touch targets: mínimo 44x44px
2. Espaçamento: 16px horizontal, 24px vertical
3. Fontes: mínimo 16px para corpo (evita zoom)
4. Botões: altura mínima 48px
5. Ícones: 24px minimum
6. Imagens: object-fit cover com aspect-ratio

---

## 1. Estratégia de Preços

### 1.1 Estrutura de Ofertas

| Plano | Preço Original | Preço Promocional | Preço Final |
|-------|----------------|-------------------|--------------|
| **Trial** | - | 7 dias grátis | R$ 0 |
| **Mensal** | R$ 89,90 | R$ 59,90 (3 meses) | R$ 69,90 (após 3 meses) |
| **Anual** | R$ 1.078,80/ano | R$ 598,80/ano | **R$ 49,90/mês** |

### 1.2 Estratégia de Conversão

**Fase 1: Trial (Dias 1-7)**
- Acesso COMPLETO a todas as funcionalidades
- Banner sutil: "7 dias gratuitos"
- Sem necessidade de cartão

**Fase 2: Upgrade Sugerido (Dias 8-14)**
- Modal de upgrade ao tentar acessar recurso
- Texto: "Período de teste terminado"
- Offer: "Primeiros 3 meses por R$ 59,90/mês"
- Botão: "Continuar com Premium"

**Fase 3: Conversão (Após 14 dias)**
- Acesso limitado a funcionalidades básicas
- Wall de conversão: "Atualize para continuar"
- Preço normal: R$ 69,90/mês ou R$ 49,90/mês (anual)

### 1.3 copy dos Preços

**Plano Starter (Grátis)**
- "Perfeito para conhecer a plataforma"
- Anamnese completa
- Até 10 pacientes
- Presets básicos
- Suporte por email

**Plano Professional (R$ 59,90/mês)**
- "Mais Popular - Ideal para crescer"
- Pacientes ilimitados
- Todos os presets
- Xpert Messenger
- Relatórios de evolução
- Suporte prioritário
- **Badge: "ESPECIAL 3 MESES"**

**Plano Annual (R$ 49,90/mês)**
- "Melhor custo-benefício"
- Tudo do Professional
- 2 meses gratuitos
- Treinamento exclusivo
- Badge: "ECONOMIZE 44%"

---

## 1. Análise Detalhada das Seções Atuais

### 1.1 Header (page.tsx:23-54)

**Status:** Bom, mas pode melhorar

**Pontos Fortes:**
- Logo com identidade visual correta (#10b981)
- Navegação funcional com links internos
- Botão de CTA "Começar Agora"

**Pontos de Melhoria:**
- Ausência de efeito visual no header (deve ser sticky com glassmorphism mais impactante)
- Falta de destaque para a logo no scroll
- Menu mobile pode ter animações mais suaves

---

### 1.2 HeroV3 (HeroV3.tsx)

**Status:** Precisando deRepaginação Urgente

**Problemas Identificados:**
- **Título genérico:** "MULTIPLIQUE SUA AUTORIDADE PROFISSIONAL" não conecta diretamente com benefícios tangíveis
- **Copywriting fraco:** O subtítulo mistura muitas features sem hierarquia clara
- **Ícones de benefícios:** Usam ícones genéricos (Zap, ShieldCheck, Hexagon) sem diferenciação visual
- **CTA primário:** "Torne-se um Especialista" não é motivador o suficiente
- **Prova social:** "2.500+ nutricionistas" aparece muito pequena no final
- **Falta conexão com a logo:** O verde esmeralda está presente mas não como elemento principal de reconhecimento

**Melhorias Necessárias:**
- Transformar em título orientado a resultado ("Multiplique Sua Capacidade de Atender Pacientes")
- Adicionar demonstrativo visual do produto (screenshot/gif animado)
- Criar contadores animados de métricas
- Destacar prova social mais cedo e de forma mais impactante

---

### 1.3 EcosystemV3 (EcosystemV3.tsx)

**Status:** Boa estrutura, preciso de mais diferenciação

**Problemas Identificados:**
- Cards são "simples" - apenas fundo escuro com borda
- Falta de elementos visuais de alto impacto (ícones maiores, ilustrações, gradientes)
- As 6 funcionalidades não cobrem todas as 11 listadas no escopo:
  - ✅ Anamnese Completa
  - ✅ Presets Inteligentes
  - ✅ Substituição Automática
  - ✅ Banco de Dados Premium
  - ✅ Gestão de Pacientes
  - ✅ Segurança LGPD
  - ❌ Xpert Messenger
  - ❌ Alimentos Favoritos
  - ❌ Cálculo de Macros (TMB, GCDT)
  - ❌ Relatórios
  - ❌ Integrações

**Melhorias Necessárias:**
- Adicionar 5 cards extras para cobrir todos os recursos
- Criar cards com efeito hover mais impactante (3D, parallax, etc.)
- Adicionar mini-demonstrações visuais em cada card

---

### 1.4 ProductivityV3 (ProductivityV3.tsx)

**Status:** Razoável, precisa de mais contexto

**Problemas Identificados:**
- As métricas (80%, 3x, 99%, +60%) não têm fonte ou contexto
- O workflow de 4 passos é muito genérico
- Falta conexão visual com o produto real

**Melhorias Necessárias:**
- Adicionar fontes para as estatísticas
- Criar visualização do workflow mais interativa
- Adicionar screenshots do sistema

---

### 1.5 PerformanceV3 (PerformanceV3.tsx)

**Status:** Necesário mover para seção de confiança

**Problemas Identificados:**
- métricas técnicas (AES-256, uptime 99.9%) são importantes mas apresentadas muito cedo
- Deveria estar após a seção de funcionalidades

**Melhorias Necessárias:**
- Mover para antes do Pricing como "Garantia de Qualidade"
- Adicionar selos de segurança e certificações

---

### 1.6 TestimonialsV3 (TestimonialsV3.tsx)

**Status:** Bom, mas pode adicionar mais elementos de convicção

**Pontos Fortes:**
- Prova social com CRN dos profissionais
- Ratings 5 estrelas
- Resultados quantificados

**Pontos de Melhoria:**
- Falta fotos dos profissionais
- Falta vídeo-depoimentos
- Ausência de logos de clínicas/parceiros

---

### 1.7 PricingV3 (PricingV3.tsx)

**Status:** Planes genéricos, PRECISA REDESENHAR COMPLETO

**Problemas Identificados:**
- Planos não têm diferenciação clara além de features
- Falta badge de "Recomendado" mais impactante
- Não há comparação detalhada
- Falta garantia visual (selo de 7 dias)
- NÃO TEM estratégia de trial e conversão

**NOVA ESTRUTURA DE PREÇOS (IMPLEMENTAR):**

| Plano | Preço | Destaque |
|-------|-------|----------|
| **Starter (Grátis)** | R$ 0 | "7 dias gratuitos para testar" |
| **Professional** | R$ 59,90/mês (3 meses) → R$ 69,90 | Badge "ESPECIAL 3 MESES" |
| **Annual** | R$ 49,90/mês | Badge "ECONOMIZE 44%" |

**Melhorias Necessárias:**
- Banner "7 dias grátis" bem visível
- Cards com animação de destaque no Professional
- Comparação visual lado a lado
- Selo "GARANTIA DE 7 DIAS"
- Contador de oferta (urgência)
- CTA persuasivos:
  - "Começar Trial Grátis"
  - "Garantir Oferta Especial"
  - "Economizar 44%"

---

### 1.8 Footer (page.tsx:78-111)

**Status:** Simples, precisa de expansão

**Melhorias Necessias:**
- Adicionar mais links úteis (Blog, FAQ, Termos, Privacidade)
- Adicionar newsletter signup
- Adicionar selos de segurança

---

## 1.B Detalhamento dos 11 Recursos do Ecossistema

### 1.B.1 ANAMNESE COMPLETA DE 7 SEÇÕES
**O que é:** Sistema de questionário nutricional completo com 7 seções distintas que capturam TODOS os dados necessários para um diagnóstico preciso.

**Seções detalhadas:**
1. **IDENTIFICAÇÃO** - Nome, idade, sexo, nascimento, profissão, email, telefone
2. **ROTINA** - Horários de sono, qualidade do sono, treino (dia, horário, duração)
3. **NUTRIÇÃO E HÁBITOS** - Peso, altura, status de peso/altura, alimentos restritos, histórico de dietas, funcionamento intestinal, apetite, suplementação
4. **HISTÓRICO DE SAÚDE** - Alergias, intolerâncias, medicamentos, doenças crônicas, cirurgias, histórico familiar
5. **OBJETIVOS** - Meta de peso, objetivo principal, prazo, motivação
6. **MEDIDAS** - Dados antropométricos completos (peso, altura, circumferências)
7. **FOTOS** - Fotografias para avaliação visual e acompanhamento de evolução

**Por que impressiona:** O sistema faz PERGUNTAS CONDICIONAIS - ex: se o paciente marcar "já fez dieta", abre campo para relatar resultado. Isso demonstra sofisticação.

---

### 1.B.2 PRESETS INTELIGENTES (100+ COMBINAÇÕES)
**O que é:** Modelos de refeições pré-configurados que permitem criar dietas completas em SEGUNDOS.

**Tipos de refeição suportados:**
- Café da Manhã, Almoço, Jantar
- Lanche da Manhã, Lanche da Tarde, Ceia
- Pré-treino, Pós-treino, Suplemento

**Tipos de dieta disponíveis:**
- Normocalórica, Balanceada, Low Carb, High Carb
- Cetogênica, Mediterrânea
- Vegetariana, Vegana
- Sem Glúten, Hiperproteica
- Personalizada

**Exemplo de uso:** Nutritionista seleciona "Almoço" + "Low Carb" + "Frango" = Sistema gera Cardápio completo com substitutions automáticas.

**Por que impressiona:** Cria 100+ combinações diferentes. O nutritionist NÃO precisa criar do zero.

---

### 1.B.3 SUBSTITUIÇÃO AUTOMÁTICA DE ALIMENTOS
**O que é:** Motor de inteligência nutricional que substitui alimentos mantendo equivalence calórica e de macros.

**Como funciona (técnico):**
- Classificação universal por categoria (PROTEIN_LEAN, LEGUME, DAIRY, FAT, etc.)
- Cálculo de similarity_score (0.1 a 0.99)
- Equilíbrio por macro-âncora (proteína, carb ou gordura)
- Ajuste de PORÇÃO para manter mesmas calorias

**Exemplo prático:**
- Paciente não pode comer frango → Sistema sugere salmão com porção ajustada para manter mesma proteína
- Quer menos carboidrato → Substitui arroz por couve-flor mantendo caloricidade

**Por que impressiona:** Algoritmo UUFT (Pureza, Estado de Preparo, Equivalência) - tecnologia de nível enterprise.

---

### 1.B.4 BANCO DE DADOS PREMIUM (TACO + TBCA + USDA + SUPLEMENTOS)
**O que é:** Três bases de dados nutricionais integradas + banco de suplementos.

**TACO (brasileira):**
- ~600 alimentos típicos brasileiros
- Dados por 100g e porção caseira

**TBCA (brasileira):**
- Tabela Brasileira de Composição de Alimentos
- Dados mais detalhados

**USDA (americana):**
- FoodData Central do governo americano
- MILHARES de alimentos industrializados
- Dados completos: kcal, proteína, lipídios, carboidratos, fibras, vitaminas (A, C, D), minerais (ferro, cálcio, sódio)

**Suplementos:**
- 500+ suplementos catalogados
- Whey, creatina, BCAA, glutamina, etc.

**Por que impressiona:** Acesso a +10.000 alimentos diferentes com dados científicos confiáveis.

---

### 1.B.5 GESTÃO INTELIGENTE DE PACIENTES
**O que é:** Sistema completo de CRM para nutricionistas.

**Recursos:**
- **Cadastro completo** com dados pessoais, contato, emergência
- **Agenda inteligente** com agendamento de consultas
- **Acompanhamento de evolução** com gráficos e fotos
- **Histórico completo** de todas as interações
- **Notificações push** automáticas (lembretes,Expiry de dieta, novas mensagens)

**Tipos de notificação:**
- Lembrete de consulta
- Dieta próxima ao vencimento
- Novo plano alimentar enviado
- Registro de refeição do paciente
- Nova mensagem
- Pagamentos

**Por que impressiona:** Tudo em um lugar - não precisa de Excel, agenda, WhatsApp separado.

---

### 1.B.6 XPERT MESSENGER - COMUNICAÇÃO SEM EXPOR WHATSAPP
**O que é:** Sistema de mensagens integrado dentro da plataforma.

**Benefício principal:** Nutricionista NÃO PRECISA DAR SEU WHATSAPP para o paciente.

**Funcionalidades:**
- Conversas em tempo real
- Mensagens criptografadas
- Notificações push quando há novas mensagens
- Histórico completo de conversas
- Suporte a múltiplos participantes

**Segurança:**
- sanitize_string() em todas as mensagens (prevenção XSS)
- Dados criptografados
- LGPD compliant

**Por que impressiona:** Mantém o nutritionist PROTEGIDO e PROFISSIONAL - nenhuma exposição de dados pessoais.

---

### 1.B.7 ALIMENTOS FAVORITOS DO PACIENTE
**O que é:** Sistema que aprende as preferências alimentares de cada paciente.

**Funcionalidades:**
- Nutricionista pode "favoritar" substituições
- Sistema aprende preferências por tipo de dieta
- Sugestões personalizadas baseadas no histórico
- Toggle de favoritos para otimizar substituições

**Por que impressiona:** Cada paciente tem preferências únicas - o sistema REMEMBRA e PERSONALIZA.

---

### 1.B.8 RELATÓRIOS DE EVOLUÇÃO
**O que é:** Sistema de acompanhamento e geração de relatórios.

**Recursos:**
- **ProgressPhoto** - Fotos de evolução com timestamps
- **Gráficos de peso** - Evolução ao longo do tempo
- **Comparativo de medidas** - Antropometria comparativa
- **Relatórios visuais** - Compilação para apresentar ao paciente

**Por que impressiona:** Mostra RESULTADOS ao paciente - evidencia o trabalho do nutritionist.

---

### 1.B.9 INTEGRAÇÕES (Google Calendar)
**O que é:** Conexão com ferramentas externas.

**Google Calendar:**
- Sincronização de consultas
- Eventos automáticos quando há agendamento
- Lembretes integrados

**Por que impressiona:** Nutritionista não precisa gerenciar agenda manualmente - tudo sincroniza.

---

### 1.B.10 SEGURANÇA LGPD TOTAL
**O que é:** Conformidade completa com Lei Geral de Proteção de Dados.

**Recursos implementados:**
- **Criptografia** de dados sensíveis
- **Sanitização** de todas as entradas (prevenção XSS, SQL Injection)
- **Isolamento de dados** - Cada nutritionist vê APENAS seus pacientes
- **Consentimento** explícito para tratamento de dados
- **Anonimização** de dados quando necessário

**Por que impressiona:** Proteção de dados é OBRIGATÓRIA para profissionais de saúde - o sistema CUMPRE.

---

### 1.B.11 PLANEJAMENTO DE DIETAS AVANÇADO
**O que é:** Sistema completo de criação e gerenciamento de planos alimentares.

**Recursos:**
- Criação de dietas ilimitadas
- Multiple tipos de dieta (10+ tipos)
- Instruções personalizadas
- Controle de validade (sistema alerta quando dieta expira)
- Histórico de versões

**Por que impressiona:** Tudo o que um nutritionist precisa paraPRATICAR - em uma única tela.

---

## 2. Estratégia de Redesign por Seção

### 2.1 Header
- **Efeito sticky** com blur mais intenso (`backdrop-blur-xl`)
- **Animação da logo** no scroll (escala + glow verde esmeralda)
- **Navegação com indicadores** de seção ativa
- **Mobile:** Menu hamburger com drawer lateral
- **Cores:** Background `#020804/80`, border `#white/5`

### 2.2 Hero Section
- **Novo headline:** "A Plataforma que Transforma Nutricionistas em Referência de Mercado"
- **Subtítulo focado em dor:** "Pare de perder horas com planilhas. Comece a atender mais pacientes com qualidade superior."
- **Demonstração visual:** GIF/MP4 do sistema em ação (30 segundos)
- **Barra de métricas flutuante:** "2.500+ Nutricionistas | 10M+ Refeições | 99% Satisfação"
- **CTA duplo:** 
  - Primário: "Experimente Grátis" (gradiente emerald)
  - Secundário: "Ver Demo" (outline)
- **Mobile:** Stack vertical, texto menor, demo em thumbnail clicável

### 2.3 Ecossistema (Recursos)
- **11 cards** (um para cada feature)
- **Efeito hover 3D** com rotação sutil (`group-hover:rotate-y-6`)
- **Ícones maiores** com gradientes (emerald/purple/cyan)
- **Badge de "Novo"** para recursos recentes
- **Mobile:** Grid 1 coluna, cards com swipe horizontal

### 2.4 Produtividade
- **Stats com fontes** (estudos, pesquisas)
- **Workflow interativo** com step-by-step
- **Comparação antes/depois**
- **Mobile:** Stats em stack vertical, números grandes

### 2.5 Segurança & Performance
- **Selos de certificação** visuais
- **Grid de recursos de segurança**
- **Badge LGPD Compliance** verde
- **Certificações:** AES-256, Uptime 99.9%, ISO 27001

### 2.6 Depoimentos
- **Carrossel com fotos** dos profissionais
- **Seção de logos** de clínicas parceiras
- **Vídeo-depoimentos** (embed ou thumbnail clicável)
- **Mobile:** Carrossel touch, logos em scroll horizontal

### 2.7 Pricing
- **Banner "7 dias grátis"** bem visível no topo
- **Cards com animação** de destaque no Professional
- **Comparação visual** lado a lado
- **Selo "GARANTIA DE 7 DIAS"**
- **Contador de oferta** (urgência)
- **CTA persuasivos:**
  - "Começar Trial Grátis"
  - "Garantir Oferta Especial"
  - "Economizar 44%"
- **Cores por plano:**
  - Grátis: `#71717A` (cinza)
  - Professional: `#10b981` (emerald) - DESTAQUE
  - Annual: `#8B5CF6` (purple)
- **Mobile:** Cards em stack, preços bem visíveis

### 2.8 Footer
- **Expansão de links** (Blog, FAQ, Termos, Privacidade)
- **Newsletter signup** com input + botão
- **Selos de segurança e pagamentos**
- **Logo NutriXpertPro** com cores corretas
- **Mobile:** Stack vertical, newsletter em 1 linha

### 2.9 Responsividade Mobile (iPhone + Android)

**Regras OBRIGATÓRIAS:**

| Regra | Especificação |
|-------|---------------|
| **Touch targets** | Mínimo 44x44px |
| **Botões** | Altura 48px minimum |
| **Ícones** | 24px minimum |
| **Spacing** | 16px horizontal, 24px vertical |
| **Fontes** | Mínimo 16px (corpo) |
| **Grid cards** | 1 coluna (mobile), 2 (tablet), 3 (desktop) |
| **Imagens** | object-fit cover |
| **Safe areas** | Respeitar notch iPhone |

**Dispositivos de teste:**
- iPhone SE / 13 Mini (375px)
- iPhone 14/15 (390-393px)
- iPhone 14/15 Pro Max (430px)
- Samsung Galaxy S24 (360px)
- Samsung Galaxy S24 Ultra (412px)
- iPad Mini (768px)
- iPad Pro (1024px)

---

## 3. Lista de Tarefas Específicas

### Fase 1: Análise e Design (Dias 1-3)

| # | Tarefa | Agent | Entregável |
|---|--------|-------|-------------|
| 1 | Criar wireframes de alta fidelidade para todas as seções | ui-ux-designer | Wireframes Figma |
| 2 | Definir sistema de design (cores, tipografia, spacing) | ui-ux-designer | Style Guide |
| 3 | Criar especificações de componentes reutilizáveis | ui-ux-designer | Component Specs |
| 4 | Desenvolver copy persuasivo e estratégia de conversão para cada seção | especialista_em_conteudo_marketing_nutrixpertpro | Documento de Copy |

### Fase 2: Implementação Frontend (Dias 4-10)

| # | Tarefa | Agent | Entregável |
|---|--------|-------|-------------|
| 5 | Implementar novo Header com animações | especialista-frontend | Header.tsx |
| 6 | Implementar Hero Section com demo | especialista-frontend | HeroV4.tsx |
| 7 | Implementar Ecossistema com 11 cards | especialista-frontend | EcosystemV4.tsx |
| 8 | Implementar Produtividade com stats | especialista-frontend | ProductivityV4.tsx |
| 9 | Implementar Segurança/Performance | especialista-frontend | SecurityV4.tsx |
| 10 | Implementar Depoimentos com fotos | especialista-frontend | TestimonialsV4.tsx |
| 11 | Implementar Pricing com comparações | especialista-frontend | PricingV4.tsx |
| 12 | Implementar Footer expandido | especialista-frontend | Footer.tsx |

### Fase 3: Integração e Otimização (Dias 11-14)

| # | Tarefa | Agent | Entregável |
|---|--------|-------|-------------|
| 13 | Integrar todas as seções na page.tsx | especialista-frontend | page.tsx atualizado |
| 14 | Adicionar animações e transições | especialista-frontend | Animações via Framer |
| 15 | Otimizar imagens e assets | especialista-frontend | Assets otimizados |
| 16 | Testar responsividade | especialista-frontend | Mobile/Tablet/Desktop |

### Fase 4: Testes e Lançamento (Dias 15-18)

| # | Tarefa | Agent | Entregável |
|---|--------|-------|-------------|
| 17 | Testes de usabilidade | planejador-projetos | Relatório de testes |
| 18 | Correções de bugs | especialista-frontend | Bugs corrigidos |
| 19 | SEO e meta tags | especialista-frontend | Metadata otimizado |
| 20 | Deploy e monitoramento | planejador-projetos | Landing no ar |

---

## 4. Agentes Necessários por Tarefa

### especialista_em_conteudo_marketing_nutrixpertpro
- **AGENTE ESPECÍFICO DO NUTRIXPERTPRO** - Já conhece todas as 15+ funcionalidades
- Copywriting persuasivo focado em conversão
- Estratégia de conversão para software de saúde
- Textos para CTAs com gatilhos mentais
- Estrutura de benefícios baseada em diferenciais reais
- Análise e substituição de conteúdo irrelevante
- Otimização de landing page para conversão

### ui-ux-designer
- Wireframes de alta fidelidade
- Sistema de design
- Especificações de componentes
- Design de recursos visuais (ícones, ilustrações)

### especialista-frontend
- Implementação de todos os componentes React
- Integrações com animações (Framer Motion)
- Otimização de performance
- Testes de responsividade

### planejador-projetos
- Coordenação de tarefas
- Cronograma
- Testes de usabilidade
- Deploy e monitoramento

---

## 5. Timeline Sugerida

```
Semana 1: Design e Estratégia
├── Dia 1-2: Análise e wireframes
├── Dia 3: Style guide e specs
└── Dia 4: Copywriting

Semana 2: Implementação
├── Dia 5-6: Header + Hero
├── Dia 7-8: Ecossistema + Produtividade
└── Dia 9-10: Segurança + Depoimentos + Pricing

Semana 3: Finalização
├── Dia 11-12: Integração + Footer
├── Dia 13-14: Animações + Otimização
└── Dia 15-16: Testes + Deploy
```

**Total estimado:** 16 dias úteis

---

## 6. Elementos Visuais de Alto Impacto - GUIA COMPLETO

### 6.1 Cores (IDENTIDADE VISUAL)

| Elemento | Cor | Hex | Uso |
|----------|-----|-----|-----|
| **Logo** | Emerald | `#10b981` | Logo, CTAs, highlights |
| **Primária Escura** | Emerald 600 | `#059669` | Hover states |
| **Primária Clara** | Emerald 400 | `#34D399` | Borders, detalhes |
| **Fundo Principal** | Quase Preto | `#020804` | Background geral |
| **Fundo Secundário** | Preto Suave | `#050505` | Cards, seções |
| **Fundo Terciário** | Preto Elevado | `#0A0A0A` | Elementos elevados |
| **Texto Principal** | Branco | `#FFFFFF` | Títulos |
| **Texto Secundário** | Cinza | `#A1A1AA` | Subtítulos |
| **Texto Tertiary** | Cinza Escuro | `#71717A` | Labels |
| **Accent Purple** | Violet | `#8B5CF6` | Elementos decorativos |
| **Accent Cyan** | Cyan | `#06B6D4` | Destaques |
| **Accent Amber** | Amber | `#F59E0B` | Warnings, badges |

### 6.2 Gradientes

| Nome | Composição | Uso |
|------|------------|-----|
| **Emerald Glow** | `linear-gradient(135deg, #10b981 0%, #059669 100%)` | Botões primários |
| **Midnight Emerald** | `linear-gradient(180deg, #020804 0%, #050505 100%)` | Backgrounds |
| **Purple Haze** | `linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)` | Decorativos |
| **Card Shine** | `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)` | Hover cards |
| **Button Shine** | `linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)` | Brilho CTAs |
| **Text Gradient** | `bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500` | Títulos especiais |

### 6.3 Efeitos Visuais

| Efeito | Código Tailwind | Uso |
|--------|-----------------|-----|
| **Glassmorphism** | `backdrop-blur-xl bg-white/5 border border-white/10` | Header, modais |
| **Card Glow** | `shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]` | Cards destaque |
| **Button Glow** | `shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)]` | CTAs principais |
| **Border Glow** | `border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]` | Hover cards |
| **Text Glow** | `drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]` | Texto destaque |
| **Gradient Text** | `bg-clip-text text-transparent` | Títulos gradient |
| **Parallax BG** | Framer Motion | Backgrounds animados |

### 6.4 Botões

| Tipo | Estilo | Uso |
|------|--------|-----|
| **Primário** | `bg-emerald-500 hover:bg-emerald-600 text-white rounded-full h-12 px-8 shadow-glow` | CTAs principais |
| **Secundário** | `border border-white/20 hover:border-emerald-500/50 text-white rounded-full h-12 px-8` | Ver Demo |
| **Ghost** | `text-neutral-400 hover:text-white` | Links |
| **Mobile** | `h-12 min-w-[120px]` | Touch friendly |

### 6.5 Cards

| Tipo | Estilo | Uso |
|------|--------|-----|
| **Feature Card** | `bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 hover:border-emerald-500/30` | Ecossistema |
| **Pricing Card** | `bg-gradient-to-b from-emerald-500/10 to-[#0a0a0a] border border-emerald-500/30 rounded-2xl` | Destaque |
| **Testimonial** | `bg-white/[0.02] border border-white/5 rounded-2xl p-6` | Depoimentos |

### 6.6 Animações

| Animação | Biblioteca | Duração | Uso |
|----------|------------|---------|-----|
| **Fade In Up** | Framer Motion | 0.5s | Entrada de seções |
| **Scale In** | Framer Motion | 0.3s | Elementos aparecem |
| **Stagger** | Framer Motion | 0.1s delay | Listas |
| **Hover Scale** | Tailwind | 0.2s | Botões, cards |
| **Pulse Glow** | Framer Motion | 2s infinite | CTAs importantes |
| **Count Up** | Framer Motion | 2s | Números animados |

### 6.7 Ícones

- **Biblioteca:** Lucide React
- **Tamanho padrão:** 24px
- **Tamanho mobile:** 24px minimum
- **Cores:** Herdar do contexto ou usar emerald-400

---

## 7. Priorização de Implementação

### Alta Prioridade (Must Have)
1. Novo Hero com demo visual
2. Ecossistema com 11 features
3. Pricing com diferenciação clara

### Média Prioridade (Should Have)
4. Testimonials com fotos
5. Footer expandido
6. Animações de entrada

### Baixa Prioridade (Nice to Have)
7. Vídeo-depoimentos
8. Comparador interativo
9. FAQ integrado

---

## 8. Métricas de Sucesso

- **Taxa de conversão:** Aumento de 30% no CTA
- **Tempo na página:** Aumento de 50%
- **Taxa de rejeição:** Redução de 20%
- **Mobile:** 100% funcional

---

## Próximos Passos Imediatos

1. **Reunião de alinhamento** com stakeholders para validar prioridades
2. **Briefing de design** para ui-ux-designer
3. **Criação de assets** (screenshots do sistema, ícones, fotos)
4. **Kick-off** com especialista-frontend

---

*Documento criado em: Fevereiro 2026*
*Versão: 1.0*
