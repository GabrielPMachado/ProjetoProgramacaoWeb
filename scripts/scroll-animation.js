// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
  // Seleciona todos os elementos que possuem a classe de animação
  const elements = document.querySelectorAll(".scroll");

  // Variável de controle para otimizar o scroll (evita múltiplas execuções por frame)
  let ticking = false;

  // Função responsável por ativar/desativar animações conforme o scroll
  function showOnScroll() {
    const windowHeight = window.innerHeight;

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();

      // Verifica se o elemento está visível na área da tela
      const isVisible = rect.top < windowHeight - 100 && rect.bottom > 100;

      // Adiciona ou remove a classe "active" dependendo da visibilidade
      el.classList.toggle("active", isVisible);
    });

    // Libera para a próxima execução
    ticking = false;
  }

  // Evento de scroll da janela
  window.addEventListener("scroll", () => {
    // Usa requestAnimationFrame para melhor performance
    if (!ticking) {
      requestAnimationFrame(showOnScroll);
      ticking = true;
    }
  });

  // Executa uma vez ao carregar a página
  // (para ativar elementos que já estão visíveis)
  showOnScroll();
});