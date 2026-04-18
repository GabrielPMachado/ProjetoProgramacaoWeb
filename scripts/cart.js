// Carrega o carrinho salvo no localStorage ou inicia vazio
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Variáveis de controle para o gesto de segurar e limpar o carrinho
let pressTimer = null;
let isHolding = false;

// Atualiza a interface do carrinho na tela
function updateCart() {
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const badge = document.getElementById("cartCount");

  if (!cartItemsEl || !cartTotalEl || !badge) return;

  // Limpa a lista atual antes de renderizar novamente
  cartItemsEl.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    // Soma o valor total e a quantidade total de itens
    total += item.preco * item.quantidade;
    count += item.quantidade;

    // Gera as especificações do produto, limitando a 3 itens
    const specsHTML = item.specs
      ? item.specs
          .slice(0, 3)
          .map(spec => `<span>${spec.label}</span>`)
          .join(" • ")
      : "";

    const li = document.createElement("li");

    // Monta o HTML de cada item do carrinho
    li.innerHTML = `
      <div class="cart-item">
        <img src="${item.img || 'images/default.jpg'}" class="cart-item-img">

        <div class="cart-item-info">
          <strong>${item.nome}</strong>
          <small>${specsHTML}</small>
          <p>Qtd: ${item.quantidade}</p>
        </div>

        <div class="cart-item-actions">
          <span>R$ ${(item.preco * item.quantidade).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          <button onclick="removeItem(${item.id})">❌</button>
        </div>
      </div>
    `;

    // Adiciona o item à lista do carrinho
    cartItemsEl.appendChild(li);
  });

  // Atualiza o valor total exibido
  cartTotalEl.textContent = "Total: R$ " + total.toLocaleString("pt-BR", {
    minimumFractionDigits: 2
  });

  // Mostra ou esconde o contador do carrinho
  badge.classList.toggle("show", count > 0);

  // Limita a exibição do contador até 9+
  if (count > 0) badge.textContent = count > 9 ? "9+" : count;

  // Salva o carrinho atualizado no localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Adiciona um produto ao carrinho
function addToCart(prod) {
  const item = cart.find(p => p.id === prod.id);

  // Se o produto já existir, aumenta a quantidade
  if (item) {
    item.quantidade++;
  } else {
    // Se não existir, adiciona um novo item ao carrinho
    cart.push({
      id: prod.id,
      nome: prod.name,
      preco: Number(prod.price.replace(/\./g, "").replace(",", ".")),
      img: prod.img,
      specs: prod.specs,
      categoria: prod.category,
      quantidade: 1
    });
  }

  // Atualiza a interface do carrinho
  updateCart();

  // Aplica uma animação rápida no botão do carrinho
  const btn = document.getElementById("cartBtn");
  if (btn) {
    btn.classList.add("added");
    setTimeout(() => btn.classList.remove("added"), 300);
  }
}

// Remove uma unidade de um item do carrinho
function removeItem(id) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  // Se houver mais de uma unidade, diminui a quantidade
  if (item.quantidade > 1) {
    item.quantidade--;
  } else {
    // Se houver apenas uma, remove o item do carrinho
    cart = cart.filter(i => i.id !== id);
  }

  // Atualiza a interface do carrinho
  updateCart();
}

// Inicializa os eventos e o funcionamento do carrinho
function initCart() {
  const cartBtn = document.getElementById("cartBtn");
  const cartPopup = document.getElementById("cartPopup");
  const overlay = document.getElementById("cartOverlay");

  if (!cartBtn || !cartPopup || !overlay) return;

  // Abre ou fecha o popup do carrinho ao clicar no botão
  cartBtn.addEventListener("click", e => {
    if (isHolding) return;
    e.stopPropagation();
    overlay.classList.toggle("active");
  });

  // Fecha o carrinho ao clicar no overlay
  overlay.addEventListener("click", () => overlay.classList.remove("active"));

  // Impede que o clique dentro do popup feche o carrinho
  cartPopup.addEventListener("click", e => e.stopPropagation());

  // Inicia o temporizador para limpar o carrinho ao segurar o botão
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

  // Cancela a limpeza ao soltar ou sair do botão
  function stopHoldingClear() {
    clearTimeout(pressTimer);
    cartBtn.classList.remove("holding");
  }

  // Eventos de mouse para segurar e limpar
  cartBtn.addEventListener("mousedown", startHoldingClear);
  cartBtn.addEventListener("mouseup", stopHoldingClear);
  cartBtn.addEventListener("mouseleave", stopHoldingClear);

  // Eventos de toque para dispositivos móveis
  cartBtn.addEventListener("touchstart", startHoldingClear);
  cartBtn.addEventListener("touchend", stopHoldingClear);

  // Atualiza o carrinho ao iniciar
  updateCart();
}

// Inicializa o carrinho quando o DOM carregar
document.addEventListener("DOMContentLoaded", initCart);