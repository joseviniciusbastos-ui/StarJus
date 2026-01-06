# StarJus Edge Functions - Deployment Guide

## Prerequisites

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link to your project:
```bash
supabase link --project-ref vzomrqzgdtlnrvkfkvrb
```

## Configure Environment Variables

Set these secrets for your Edge Functions:

```bash
# Gemini API Key (obtenha em https://aistudio.google.com/app/apikey)
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here
```

As variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são injetadas automaticamente.

## Deploy Edge Functions

### Deploy all functions:
```bash
supabase functions deploy
```

### Deploy individual functions:
```bash
supabase functions deploy process-ai-analysis
supabase functions deploy document-categorization
```

## Test Edge Functions Locally

```bash
# Start local development
supabase start

# Serve functions locally
supabase functions serve

# Test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/process-ai-analysis' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"processId":"1","processNumber":"0000000-00.2020.1.00.0001","processTitle":"Ação Civil","court":"1ª Vara Cível"}'
```

## Monitor Functions

View logs in real-time:
```bash
supabase functions logs process-ai-analysis --project-ref vzomrqzgdtlnrvkfkvrb
```

## Pricing

- **Edge Functions**: Incluído no plano Free (500k invocações/mês)
- **Gemini API**: Gratuito até 1500 requests/dia (Gemini 2.0 Flash)

## Troubleshooting

### Error: "GEMINI_API_KEY not found"
- Verifique se configurou o secret: `supabase secrets list`
- Re-deploy a function após configurar

### Error: "Failed to analyze process"
- Verifique logs: `supabase functions logs process-ai-analysis`
- Teste a API Gemini diretamente
- Verifique rate limits

### CORS Errors
- As funções já incluem headers CORS
- Verifique se está usando o endpoint correto
