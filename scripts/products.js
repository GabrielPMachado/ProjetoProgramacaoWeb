// Seleciona o container onde os produtos serão exibidos
const productGrid = document.querySelector(".product-grid");

// Armazena os produtos carregados uma única vez
let allProducts = [];

// Verifica se a página atual é a de categoria
function isCategoryPage() {
  return window.location.pathname.endsWith("category.html");
}

// Pega categoria da URL
function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("cat");
}

// Pega termo da busca da URL
function getSearchTermFromURL() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("search") || "").trim().toLowerCase();
}

// Pega termo digitado no input
function getSearchTermFromInput() {
  const input = document.getElementById("searchInput");
  return input ? input.value.trim().toLowerCase() : "";
}

// Decide qual termo usar
function getActiveSearchTerm() {
  const inputTerm = getSearchTermFromInput();
  const urlTerm = getSearchTermFromURL();
  return inputTerm || urlTerm;
}

// Preenche o input com o termo da URL ao carregar
function syncSearchInputWithURL() {
  const input = document.getElementById("searchInput");
  const search = getSearchTermFromURL();

  if (input && search) {
    input.value = search;
  }
}

// Função para renderizar os produtos na tela
function renderProducts(products) {
  if (!productGrid) return;

  productGrid.innerHTML = "";

  if (products.length === 0) {
    productGrid.innerHTML = `<p>Nenhum produto encontrado.</p>`;
    return;
  }

  products.forEach((prod) => {
    const card = document.createElement("div");
    card.classList.add("product-card", "scroll");

    // Gera o HTML das especificações
    const specsHTML = Array.isArray(prod.specs)
      ? prod.specs.map((spec) => `
          <div class="spec-item">
            <img class="spec-icon" src="${spec.icon}" alt="Ícone">
            <span>${spec.label}</span>
          </div>
        `).join("")
      : "";

    // Define imagem padrão caso venha vazia
    const imagePath =
      prod.img && prod.img.trim() !== ""
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

      <button class="buy-button">Comprar</button>
    `;

    // Adiciona evento no botão de compra
    const buyButton = card.querySelector(".buy-button");
    buyButton.addEventListener("click", () => {
      if (typeof addToCart === "function") {
        addToCart(prod);
      }
    });

    // Adiciona o card na grade
    productGrid.appendChild(card);

    // Ativa a animação de entrada
    requestAnimationFrame(() => {
      card.classList.add("active");
    });
  });
}

// Aplica os filtros sem recarregar o JSON toda hora
function applyFilters() {
  let filteredProducts = [...allProducts];

  const category = getCategoryFromURL();
  const search = getActiveSearchTerm();

  // Filtro por categoria
  if (category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filtro por busca
  if (search) {
    filteredProducts = filteredProducts.filter((p) => {
      const name = (p.name || "").toLowerCase();
      return name.includes(search);
    });
  }

  renderProducts(filteredProducts);
}

// Carrega produtos apenas uma vez
async function loadProducts() {
  try {
    const response = await fetch("../data/products.json");

    if (!response.ok) {
      throw new Error("Não foi possível carregar o arquivo products.json");
    }

    allProducts = await response.json();

    if (isCategoryPage()) {
      syncSearchInputWithURL();
      applyFilters();
    } else {
      renderProducts(allProducts);
    }
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);

    if (productGrid) {
      productGrid.innerHTML = `<p>Erro ao carregar os produtos.</p>`;
    }
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");

  loadProducts();

  // Só ativa busca dinâmica na página de categoria
  if (isCategoryPage() && input) {
    input.addEventListener("input", () => {
      applyFilters();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const value = input.value.trim();
        const params = new URLSearchParams(window.location.search);

        if (value) {
          params.set("search", value);
        } else {
          params.delete("search");
        }

        const newURL = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newURL);

        applyFilters();
      }
    });
  }
});