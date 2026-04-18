(() => {
  // Seleciona o campo de busca e a caixa de sugestões
  const searchInput = document.getElementById("searchInput");
  const suggestionsBox = document.getElementById("searchSuggestions");

  // Armazena os produtos da busca e o índice do item selecionado
  let searchProducts = [];
  let selectedIndex = -1;
  let productsLoaded = false;

  // Redireciona para a página de categoria com o termo pesquisado
  function redirectToSearch(value) {
    const term = value.trim();
    if (!term) return;

    window.location.href = `/category.html?search=${encodeURIComponent(term)}`;
  }

  // Carrega os produtos do JSON para usar na busca
  async function loadProductsForSearch() {
    try {
      const response = await fetch("./data/products.json");

      // Verifica se a resposta da requisição foi bem-sucedida
      if (!response.ok) {
        throw new Error("Erro ao carregar produtos");
      }

      // Salva os produtos carregados na variável da busca
      searchProducts = await response.json();
      productsLoaded = true;

      // Se o usuário já tiver digitado algo, renderiza as sugestões
      if (searchInput && searchInput.value.trim()) {
        showSuggestions(searchInput.value);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos da busca:", error);
      searchProducts = [];
      productsLoaded = false;
    }
  }

  // Limpa as sugestões exibidas na tela
  function clearSuggestions() {
    if (!suggestionsBox) return;

    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.remove("show");
    selectedIndex = -1;
  }

  // Atualiza visualmente a sugestão selecionada pelo teclado
  function updateSelectedSuggestion(items) {
    items.forEach((item, index) => {
      item.classList.toggle("active", index === selectedIndex);
    });
  }

  // Exibe sugestões com base no termo digitado
  function showSuggestions(term) {
    if (!suggestionsBox) return;

    const search = term.trim().toLowerCase();

    // Se o campo estiver vazio, limpa as sugestões
    if (!search) {
      clearSuggestions();
      return;
    }

    // Se ainda não carregou os produtos, mostra aviso temporário
    if (!productsLoaded) {
      suggestionsBox.innerHTML = `
        <div class="suggestion-item empty">Carregando produtos...</div>
      `;
      suggestionsBox.classList.add("show");
      selectedIndex = -1;
      return;
    }

    // Filtra os produtos que combinam com o termo pesquisado
    const matches = searchProducts
      .filter((product) =>
        (product.name || "").toLowerCase().includes(search)
      )
      .slice(0, 6);

    // Mostra mensagem caso nenhum produto seja encontrado
    if (!matches.length) {
      suggestionsBox.innerHTML = `
        <div class="suggestion-item empty">Nenhum produto encontrado</div>
      `;
      suggestionsBox.classList.add("show");
      selectedIndex = -1;
      return;
    }

    // Monta o HTML das sugestões encontradas
    suggestionsBox.innerHTML = matches
      .map((product) => {
        // Define imagem padrão caso venha vazia
        const imagePath =
          product.img && product.img.trim() !== ""
            ? product.img
            : "images/default.jpg";

        return `
          <button type="button" class="suggestion-item" data-name="${product.name}">
            <img src="${imagePath}" alt="${product.name}">
            <span>${product.name}</span>
          </button>
        `;
      })
      .join("");

    suggestionsBox.classList.add("show");
    selectedIndex = -1;

    // Adiciona clique em cada sugestão para redirecionar a busca
    const items = suggestionsBox.querySelectorAll(".suggestion-item[data-name]");

    items.forEach((item) => {
      item.addEventListener("click", () => {
        redirectToSearch(item.dataset.name || "");
      });
    });
  }

  // Inicializa os eventos da busca se os elementos existirem
  async function initSearch() {
    if (!searchInput || !suggestionsBox) return;

    // Desativa o autocomplete padrão do navegador
    searchInput.setAttribute("autocomplete", "off");

    // Limpa o campo ao entrar na página inicial
    if (window.location.pathname.endsWith("index.html")) {
      searchInput.value = "";
    }

    // Carrega os produtos antes de usar a busca
    await loadProductsForSearch();

    // Atualiza as sugestões enquanto o usuário digita
    searchInput.addEventListener("input", () => {
      showSuggestions(searchInput.value);
    });

    // Reexibe sugestões ao focar no campo, se houver texto
    searchInput.addEventListener("focus", () => {
      if (searchInput.value.trim()) {
        showSuggestions(searchInput.value);
      }
    });

    // Controla navegação por teclado nas sugestões
    searchInput.addEventListener("keydown", (e) => {
      const items = suggestionsBox.querySelectorAll(".suggestion-item[data-name]");

      // Seleciona próxima sugestão
      if (e.key === "ArrowDown" && items.length) {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelectedSuggestion(items);
        return;
      }

      // Seleciona sugestão anterior
      if (e.key === "ArrowUp" && items.length) {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelectedSuggestion(items);
        return;
      }

      // Confirma a busca ao pressionar Enter
      if (e.key === "Enter") {
        e.preventDefault();

        if (selectedIndex >= 0 && items[selectedIndex]) {
          redirectToSearch(items[selectedIndex].dataset.name || "");
          return;
        }

        redirectToSearch(searchInput.value);
      }

      // Fecha as sugestões ao pressionar Escape
      if (e.key === "Escape") {
        clearSuggestions();
      }
    });

    // Fecha as sugestões ao clicar fora da área de busca
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-box")) {
        clearSuggestions();
      }
    });
  }

  // Inicia a busca ao carregar a página
  document.addEventListener("DOMContentLoaded", initSearch);
})();