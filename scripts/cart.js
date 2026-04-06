// =========================
// ESTADO GLOBAL DO CARRINHO
// =========================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let pressTimer = null;
let isHolding = false;

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

  badge.style.display = count === 0 ? "none" : "inline-block";
  if (count > 0) badge.textContent = count > 9 ? "9+" : count;

  localStorage.setItem("cart", JSON.stringify(cart));
}

// =========================
// ADICIONAR AO CARRINHO
// =========================
function addToCart(nome, preco) {
  const item = cart.find(p => p.id === nome);

  if (item) item.quantidade++;
  else cart.push({ id: nome, nome, preco, quantidade: 1 });

  updateCart();

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

  if (item.quantidade > 1) item.quantidade--;
  else cart = cart.filter(item => item.id !== id);

  updateCart();
}

// =========================
// ABRIR / FECHAR CARRINHO + LONG PRESS
// =========================
function initCart() {
  const cartBtn = document.getElementById("cartBtn");
  const cartPopup = document.getElementById("cartPopup");
  const overlay = document.getElementById("cartOverlay");

  if (!cartBtn || !cartPopup || !overlay) return;

  // clique curto abre/fecha
  cartBtn.addEventListener("click", e => {
    if (isHolding) return;
    e.stopPropagation();
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", () => overlay.classList.remove("active"));
  cartPopup.addEventListener("click", e => e.stopPropagation());

  // long press para limpar carrinho com animação
  function startHoldingClear() {
    isHolding = false;
    cartBtn.classList.add("holding");

    pressTimer = setTimeout(() => {
      isHolding = true;
      cart = [];
      updateCart();
      cartBtn.classList.remove("holding");
    }, 1800);
  }

  function stopHoldingClear() {
    clearTimeout(pressTimer);
    cartBtn.classList.remove("holding");
  }

  // desktop
  cartBtn.addEventListener("mousedown", startHoldingClear);
  cartBtn.addEventListener("mouseup", stopHoldingClear);
  cartBtn.addEventListener("mouseleave", stopHoldingClear);

  // mobile
  cartBtn.addEventListener("touchstart", startHoldingClear);
  cartBtn.addEventListener("touchend", stopHoldingClear);

  updateCart();
}

// Inicializa cart.js
document.addEventListener("DOMContentLoaded", initCart);