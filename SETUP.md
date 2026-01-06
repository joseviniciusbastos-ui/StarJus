# StarJus - Instruções de Configuração Manual

## 📦 Criar Bucket no Supabase (IMPORTANTE)

Como o Supabase CLI não conseguiu criar o bucket automaticamente, siga estes passos:

### Método 1: Via Dashboard (Recomendado - 2 minutos)

1. Acesse: https://app.supabase.com/project/vzomrqzgdtlnrvkfkvrb/storage/buckets
2. Clique em "New Bucket"
3. Configure:
   - **Name**: `client-documents`
   - **Public**: ❌ Desabilitado (privado)
   - **File size limit**: `10485760` (10MB)
   - **Allowed MIME types** (opcional mas recomendado):
     ```
     application/pdf
     image/jpeg
     image/png
     image/gif
     image/webp
     application/msword
     application/vnd.openxmlformats-officedocument.wordprocessingml.document
     ```
4. Clique em "Create bucket"

### Método 2: Via SQL Editor

1. Vá para SQL Editor no Supabase Dashboard
2. Execute este comando:
   ```sql
   INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
   VALUES (
     'client-documents',
     'client-documents',
     false,
     10485760,
     ARRAY[
       'application/pdf',
       'image/jpeg',
       'image/png',
       'image/gif',
       'image/webp',
       'application/msword',
       'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
     ]
   );
   ```

### 3. Aplicar Storage Policies

Após criar o bucket, execute o arquivo `supabase/storage_policies.sql` no SQL Editor.

---

## ✅ Configurações Aplicadas Automaticamente

- ✅ API de câmbio configurada (Open Access, sem necessidade de registar)
- ✅ React Router implementado com rotas profundas
- ✅ Navegação via URL funcional
- ✅ Políticas RLS aplicadas no banco de dados
- ✅ Multi-moedas funcionando

---

## 🧪 Testando a Aplicação

Após criar o bucket, execute:

```bash
npm run dev
```

Teste as seguintes URLs:
- http://localhost:5173/ - Dashboard
- http://localhost:5173/clients - Clientes
- http://localhost:5173/financial - Financial (multi-moedas)
- http://localhost:5173/processes - Processos (com DataJud)

---

## 🔑 API Keys Configuradas

### ExchangeRate API
- **Status**: ✅ Configurado
- **Tipo**: Open Access (sem chave)
- **Limite**: 100 requests/dia
- **Cache**: 24 horas (reduz uso)
- **Endpoint**: `https://open.er-api.com/v6/latest/BRL`

Se precisar de mais requests (1.500/mês), registre manualmente em:
https://www.exchangerate-api.com/sign-up

e atualize em `lib/apis/currency.ts`:
```typescript
private baseUrl = 'https://v6.exchangerate-api.com/v6';
private apiKey = 'SUA_CHAVE_AQUI';
```

---

## 🚨 Troubleshooting

### Erro ao fazer upload de documento
- **Causa**: Bucket não criado
- **Solução**: Seguir instruções acima para criar bucket

### Erro de conversão de moeda
- **Causa**: Limite de 100 requests/dia atingido
- **Solução**: Cache de 24h evita isso. Se persistir, registrar para chave premium.

### Erro de permissão RLS
- **Causa**: RLS não aplicado corretamente
- **Solução**: Executar `supabase/migrations/001_starjus_enhancement.sql` novamente

---

## 📞 Suporte

Qualquer erro, verifique:
1. Console do navegador (F12)
2. Logs do Supabase Dashboard
3. Verificar se bucket existe
