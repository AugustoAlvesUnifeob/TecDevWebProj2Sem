# API de Avaliação de Estabelecimentos

Projeto desenvolvido para a disciplina de Desenvolvimento Web. É uma API REST em Node.js/Express para gestão de estabelecimentos e avaliações de usuários, contando com regras de negócio, autenticação via JWT e controle de acesso por papéis (RBAC).

---

## Tecnologias Usadas

* **Node.js** & **Express**
* **MySQL** & **Sequelize** (ORM)
* **JWT (JSON Web Token)** para autenticação
* **bcrypt** para criptografia de senhas
* **express-validator** para validação dos dados de entrada

---

## Funcionalidades & Regras de Negócio

* **Autenticação:** Cadastro e login de usuários com senhas criptografadas.
* **Controle de Acesso (RBAC):** Diferenciação entre usuários `cliente` e `admin`.
* **Regra de Unicidade:** Cada usuário só pode avaliar o mesmo estabelecimento uma única vez (retorna erro `409 Conflict`).
* **Moderação:** Avaliações enviadas entram para análise e apenas administradores podem aprovar ou recusar.
* **Validação:** Dados do formulário são tratados pelo `express-validator` (retorna `400 Bad Request` se houver erros).

---
