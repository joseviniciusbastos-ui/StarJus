import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

interface ProcessAnalysisRequest {
    processId: string;
    processNumber: string;
    processTitle: string;
    court: string;
    movements?: Array<{
        date: string;
        description: string;
    }>;
}

interface ProcessAnalysisResponse {
    summary: string;
    riskLevel: 'low' | 'medium' | 'high';
    suggestedActions: string[];
    insights: string[];
    nextSteps: string[];
    estimatedDuration: string;
}

serve(async (req) => {
    try {
        // CORS headers
        if (req.method === 'OPTIONS') {
            return new Response('ok', {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
                },
            });
        }

        const { processId, processNumber, processTitle, court, movements } = await req.json() as ProcessAnalysisRequest;

        if (!processId || !processNumber) {
            return new Response(
                JSON.stringify({ error: 'processId and processNumber are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Create Supabase client
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

        // Build prompt for Gemini
        const prompt = `
Você é um assistente jurídico especializado em análise de processos judiciais brasileiros.

Analise o seguinte processo e forneça uma análise detalhada em JSON:

**Número do Processo**: ${processNumber}
**Título**: ${processTitle}
**Tribunal**: ${court}

${movements && movements.length > 0 ? `
**Últimas Movimentações**:
${movements.map(m => `- ${m.date}: ${m.description}`).join('\n')}
` : ''}

Forneça sua análise no seguinte formato JSON (APENAS JSON, sem markdown):
{
  "summary": "Resumo executivo do processo (máximo 200 palavras)",
  "riskLevel": "low|medium|high",
  "suggestedActions": ["ação sugerida 1", "ação sugerida 2"],
  "insights": ["insight importante 1", "insight importante 2"],
  "nextSteps": ["próximo passo recomendado 1", "próximo passo 2"],
  "estimatedDuration": "estimativa de duração (ex: '6-12 meses')"
}

Considere:
- Prazos processuais urgentes
- Riscos jurídicos
- Oportunidades estratégicas
- Jurisprudência relevante
- Complexidade do caso
`;

        // Call Gemini API
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    },
                }),
            }
        );

        if (!geminiResponse.ok) {
            console.error('Gemini API error:', await geminiResponse.text());
            throw new Error('Failed to analyze process with Gemini');
        }

        const geminiData = await geminiResponse.json();
        const analysisText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse JSON from response (removing markdown if present)
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to extract JSON from Gemini response');
        }

        const analysis: ProcessAnalysisResponse = JSON.parse(jsonMatch[0]);

        // Store analysis in database
        await supabase
            .from('process_ai_analysis')
            .upsert({
                process_id: parseInt(processId),
                analysis_data: analysis,
                analyzed_at: new Date().toISOString(),
                model_version: 'gemini-2.0-flash-exp',
            });

        return new Response(
            JSON.stringify({
                success: true,
                analysis,
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
        console.error('Error in process-ai-analysis:', error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : 'Unknown error',
            }),
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
