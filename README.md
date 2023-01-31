<h1 align="center"> Recognizer Backend </h1>

![GitHub repo size](https://img.shields.io/github/repo-size/devArchetype/recognizer-backend?label=tamanho&style=flat-square)
![GitHub language count](https://img.shields.io/github/languages/count/devArchetype/recognizer-backend?label=linguagens&style=flat-square)
![Project version](https://img.shields.io/github/package-json/v/devArchetype/recognizer-backend?label=vers%C3%A3o&style=flat-square)
[![MIT License badge](https://img.shields.io/github/license/devArchetype/recognizer-backend?color=green&label=licen%C3%A7a&style=flat-square)](LICENSE.md)

---

<div align="center">
 <a href="#about">Sobre</a> |
 <a href="#technologies">Tecnologias</a> |
 <a href="#installation">Como executar</a> |
 <a href="#developers">Desenvolvedores</a>
</div>

<h2 id="about">💡&nbsp; Sobre o projeto</h2>

**Recognizer** é uma plataforma destinada a leitura e correção de gabaritos, proporcionando uma correção mais eficiente e precisa. Acesse agora a plataforma: [⤤ Ir para Recognizer](http://recognizer.vercel.app/).

Este repositório contém todo o código que compõe o back-end do projeto, os demais repositórios podem ser acessados em: [⤤ Recognizer Front-End](https://github.com/devArchetype/recognizer-frontend) e [⤤ Recognizer AI](https://github.com/devArchetype/recognizer-AI).

---

<h2 id="technologies">🛠&nbsp; Tecnologias</h2>

Este projeto foi desenvolvido usando as seguintes tecnologias:

✔️ [NodeJs](https://nodejs.org/en/)

✔️ [TypeScript](https://www.typescriptlang.org/)

✔️ [ExpressJS](https://expressjs.com/)

✔️ [Prisma](https://www.prisma.io/)

✔️ [MySQL](https://www.mysql.com/)

✔️ [Docker](https://www.docker.com/)

---

<h2 id="installation">🚀&nbsp; Como executar </h2>

```bash
# Clone o repositório
git clone https://github.com/devArchetype/recognizer-backend.git

# Entre na pasta da aplicação
cd recognizer-backend

# Instale as dependẽncias do projeto
npm i

# Suba os containers referentes
docker compose up -d

# Aplique as Migrações do BD
npx prisma migrate deploy

# Faça o build do projeto
npm run build

# Inicie o servidor
npm run start

# Acesse o servidor pelas rotas a partir de http://localhost:3000
```

---

<h2 id="developers">👨‍💻&nbsp;Desenvolvedores</h2>

- [Riquelme Damião](https://github.com/the-riquelme)
- [Paloma Bárbara](https://github.com/palomabarbara)
- [Marcus Vinícius](https://github.com/pymarcus)
- [João Gabriel](https://github.com/Gabrieljr42)
- [Isaac Santiago](https://github.com/eoisaac)
