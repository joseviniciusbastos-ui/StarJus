import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

serve(async (req) => {
    try {
        if (req.method === 'OPTIONS') {
            return new Response('ok', {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
                },
            });
        }

        const { file, fileType } = await req.json();

        if (!file || !fileType) {
            return new Response(
                JSON.stringify({ error: 'file and fileType are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Build categorization prompt
        const prompt = `
Você é um assistente de classificação de documentos jurídicos brasileiros.

Analise o seguinte documento e classifique-o de acordo com estas categorias:

**Categorias Principais**:
1. Petição Inicial
2. Contestação
3. Sentença
4. Acórdão
5. Contrato
6. Procuração
7. Documento Pessoal (RG, CPF, CNH)
8. Comprovante (Residência, Renda)
9. Certidão
10. Outro

**Tipo de Arquivo**: ${fileType}
**Nome**: ${file.name || 'Sem nome'}

${file.preview ? `**Conteúdo Parcial**: ${file.preview}` : ''}

Responda APENAS com um JSON neste formato:
{
  "category": "nome_da_categoria",
  "confidence": 0.95,
  "subcategory": "subcategoria_específica_se_houver",
  "tags": ["tag1", "tag2"],
  "suggestedName": "nome_sugerido_para_arquivo.pdf"
}
`;

        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.3, // Lower temperature for consistent categorization
                        maxOutputTokens: 512,
                    },
                }),
            }
        );

        if (!geminiResponse.ok) {
            throw new Error('Failed to categorize document');
        }

        const geminiData = await geminiResponse.json();
        const resultText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

        const jsonMatch = resultText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to extract categorization result');
        }

        const categorization = JSON.parse(jsonMatch[0]);

        return new Response(
            JSON.stringify({
                success: true,
                categorization,
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );

    } catch (error) {
        console.error('Error in document-categorization:', error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
});
