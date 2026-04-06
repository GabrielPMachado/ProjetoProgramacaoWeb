document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll('.scroll');
  let ticking = false;

  function showOnScroll() {
    const windowHeight = window.innerHeight;

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < windowHeight - 100 && rect.bottom > 100;
      el.classList.toggle('active', isVisible);
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(showOnScroll);
      ticking = true;
    }
  });

  showOnScroll();
});