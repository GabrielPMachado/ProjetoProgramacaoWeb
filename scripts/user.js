// =========================
// ESTADO DO USUÁRIO
// =========================

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getLoggedUser() {
  return JSON.parse(localStorage.getItem("loggedUser")) || null;
}

function saveLoggedUser(user) {
  localStorage.setItem("loggedUser", JSON.stringify(user));
}

// =========================
// ATUALIZAR NAVBAR
// =========================

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
// INIT
// =========================

function initUser() {
  const userBtn = document.querySelector(".user-btn");
  const userOverlay = document.getElementById("userOverlay");
  const userPopup = document.getElementById("userPopup");

  if (!userBtn || !userOverlay || !userPopup) return;

  userOverlay.classList.remove("active");
  updateNavbarUser();

  // Abrir popup (só se não estiver logado)
  userBtn.addEventListener("click", (e) => {
    const user = getLoggedUser();
    if (user) {
      // Se já logado, clique faz logout
      if (confirm(`Sair da conta de ${user.name}?`)) {
        localStorage.removeItem("loggedUser");
        updateNavbarUser();
      }
      return;
    }
    userOverlay.classList.add("active");
    showLogin();
  });

  // Fechar clicando fora
  userOverlay.addEventListener("click", (e) => {
    if (e.target === userOverlay) userOverlay.classList.remove("active");
  });

  userPopup.addEventListener("click", (e) => e.stopPropagation());

  // Alternar entre login e cadastro
  userPopup.addEventListener("click", (e) => {
    if (e.target.id === "goToRegister") showRegister();
    if (e.target.id === "goToLogin") showLogin();
  });

  // Submit
  userPopup.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    if (form.id === "loginForm") handleLogin(form);
    if (form.id === "registerForm") handleRegister(form);
  });
}

// =========================
// TELAS
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
    <p class="auth-switch">Não tem conta? <a id="goToRegister">Cadastre-se</a></p>
  `;
}

function showRegister() {
  const userPopup = document.getElementById("userPopup");
  userPopup.innerHTML = `
    <h2>Criar Conta</h2>
    <form id="registerForm">
      <input type="text" placeholder="Nome" required>
      <input type="email" placeholder="Email" required>
      <input type="password" placeholder="Senha" required>
      <button type="submit">Cadastrar</button>
    </form>
    <p class="auth-switch">Já tem conta? <a id="goToLogin">Entrar</a></p>
  `;
}

// =========================
// HANDLERS
// =========================

function handleLogin(form) {
  const email = form.querySelector("input[type='email']").value.trim();
  const senha = form.querySelector("input[type='password']").value;
  const users = getUsers();

  const user = users.find(u => u.email === email && u.password === senha);

  if (!user) {
    showError("Email ou senha incorretos.");
    return;
  }

  saveLoggedUser(user);
  document.getElementById("userOverlay").classList.remove("active");
  updateNavbarUser();
}

function handleRegister(form) {
  const name = form.querySelector("input[type='text']").value.trim();
  const email = form.querySelector("input[type='email']").value.trim();
  const password = form.querySelector("input[type='password']").value;
  const users = getUsers();

  if (users.find(u => u.email === email)) {
    showError("Este email já está cadastrado.");
    return;
  }

  const newUser = { name, email, password };
  users.push(newUser);
  saveUsers(users);
  saveLoggedUser(newUser);

  document.getElementById("userOverlay").classList.remove("active");
  updateNavbarUser();
}

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

document.addEventListener("DOMContentLoaded", initUser);