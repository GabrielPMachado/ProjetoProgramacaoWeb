// Importa as dependências
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

// Inicializa o app
const app = express();
const PORT = 3000;

// Permite requisições externas e leitura de JSON
app.use(cors());
app.use(express.json());

// Caminho da pasta e arquivo de usuários
const dataDir = path.join(__dirname, "data");
const filePath = path.join(dataDir, "users.json");

// Cria pasta se não existir
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Cria arquivo se não existir
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf-8");
}

// Lê os usuários do arquivo
function readUsers() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Salva os usuários no arquivo
function writeUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
}

// Rota teste
app.get("/", (req, res) => {
  res.status(200).send("Servidor funcionando.");
});

// Cadastro
app.post("/register", (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validação básica
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Nome, email e senha são obrigatórios."
      });
    }

    const users = readUsers();

    // Verifica se já existe usuário com esse email
    const userExists = users.find((user) => user.email === email);
    if (userExists) {
      return res.status(400).json({
        error: "Email já cadastrado."
      });
    }

    // Cria novo usuário
    const newUser = {
      id: Date.now(),
      name,
      email,
      password
    };

    users.push(newUser);
    writeUsers(users);

    res.status(201).json({
      message: "Usuário cadastrado com sucesso."
    });
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
    res.status(500).json({
      error: "Erro interno no servidor."
    });
  }
});

// Login
app.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({
        error: "Email e senha são obrigatórios."
      });
    }

    const users = readUsers();

    // Busca usuário
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!user) {
      return res.status(401).json({
        error: "Email ou senha incorretos."
      });
    }

    // Remove senha da resposta
    const { password: _, ...safeUser } = user;

    res.status(200).json({
      message: "Login realizado com sucesso.",
      user: safeUser
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({
      error: "Erro interno no servidor."
    });
  }
});

// Inicializa servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});