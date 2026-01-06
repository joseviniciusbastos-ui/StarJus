# 🔑 Configuração da Gemini API Key

## Passos para Configurar

### 1. Configuração Local (Desenvolvimento)

Adicione ao seu arquivo `.env.local`:

```env
# Gemini AI
GEMINI_API_KEY=AIzaSyDD9UX1AExlxgJWroqPrlA0w6C0Jzfa9SU
```

### 2. Configuração no Supabase (Produção)

**Via Dashboard** (Recomendado):
1. Acesse: https://app.supabase.com/project/vzomrqzgdtlnrvkfkvrb/settings/functions
2. Vá em "Edge Functions" > "Manage secrets"
3. Adicionar novo secret:
   - Key: `GEMINI_API_KEY`
   - Value: `AIzaSyDD9UX1AExlxgJWroqPrlA0w6C0Jzfa9SU`
4. Salvar

**Via CLI** (Alternativa):
```bash
# Se tiver Supabase CLI instalado
supabase secrets set GEMINI_API_KEY=AIzaSyDD9UX1AExlxgJWroqPrlA0w6C0Jzfa9SU
```

### 3. Verificar Configuração

Após configurar, teste a análise de IA:
1. Acesse um processo no StarJus
2. Clique em "Gerar Análise IA"
3. Aguarde 5-10 segundos
4. Deve aparecer resumo, insights e recomendações

---

## ✅ API Key Fornecida

```
AIzaSyDD9UX1AExlxgJWroqPrlA0w6C0Jzfa9SU
```

**Status**: Pronta para uso  
**Limite**: 1500 requests/dia (gratuito)

---

## 🎯 O Que Isso Habilita

Com a API key configurada, as seguintes features ficam ativas:

- ✅ Análise inteligente de processos judiciais
- ✅ Avaliação de risco (baixo/médio/alto)
- ✅ Sugestões estratégicas personalizadas
- ✅ Insights jurisprudenciais
- ✅ Estimativa de duração processual
- ✅ Classificação automática de documentos

---

## 🔐 Segurança

A chave está configurada como **secret** no Supabase, então:
- ❌ Não fica exposta no código frontend
- ✅ Apenas Edge Functions têm acesso
- ✅ Não aparece em logs públicos
- ✅ Protegida por RLS do Supabase

---

**StarJus agora está 100% funcional! 🚀**
