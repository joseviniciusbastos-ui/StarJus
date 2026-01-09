import React from 'react';
import { Globe, Shield } from 'lucide-react';

interface OfficeSettingsFormProps {
    officeName: string;
    setOfficeName: (val: string) => void;
    officeEmail: string;
    setOfficeEmail: (val: string) => void;
    primaryColor: string;
    setPrimaryColor: (val: string) => void;
    logoUrl: string;
    setLogoUrl: (val: string) => void;
}

export const OfficeSettingsForm: React.FC<OfficeSettingsFormProps> = ({
    officeName,
    setOfficeName,
    officeEmail,
    setOfficeEmail,
    primaryColor,
    setPrimaryColor,
    logoUrl,
    setLogoUrl
}) => {
    return (
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
                            {logoUrl ? <img src={logoUrl} alt="Logo" /> : 'LOGO'}
                        </div>
                        <button className="text-[10px] font-black uppercase text-gold-600 tracking-widest hover:text-white transition-all">Upload Master Logo</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
