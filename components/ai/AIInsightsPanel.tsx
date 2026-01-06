import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Clock, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { aiClient, type AIAnalysis } from '../../lib/apis/ai';
import toast from 'react-hot-toast';

interface AIInsightsPanelProps {
    processId: number;
    processNumber: string;
    processTitle: string;
    court: string;
    movements?: Array<{ date: string; description: string }>;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
    processId,
    processNumber,
    processTitle,
    court,
    movements = [],
}) => {
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadAnalysis();
    }, [processId]);

    const loadAnalysis = async () => {
        try {
            setLoading(true);
            // Try to get cached analysis first
            const cached = await aiClient.getProcessAnalysis(processId);

            if (cached) {
                setAnalysis(cached);
            } else {
                // Generate new analysis
                await generateAnalysis();
            }
        } catch (err) {
            console.error('Error loading analysis:', err);
            setError(err instanceof Error ? err.message : 'Failed to load analysis');
        } finally {
            setLoading(false);
        }
    };

    const generateAnalysis = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await aiClient.analyzeProcess({
                processId: processId.toString(),
                processNumber,
                processTitle,
                court,
                movements: movements.slice(0, 5), // Last 5 movements
            });

            setAnalysis(result);
            toast.success('Análise IA concluída!');
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to generate analysis';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'high': return 'text-red-600 bg-red-500/10 border-red-500/20';
            case 'medium': return 'text-orange-600 bg-orange-500/10 border-orange-500/20';
            case 'low': return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
            default: return 'text-slate-600 bg-slate-500/10 border-slate-500/20';
        }
    };

    const getRiskIcon = (level: string) => {
        switch (level) {
            case 'high': return <AlertTriangle size={20} />;
            case 'medium': return <TrendingUp size={20} />;
            case 'low': return <CheckCircle size={20} />;
            default: return <Brain size={20} />;
        }
    };

    if (loading) {
        return (
            <div className="premium-card p-12 rounded-[3rem] animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-gold-500/10 rounded-2xl">
                        <Sparkles className="text-gold-600 animate-spin" size={28} />
                    </div>
                    <div>
                        <div className="h-6 w-48 bg-slate-200 dark:bg-zinc-800 rounded mb-2"></div>
                        <div className="h-4 w-72 bg-slate-100 dark:bg-zinc-900 rounded"></div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="h-20 bg-slate-100 dark:bg-zinc-900 rounded-2xl"></div>
                    <div className="h-20 bg-slate-100 dark:bg-zinc-900 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (error && !analysis) {
        return (
            <div className="premium-card p-12 rounded-[3rem] border-2 border-red-500/20">
                <div className="text-center space-y-4">
                    <AlertTriangle className="mx-auto text-red-500" size={48} />
                    <h3 className="text-xl font-black text-slate-950 dark:text-white">
                        Erro ao Gerar Análise IA
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-zinc-500">{error}</p>
                    <button
                        onClick={generateAnalysis}
                        className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:scale-105"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="premium-card p-12 rounded-[3rem]">
                <div className="text-center space-y-6">
                    <div className="p-6 bg-gold-500/10 rounded-3xl border border-gold-500/20 w-fit mx-auto">
                        <Brain className="text-gold-600" size={48} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-950 dark:text-white mb-2">
                            Insights Preditivos Alpha
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-zinc-500 mb-6">
                            Gere uma análise inteligente deste processo com IA avançada
                        </p>
                        <button
                            onClick={generateAnalysis}
                            className="bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-3xl transition-all hover:scale-105 flex items-center gap-3 mx-auto"
                        >
                            <Sparkles size={20} />
                            Gerar Análise IA
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="premium-card p-8 rounded-[2.5rem] flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-gold-500/10 rounded-2xl border border-gold-500/20">
                        <Brain className="text-gold-600" size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-950 dark:text-white leading-none mb-1">
                            Análise IA Alpha
                        </h3>
                        <p className="text-xs font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">
                            Powered by Gemini 2.0
                        </p>
                    </div>
                </div>
                <button
                    onClick={generateAnalysis}
                    disabled={loading}
                    className="px-6 py-3 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-zinc-400 hover:text-gold-600 hover:border-gold-500 transition-all disabled:opacity-50"
                >
                    Atualizar
                </button>
            </div>

            {/* Risk Level */}
            <div className={`premium-card p-8 rounded-[2.5rem] border-2 ${getRiskColor(analysis.riskLevel)}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {getRiskIcon(analysis.riskLevel)}
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">
                                Nível de Risco
                            </p>
                            <p className="text-xl font-black uppercase">
                                {analysis.riskLevel === 'high' ? 'Alto' :
                                    analysis.riskLevel === 'medium' ? 'Médio' : 'Baixo'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                        <Clock size={16} />
                        {analysis.estimatedDuration}
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="premium-card p-10 rounded-[3rem]">
                <h4 className="text-sm font-black text-gold-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Lightbulb size={18} />
                    Resumo Executivo
                </h4>
                <p className="text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
                    {analysis.summary}
                </p>
            </div>

            {/* Insights */}
            {analysis.insights && analysis.insights.length > 0 && (
                <div className="premium-card p-10 rounded-[3rem]">
                    <h4 className="text-sm font-black text-gold-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <TrendingUp size={18} />
                        Insights Estratégicos
                    </h4>
                    <div className="space-y-3">
                        {analysis.insights.map((insight, index) => (
                            <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
                                <div className="p-1.5 bg-gold-500 rounded-full mt-1">
                                    <ArrowRight className="text-black" size={12} />
                                </div>
                                <p className="text-sm text-slate-700 dark:text-zinc-300 font-medium flex-1">
                                    {insight}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggested Actions */}
            {analysis.suggestedActions && analysis.suggestedActions.length > 0 && (
                <div className="premium-card p-10 rounded-[3rem]">
                    <h4 className="text-sm font-black text-gold-600 uppercase tracking-widest mb-6">
                        Ações Sugeridas
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysis.suggestedActions.map((action, index) => (
                            <div
                                key={index}
                                className="p-6 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-gold-500 transition-all group cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gold-500 text-black font-black text-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                                        {index + 1}
                                    </div>
                                    <p className="text-sm text-slate-950 dark:text-white font-bold flex-1">
                                        {action}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Next Steps */}
            {analysis.nextSteps && analysis.nextSteps.length > 0 && (
                <div className="premium-card p-10 rounded-[3rem] bg-gradient-to-br from-gold-50 to-amber-50 dark:from-zinc-950 dark:to-zinc-900 border-gold-500/20">
                    <h4 className="text-sm font-black text-gold-600 uppercase tracking-widest mb-6">
                        Próximos Passos Recomendados
                    </h4>
                    <div className="space-y-3">
                        {analysis.nextSteps.map((step, index) => (
                            <div key={index} className="flex items-center gap-4 p-5 bg-white dark:bg-zinc-950 rounded-2xl border border-gold-500/20">
                                <CheckCircle className="text-gold-600 shrink-0" size={20} />
                                <p className="text-sm text-slate-950 dark:text-white font-bold">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
