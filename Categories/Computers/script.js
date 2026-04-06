const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    alert("Você pesquisou por: " + searchInput.value);
  }
});

let cartCount = 0;
let pressTimer;

const cartBtn = document.querySelector(".cart-btn");
const badge = document.getElementById("cartCount");

// Atualiza visual
  function updateCart() {
  badge.textContent = cartCount > 9 ? "9+" : cartCount;

  if (cartCount === 0) {
    badge.style.display = "none";
  } else {
    badge.style.display = "block";
  }
}

updateCart();

// Função para adicionar item
function addToCart() {
  cartCount = cartCount + 1;
  badge.textContent = cartCount;

  // animação
  badge.classList.add("animate");
  setTimeout(() => badge.classList.remove("animate"), 200);

  badge.textContent = cartCount > 9 ? "9+" : cartCount;

  updateCart()
}

// Segurar clique (desktop)
cartBtn.addEventListener("mousedown", () => {
  pressTimer = setTimeout(() => {
    cartCount = 0;
    updateCart();

    // animação
    badge.classList.add("animate");
    setTimeout(() => badge.classList.remove("animate"), 200);
  }, 1000); // tempo segurando (1s)
});

cartBtn.addEventListener("mouseup", () => {
  clearTimeout(pressTimer);
});

cartBtn.addEventListener("mouseleave", () => {
  clearTimeout(pressTimer);
});


// Mobile (toque)
cartBtn.addEventListener("touchstart", () => {
  pressTimer = setTimeout(() => {
    cartCount = 0;
    updateCart();
  }, 1000);
});

cartBtn.addEventListener("touchend", () => {
  clearTimeout(pressTimer);
});

cartBtn.addEventListener("mousedown", () => {
  cartBtn.classList.add("holding");
});

cartBtn.addEventListener("mouseup", () => {
  cartBtn.classList.remove("holding");
});