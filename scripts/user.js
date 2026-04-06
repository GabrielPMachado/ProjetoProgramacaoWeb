// =========================
// GERENCIAMENTO DE USUÁRIOS (LOCAL)
// =========================

// Retorna todos os usuários do localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// Salva lista de usuários no localStorage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Retorna usuário logado
function getLoggedUser() {
  return JSON.parse(localStorage.getItem("loggedUser")) || null;
}

// Salva usuário logado
function saveLoggedUser(user) {
  localStorage.setItem("loggedUser", JSON.stringify(user));
}


// =========================
// ATUALIZAÇÃO DA NAVBAR
// =========================

// Atualiza botão do usuário (nome ou ícone)
function updateNavbarUser() {
  const userBtn = document.querySelector(".user-btn");
  const user = getLoggedUser();

  if (!userBtn) return;

  if (user) {
    userBtn.innerHTML = `<span class="user-name">${user.name}</span>`;
  } else {
    userBtn.innerHTML = `
      <svg class="icon-user" viewBox="0 0 24 24">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <path d="M16 3.128a4 4 0 0 1 0 7.744"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <circle cx="9" cy="7" r="4"/>
      </svg>
    `;
  }
}


// =========================
// INICIALIZAÇÃO
// =========================

function initUser() {
  const userBtn = document.querySelector(".user-btn");
  const userOverlay = document.getElementById("userOverlay");
  const userPopup = document.getElementById("userPopup");

  if (!userBtn || !userOverlay || !userPopup) return;

  // Garante popup fechado ao iniciar
  userOverlay.classList.remove("active");

  // Atualiza navbar
  updateNavbarUser();

  // =========================
  // CLICK NO BOTÃO DE USUÁRIO
  // =========================
  userBtn.addEventListener("click", () => {
    const user = getLoggedUser();

    // Se estiver logado → logout
    if (user) {
      if (confirm(`Sair da conta de ${user.name}?`)) {
        localStorage.removeItem("loggedUser");
        updateNavbarUser();
      }
      return;
    }

    // Se não estiver logado → abre login
    userOverlay.classList.add("active");
    showLogin();
  });

  // Fecha clicando fora
  userOverlay.addEventListener("click", (e) => {
    if (e.target === userOverlay) {
      userOverlay.classList.remove("active");
    }
  });

  // Impede fechamento ao clicar dentro
  userPopup.addEventListener("click", (e) => e.stopPropagation());

  // Troca entre login e cadastro
  userPopup.addEventListener("click", (e) => {
    if (e.target.id === "goToRegister") showRegister();
    if (e.target.id === "goToLogin") showLogin();
  });

  // Submit dos formulários
  userPopup.addEventListener("submit", (e) => {
    e.preventDefault();

    if (e.target.id === "loginForm") handleLogin(e.target);
    if (e.target.id === "registerForm") handleRegister(e.target);
  });
}


// =========================
// TELAS (LOGIN / CADASTRO)
// =========================

function showLogin() {
  const userPopup = document.getElementById("userPopup");

  userPopup.innerHTML = `
    <h2>Faça Login</h2>
    <form id="loginForm">
      <input type="email" placeholder="Email" required>
      <input type="password" placeholder="Senha" required>
      <button type="submit">Entrar</button>
    </form>
    <p class="auth-switch">
      Não tem conta? <a id="goToRegister">Cadastre-se</a>
    </p>
  `;
}

function showRegister() {
  const userPopup = document.getElementById("userPopup");

  userPopup.innerHTML = `
    <h2>Criar Conta</h2>
    <form id="registerForm">
      <input type="text" placeholder="Nome" required>
      <input type="email" placeholder="Email" required>
      <input type="text" placeholder="Telefone" required>
      <input type="text" placeholder="CPF" required>
      <input type="text" placeholder="CEP" required>
      <input type="text" placeholder="Endereço" required>
      <input type="text" placeholder="Cidade" required>
      <input type="text" placeholder="Estado" required>
      <input type="password" placeholder="Senha" required>
      <button type="submit">Cadastrar</button>
    </form>
    <p class="auth-switch">
      Já tem conta? <a id="goToLogin">Entrar</a>
    </p>
  `;
}


// =========================
// LOGIN
// =========================

function handleLogin(form) {
  const email = form.querySelector("input[type='email']").value.trim();
  const senha = form.querySelector("input[type='password']").value;

  const users = getUsers();

  const user = users.find(
    (u) => u.email === email && u.password === senha
  );

  if (!user) {
    showError("Email ou senha incorretos.");
    return;
  }

  saveLoggedUser(user);
  document.getElementById("userOverlay").classList.remove("active");
  updateNavbarUser();
}


// =========================
// CADASTRO (BACKEND + LOCAL)
// =========================

async function handleRegister(form) {
  const inputs = form.querySelectorAll("input");

  const newUser = {
    name: inputs[0].value.trim(),
    email: inputs[1].value.trim(),
    phone: inputs[2].value.trim(),
    cpf: inputs[3].value.trim(),
    cep: inputs[4].value.trim(),
    address: inputs[5].value.trim(),
    city: inputs[6].value.trim(),
    state: inputs[7].value.trim(),
    password: inputs[8].value
  };

  try {
    // Envia para o backend (salva no users.json)
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    });

    const data = await response.json();

    // Erro do backend
    if (!response.ok) {
      showError(data.error || "Erro ao cadastrar.");
      return;
    }

    // Salva também localmente (fallback)
    const users = getUsers();
    users.push(newUser);
    saveUsers(users);
    saveLoggedUser(newUser);

    // Atualiza UI
    document.getElementById("userOverlay").classList.remove("active");
    updateNavbarUser();

  } catch (err) {
    showError("Erro ao conectar com o servidor.");
  }
}


// =========================
// EXIBIÇÃO DE ERROS
// =========================

function showError(msg) {
  let err = document.getElementById("authError");

  if (!err) {
    err = document.createElement("p");
    err.id = "authError";
    err.classList.add("auth-error");
    document.getElementById("userPopup").appendChild(err);
  }

  err.textContent = msg;
}


// =========================
// START
// =========================

document.addEventListener("DOMContentLoaded", initUser);