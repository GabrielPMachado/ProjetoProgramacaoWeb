// =========================
// IMPORTS
// =========================
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

// =========================
// CONFIGURAÇÕES
// =========================
app.use(cors());
app.use(express.json());

// =========================
// PASTA / ARQUIVO DE USUÁRIOS
// =========================
const dataDir = path.join(__dirname, "data");
const filePath = path.join(dataDir, "users.json");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([], null, 2));
}

// =========================
// ROTA PRINCIPAL
// =========================
app.get("/", (req, res) => {
  res.send("Servidor funcionando.");
});

// =========================
// ROTA DE CADASTRO
// =========================
app.post("/register", (req, res) => {
  try {
    const newUser = req.body;

    const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const userExists = users.find((u) => u.email === newUser.email);

    if (userExists) {
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

// =========================
// ROTA PRINCIPAL
// =========================
app.get("/", (req, res) => {
  res.send("Servidor funcionando.");
});

// =========================
// INICIAR SERVIDOR
// =========================
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});