/**
 * Cliente para API de Conversão de Moedas
 * Usando ExchangeRate Open Access API (gratuito, sem necessidade de registro)
 * Limitação: 100 requests/dia (suficiente com cache de 24h)
 */

export type Currency = 'BRL' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'ARS';

interface ExchangeRates {
    [key: string]: number;
}

interface ExchangeRateResponse {
    result: string;
    base_code: string;
    conversion_rates: ExchangeRates;
    time_last_update_unix: number;
}

class CurrencyClient {
    // Open Access API - sem necessidade de chave
    private baseUrl = 'https://open.er-api.com/v6';
    private cacheKey = 'starjus_exchange_rates';
    private cacheDuration = 24 * 60 * 60 * 1000; // 24 horas

    /**
     * Obtém taxas de câmbio (com cache local)
     */
    async getExchangeRates(baseCurrency: Currency = 'BRL'): Promise<ExchangeRates> {
        try {
            // Tentar cache primeiro
            const cached = this.getCachedRates(baseCurrency);
            if (cached) return cached;

            // Buscar da Open Access API (sem necessidade de key)
            const response = await fetch(
                `${this.baseUrl}/latest/${baseCurrency}`
            );

            if (!response.ok) {
                throw new Error('Erro ao buscar taxas de câmbio');
            }

            const data: ExchangeRateResponse = await response.json();

            if (data.result !== 'success') {
                throw new Error('Resposta inválida da API de câmbio');
            }

            // Salvar no cache
            this.cacheRates(baseCurrency, data.conversion_rates, data.time_last_update_unix);

            return data.conversion_rates;
        } catch (error) {
            console.error('Erro ao obter taxas de câmbio:', error);

            // Fallback para taxas estáticas em caso de erro
            return this.getFallbackRates(baseCurrency);
        }
    }

    /**
     * Converte valor entre moedas
     */
    async convert(amount: number, from: Currency, to: Currency): Promise<number> {
        if (from === to) return amount;

        const rates = await this.getExchangeRates(from);
        const rate = rates[to];

        if (!rate) {
            throw new Error(`Taxa de câmbio não encontrada para ${to}`);
        }

        return amount * rate;
    }

    /**
     * Converte para BRL (moeda base do sistema)
     */
    async convertToBRL(amount: number, from: Currency): Promise<number> {
        return this.convert(amount, from, 'BRL');
    }

    /**
     * Formata valor monetário
     */
    formatCurrency(amount: number, currency: Currency): string {
        const locale = currency === 'BRL' ? 'pt-BR' : 'en-US';

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
        }).format(amount);
    }

    /**
     * Cache local usando localStorage
     */
    private getCachedRates(baseCurrency: Currency): ExchangeRates | null {
        try {
            const cached = localStorage.getItem(`${this.cacheKey}_${baseCurrency}`);
            if (!cached) return null;

            const { rates, timestamp } = JSON.parse(cached);
            const now = Date.now();

            // Verificar se cache ainda é válido
            if (now - timestamp < this.cacheDuration) {
                return rates;
            }

            return null;
        } catch {
            return null;
        }
    }

    private cacheRates(baseCurrency: Currency, rates: ExchangeRates, unixTimestamp: number) {
        try {
            localStorage.setItem(
                `${this.cacheKey}_${baseCurrency}`,
                JSON.stringify({
                    rates,
                    timestamp: unixTimestamp * 1000, // Converter para milliseconds
                })
            );
        } catch (error) {
            console.warn('Não foi possível salvar cache de taxas:', error);
        }
    }

    /**
     * Taxas de fallback caso a API falhe
     */
    private getFallbackRates(baseCurrency: Currency): ExchangeRates {
        // Taxas aproximadas (atualizar periodicamente)
        const fallbackRates: Record<Currency, ExchangeRates> = {
            BRL: {
                USD: 0.20,
                EUR: 0.18,
                GBP: 0.16,
                JPY: 28.50,
                CNY: 1.40,
                ARS: 175.00,
                BRL: 1.00,
            },
            USD: {
                BRL: 5.00,
                EUR: 0.92,
                GBP: 0.79,
                JPY: 145.00,
                CNY: 7.20,
                ARS: 900.00,
                USD: 1.00,
            },
            EUR: {
                BRL: 5.50,
                USD: 1.09,
                GBP: 0.86,
                JPY: 158.00,
                CNY: 7.85,
                ARS: 980.00,
                EUR: 1.00,
            },
            GBP: {
                BRL: 6.40,
                USD: 1.27,
                EUR: 1.16,
                JPY: 184.00,
                CNY: 9.15,
                ARS: 1140.00,
                GBP: 1.00,
            },
            JPY: {
                BRL: 0.035,
                USD: 0.0069,
                EUR: 0.0063,
                GBP: 0.0054,
                CNY: 0.050,
                ARS: 6.20,
                JPY: 1.00,
            },
            CNY: {
                BRL: 0.70,
                USD: 0.14,
                EUR: 0.13,
                GBP: 0.11,
                JPY: 20.00,
                ARS: 125.00,
                CNY: 1.00,
            },
            ARS: {
                BRL: 0.0057,
                USD: 0.0011,
                EUR: 0.0010,
                GBP: 0.00088,
                JPY: 0.16,
                CNY: 0.008,
                ARS: 1.00,
            },
        };

        console.warn('Usando taxas de câmbio de fallback');
        return fallbackRates[baseCurrency];
    }
}

export const currencyClient = new CurrencyClient();
