
import React, { useState, useEffect } from 'react';
import { User, Building, Users, Mail, Shield, UserPlus, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface OfficeMember {
    user_id: string;
    role: string;
    profiles: {
        full_name: string;
        email: string;
    };
}

export const ProfilePage: React.FC = () => {
    const { session, officeId } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [members, setMembers] = useState<OfficeMember[]>([]);
    const [officeName, setOfficeName] = useState('');
    const [fullName, setFullName] = useState('');

    const userEmail = session?.user?.email || '';
    const avatarPlaceholder = "/C:/Users/jose2/.gemini/antigravity/brain/590fc8b5-ab18-46ad-b159-1ea707ca5642/lawyer_profile_placeholder_1767738381031.png";

    useEffect(() => {
        if (officeId) {
            fetchProfileData();
            fetchOfficeMembers();
        }
    }, [officeId]);

    const fetchProfileData = async () => {
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', session?.user?.id)
            .single();

        if (profile) setFullName(profile.full_name || '');

        const { data: office } = await supabase
            .from('offices')
            .select('name')
            .eq('id', officeId)
            .single();

        if (office) setOfficeName(office.name);
        setLoading(false);
    };

    const fetchOfficeMembers = async () => {
        // Note: This requires a join or separate profile fetch depending on schema
        const { data } = await supabase
            .from('office_members')
            .select(`
        user_id,
        role,
        profiles:user_id (
          full_name
        )
      `)
            .eq('office_id', officeId);

        if (data) setMembers(data as any);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: session?.user?.id,
                full_name: fullName,
                office_id: officeId
            });

        if (error) {
            toast.error('Erro ao atualizar perfil');
        } else {
            toast.success('Perfil atualizado com sucesso');
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white uppercase leading-none italic font-serif gold-gradient-text">Configurações de Perfil.</h1>
                <p className="text-slate-500 dark:text-zinc-500 font-black uppercase text-[10px] tracking-[0.4em]">Gerenciamento de Identidade e Governança</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* User Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="premium-card p-10 rounded-[3rem] text-center space-y-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent pointer-events-none" />
                        <div className="relative mx-auto w-40 h-40 rounded-[2.5rem] border-4 border-gold-500 overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500">
                            <img src={avatarPlaceholder} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">{fullName || 'Gestor'}</h2>
                            <p className="text-sm font-bold text-slate-400 dark:text-zinc-500">{userEmail}</p>
                        </div>
                        <div className="flex justify-center gap-3">
                            <span className="px-4 py-1.5 bg-gold-500/10 text-gold-600 border border-gold-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Admin Principal</span>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="premium-card p-8 rounded-[2.5rem] space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Nome Completo</label>
                            <div className="relative">
                                <User className="absolute left-5 top-4 h-4 w-4 text-slate-400" />
                                <input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-2xl outline-none text-slate-950 dark:text-white font-black text-sm transition-all focus:border-gold-500"
                                    placeholder="Seu nome"
                                />
                            </div>
                        </div>
                        <button
                            disabled={saving}
                            className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-xl"
                        >
                            <Save size={16} />
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </form>
                </div>

                {/* Office Management */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="premium-card p-10 rounded-[3rem] space-y-8">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-6">
                            <div className="space-y-1">
                                <h3 className="font-black text-slate-950 dark:text-white text-xl flex items-center gap-3 tracking-tighter uppercase">
                                    <Building size={22} className="text-gold-500" />
                                    Estrutura do Escritório
                                </h3>
                                <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">{officeName}</p>
                            </div>
                            <button className="p-3 bg-slate-50 dark:bg-zinc-900 rounded-2xl text-gold-500 hover:bg-gold-500 hover:text-black transition-all">
                                <UserPlus size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-[0.2em] mb-4">Equipe de Governança</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {members.map((member, idx) => (
                                    <div key={idx} className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-3xl group hover:border-gold-500 transition-all">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-gold-600 group-hover:bg-gold-500 group-hover:text-black transition-all">
                                            <Shield size={22} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-950 dark:text-white text-sm uppercase tracking-tight">{(member.profiles as any)?.full_name || 'Membro do Time'}</p>
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">{member.role === 'admin' ? 'Coordenador Master' : 'Assessor'}</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Invite Placeholder */}
                                <div className="flex items-center gap-5 p-5 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl opacity-50 cursor-pointer hover:opacity-100 transition-all group">
                                    <div className="w-12 h-12 rounded-2xl bg-transparent border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-300 dark:text-zinc-700 group-hover:text-gold-500 transition-all">
                                        <UserPlus size={22} />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-400 dark:text-zinc-700 text-sm uppercase tracking-tight">Novo Convite</p>
                                        <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-800 uppercase tracking-widest">Adicionar Membro</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 dark:border-zinc-900 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-[2rem] border border-slate-200 dark:border-zinc-900 space-y-1">
                                <span className="text-[9px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Sincronização</span>
                                <p className="text-sm font-black text-gold-600 flex items-center gap-2">
                                    Ativa <CheckCircle2 size={14} />
                                </p>
                            </div>
                            <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-[2rem] border border-slate-200 dark:border-zinc-900 space-y-1">
                                <span className="text-[9px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Licença Node</span>
                                <p className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-tighter">Enterprise</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-[2rem] border border-slate-200 dark:border-zinc-900 space-y-1">
                                <span className="text-[9px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Limite Membros</span>
                                <p className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-tighter">Unlimited</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
