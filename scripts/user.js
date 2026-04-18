// Retorna o usuário logado atualmente
function getLoggedUser() {
  return JSON.parse(localStorage.getItem("loggedUser")) || null;
}

// Salva o usuário logado no localStorage
function saveLoggedUser(user) {
  localStorage.setItem("loggedUser", JSON.stringify(user));
}

// Armazena os dados da etapa 1 do cadastro temporariamente
let registerTemp = null;

// Atualiza o botão da navbar com o estado do usuário (logado ou não)
function updateNavbarUser() {
  const userBtn = document.querySelector(".user-btn");
  const user = getLoggedUser();

  if (!userBtn) return;

  // Mostra nome do usuário se logado, só ícone se não
  if (user) {
    userBtn.innerHTML = `
      <svg class="icon-user" viewBox="0 0 24 24">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <path d="M16 3.128a4 4 0 0 1 0 7.744"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <circle cx="9" cy="7" r="4"/>
      </svg>
      <span class="user-name">${user.name}</span>
    `;
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

// Inicializa toda a lógica de autenticação e interação do usuário
function initUser() {
  const userBtn = document.querySelector(".user-btn");
  const userOverlay = document.getElementById("userOverlay");
  const userPopup = document.getElementById("userPopup");

  if (!userBtn || !userOverlay || !userPopup) return;

  // Garante que o popup começa fechado
  userOverlay.classList.remove("active");

  // Atualiza a navbar com o estado atual
  updateNavbarUser();

  // Clique no botão de usuário
  userBtn.addEventListener("click", () => {
    const user = getLoggedUser();

    // Se logado, pergunta se quer sair
    if (user) {
      if (confirm(`Sair da conta de ${user.name}?`)) {
        localStorage.removeItem("loggedUser");
        updateNavbarUser();
      }
      return;
    }

    // Se não logado, abre o popup de login
    userOverlay.classList.add("active");
    showLogin();
  });

  // Fecha o popup ao clicar fora
  userOverlay.addEventListener("click", (e) => {
    if (e.target === userOverlay) {
      userOverlay.classList.remove("active");
      registerTemp = null;
    }
  });

  // Impede que cliques dentro do popup fechem ele
  userPopup.addEventListener("click", (e) => e.stopPropagation());

  // Navegação entre telas (login, cadastro, voltar)
  userPopup.addEventListener("click", (e) => {
    if (e.target.id === "goToRegister") {
      registerTemp = null;
      showRegister();
    }

    if (e.target.id === "goToLogin") showLogin();

    if (e.target.id === "goBack") {
      // Salva os dados da etapa 2 antes de voltar
      const form = document.getElementById("registerForm2");
      if (form) {
        const inputs = form.querySelectorAll("input");
        registerTemp.phone   = inputs[0].value;
        registerTemp.cpf     = inputs[1].value;
        registerTemp.cep     = inputs[2].value;
        registerTemp.address = inputs[3].value;
        registerTemp.city    = inputs[4].value;
        registerTemp.state   = inputs[5].value;
      }
      showRegister();
    }
  });

  // Trata o envio dos formulários (login e cadastro)
  userPopup.addEventListener("submit", (e) => {
    e.preventDefault();

    if (e.target.id === "loginForm") handleLogin(e.target);
    if (e.target.id === "registerForm") handleRegisterStep1(e.target);
    if (e.target.id === "registerForm2") handleRegister(e.target);
  });
}

// Renderiza a tela de login
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

// Renderiza a etapa 1 do cadastro
function showRegister() {
  const userPopup = document.getElementById("userPopup");

  userPopup.innerHTML = `
    <h2>Criar Conta</h2>
    <form id="registerForm">
      <input type="text" placeholder="Nome" required>
      <input type="email" placeholder="Email" required>
      <input type="password" placeholder="Senha" required>
      <button type="submit">Continuar</button>
    </form>
    <p class="auth-switch">
      Já tem conta? <a id="goToLogin">Entrar</a>
    </p>
  `;

  // Repopula os campos se já havia preenchido antes
  if (registerTemp) {
    const form = document.getElementById("registerForm");
    form.querySelector("input[type='text']").value  = registerTemp.name  || "";
    form.querySelector("input[type='email']").value = registerTemp.email || "";
  }
}

// Renderiza a etapa 2 do cadastro
function showRegisterStep2() {
  const userPopup = document.getElementById("userPopup");

  userPopup.innerHTML = `
    <h2>Seus dados</h2>
    <form id="registerForm2">
      <input type="text" placeholder="Telefone" required maxlength="15" oninput="formatPhone(this)">
      <input type="text" placeholder="CPF" required maxlength="14" oninput="formatCPF(this)">
      <input type="text" placeholder="CEP" required maxlength="9" oninput="formatCEP(this)">
      <input type="text" placeholder="Endereço" required>
      <input type="text" placeholder="Cidade" required>
      <input type="text" placeholder="Estado" required maxlength="2" oninput="formatState(this)">
      <button type="submit">Cadastrar</button>
    </form>
    <p class="auth-switch">
      <a id="goBack">Voltar</a>
    </p>
  `;

  // Repopula os dados já preenchidos
  if (registerTemp) {
    const form = document.getElementById("registerForm2");
    const inputs = form.querySelectorAll("input");
    inputs[0].value = registerTemp.phone   || "";
    inputs[1].value = registerTemp.cpf     || "";
    inputs[2].value = registerTemp.cep     || "";
    inputs[3].value = registerTemp.address || "";
    inputs[4].value = registerTemp.city    || "";
    inputs[5].value = registerTemp.state   || "";
  }
}

// Aplica máscara de telefone
function formatPhone(input) {
  let value = input.value.replace(/\D/g, "").slice(0, 11);

  if (value.length === 0) input.value = "";
  else if (value.length < 3) input.value = `(${value}`;
  else if (value.length < 7) input.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
  else if (value.length < 11) input.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
  else input.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
}

// Aplica máscara de CPF
function formatCPF(input) {
  let value = input.value.replace(/\D/g, "").slice(0, 11);

  if (value.length <= 3) input.value = value;
  else if (value.length <= 6) input.value = `${value.slice(0, 3)}.${value.slice(3)}`;
  else if (value.length <= 9) input.value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
  else input.value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
}

// Aplica máscara de CEP
function formatCEP(input) {
  let value = input.value.replace(/\D/g, "").slice(0, 8);

  if (value.length <= 5) input.value = value;
  else input.value = `${value.slice(0, 5)}-${value.slice(5)}`;
}

// Formata estado (sigla)
function formatState(input) {
  input.value = input.value
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 2)
    .toUpperCase();
}

// Realiza login via backend
async function handleLogin(form) {
  const email = form.querySelector("input[type='email']").value.trim();
  const senha = form.querySelector("input[type='password']").value;

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: senha })
    });

    const data = await response.json();

    // Trata erro de login
    if (!response.ok) {
      showError(data.error || "Email ou senha incorretos.");
      return;
    }

    // Salva usuário e fecha popup
    saveLoggedUser(data.user);
    document.getElementById("userOverlay").classList.remove("active");
    updateNavbarUser();

  } catch (err) {
    showError("Erro ao conectar com o servidor.");
  }
}

// Valida etapa 1 do cadastro
function handleRegisterStep1(form) {
  const name = form.querySelector("input[type='text']").value.trim();
  const email = form.querySelector("input[type='email']").value.trim();
  const password = form.querySelector("input[type='password']").value;

  if (name.length < 3) { showError("Nome muito curto."); return; }
  if (password.length < 8) { showError("Senha deve ter no mínimo 8 caracteres."); return; }

  // Guarda dados e vai para etapa 2
  registerTemp = { name, email, password };
  showRegisterStep2();
}

// Finaliza cadastro
async function handleRegister(form) {
  const inputs = form.querySelectorAll("input");

  const newUser = {
    ...registerTemp,
    phone: inputs[0].value.replace(/\D/g, ""),
    cpf: inputs[1].value.replace(/\D/g, ""),
    cep: inputs[2].value.replace(/\D/g, ""),
    address: inputs[3].value.trim(),
    city: inputs[4].value.trim(),
    state: inputs[5].value.trim().toUpperCase(),
  };

  registerTemp = null;

  // Validações finais
  if (!/^\d{11}$/.test(newUser.cpf)) { showError("CPF inválido."); return; }
  if (!/^\d{10,11}$/.test(newUser.phone)) { showError("Telefone inválido."); return; }
  if (!/^\d{8}$/.test(newUser.cep)) { showError("CEP inválido."); return; }
  if (!/^[A-Za-zÀ-ÿ\s]+$/.test(newUser.city)) { showError("Cidade inválida."); return; }

  const siglas = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

  if (!siglas.includes(newUser.state)) { showError("Estado inválido."); return; }

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });

    const data = await response.json();

    if (!response.ok) { showError(data.error || "Erro ao cadastrar."); return; }

    // Salva sessão e fecha popup
    saveLoggedUser(newUser);
    document.getElementById("userOverlay").classList.remove("active");
    updateNavbarUser();

  } catch (err) {
    showError("Erro ao conectar com o servidor.");
  }
}

// Exibe mensagens de erro na interface
function showError(msg) {
  let err = document.getElementById("authError");

  // Cria o elemento se não existir
  if (!err) {
    err = document.createElement("p");
    err.id = "authError";
    err.classList.add("auth-error");
    document.getElementById("userPopup").appendChild(err);
  }

  // Atualiza mensagem
  err.textContent = msg;
}

// Inicializa tudo quando o DOM carregar
document.addEventListener("DOMContentLoaded", initUser);