# Backend BASED

## Configuração

1. Instale as dependências com `npm install`.
2. Copie `.env.example` para `.env` e preencha as credenciais do PostgreSQL.
3. Configure `JWT_SECRET` com um segredo aleatório de pelo menos 32 caracteres.
4. Execute uma vez no banco a migração `migrations/20261027000100_domain_api.sql`.
5. Inicie a API com `npm start` ou em desenvolvimento com `npm run dev`.

A API fica disponível em `http://localhost:3000/api`. Durante o desenvolvimento do
frontend, o Vite encaminha `/api` para essa URL. Para uma origem diferente,
configure `CORS_ORIGIN` com a lista de origens permitidas separadas por vírgula.

## Rotas para o frontend

- `POST /api/auth/cadastro` e `POST /api/auth/login` criam uma sessão com token Bearer.
- `GET /api/times`, `GET /api/eventos` e `GET /api/vagas` publicam os catálogos.
- `GET /api/eventos?tipo=evento&busca=texto` faz filtro e busca no servidor.
- `/api/perfil` guarda perfil, galeria e conquistas do usuário autenticado.
- `/api/preferencias` guarda preferências por conta autenticada.
- Inscrições em eventos e candidaturas a vagas usam o atleta vinculado à sessão;
  o cliente não pode escolher outro atleta.

Recursos de escrita e dados pessoais exigem `Authorization: Bearer <token>`.
