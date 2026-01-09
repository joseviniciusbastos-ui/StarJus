import React, { useEffect, useState } from 'react';
import { MoreHorizontal, ImageIcon } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';

export const ProcessStatusChart: React.FC = () => {
    const { officeId } = useAuth();
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        if (!officeId) return;

        const fetchStatus = async () => {
            const { data: processes } = await supabase
                .from('processes')
                .select('status')
                .eq('office_id', officeId);

            if (processes) {
                // Count occurrences
                const counts: { [key: string]: number } = {};
                processes.forEach(p => {
                    const s = p.status || 'Unknown';
                    counts[s] = (counts[s] || 0) + 1;
                });

                // Format for chart
                const chartData = Object.keys(counts).map(status => {
                    let color = 'bg-slate-400';
                    if (status === 'Active') color = 'bg-yellow-400';
                    if (status === 'Suspended') color = 'bg-orange-400';
                    if (status === 'Done') color = 'bg-lime-400';
                    if (status === 'Archived') color = 'bg-slate-400';

                    return {
                        status,
                        value: counts[status],
                        color
                    };
                });

                // If empty, put placeholders
                if (chartData.length === 0) {
                    setData([
                        { status: 'Active', value: 0, color: 'bg-yellow-400' },
                    ]);
                } else {
                    setData(chartData);
                }
            }
        };

        fetchStatus();
    }, [officeId]);

    const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value)) : 10;

    return (
        <div className="flex flex-col h-full bg-[#1A1D21] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-400 font-medium text-sm">Processos por status</h3>
                <div className="flex gap-2">
                    <ImageIcon size={16} className="text-slate-600 hover:text-slate-300 cursor-pointer" />
                    <MoreHorizontal size={16} className="text-slate-600 hover:text-slate-300 cursor-pointer" />
                </div>
            </div>

            <div className="flex-1 flex items-end justify-center gap-3 pb-8">
                {data.map((item, index) => {
                    const heightPercentage = Math.max(10, (item.value / maxValue) * 100);
                    return (
                        <div key={index} className="flex flex-col items-center gap-2 group">
                            <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-6">
                                {item.value}
                            </span>
                            <div
                                className={`w-8 rounded-t-lg ${item.color} hover:opacity-90 transition-all`}
                                style={{ height: `${heightPercentage}%` }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-[10px] uppercase text-slate-500 font-semibold truncate max-w-[80px]">{item.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
