import React, { useState, useEffect } from 'react';
import {
    User, Mail, Shield, Building, Edit2, Camera, LogOut, CheckCircle2,
    Clock, Palette, BellRing, Music, Settings, Layout, Globe, Briefcase,
    CreditCard, Zap
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { logAudit } from '../../lib/utils/audit';
import { useNotification } from '../../lib/hooks/useNotification';

interface OfficeMember {
    user_id: string;
    role: string;
    joined_at: string;
    profiles: {
        full_name: string;
        avatar_url: string;
    };
}

const THEMES = [
    { id: 'midnight-gold', name: 'Midnight Gold', desc: 'Dark & Premium', color: '#D4AF37' },
    { id: 'ivory-business', name: 'Ivory Business', desc: 'Light & Executive', color: '#8B7355' },
    { id: 'ocean-deep', name: 'Ocean Deep', desc: 'Cyan & Tech', color: '#00AFB9' },
    { id: 'forest-legal', name: 'Forest Legal', desc: 'Organic & Secure', color: '#10B981' },
    { id: 'cyber-justice', name: 'Cyber Justice', desc: 'Neon & Future', color: '#D946EF' },
    { id: 'royal-velvet', name: 'Royal Velvet', desc: 'Bordeaux & Class', color: '#DC2626' },
    { id: 'minimalist-slate', name: 'Slate Minimal', desc: 'Pure & Simple', color: '#334155' },
    { id: 'sunrise-law', name: 'Sunrise Law', desc: 'Warm & Active', color: '#F59E0B' },
    { id: 'amethyst-legal', name: 'Amethyst', desc: 'Purple & Wise', color: '#8B5CF6' },
    { id: 'terra-cotta', name: 'Terra Cotta', desc: 'Earthy & Strong', color: '#EA580C' },
];

export const ProfilePage: React.FC = () => {
    const { session, officeId, signOut, userRole, theme, setTheme } = useAuth();
    const { playSound } = useNotification();

    const [activeTab, setActiveTab] = useState<'profile' | 'office' | 'experience'>('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Profile State
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [credentials, setCredentials] = useState('');
    const [initialFullName, setInitialFullName] = useState('');

    // Office State
    const [officeName, setOfficeName] = useState('');
    const [officeEmail, setOfficeEmail] = useState('');
    const [primaryColor, setPrimaryColor] = useState('#D4AF37');
    const [logoUrl, setLogoUrl] = useState('');
    const [members, setMembers] = useState<OfficeMember[]>([]);

    // Notifications State
    const [notifSound, setNotifSound] = useState(true);
    const [notifEmail, setNotifEmail] = useState(true);
    const [pomodoroSound, setPomodoroSound] = useState('gongo');

    const avatarPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=D4AF37&color=000`;

    useEffect(() => {
        if (officeId) {
            fetchInitialData();
        }
    }, [officeId]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // 1. Profile Data
            const { data: profile } = await (supabase
                .from('profiles')
                .select('*')
                .eq('id', session?.user?.id)
                .single() as any);

            if (profile) {
                setFullName(profile.full_name || '');
                setInitialFullName(profile.full_name || '');
                // Note: Extension columns might need a refresh or default handling if just added
                if (profile.notification_settings) {
                    setNotifSound(profile.notification_settings.sound !== false);
                    setNotifEmail(profile.notification_settings.email !== false);
                    setPomodoroSound(profile.notification_settings.timer_sound || 'gongo');
                }
            }

            // 2. Office Data
            const { data: office } = await (supabase
                .from('offices')
                .select('*')
                .eq('id', officeId)
                .single() as any);

            if (office) {
                setOfficeName(office.name || '');
                setOfficeEmail(office.institutional_email || '');
                setPrimaryColor(office.primary_color || '#D4AF37');
                setLogoUrl(office.logo_url || '');
            }

            // 3. Members
            const { data: membersList } = await (supabase
                .from('office_members')
                .select('user_id, role, joined_at, profiles:user_id(full_name, avatar_url)')
                .eq('office_id', officeId) as any);

            setMembers(membersList || []);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const { error } = await (supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    theme_preference: theme,
                    notification_settings: {
                        sound: notifSound,
                        email: notifEmail,
                        timer_sound: pomodoroSound
                    },
                    bio: bio,
                    credentials: credentials
                } as any)
                .eq('id', session?.user?.id) as any);

            if (error) throw error;

            // Audit logic...
            toast.success('Preferências salvas localmente e na nuvem!');
        } catch (error) {
            toast.error('Erro ao sincronizar dados.');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveOffice = async () => {
        if (userRole !== 'owner' && userRole !== 'manager') {
            toast.error('Apenas gestores podem alterar dados do escritório.');
            return;
        }
        setSaving(true);
        try {
            const { error } = await (supabase
                .from('offices')
                .update({
                    name: officeName,
                    institutional_email: officeEmail,
                    primary_color: primaryColor,
                    logo_url: logoUrl
                } as any)
                .eq('id', officeId) as any);

            if (error) throw error;
            toast.success('Escritório atualizado com sucesso!');
        } catch (error) {
            toast.error('Erro ao salvar dados institucionais.');
        } finally {
            setSaving(false);
        }
    };

    const handleThemeChange = (id: string) => {
        setTheme(id);
        // Instant visual feedback
        toast.success(`Tema ${id.replace('-', ' ')} ativado`, {
            style: { border: `1px solid ${THEMES.find(t => t.id === id)?.color}` }
        });
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin shadow-2xl" />
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header / Tabs */}
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
                    <button onClick={signOut} className="flex-1 lg:flex-none px-8 py-5 rounded-[2rem] border border-red-500/20 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all">Sair do Sistema</button>
                    <button
                        onClick={activeTab === 'office' ? handleSaveOffice : handleSaveProfile}
                        disabled={saving}
                        className="flex-1 lg:flex-none px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {saving ? 'Sincronizando...' : 'Efetivar Mudanças'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">

                {/* Main Content Area */}
                <div className="xl:col-span-2 space-y-12">

                    {activeTab === 'profile' && (
                        <div className="premium-card p-12 rounded-[3.5rem] space-y-12">
                            <div className="flex flex-col md:flex-row items-center gap-10">
                                <div className="relative group">
                                    <div className="w-44 h-44 rounded-[3rem] overflow-hidden border-4 border-gold-500/10 shadow-3xl">
                                        <img src={avatarPlaceholder} className="w-full h-full object-cover" />
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 p-4 bg-gold-600 rounded-2xl shadow-2xl border-4 border-white dark:border-zinc-950 text-black hover:scale-110 transition-all">
                                        <Camera size={20} />
                                    </button>
                                </div>
                                <div className="space-y-4 text-center md:text-left">
                                    <h3 className="text-3xl font-black text-slate-950 dark:text-white uppercase italic">{fullName || 'Usuário Alpha'}</h3>
                                    <p className="text-xs font-black text-gold-600 uppercase tracking-[0.4em]">{userRole === 'owner' ? 'Sócio Fundador' : userRole === 'manager' ? 'Gestor Master' : 'Conselheiro Legal'}</p>
                                    <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
                                        <div className="px-4 py-2 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                            <Mail size={14} className="text-gold-500" /> {session?.user?.email}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-100 dark:border-zinc-900">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Nome Profissional</label>
                                    <input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-3xl outline-none font-black focus:border-gold-500 transition-all shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Título / OAB</label>
                                    <input
                                        value={credentials}
                                        onChange={(e) => setCredentials(e.target.value)}
                                        placeholder="Ex: OAB/SP 123.456"
                                        className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-3xl outline-none font-black focus:border-gold-500 transition-all shadow-inner"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Biografia Curatorial</label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        rows={4}
                                        placeholder="Descreva sua especialidade e histórico profissional..."
                                        className="w-full px-8 py-6 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-[2rem] outline-none font-medium text-sm focus:border-gold-500 transition-all shadow-inner resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'office' && (
                        <div className="premium-card p-12 rounded-[3.5rem] space-y-12">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase italic tracking-tighter">Branding Institucional.</h3>
                                <div className="flex gap-4">
                                    <Globe size={24} className="text-gold-500" />
                                    <Shield size={24} className="text-gold-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Nome do Escritório</label>
                                    <input
                                        value={officeName}
                                        onChange={(e) => setOfficeName(e.target.value)}
                                        className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-3xl outline-none font-black focus:border-gold-500 transition-all shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Email Institucional</label>
                                    <input
                                        value={officeEmail}
                                        onChange={(e) => setOfficeEmail(e.target.value)}
                                        className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-3xl outline-none font-black focus:border-gold-500 transition-all shadow-inner"
                                    />
                                </div>
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Identidade Cromática (Primária)</label>
                                    <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800">
                                        <input
                                            type="color"
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className="w-16 h-16 rounded-2xl cursor-pointer border-none bg-transparent"
                                        />
                                        <span className="text-sm font-black mono text-zinc-600 uppercase">{primaryColor}</span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Logo Corporativa</label>
                                    <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800">
                                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-xs font-black text-black border border-slate-200 shadow-sm overflow-hidden">
                                            {logoUrl ? <img src={logoUrl} /> : 'LOGO'}
                                        </div>
                                        <button className="text-[10px] font-black uppercase text-gold-600 tracking-widest hover:text-white transition-all">Upload Master Logo</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'experience' && (
                        <div className="space-y-12 animate-in slide-in-from-right-5 duration-500">
                            {/* Themes Grid */}
                            <div className="premium-card p-12 rounded-[3.5rem] space-y-10">
                                <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase italic tracking-tighter">Experience Center • Temas.</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                    {THEMES.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => handleThemeChange(t.id)}
                                            className={`flex flex-col items-center gap-4 p-6 rounded-[2.5rem] border-2 transition-all hover:scale-105 active:scale-95 ${theme === t.id ? 'border-gold-500 bg-gold-500/5' : 'border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30'}`}
                                        >
                                            <div
                                                className="w-12 h-12 rounded-2xl shadow-xl border border-white/10"
                                                style={{ backgroundColor: t.color }}
                                            />
                                            <div className="text-center">
                                                <p className="text-[10px] font-black uppercase tracking-tighter text-slate-950 dark:text-white">{t.name}</p>
                                                <p className="text-[8px] font-bold text-zinc-500 mt-1 uppercase tracking-widest">{t.desc}</p>
                                            </div>
                                            {theme === t.id && <Zap size={10} className="text-gold-500 fill-gold-500 animate-pulse" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notifications Center */}
                            <div className="premium-card p-12 rounded-[3.5rem] space-y-10">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase italic tracking-tighter">Alertas & Sonoplastia.</h3>
                                    <BellRing size={24} className="text-gold-500" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-zinc-900 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
                                        <div className="space-y-2">
                                            <p className="text-xs font-black text-slate-950 dark:text-white uppercase">Sons de Alerta</p>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Feedback sonoro em tempo real</p>
                                        </div>
                                        <button
                                            onClick={() => setNotifSound(!notifSound)}
                                            className={`w-14 h-8 rounded-full relative transition-all ${notifSound ? 'bg-gold-500' : 'bg-zinc-700'}`}
                                        >
                                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${notifSound ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-zinc-900 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
                                        <div className="space-y-2">
                                            <p className="text-xs font-black text-slate-950 dark:text-white uppercase">Relatórios por E-mail</p>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Balanço diário de atividades</p>
                                        </div>
                                        <button
                                            onClick={() => setNotifEmail(!notifEmail)}
                                            className={`w-14 h-8 rounded-full relative transition-all ${notifEmail ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                                        >
                                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${notifEmail ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Sonoridade do Pomodoro (Timer Gongo)</label>
                                        <div className="flex gap-4">
                                            {['gongo', 'modern', 'digital'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => { setPomodoroSound(s); playSound('pomodoro'); }}
                                                    className={`flex-1 py-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${pomodoroSound === s ? 'bg-black dark:bg-white text-white dark:text-black border-transparent' : 'bg-slate-50 dark:bg-zinc-900 text-zinc-500 border-slate-200 dark:border-zinc-800'}`}
                                                >
                                                    <Music size={12} className="inline mr-2" /> {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Sidebar Stats */}
                <div className="space-y-10">
                    <div className="bg-slate-950 dark:bg-zinc-900 rounded-[4rem] p-10 space-y-10 shadow-3xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 space-y-2">
                            <h3 className="text-2xl font-black text-white italic tracking-tighter gold-gradient-text">Account Indices.</h3>
                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">Performance & Security Alpha</p>
                        </div>

                        <div className="relative z-10 space-y-8">
                            <div className="flex justify-between items-center group/item hover:translate-x-4 transition-all duration-500">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-zinc-500 uppercase">Segurança</p>
                                    <p className="text-lg font-black text-white">Advanced</p>
                                </div>
                                <Shield className="text-gold-500" />
                            </div>
                            <div className="flex justify-between items-center group/item hover:translate-x-4 transition-all duration-500">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-zinc-500 uppercase">Produtividade</p>
                                    <p className="text-lg font-black text-white">Top 2%</p>
                                </div>
                                <Zap className="text-gold-500 fill-gold-500" />
                            </div>
                            <div className="flex justify-between items-center group/item hover:translate-x-4 transition-all duration-500">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-zinc-500 uppercase">Horas Ativas</p>
                                    <p className="text-lg font-black text-white">1,242h</p>
                                </div>
                                <Clock className="text-gold-500" />
                            </div>
                        </div>

                        <div className="relative z-10 pt-10 border-t border-zinc-800/50">
                            <button className="w-full py-5 bg-gold-600 rounded-3xl text-[10px] font-black uppercase text-black tracking-[0.2em] shadow-2xl hover:bg-white transition-all">Ver Relatório de Acesso</button>
                        </div>
                    </div>

                    <div className="premium-card p-10 rounded-[3rem] space-y-10">
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-950 dark:text-white uppercase italic tracking-tighter">Quadro Social Alpha.</h3>
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">Membros do Escritório</p>
                        </div>
                        <div className="space-y-6">
                            {members.map(m => (
                                <div key={m.user_id} className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 overflow-hidden">
                                        <img src={m.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.profiles?.full_name || 'M')}&background=000&color=fff`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] font-black text-slate-950 dark:text-white uppercase">{m.profiles?.full_name}</p>
                                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">{m.role === 'owner' ? 'Sócio Fundador' : 'Advogado'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
