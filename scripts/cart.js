// Carrega o carrinho salvo ou inicia vazio
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let pressTimer = null;
let isHolding = false;

function updateCart() {
  // Pega os elementos da página
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const badge = document.getElementById("cartCount");

  // Sai se algum elemento não existir
  if (!cartItemsEl || !cartTotalEl || !badge) return;

  // Limpa a lista antes de redesenhar
  cartItemsEl.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    // Soma preço e quantidade de cada item
    total += item.preco * item.quantidade;
    count += item.quantidade;

    // Cria e adiciona o item na lista
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nome} x${item.quantidade}
      <button onclick="removeItem('${item.id}')">❌</button>
    `;
    cartItemsEl.appendChild(li);
  });

  // Atualiza o total em reais
  cartTotalEl.textContent = "Total: R$ " + total.toFixed(2);

  // Mostra o badge só se tiver itens; limita a exibição em "9+"
  badge.classList.toggle("show", count > 0);
  if (count > 0) badge.textContent = count > 9 ? "9+" : count;

  // Salva o carrinho no localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(nome, preco) {
  const item = cart.find(p => p.id === nome);

  // Se o item já existe, incrementa; senão, adiciona
  if (item) item.quantidade++;
  else cart.push({ id: nome, nome, preco, quantidade: 1 });

  updateCart();

  // Animação rápida no botão do carrinho
  const btn = document.getElementById("cartBtn");
  if (btn) {
    btn.classList.add("added");
    setTimeout(() => btn.classList.remove("added"), 300);
  }
}

function removeItem(id) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  // Se tiver mais de um, decrementa; senão remove do array
  if (item.quantidade > 1) item.quantidade--;
  else cart = cart.filter(i => i.id !== id);

  updateCart();
}

function initCart() {
  const cartBtn = document.getElementById("cartBtn");
  const cartPopup = document.getElementById("cartPopup");
  const overlay = document.getElementById("cartOverlay");

  if (!cartBtn || !cartPopup || !overlay) return;

  // Clique normal abre/fecha o carrinho
  cartBtn.addEventListener("click", e => {
    if (isHolding) return;
    e.stopPropagation();
    overlay.classList.toggle("active");
  });

  // Clique fora fecha; clique dentro não fecha
  overlay.addEventListener("click", () => overlay.classList.remove("active"));
  cartPopup.addEventListener("click", e => e.stopPropagation());

  // Começa a contar o tempo de pressionamento
  function startHoldingClear() {
    isHolding = false;
    cartBtn.classList.add("holding");

    // Limpa o carrinho após 1.8s segurando
    pressTimer = setTimeout(() => {
      isHolding = true;
      cart = [];
      updateCart();
      cartBtn.classList.remove("holding");
    }, 1800);
  }

  // Cancela o timer ao soltar
  function stopHoldingClear() {
    clearTimeout(pressTimer);
    cartBtn.classList.remove("holding");
  }

  // Eventos de pressionamento para desktop
  cartBtn.addEventListener("mousedown", startHoldingClear);
  cartBtn.addEventListener("mouseup", stopHoldingClear);
  cartBtn.addEventListener("mouseleave", stopHoldingClear);

  // Eventos de pressionamento para mobile
  cartBtn.addEventListener("touchstart", startHoldingClear);
  cartBtn.addEventListener("touchend", stopHoldingClear);

  updateCart();
}

document.addEventListener("DOMContentLoaded", initCart);
