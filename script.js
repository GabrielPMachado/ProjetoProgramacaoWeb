// =========================
// ESTADO GLOBAL
// =========================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let pressTimer = null;
let isHolding = false;

// =========================
// BUSCA
// =========================
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      const value = searchInput.value.trim();
      if (value !== "") {
        console.log("Buscar por:", value);
      }
    }
  });
}

// =========================
// ATUALIZAR CARRINHO
// =========================
function updateCart() {
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const badge = document.getElementById("cartCount");

  if (!cartItemsEl || !cartTotalEl || !badge) return;

  cartItemsEl.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    total += item.preco * item.quantidade;
    count += item.quantidade;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nome} x${item.quantidade}
      <button onclick="removeItem('${item.id}')">❌</button>
    `;
    cartItemsEl.appendChild(li);
  });

  cartTotalEl.textContent = "Total: R$ " + total.toFixed(2);

  if (count === 0) {
    badge.style.display = "none";
  } else {
    badge.style.display = "inline-block";
    badge.textContent = count > 9 ? "9+" : count;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

// =========================
// ADICIONAR AO CARRINHO
// =========================
function addToCart(nome, preco) {
  const item = cart.find(p => p.id === nome);

  if (item) {
    item.quantidade++;
  } else {
    cart.push({ id: nome, nome, preco, quantidade: 1 });
  }

  updateCart();

  // Feedback visual no botão
  const btn = document.getElementById("cartBtn");
  if (btn) {
    btn.classList.add("holding");
    setTimeout(() => btn.classList.remove("holding"), 300);
  }
}

// =========================
// REMOVER ITEM
// =========================
function removeItem(id) {
  const item = cart.find(p => p.id === id);

  if (!item) return;

  if (item.quantidade > 1) {
    item.quantidade--;
  } else {
    cart = cart.filter(item => item.id !== id);
  }

  updateCart();
}

// =========================
// INICIALIZAÇÃO
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.getElementById("cartBtn");
  const cartPopup = document.getElementById("cartPopup");
  const overlay = document.getElementById("cartOverlay");

  window.scrollTo(0, 0);

  // =========================
  // ABRIR / FECHAR CARRINHO
  // =========================
  if (cartBtn && overlay && cartPopup) {
    cartBtn.addEventListener("click", (e) => {
      if (isHolding) return; // ignora clique curto se é clique longo
      e.stopPropagation();
      overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", () => overlay.classList.remove("active"));
    cartPopup.addEventListener("click", (e) => e.stopPropagation());
  }

  // =========================
  // LONG PRESS PARA LIMPAR CARRINHO COM ANIMAÇÃO
  // =========================
  function startHoldingClear() {
    if (!cartBtn) return;
    isHolding = false;

    cartBtn.classList.add("holding"); // animação

    pressTimer = setTimeout(() => {
      isHolding = true;
      cart = [];
      updateCart();
      cartBtn.classList.remove("holding");
    }, 1800); // 1,8 segundos para limpar
  }

  function stopHoldingClear() {
    clearTimeout(pressTimer);
    cartBtn.classList.remove("holding");
  }

  if (cartBtn) {
    // Desktop
    cartBtn.addEventListener("mousedown", startHoldingClear);
    cartBtn.addEventListener("mouseup", stopHoldingClear);
    cartBtn.addEventListener("mouseleave", stopHoldingClear);

    // Mobile
    cartBtn.addEventListener("touchstart", startHoldingClear);
    cartBtn.addEventListener("touchend", stopHoldingClear);
  }

  // =========================
  // SCROLL ANIMATION
  // =========================
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

  // =========================
  // INICIAR
  // =========================
  updateCart();
});