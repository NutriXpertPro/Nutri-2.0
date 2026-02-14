/**
 * Script para corrigir as bordas dos cards em todas as abas da aplicação
 * Este script aplica consistentemente a visibilidade das bordas em todos os componentes com classes glass-panel e glass-card
 */

// Função para aplicar as correções de borda em todas as páginas
function aplicarCorrecoesBordaTodasAbas() {
    // Corrigir todos os elementos com classe glass-panel
    const glassPanels = document.querySelectorAll('.glass-panel');
    glassPanels.forEach(panel => {
        // Aumentar a visibilidade da borda de 10% para 20%
        panel.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.2)', 'important');
    });

    // Corrigir todos os elementos com classe glass-card
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
        // Aumentar a visibilidade da borda de 5% para 20%
        card.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.2)', 'important');
    });

    // Corrigir cards com bordas coloridas (mantendo a cor mas aumentando visibilidade)
    const coloredBorderCards = document.querySelectorAll('[class*="border-primary"], [class*="border-secondary"]');
    coloredBorderCards.forEach(card => {
        // Extrair a cor da borda existente e aplicar com 20% de opacidade
        const computedStyle = window.getComputedStyle(card);
        const borderColor = computedStyle.borderColor;
        
        if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)' && borderColor !== 'transparent') {
            // Se já tiver uma cor de borda definida, manter a cor mas ajustar a visibilidade
            const rgbMatch = borderColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
            if (rgbMatch) {
                const [_, r, g, b] = rgbMatch;
                card.style.setProperty('border', `1px solid rgba(${r}, ${g}, ${b}, 0.4)`, 'important'); // Ajustar para 40% para manter a cor mas aumentar visibilidade
            }
        } else {
            // Caso contrário, aplicar borda padrão
            card.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.2)', 'important');
        }
    });
}

// Executar a função quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Adicionando um pequeno atraso para garantir que todos os elementos estejam carregados
    setTimeout(aplicarCorrecoesBordaTodasAbas, 100);
});

// Executar novamente após mudanças dinâmicas (por exemplo, em aplicações React)
if (window.MutationObserver) {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                // Pequeno atraso para garantir que os novos elementos estejam completamente renderizados
                setTimeout(aplicarCorrecoesBordaTodasAbas, 50);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });
}

// Função para reexecutar quando o tema mudar (modo claro/escuro)
function observarMudancaTema() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', function(e) {
        setTimeout(aplicarCorrecoesBordaTodasAbas, 100);
    });
}

// Executar a observação de mudança de tema quando a página carregar
document.addEventListener('DOMContentLoaded', observarMudancaTema);