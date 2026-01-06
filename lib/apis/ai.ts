import { supabase } from '../supabase';

export interface AIAnalysis {
    summary: string;
    riskLevel: 'low' | 'medium' | 'high';
    suggestedActions: string[];
    insights: string[];
    nextSteps: string[];
    estimatedDuration: string;
}

/**
 * Client for AI-powered features via Supabase Edge Functions
 */
class AIClient {
    private functionsUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

    /**
     * Analyze a judicial process using AI
     */
    async analyzeProcess(params: {
        processId: string;
        processNumber: string;
        processTitle: string;
        court: string;
        movements?: Array<{ date: string; description: string }>;
    }): Promise<AIAnalysis> {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            const response = await fetch(`${this.functionsUrl}/process-ai-analysis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to analyze process');
            }

            const result = await response.json();
            return result.analysis;
        } catch (error) {
            console.error('Error analyzing process:', error);
            throw error;
        }
    }

    /**
     * Get cached AI analysis for a process
     */
    async getProcessAnalysis(processId: number): Promise<AIAnalysis | null> {
        try {
            const { data, error } = await supabase
                .from('process_ai_analysis')
                .select('analysis_data, analyzed_at')
                .eq('process_id', processId)
                .order('analyzed_at', { ascending: false })
                .limit(1)
                .single();

            if (error || !data) return null;

            // Check if analysis is recent (less than 7 days old)
            const analysisDate = new Date(data.analyzed_at);
            const daysSince = (Date.now() - analysisDate.getTime()) / (1000 * 60 * 60 * 24);

            if (daysSince > 7) {
                // Analysis is stale, return null to trigger new analysis
                return null;
            }

            return data.analysis_data as AIAnalysis;
        } catch (error) {
            console.error('Error getting process analysis:', error);
            return null;
        }
    }

    /**
     * Categorize a document using AI
     */
    async categorizeDocument(file: {
        name: string;
        type: string;
        preview?: string;
    }): Promise<{
        category: string;
        confidence: number;
        subcategory?: string;
        tags: string[];
        suggestedName: string;
    }> {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            const response = await fetch(`${this.functionsUrl}/document-categorization`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({
                    file: {
                        name: file.name,
                        preview: file.preview,
                    },
                    fileType: file.type,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to categorize document');
            }

            const result = await response.json();
            return result.categorization;
        } catch (error) {
            console.error('Error categorizing document:', error);
            throw error;
        }
    }

    /**
     * Generate smart deadline alerts
     */
    async checkDeadlineAlerts(officeId: number): Promise<Array<{
        processId: number;
        processNumber: string;
        alert: string;
        daysRemaining: number;
        priority: 'high' | 'medium' | 'low';
    }>> {
        try {
            // This would call an Edge Function that analyzes processes
            // and generates intelligent deadline alerts
            const { data: { session } } = await supabase.auth.getSession();

            const response = await fetch(`${this.functionsUrl}/deadline-alerts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({ officeId }),
            });

            if (!response.ok) {
                return [];
            }

            const result = await response.json();
            return result.alerts || [];
        } catch (error) {
            console.error('Error checking deadline alerts:', error);
            return [];
        }
    }
}

export const aiClient = new AIClient();
