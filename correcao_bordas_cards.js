/**
 * Script para corrigir as bordas dos cards na página patient-dashboard-v2
 * Este script modifica dinamicamente os estilos para tornar as bordas mais visíveis
 */

// Função para aplicar as correções de borda
function aplicarCorrecoesBordaCards() {
    // Corrigir todos os elementos com classe glass-panel
    const glassPanels = document.querySelectorAll('.glass-panel');
    glassPanels.forEach(panel => {
        // Aumentar a visibilidade da borda
        panel.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    });

    // Corrigir cards específicos de métricas
    const metricCards = document.querySelectorAll('.snap-center.flex-none.w-[160px].h-[180px].glass-panel');
    metricCards.forEach(card => {
        card.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        card.style.borderRadius = '1.5rem';
    });

    // Corrigir cards de refeição
    const mealCards = document.querySelectorAll('.glass-panel.p-4.rounded-2xl');
    mealCards.forEach(card => {
        card.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    });

    // Corrigir o card de dica do coach
    const adviceCard = document.querySelector('.relative.overflow-hidden.rounded-3xl.bg-gradient-to-br');
    if (adviceCard) {
        adviceCard.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    }

    // Corrigir o card de refeição ativa
    const activeMealCard = document.querySelector('.bg-surface.border.border-primary\\/20');
    if (activeMealCard) {
        activeMealCard.style.border = '1px solid rgba(204, 255, 0, 0.4)';
    }

    // Corrigir glass-cards adicionais
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
        card.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    });
}

// Executar a função quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Adicionando um pequeno atraso para garantir que todos os elementos estejam carregados
    setTimeout(aplicarCorrecoesBordaCards, 100);
});

// Também executar após mudanças dinâmicas (por exemplo, em aplicações React)
if (window.MutationObserver) {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                aplicarCorrecoesBordaCards();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}