import React from 'react';
import { Camera, Mail } from 'lucide-react';

interface ProfileFormProps {
    fullName: string;
    setFullName: (val: string) => void;
    bio: string;
    setBio: (val: string) => void;
    credentials: string;
    setCredentials: (val: string) => void;
    email?: string;
    userRole: string | null;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
    fullName,
    setFullName,
    bio,
    setBio,
    credentials,
    setCredentials,
    email,
    userRole
}) => {
    const avatarPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=D4AF37&color=000`;

    return (
        <div className="premium-card p-12 rounded-[3.5rem] space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="relative group">
                    <div className="w-44 h-44 rounded-[3rem] overflow-hidden border-4 border-gold-500/10 shadow-3xl">
                        <img src={avatarPlaceholder} className="w-full h-full object-cover" alt="Avatar" />
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
                            <Mail size={14} className="text-gold-500" /> {email}
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
    );
};
