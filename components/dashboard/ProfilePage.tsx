import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Building, Edit2, Camera, LogOut, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { logAudit } from '../../lib/utils/audit';

interface OfficeMember {
    user_id: string;
    role: string;
    joined_at: string;
    profiles: {
        full_name: string;
        avatar_url: string;
    };
}

export const ProfilePage: React.FC = () => {
    const { session, officeId, signOut, userRole } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [members, setMembers] = useState<OfficeMember[]>([]);
    const [officeName, setOfficeName] = useState('');
    const [fullName, setFullName] = useState('');
    const [initialFullName, setInitialFullName] = useState('');
    const [theme, setTheme] = useState<'high' | 'soft'>(localStorage.getItem('starjus-theme') as any || 'high');

    const userEmail = session?.user?.email || '';
    const avatarPlaceholder = "https://ui-avatars.com/api/?name=" + encodeURIComponent(fullName || 'User') + "&background=D4AF37&color=000";

    useEffect(() => {
        if (officeId) {
            fetchOfficeData();
            fetchMembers();
            fetchProfileData();
        }
        // Apply theme on load
        applyTheme(theme);
    }, [officeId]);

    const applyTheme = (t: 'high' | 'soft') => {
        const root = document.documentElement;
        if (t === 'soft') {
            root.classList.add('soft-theme');
        } else {
            root.classList.remove('soft-theme');
        }
    };

    const handleThemeChange = (newTheme: 'high' | 'soft') => {
        setTheme(newTheme);
        applyTheme(newTheme);
        localStorage.setItem('starjus-theme', newTheme);
        toast.success(`Tema ${newTheme === 'soft' ? 'Soft Contrast' : 'High Contrast'} aplicado`);
    };

    const fetchProfileData = async () => {
        try {
            const { data: profileData, error: profileError } = await (supabase
                .from('profiles')
                .select('full_name')
                .eq('id', session?.user?.id)
                .single() as any);

            if (profileData) {
                setFullName((profileData as any).full_name || '');
                setInitialFullName((profileData as any).full_name || '');
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    const fetchOfficeData = async () => {
        try {
            const { data: office } = await (supabase
                .from('offices')
                .select('name')
                .eq('id', officeId)
                .single() as any);

            if (office) setOfficeName((office as any).name);
        } catch (err) {
            console.error('Error fetching office:', err);
        }
    };

    const fetchMembers = async () => {
        try {
            const { data, error } = await (supabase
                .from('office_members')
                .select(`
                    user_id,
                    role,
                    joined_at,
                    profiles:user_id (
                        full_name,
                        avatar_url
                    )
                `)
                .eq('office_id', officeId) as any);

            if (error) throw error;
            setMembers(data || []);
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error } = await (supabase
                .from('profiles')
                .upsert({
                    id: session?.user?.id,
                    full_name: fullName,
                    office_id: officeId
                } as any) as any);

            if (error) throw error;

            // Audit Log
            if (session?.user?.id && officeId) {
                await logAudit({
                    userId: session.user.id,
                    officeId: officeId,
                    action: 'UPDATE_PROFILE',
                    entityType: 'profile',
                    entityId: session.user.id,
                    oldData: { full_name: initialFullName },
                    newData: { full_name: fullName }
                });
            }

            setInitialFullName(fullName);
            toast.success('Perfil atualizado com sucesso!');
        } catch (error) {
            toast.error('Erro ao atualizar perfil.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white uppercase leading-none italic font-serif gold-gradient-text">Identidade Profissional.</h1>
                    <p className="text-slate-500 dark:text-zinc-500 font-black uppercase text-[10px] tracking-[0.4em]">Gestão de Acesso e Credenciais</p>
                </div>
                <button
                    onClick={() => signOut()}
                    className="group bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 active:scale-95"
                >
                    <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> Encerrar Sessão
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Profile Section */}
                <div className="xl:col-span-2 space-y-10">
                    <div className="premium-card p-12 rounded-[3.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-gold-500/10 transition-colors" />

                        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                            <div className="relative">
                                <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-gold-500/20 shadow-2xl">
                                    <img
                                        src={avatarPlaceholder}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button className="absolute -right-2 -bottom-2 bg-gold-500 text-black p-4 rounded-2xl shadow-2xl hover:scale-110 transition-all active:scale-95 border-4 border-zinc-950">
                                    <Camera size={20} />
                                </button>
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-4">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-center md:justify-start gap-4">
                                        <h2 className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">{fullName || 'Advogado Associado'}</h2>
                                        <div className="p-1 px-3 bg-gold-500/10 border border-gold-500/20 rounded-lg">
                                            <Shield size={12} className="text-gold-500" />
                                        </div>
                                    </div>
                                    <p className="text-base font-bold text-zinc-500 uppercase tracking-widest">{userRole === 'owner' ? 'Sócio Majoritário' : userRole === 'manager' ? 'Gestor de Operações' : 'Advogado Pleno'}</p>
                                </div>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                        <Mail size={14} className="text-gold-500" /> {userEmail}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                        <Building size={14} className="text-gold-500" /> {officeName}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="mt-16 pt-16 border-t border-zinc-900 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                                    <input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-900 rounded-3xl px-14 py-5 text-sm text-white focus:border-gold-500 outline-none transition-all font-black placeholder:text-zinc-800"
                                        placeholder="Seu nome profissional"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Vínculo Institucional</label>
                                <div className="relative">
                                    <Building className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                                    <input
                                        disabled
                                        value={officeName}
                                        className="w-full bg-zinc-900 border border-zinc-900 rounded-3xl px-14 py-5 text-sm text-zinc-600 font-black cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-white text-black px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-gold-500 transition-all flex items-center gap-4 active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? 'Sincronizando...' : <>Salvar Alterações <Edit2 size={16} /></>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Security & Access Indices */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="premium-card p-10 rounded-[3rem] space-y-8 group">
                            <div className="flex justify-between items-center">
                                <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20 group-hover:bg-green-500 group-hover:text-black transition-all">
                                    <CheckCircle2 size={24} className="text-green-500 group-hover:text-black" />
                                </div>
                                <span className="text-3xl font-black text-white italic group-hover:gold-gradient-text transition-all">98%</span>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Nível de Segurança</h4>
                                <p className="text-xs text-zinc-600 leading-relaxed font-bold">Criptografia biométrica e autenticação em dois fatores ativa.</p>
                            </div>
                        </div>

                        <div className="premium-card p-10 rounded-[3rem] space-y-8 group">
                            <div className="flex justify-between items-center">
                                <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-black transition-all">
                                    <Clock size={24} className="text-blue-500 group-hover:text-black" />
                                </div>
                                <span className="text-3xl font-black text-white italic group-hover:gold-gradient-text transition-all">142h</span>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Tempo Produtivo (MT)</h4>
                                <p className="text-xs text-zinc-600 leading-relaxed font-bold">Total de horas focadas registradas no sistema este mês.</p>
                            </div>
                        </div>

                        {/* Theme Selection */}
                        <div className="md:col-span-2 premium-card p-10 rounded-[3rem] space-y-8">
                            <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">Preferências de Visão (Experience Center)</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <button
                                    onClick={() => handleThemeChange('high')}
                                    className={`p-8 rounded-[2rem] border-2 transition-all text-left space-y-4 ${theme === 'high' ? 'border-gold-500 bg-gold-500/5' : 'border-zinc-900 bg-zinc-950/50 hover:border-zinc-700'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="w-8 h-8 rounded-full bg-black border border-gold-500" />
                                        {theme === 'high' && <CheckCircle2 size={16} className="text-gold-500" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase italic">High Contrast</p>
                                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1 italic">Midnight & Gold Professional</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleThemeChange('soft')}
                                    className={`p-8 rounded-[2rem] border-2 transition-all text-left space-y-4 ${theme === 'soft' ? 'border-gold-500 bg-gold-500/5' : 'border-zinc-900 bg-zinc-950/50 hover:border-zinc-700'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="w-8 h-8 rounded-full bg-[#FDFCFB] border border-zinc-200 shadow-inner" />
                                        {theme === 'soft' && <CheckCircle2 size={16} className="text-gold-500" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase italic">Soft Contrast</p>
                                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1 italic">Ivory Business Performance</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Office Members Section */}
                <div className="space-y-8">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-[3.5rem] p-10 h-full flex flex-col">
                        <div className="space-y-2 mb-10">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic gold-gradient-text">Quadro Social.</h3>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Membros do Escritório</p>
                        </div>

                        <div className="flex-1 space-y-6">
                            {members.map((member) => (
                                <div key={member.user_id} className="flex items-center gap-4 group p-4 border border-transparent hover:border-zinc-900 hover:bg-zinc-900/30 rounded-3xl transition-all cursor-default">
                                    <div className="w-12 h-12 rounded-xl border border-zinc-800 overflow-hidden relative">
                                        <img
                                            src={member.profiles?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(member.profiles?.full_name || 'M') + "&background=111&color=fff"}
                                            alt={member.profiles?.full_name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-0.5">
                                        <p className="text-xs font-black text-white uppercase tracking-wider group-hover:text-gold-500 transition-colors">{member.profiles?.full_name}</p>
                                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">{member.role === 'owner' ? 'Sócio' : member.role === 'manager' ? 'Gestor' : 'Advogado'}</p>
                                    </div>
                                    <div className={`w-1.5 h-1.5 rounded-full ${member.user_id === session?.user?.id ? 'bg-green-500' : 'bg-zinc-800'}`} />
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-10 border-t border-zinc-900">
                            <button disabled className="w-full py-5 bg-zinc-900/50 border border-zinc-900 rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-700 cursor-not-allowed">Convidar Novos Sócios</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
