const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

// Permite requisições de outras origens e lê JSON do body
app.use(cors());
app.use(express.json());

// Caminho para a pasta e arquivo de usuários
const dataDir = path.join(__dirname, "data");
const filePath = path.join(dataDir, "users.json");

// Cria a pasta e o arquivo se não existirem
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([], null, 2));

// Rota de teste para confirmar que o servidor está no ar
app.get("/", (req, res) => {
  res.send("Servidor funcionando.");
});

// Cadastra um novo usuário
app.post("/register", (req, res) => {
  try {
    const newUser = req.body;
    const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Impede cadastro com email já existente
    if (users.find((u) => u.email === newUser.email)) {
      return res.status(400).json({ error: "Email já cadastrado." });
    }

    users.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    res.status(201).json({ message: "Usuário cadastrado com sucesso." });
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// Autentica um usuário pelo email e senha
app.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Busca usuário com email e senha correspondentes
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ error: "Email ou senha incorretos." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
