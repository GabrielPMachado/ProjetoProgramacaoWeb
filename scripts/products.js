// Seleciona o container onde os produtos serão exibidos
const productGrid = document.querySelector(".product-grid");

// Função para renderizar os produtos na tela
function renderProducts(products) {
  if (!productGrid) return;

  // Limpa a grade antes de renderizar novamente
  productGrid.innerHTML = "";

  products.forEach((prod) => {
    const card = document.createElement('div');
    card.classList.add("product-card");

    // Gera o HTML das especificações
    const specsHTML = prod.specs
      .map(
        (spec) => `
        <div class="spec-item">
          <img class="spec-icon" src="${spec.icon}" alt="Ícone">
          <span>${spec.label}</span>
        </div>
      `
      )
      .join("");

    // Converte o preço de string BR para número JS
    const precoNumerico = Number(
      prod.price.replace(/\./g, "").replace(",", ".")
    );

    // Define imagem padrão caso venha vazia
    const imagePath = prod.img && prod.img.trim() !== ""
      ? prod.img
      : "images/default.jpg";

    // Monta o HTML do card
    card.innerHTML = `
      <div class="product-image">
        <img src="${imagePath}" alt="${prod.name}">
      </div>

      <div class="product-info">
        <h3>${prod.name}</h3>
        <p>R$ ${prod.price}</p>
      </div>

      <div class="product-specs">
        ${specsHTML}
      </div>

      <button class="buy-button">
        Comprar
      </button>
    `;

    // Adiciona evento no botão de compra
    const buyButton = card.querySelector(".buy-button");
    buyButton.addEventListener("click", () => {
      addToCart(prod.id, prod.name, precoNumerico);
    });

    // Adiciona animação de fade-in
    card.classList.add("scroll");

    // Adiciona o card na grade
    productGrid.appendChild(card);

    // Força a ativação da animação imediatamente
    setTimeout(() => {
      card.classList.add("active");
    }, 10);
  });
}

// Função para carregar os produtos do JSON
async function loadProducts() {
  try {
    const response = await fetch("./data/products.json");

    if (!response.ok) {
      throw new Error("Não foi possível carregar o arquivo products.json");
    }

    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);

    if (productGrid) {
      productGrid.innerHTML = `<p>Erro ao carregar os produtos.</p>`;
    }
  }
}

// Inicia o carregamento dos produtos
loadProducts();
