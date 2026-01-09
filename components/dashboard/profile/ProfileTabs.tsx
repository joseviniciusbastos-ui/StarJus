import React from 'react';
import { User, Building, Palette } from 'lucide-react';

interface ProfileTabsProps {
    activeTab: 'profile' | 'office' | 'experience';
    setActiveTab: (tab: 'profile' | 'office' | 'experience') => void;
    userRole: string | null;
    onSignOut: () => void;
    onSave: () => void;
    isSaving: boolean;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
    activeTab,
    setActiveTab,
    userRole,
    onSignOut,
    onSave,
    isSaving
}) => {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tighter text-slate-950 dark:text-white uppercase leading-none italic font-serif gold-gradient-text">Personalização Master.</h1>
                <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 w-fit">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-white dark:bg-zinc-800 text-gold-500 shadow-lg' : 'text-zinc-500'}`}
                    >
                        <User size={14} className="inline mr-2" /> Meu Perfil
                    </button>
                    {(userRole === 'owner' || userRole === 'manager') && (
                        <button
                            onClick={() => setActiveTab('office')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'office' ? 'bg-white dark:bg-zinc-800 text-gold-500 shadow-lg' : 'text-zinc-500'}`}
                        >
                            <Building size={14} className="inline mr-2" /> Escritório
                        </button>
                    )}
                    <button
                        onClick={() => setActiveTab('experience')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'experience' ? 'bg-white dark:bg-zinc-800 text-gold-500 shadow-lg' : 'text-zinc-500'}`}
                    >
                        <Palette size={14} className="inline mr-2" /> Experiência
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
                <button onClick={onSignOut} className="flex-1 lg:flex-none px-8 py-5 rounded-[2rem] border border-red-500/20 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all">Sair do Sistema</button>
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex-1 lg:flex-none px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    {isSaving ? 'Sincronizando...' : 'Efetivar Mudanças'}
                </button>
            </div>
        </div>
    );
};
