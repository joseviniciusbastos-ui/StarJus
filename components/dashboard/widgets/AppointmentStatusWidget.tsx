import React, { useEffect, useState } from 'react';
import { MoreHorizontal, ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

export const AppointmentStatusWidget: React.FC = () => {
    const { officeId } = useAuth();
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        if (!officeId) return;

        const fetchStatus = async () => {
            const { data: tasks } = await supabase
                .from('tasks')
                .select('status')
                .eq('office_id', officeId);

            if (tasks) {
                const total = tasks.length || 1;
                const counts: { [key: string]: number } = {};
                tasks.forEach(t => {
                    const s = t.status || 'Outros';
                    counts[s] = (counts[s] || 0) + 1;
                });

                // Map to chart format
                const chartData = Object.keys(counts).map(status => {
                    let color = '#94a3b8'; // slate default
                    if (status === 'A Fazer' || status === 'Pendente') color = '#3b82f6'; // blue
                    if (status === 'Concluído' || status === 'Done') color = '#f97316'; // orange (matching image somewhat) or green
                    if (status === 'Em Andamento') color = '#ef4444'; // red

                    return {
                        label: status,
                        value: Math.round((counts[status] / total) * 100),
                        color
                    };
                });

                if (chartData.length === 0) {
                    setData([{ label: 'Sem dados', value: 100, color: '#334155' }]);
                } else {
                    setData(chartData);
                }
            }
        };

        fetchStatus();
    }, [officeId]);

    // SVG Circle config
    const size = 160;
    const strokeWidth = 15;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let currentOffset = 0; // -90 degrees start

    return (
        <div className="flex flex-col h-full bg-[#1A1D21] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-400 font-medium text-sm">Agenda: compromissos por status</h3>
                <div className="flex gap-2">
                    <ImageIcon size={16} className="text-slate-600 hover:text-slate-300 cursor-pointer" />
                    <MoreHorizontal size={16} className="text-slate-600 hover:text-slate-300 cursor-pointer" />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-40 h-40">
                    <svg width={size} height={size} className="transform -rotate-90">
                        {data.map((item, idx) => {
                            const strokeDasharray = `${(item.value / 100) * circumference} ${circumference}`;
                            const strokeDashoffset = -currentOffset;
                            currentOffset += (item.value / 100) * circumference;

                            return (
                                <circle
                                    key={idx}
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    fill="transparent"
                                    stroke={item.color}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-[#242830] flex items-center justify-center shadow-inner">
                            <span className="text-2xl font-black text-white">100%</span>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-1 gap-2 mt-8 w-full px-4">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-[10px] uppercase text-slate-400 font-bold truncate max-w-[100px]">{item.label}</span>
                            </div>
                            <span className="text-xs font-bold text-white">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
