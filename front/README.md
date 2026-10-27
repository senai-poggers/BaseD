# BASED

React + Vite + TypeScript.

```sh
npm install
npm run dev
```

Para usar o Supabase, execute `supabase/migrations/20261026180000_initial_catalog.sql`
no SQL Editor do projeto. Copie `.env.example` para `.env.local`, configure as
credenciais públicas e reinicie o Vite. Sem credenciais, o app usa dados de exemplo.
Nunca use a chave `service_role` no frontend.
