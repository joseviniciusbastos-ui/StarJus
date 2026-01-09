import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';

export const AppointmentTypeWidget: React.FC = () => {
    const { officeId } = useAuth();
    const [stats, setStats] = useState<any[]>([]);

    useEffect(() => {
        if (!officeId) return;

        const fetchStats = async () => {
            // Fetch all tasks
            const { data: tasks } = await supabase
                .from('tasks')
                .select('tag, status, due_date')
                .eq('office_id', officeId);

            if (tasks) {
                const categories = {
                    'Compromissos': { value: 0, overdue: 0, today: 0, color: 'text-slate-200', ring: 'border-slate-600' },
                    'Prazo': { value: 0, overdue: 0, today: 0, color: 'text-red-500', ring: 'border-red-500' },
                    'Audiência': { value: 0, overdue: 0, today: 0, color: 'text-purple-400', ring: 'border-purple-400' },
                    'Contestação': { value: 0, overdue: 0, today: 0, color: 'text-blue-500', ring: 'border-blue-500' }
                };

                const todayStr = new Date().toISOString().split('T')[0];

                tasks.forEach(t => {
                    // Determine category based on tag or default to Compromissos
                    let catKey = 'Compromissos';
                    const tagLower = (t.tag || '').toLowerCase();

                    if (tagLower.includes('prazo')) catKey = 'Prazo';
                    else if (tagLower.includes('audiência') || tagLower.includes('audiencia')) catKey = 'Audiência';
                    else if (tagLower.includes('contest')) catKey = 'Contestação';

                    // Update counts
                    categories[catKey].value += 1;

                    const tDate = t.due_date ? t.due_date.split('T')[0] : '';
                    if (tDate === todayStr) categories[catKey].today += 1;
                    if (tDate < todayStr && t.status !== 'Concluído') categories[catKey].overdue += 1;
                });

                setStats(Object.keys(categories).map(key => ({
                    label: key,
                    sub: 'Total',
                    ...categories[key]
                })));
            }
        };

        fetchStats();
    }, [officeId]);

    return (
        <div className="flex flex-col h-full bg-[#1A1D21] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-slate-400 font-medium text-sm">Agenda: compromissos/atividades por tipo</h3>
                <ChevronDown size={16} className="text-slate-600" />
            </div>

            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4 custom-scrollbar">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col items-center min-w-[80px]">
                        <div className={`w-20 h-20 rounded-full border-2 ${stat.ring} flex flex-col items-center justify-center bg-[#242830]`}>
                            <span className={`text-lg font-black ${stat.color}`}>{stat.value}</span>
                            <span className="text-[9px] text-slate-500 uppercase font-bold">{stat.sub}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold mt-3 text-center">{stat.label}</span>

                        <div className="mt-4 flex flex-col items-center">
                            <span className={`text-sm font-bold ${stat.color}`}>
                                {stat.overdue}
                            </span>
                            <span className="text-[9px] text-slate-600 uppercase">Atrasados</span>
                        </div>

                        <div className="mt-2 flex flex-col items-center">
                            <span className={`text-md font-bold text-slate-300`}>
                                {stat.today}
                            </span>
                            <span className="text-[9px] text-slate-600 uppercase">Hoje</span>
                        </div>
                    </div>
                ))}
                {stats.length === 0 && (
                    <div className="w-full text-center text-slate-500 text-xs py-4">Carregando métricas...</div>
                )}
            </div>
        </div>
    );
};
