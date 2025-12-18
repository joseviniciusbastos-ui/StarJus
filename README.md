<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1HutnXOETdK5J76MCwPTmnTf2wMt23vi5

## STARJUS 2.0 - SaaS Legal Intelligence

Sistema avançado de gestão jurídica e automação para advogados modernos.

## 🚀 Deploy no GitHub

Para rodar este projeto ou fazer deploy via GitHub, você precisa configurar os segredos (Secrets) no seu repositório:

1. Vá em **Settings > Secrets and variables > Actions**.
2. Adicione os seguintes segredos:
   - `VITE_SUPABASE_URL`: A URL do seu projeto Supabase.
   - `VITE_SUPABASE_ANON_KEY`: A chave anônima (anon key) do seu projeto Supabase.

## 🛠️ Desenvolvimento Local

1. Instale as dependências: `npm install`
2. Crie um arquivo `.env.local` com suas chaves do Supabase.
3. Rode o projeto: `npm run dev`

---
> [!IMPORTANT]
> Nunca versione seu arquivo `.env.local`. Ele já está incluído no `.gitignore`.
