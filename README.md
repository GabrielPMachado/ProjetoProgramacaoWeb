# 🛒 Tecno Store

> Plataforma web de e-commerce focada na exibição de produtos tecnológicos com sistema de autenticação de usuários.

---

## 📖 Sobre o Projeto

A **Tecno Store** é um projeto de programação web que simula uma loja online de produtos tecnológicos, como notebooks, celulares, tablets e computadores.

O sistema permite que usuários:

- Naveguem por categorias de produtos  
- Visualizem produtos e especificações  
- Criem uma conta  
- Façam login no sistema  

Além disso, o projeto possui um backend simples responsável por gerenciar os usuários cadastrados.

---

## 🚀 Como Rodar o Projeto (VS Code)

Siga os passos abaixo para executar o projeto corretamente utilizando o VS Code:

### 1️⃣ Instalar o Node.js

Antes de tudo, instale o Node.js na sua máquina:

👉 https://nodejs.org  

---

### 2️⃣ Abrir o projeto no VS Code

- Abra o VS Code  
- Clique em **File > Open Folder**  
- Selecione a pasta do projeto (`ProjetoProgramacaoWeb`)  

---

### 3️⃣ Baixe a extensão Live Server

- Use o link a seguir para baixar a extensão live server no seu VS Code

https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer

- Clique em `Install`
- Abra no VS Code
- Clique para Instalar

---

### 4️⃣ Abrir o terminal no VS Code

Dentro do VS Code:

- Vá em **Terminal > New Terminal**  
- Ou use o atalho:

Ctrl + `

---

### 5️⃣ Inicializar o projeto

- No terminal digite:

npm init -y

---

### 6️⃣ Inicializar o servidor

- Ainda no terminal digite:

node server.js

- Se estiver tudo correto, irá aparecer no terminal:

Servidor rodando em `http://localhost:3000`

---

### 7️⃣ Acesse no navegador

- Use o Atalho `Ctrl + P`
- Digite na barra:

Open With Live Server

- Pronto, se estiver tudo correto ele abrirá o projeto no seu navegador.

---

## ⚙️ Como o Projeto Funciona

O projeto é dividido em duas partes principais:

### 🔹 Frontend

Responsável pela interface visual do sistema.

- Página inicial com banner e produtos  
- Navegação por categorias  
- Sistema de login e cadastro via popup  
- Estrutura de carrinho de compras  

---

### 🔹 Backend

Responsável pela manipulação dos dados.

- Desenvolvido com Node.js  
- Armazena usuários em um arquivo JSON (`users.json`)  
- Realiza cadastro e login  

---

## 🧠 Lógica de Funcionamento

1. O usuário acessa a página principal (`index.html`)  
2. Navega entre categorias de produtos  
3. Pode criar conta ou fazer login  
4. Os dados são enviados para o servidor  
5. O servidor valida e salva os dados  
6. O sistema retorna uma resposta (sucesso ou erro)  

---

## 🛠️ Tecnologias Utilizadas

<p align="center"> 
<a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> 
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" width="80"/> 
</a> 
<a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> 
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" width="80"/> 
</a> 
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> 
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="80"/> 
</a> 
<a href="https://nodejs.org" target="_blank" rel="noreferrer"> 
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" width="80"/> 
</a> 
</p>

---

## 📂 Estrutura do Projeto

```bash
📁 ProjetoProgramacaoWeb/
│
│
├── 📁 data/
├── 📁 images/
├── 📁 node_modules/
├── 📁 scripts/
├── 📁 styles/
│
├── category.html
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── server.js
