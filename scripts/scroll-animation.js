document.addEventListener("DOMContentLoaded", () => {
  // Seleciona todos os elementos que têm animação de scroll
  const elements = document.querySelectorAll(".scroll");
  let ticking = false;

  function showOnScroll() {
    const windowHeight = window.innerHeight;

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();

      // Verifica se o elemento está visível na tela
      const isVisible = rect.top < windowHeight - 100 && rect.bottom > 100;

      // Adiciona ou remove a classe "active" conforme a visibilidade
      el.classList.toggle("active", isVisible);
    });

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    // Evita chamar a função várias vezes por frame
    if (!ticking) {
      requestAnimationFrame(showOnScroll);
      ticking = true;
    }
  });

  // Roda uma vez ao carregar para ativar itens já visíveis
  showOnScroll();
});
