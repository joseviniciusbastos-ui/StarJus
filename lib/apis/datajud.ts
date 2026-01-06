import { z } from 'zod';

// Schemas de validação para DataJud
export const ProcessoSchema = z.object({
    id: z.string(),
    numeroProcesso: z.string(),
    classe: z.object({
        codigo: z.number(),
        nome: z.string(),
    }).optional(),
    sistema: z.object({
        codigo: z.number(),
        nome: z.string(),
    }).optional(),
    formato: z.object({
        codigo: z.number(),
        nome: z.string(),
    }).optional(),
    tribunal: z.string().optional(),
    dataAjuizamento: z.string().optional(),
    movimentos: z.array(z.object({
        identificadorMovimento: z.string(),
        dataHora: z.string(),
        nome: z.string().optional(),
        complementoNacional: z.array(z.object({
            nome: z.string(),
            valor: z.string().optional(),
        })).optional(),
    })).optional(),
    assuntos: z.array(z.object({
        codigo: z.number(),
        nome: z.string(),
    })).optional(),
});

export type ProcessoDataJud = z.infer<typeof ProcessoSchema>;

/**
 * Cliente para API Pública do DataJud (CNJ)
 * Documentação: https://datajud-wiki.cnj.jus.br/api-publica/
 */
class DataJudClient {
    private baseUrl = 'https://api-publica.datajud.cnj.jus.br/api_publica_';

    /**
     * Consulta processo por número CNJ
     * @param numeroProcesso - Número do processo no formato CNJ (NNNNNNN-DD.AAAA.J.TR.OOOO)
     * @returns Dados do processo
     */
    async consultarProcesso(numeroProcesso: string): Promise<ProcessoDataJud | null> {
        try {
            // Remove caracteres não numéricos
            const numeroLimpo = numeroProcesso.replace(/\D/g, '');

            if (numeroLimpo.length !== 20) {
                throw new Error('Número de processo inválido. Deve conter 20 dígitos.');
            }

            const response = await fetch(
                `${this.baseUrl}processos/${numeroLimpo}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                if (response.status === 404) {
                    return null; // Processo não encontrado
                }
                throw new Error(`Erro ao consultar DataJud: ${response.statusText}`);
            }

            const data = await response.json();
            return ProcessoSchema.parse(data);
        } catch (error) {
            console.error('Erro ao consultar DataJud:', error);
            throw error;
        }
    }

    /**
     * Busca processos por parâmetros (requer autenticação em produção)
     * Nota: Esta é uma implementação de exemplo. A API pública pode ter limitações.
     */
    async buscarProcessos(params: {
        tribunal?: string;
        classe?: number;
        dataInicio?: string;
        dataFim?: string;
    }): Promise<ProcessoDataJud[]> {
        try {
            const queryParams = new URLSearchParams();
            if (params.tribunal) queryParams.append('tribunal', params.tribunal);
            if (params.classe) queryParams.append('classe', params.classe.toString());
            if (params.dataInicio) queryParams.append('dataInicio', params.dataInicio);
            if (params.dataFim) queryParams.append('dataFim', params.dataFim);

            const response = await fetch(
                `${this.baseUrl}processos?${queryParams.toString()}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Erro ao buscar processos: ${response.statusText}`);
            }

            const data = await response.json();
            return z.array(ProcessoSchema).parse(data);
        } catch (error) {
            console.error('Erro ao buscar processos DataJud:', error);
            return [];
        }
    }

    /**
     * Formata número de processo para exibição
     */
    formatarNumeroProcesso(numero: string): string {
        const limpo = numero.replace(/\D/g, '');
        if (limpo.length !== 20) return numero;

        return `${limpo.substring(0, 7)}-${limpo.substring(7, 9)}.${limpo.substring(9, 13)}.${limpo.substring(13, 14)}.${limpo.substring(14, 16)}.${limpo.substring(16, 20)}`;
    }
}

export const dataJudClient = new DataJudClient();
