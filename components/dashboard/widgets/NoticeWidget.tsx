import React, { useEffect, useState } from 'react';
import { Bell, ChevronRight, Calendar, Plus, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { Modal } from '../ui/Modal';
import toast from 'react-hot-toast';

interface Notice {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    author: string;
    type: string;
    color?: string;
    content?: string;
}

export const NoticeWidget: React.FC = () => {
    const { officeId, userRole } = useAuth();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNotice, setNewNotice] = useState({ title: '', content: '', type: 'Aviso' });

    const fetchNotices = async () => {
        if (!officeId) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('notices')
                .select('*')
                .eq('office_id', officeId)
                .order('date', { ascending: false })
                .limit(5);

            if (error) throw error;
            if (data) setNotices(data as Notice[]);
        } catch (err) {
            console.error('Error fetching notices:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, [officeId]);

    const handleCreateNotice = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('notices').insert({
                office_id: officeId,
                title: newNotice.title,
                content: newNotice.content,
                type: newNotice.type,
                date: new Date().toISOString(),
                author: 'Admin' // Should get from user profile
            });

            if (error) throw error;
            toast.success('Aviso publicado!');
            setIsModalOpen(false);
            setNewNotice({ title: '', content: '', type: 'Aviso' });
            fetchNotices();
        } catch (err) {
            toast.error('Erro ao publicar aviso');
            console.error(err);
        }
    };

    const currentNotice = notices[0];

    return (
        <div className="flex flex-col h-full bg-[#1A1D21] rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-slate-400 font-medium text-sm">Geral: mural de avisos</h3>
                <div className="flex items-center gap-2">
                    {['owner', 'manager', 'admin'].includes(userRole || '') && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-gold-500 transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    )}
                    <ChevronRight size={16} className="text-slate-500 cursor-pointer hover:text-white transition-colors" />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center relative z-10">
                {loading ? (
                    <div className="w-8 h-8 rounded-full border-4 border-gold-500 border-t-transparent animate-spin mx-auto" />
                ) : !currentNotice ? (
                    <div className="text-center">
                        <Bell size={24} className="text-slate-600 mb-2 mx-auto" />
                        <p className="text-slate-500 text-xs">Nenhum aviso no momento.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-4">
                            {/* Avatar stack simulation */}
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-[#1A1D21] flex items-center justify-center text-xs text-white">NM</div>
                                <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-[#1A1D21] flex items-center justify-center text-xs text-white">+3</div>
                            </div>
                            <span className="text-xs text-slate-500 ml-2">Equipe Integrada</span>
                        </div>

                        <div className="bg-[#242830] rounded-2xl p-5 border-l-4 border-blue-500">
                            <h4 className="text-white font-bold text-lg mb-1">{currentNotice.title}</h4>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                                <Calendar size={14} />
                                <span>{new Date(currentNotice.date).toLocaleDateString('pt-BR')}.</span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-3">
                                {currentNotice.content || 'Sem conteúdo adicional.'}
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Aviso">
                <form onSubmit={handleCreateNotice} className="space-y-4 pt-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Título</label>
                        <input
                            required
                            value={newNotice.title}
                            onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Conteúdo</label>
                        <textarea
                            required
                            value={newNotice.content}
                            onChange={e => setNewNotice({ ...newNotice, content: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none min-h-[100px]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gold-500 text-black font-black uppercase text-xs py-4 rounded-xl hover:bg-gold-400 transition-colors"
                    >
                        Publicar Aviso
                    </button>
                </form>
            </Modal>
        </div>
    );
};
