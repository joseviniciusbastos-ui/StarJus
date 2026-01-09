import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';

export const CalendarWidget: React.FC = () => {
    const { officeId } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<number[]>([]); // Days with events
    const [nextEvent, setNextEvent] = useState<any>(null);

    useEffect(() => {
        if (!officeId) return;

        const fetchEvents = async () => {
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

            const { data } = await supabase
                .from('tasks')
                .select('due_date, title, id, status')
                .eq('office_id', officeId)
                .gte('due_date', startOfMonth)
                .lte('due_date', endOfMonth);

            if (data) {
                const daysWithEvents = data.map(t => new Date(t.due_date).getDate());
                setEvents(daysWithEvents);

                // Find next event close to today
                const today = new Date();
                const upcoming = data
                    .map(t => ({ ...t, dateObj: new Date(t.due_date) }))
                    .filter(t => t.dateObj >= today)
                    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())[0];

                setNextEvent(upcoming);
            }
        };

        fetchEvents();
    }, [officeId, currentDate]);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const monthLabel = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    const startDayOffset = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    return (
        <div className="flex flex-col h-full bg-[#1A1D21] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
            <h3 className="text-slate-400 font-medium text-sm mb-4">Agenda</h3>

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6 bg-[#242830] rounded-full p-2">
                <button
                    onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                    className="p-1 hover:bg-white/5 rounded-full"
                >
                    <ChevronLeft size={16} className="text-slate-400" />
                </button>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{monthLabel}</span>
                <button
                    onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                    className="p-1 hover:bg-white/5 rounded-full"
                >
                    <ChevronRight size={16} className="text-slate-400" />
                </button>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center mb-6">
                {weekDays.map(d => (
                    <span key={d} className="text-[10px] font-bold text-slate-600">{d}</span>
                ))}
                {Array(startDayOffset).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                {days.map(day => {
                    const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                    const hasEvent = events.includes(day);
                    return (
                        <div key={day} className="flex flex-col items-center justify-center relative cursor-pointer group">
                            <span
                                className={`
                            text-xs font-medium w-7 h-7 flex items-center justify-center rounded-full transition-all
                            ${isToday ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:bg-white/5'}
                        `}
                            >
                                {day}
                            </span>
                            {hasEvent && (
                                <div className="w-1 h-1 rounded-full bg-lime-400 mt-1" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Upcoming Event */}
            {nextEvent ? (
                <div className="mt-auto border-l-2 border-red-500 pl-4 py-1">
                    <span className="text-red-500 text-xs font-bold block mb-1">
                        {new Date(nextEvent.due_date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block truncate">
                        {nextEvent.title}
                    </span>
                    <span className="text-slate-600 text-[10px] uppercase">{nextEvent.status}</span>
                </div>
            ) : (
                <div className="mt-auto pl-4 py-1">
                    <span className="text-slate-600 text-[10px]">Sem próximos eventos.</span>
                </div>
            )}
        </div>
    );
};
