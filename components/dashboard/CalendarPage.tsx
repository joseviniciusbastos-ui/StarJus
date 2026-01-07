import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, MapPin, User, Search } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const CalendarPage: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-950 dark:text-white tracking-tight uppercase">Agenda & <span className="gold-gradient-text">Prazos</span></h1>
                    <p className="text-slate-500 dark:text-zinc-500 font-bold italic">Sincronização estratégica de compromissos judiciais.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex bg-slate-100 dark:bg-zinc-900 rounded-2xl p-1.5 border border-slate-200 dark:border-zinc-800">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all text-slate-600 dark:text-zinc-400">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="px-6 flex items-center justify-center min-w-[200px]">
                            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                            </span>
                        </div>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all text-slate-600 dark:text-zinc-400">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <button className="bg-gold-500 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all">
                        <Plus size={16} /> Novo Compromisso
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        return (
            <div className="grid grid-cols-7 mb-4">
                {days.map((day, index) => (
                    <div key={index} className="text-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-zinc-600">
                            {day}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows: any[] = [];
        let days: any[] = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d");
                const cloneDay = day;
                days.push(
                    <div
                        key={day.toString()}
                        className={`min-h-[140px] p-4 border border-slate-100 dark:border-zinc-900 transition-all cursor-pointer relative group flex flex-col ${!isSameMonth(day, monthStart) ? "bg-slate-50/50 dark:bg-zinc-950/20 opacity-20" :
                                isSameDay(day, new Date()) ? "bg-gold-500/[0.03] border-gold-500/20" : "bg-white dark:bg-zinc-950"
                            } hover:z-10 hover:shadow-2xl hover:border-gold-500/40`}
                        onClick={() => setSelectedDate(cloneDay)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-sm font-black ${isSameDay(day, new Date()) ? "text-gold-500" : "text-slate-400 dark:text-zinc-600"
                                }`}>
                                {formattedDate}
                            </span>
                            {isSameDay(day, new Date()) && (
                                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                            )}
                        </div>

                        <div className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
                            {/* Mock Events */}
                            {isSameDay(day, addDays(monthStart, 5)) && (
                                <div className="px-2 py-1 bg-red-500/10 border-l-2 border-red-500 text-[9px] font-black text-red-500 uppercase truncate">
                                    Audiência de Instrução
                                </div>
                            )}
                            {isSameDay(day, addDays(monthStart, 12)) && (
                                <div className="px-2 py-1 bg-gold-500/10 border-l-2 border-gold-500 text-[9px] font-black text-gold-500 uppercase truncate">
                                    Prazo Contestação
                                </div>
                            )}
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-2 right-2">
                            <Plus size={14} className="text-gold-500" />
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="rounded-[2.5rem] border border-slate-200 dark:border-zinc-900 overflow-hidden shadow-2xl">{rows}</div>;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderHeader()}

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
                <div className="xl:col-span-3">
                    {renderDays()}
                    {renderCells()}
                </div>

                <div className="space-y-8">
                    <div className="premium-card p-8 rounded-[2.5rem]">
                        <h3 className="text-lg font-black text-slate-950 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                            <History size={20} className="text-gold-500" />
                            Próximos Eventos
                        </h3>
                        <div className="space-y-6">
                            {[
                                { title: 'Audiência Instrução', time: '14:30', type: 'Judicial', color: 'text-red-500' },
                                { title: 'Reunião Sócio-Gestor', time: '16:00', type: 'Interno', color: 'text-gold-500' },
                                { title: 'Prazo Limite REsp', time: '23:59', type: 'Prazo', color: 'text-zinc-500' }
                            ].map((evt, i) => (
                                <div key={i} className="flex gap-4 group cursor-pointer">
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs font-black text-slate-900 dark:text-white">{evt.time}</span>
                                        <div className="w-0.5 h-12 bg-slate-100 dark:bg-zinc-900 my-1 group-last:hidden" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h4 className={`text-[10px] font-black uppercase tracking-widest ${evt.color}`}>{evt.type}</h4>
                                        <p className="text-sm font-black text-slate-950 dark:text-zinc-300 group-hover:text-gold-600 transition-colors uppercase tracking-tight">{evt.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gold-500 mb-4">Sincronização</h3>
                        <p className="text-xs text-zinc-400 font-bold italic mb-6">Conecte sua agenda institucional para centralização automática.</p>
                        <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gold-500 transition-all shadow-xl">
                            Conectar Google Calendar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
