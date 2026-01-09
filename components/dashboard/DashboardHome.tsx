import React from 'react';
import { useAuth } from '../../lib/AuthContext';
import { NoticeWidget } from './widgets/NoticeWidget';
import { ProcessMovementsWidget } from './widgets/ProcessMovementsWidget';
import { ProcessStatusChart } from './widgets/ProcessStatusChart';
import { CalendarWidget } from './widgets/CalendarWidget';
import { AppointmentTypeWidget } from './widgets/AppointmentTypeWidget';
import { AppointmentStatusWidget } from './widgets/AppointmentStatusWidget';
import { Bell, Cloud, Moon, User } from 'lucide-react';

export const DashboardHome: React.FC = () => {
    const { session } = useAuth();
    // Safe access to user metadata with fallbacks
    const userMetadata = session?.user?.user_metadata || {};
    const userName = userMetadata.full_name || session?.user?.email?.split('@')[0] || 'Gestor';

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-normal text-slate-400">Inicio</h1>
                </div>

                {/* Top Right Icons matching image */}
                <div className="flex items-center gap-4 text-slate-400">
                    <Moon size={18} className="cursor-pointer hover:text-white" />
                    <div className="w-px h-4 bg-slate-700" />
                    <span className="cursor-pointer hover:text-white"><Cloud size={18} /></span>
                    <div className="relative cursor-pointer hover:text-white">
                        <Bell size={18} />
                        <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1A1D21]" />
                    </div>
                    <div className="w-px h-4 bg-slate-700" />
                    <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                        <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center overflow-hidden">
                            <User size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 auto-rows-[380px]">
                {/* Top Row */}
                <div className="xl:col-span-1">
                    <NoticeWidget />
                </div>
                <div className="xl:col-span-1">
                    <ProcessMovementsWidget />
                </div>
                <div className="xl:col-span-1">
                    <ProcessStatusChart />
                </div>
                <div className="xl:col-span-1">
                    <CalendarWidget />
                </div>

                {/* Bottom Row */}
                <div className="xl:col-span-3">
                    <AppointmentTypeWidget />
                </div>
                <div className="xl:col-span-1">
                    <AppointmentStatusWidget />
                </div>
            </div>
        </div>
    );
};
