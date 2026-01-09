import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { Save, User, Settings, Shield, Building } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { UserManagementTab } from './tabs/UserManagementTab';

export const OfficeSettingsPage: React.FC = () => {
    const { session, userRole, officeName, officeId } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const userMetadata = session?.user?.user_metadata;
    const [newOfficeName, setNewOfficeName] = useState(officeName || '');
    const [loading, setLoading] = useState(false);

    // Simple access control check
    if (!['owner', 'manager', 'admin'].includes(userMetadata?.role || userRole || '')) {
        return (
            <div className="flex items-center justify-center h-[50vh] flex-col gap-4">
                <Shield size={48} className="text-red-500" />
                <h2 className="text-xl font-bold text-white">Acesso Negado</h2>
                <p className="text-slate-400">Você não tem permissão para acessar as configurações do escritório.</p>
            </div>
        );
    }

    const handleSave = async () => {
        if (!officeId) return;
        setLoading(true);

        try {
            const { error } = await supabase
                .from('offices')
                .update({ name: newOfficeName })
                .eq('id', officeId);

            if (error) throw error;
            toast.success('Configurações salvas com sucesso!');
        } catch (err) {
            console.error(err);
            toast.error('Erro ao salvar configurações.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-950 dark:text-white mb-2">Configurações do Escritório</h1>
                <p className="text-slate-500">Gerencie as informações e permissões do seu ambiente jurídico.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-left
                ${activeTab === 'general' ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                    >
                        <Building size={18} />
                        <span>Geral</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-left
                ${activeTab === 'users' ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                    >
                        <User size={18} />
                        <span>Usuários & Permissões</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('customization')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-left
                ${activeTab === 'customization' ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                    >
                        <Settings size={18} />
                        <span>Customização</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 bg-[#1A1D21] rounded-3xl p-8 border border-white/5">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Building size={20} className="text-gold-500" />
                                Informações do Escritório
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nome do Escritório</label>
                                    <input
                                        type="text"
                                        value={newOfficeName}
                                        onChange={(e) => setNewOfficeName(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">CNPJ</label>
                                    <input
                                        type="text"
                                        placeholder="00.000.000/0000-00"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Endereço</label>
                                    <input
                                        type="text"
                                        placeholder="Rua..."
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <User size={20} className="text-gold-500" />
                                Usuários e Acessos
                            </h2>
                            <UserManagementTab />
                        </div>
                    )}

                    {activeTab === 'customization' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Settings size={20} className="text-gold-500" />
                                Aparência e Sistema
                            </h2>
                            <p className="text-sm text-slate-500">Opções de tema e customização em breve.</p>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-black px-6 py-3 rounded-xl transition-all disabled:opacity-50"
                        >
                            <Save size={18} />
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
