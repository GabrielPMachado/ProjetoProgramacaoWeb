// Lista de produtos
const produtos = [
  {
    nome: "Notebook Gamer Acer Nitro V16",
    preco: "13.999,00",
    img: "images/products/acernitroV16.jpg",
    specs: [
      { icon: "images/specs/processador_svg.svg", label: "Intel® Core™ 7 240h" },
      { icon: "images/specs/windows_svg.svg", label: "Windows 11 Home" },
      { icon: "images/specs/memoriaram_svg.svg", label: "32 GB RAM DDR5" },
      { icon: "images/specs/hd_svg.svg", label: "1TB SSD" },
      { icon: "images/specs/tela_svg.svg", label: "16” WUXGA (1920 x 1200)" },
      { icon: "images/specs/placavideo_svg.svg", label: "Nvidia RTX 5060 com 8 GB GDDR7" }
    ]
  },
  {
    nome: "Notebook Gamer Dell XPS 15",
    preco: "12.499,00",
    img: "images/products/dellxps15.jpg",
    specs: [
      { icon: "images/specs/processador_svg.svg", label: "Intel® Core™ i7 12700H" },
      { icon: "images/specs/windows_svg.svg", label: "Windows 11 Pro" },
      { icon: "images/specs/memoriaram_svg.svg", label: "16 GB RAM DDR5" },
      { icon: "images/specs/hd_svg.svg", label: "512 GB SSD" },
      { icon: "images/specs/tela_svg.svg", label: "15” FHD (1920 x 1080)" },
      { icon: "images/specs/placavideo_svg.svg", label: "Nvidia RTX 3050 Ti" }
    ]
  },
  {
    nome: "Notebook Lenovo Legion 7",
    preco: "14.299,00",
    img: "images/products/lenovolegion7.jpg",
    specs: [
      { icon: "images/specs/processador_svg.svg", label: "Intel® Core™ i9 12900H" },
      { icon: "images/specs/windows_svg.svg", label: "Windows 11 Home" },
      { icon: "images/specs/memoriaram_svg.svg", label: "32 GB RAM DDR5" },
      { icon: "images/specs/hd_svg.svg", label: "1TB SSD" },
      { icon: "images/specs/tela_svg.svg", label: "16” QHD (2560 x 1600)" },
      { icon: "images/specs/placavideo_svg.svg", label: "Nvidia RTX 4060 com 8 GB" }
    ]
  },
  {
    nome: "Notebook Asus ROG Strix",
    preco: "15.499,00",
    img: "images/products/asusrogstrix.jpg",
    specs: [
      { icon: "images/specs/processador_svg.svg", label: "Intel® Core™ i9 13900H" },
      { icon: "images/specs/windows_svg.svg", label: "Windows 11 Home" },
      { icon: "images/specs/memoriaram_svg.svg", label: "64 GB RAM DDR5" },
      { icon: "images/specs/hd_svg.svg", label: "2TB SSD" },
      { icon: "images/specs/tela_svg.svg", label: "17” WQHD (2560 x 1440)" },
      { icon: "images/specs/placavideo_svg.svg", label: "Nvidia RTX 4070 8 GB" }
    ]
  }
];

// Seleciona o container dos produtos
const productGrid = document.querySelector(".product-grid");

// Mostrar apenas os 3 primeiros produtos
const produtosExibidos = produtos.slice(0, 3);

produtosExibidos.forEach(prod => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  let specsHTML = '';
  prod.specs.forEach(spec => {
    specsHTML += `
      <div class="spec-item">
        <img class="spec-icon" src="${spec.icon}" alt="Icone"/>
        <span>${spec.label}</span>
      </div>
    `;
  });

  card.innerHTML = `
    <img src="${prod.img}" alt="${prod.nome}">
    <h3>${prod.nome}</h3>
    <p>R$ ${prod.preco}</p>
    <div class="product-specs">${specsHTML}</div>
    <button onclick="addToCart('${prod.nome}', ${prod.preco.replace(/\./g,'').replace(',', '.')})">Comprar</button>
  `;

  productGrid.appendChild(card);
});