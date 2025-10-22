# Sistema de Gerenciamento de Dispositivos

Projeto full-stack para cadastro e monitoramento de dispositivos em tempo real, com API Node.js/Express, MySQL e atualizações via Socket.io. Frontend em Vue 3 com Tailwind CSS v4.

## 🚀 Estrutura do Projeto
- `backend/` — API (Express, Socket.io, Jest)
- `frontend/` — SPA Vue 3 (Vue CLI, Tailwind via PostCSS)

## 📋 Pré-requisitos
- `Node.js` 16+
- `MySQL` 8+
- `npm`

## 🔧 Ambiente (backend)
Crie um arquivo `.env` na pasta `backend` (ou use variáveis de ambiente) com:
```
PORT=3000
DB_HOST=localhost
DB_USER=seu_user
DB_PASSWORD=sua_senha
DB_NAME=devices_db
```

## 🗃️ Banco de Dados
Crie o schema e a tabela usados pela API:
```
CREATE DATABASE IF NOT EXISTS devices_db;
USE devices_db;
CREATE TABLE IF NOT EXISTS devices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  mac VARCHAR(17) NOT NULL UNIQUE,
  status ENUM('ATIVO','INATIVO') NOT NULL DEFAULT 'ATIVO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🛠️ Instalação e Execução
### Backend
```
cd backend
npm install
npm run dev      # http://localhost:3000
# produção
npm run build && npm start
```

### Frontend
```
cd frontend
npm install
npm run serve    # http://localhost:8080
```
A URL da API usada no frontend está em `src/App.vue` (`API_URL = http://localhost:3000/api`). Ajuste se necessário.

## 📦 Scripts Disponíveis
- Backend: `npm run dev`, `npm run build`, `npm start`, `npm test`
- Frontend: `npm run serve`, `npm run build`, `npm run lint`

## ✅ Testes (backend)
```
cd backend
npm test
```
- Stack: `jest` + `ts-jest` + `supertest`
- Cobertura: `src/**/*` (exclui `src/server.ts`)
- Os testes de integração usam o banco `devices_db` e limpam a tabela `devices`. Garanta que o banco/tabela existem.

## 🔌 API
- `GET /api/devices` — lista dispositivos
- `POST /api/devices` — cria dispositivo `{ name, mac }` (400 em caso de MAC duplicado)
- `PATCH /api/devices/:id/status` — alterna status `ATIVO`/`INATIVO`

### WebSocket (Socket.io)
- Conexão: `http://localhost:3000`
- Eventos emitidos: `device:created`, `device:status`

## 🎨 Estilos (Tailwind CSS v4)
Tailwind integrado via PostCSS no frontend:
- `frontend/postcss.config.js` usa `@tailwindcss/postcss`
- `src/assets/tailwind.css` contém `@import "tailwindcss"`
- `src/main.js` importa `./assets/tailwind.css`
Não é necessário rodar `npx tailwindcss init -p`.

## ▶️ Execução Completa
Abra dois terminais:
```
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run serve
```
Acesse `http://localhost:8080`.
