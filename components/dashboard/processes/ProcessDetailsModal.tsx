import React, { useState, useEffect } from 'react';
import { FileText, MessageSquare, Send } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Modal } from '../../ui/Modal';
import { AIInsightsPanel } from '../../ai/AIInsightsPanel';
import { FileUploader } from '../../ui/FileUploader';
import { Process } from '../../../types';
import toast from 'react-hot-toast';

interface ProcessDetailsModalProps {
    process: Process | null;
    onClose: () => void;
    onUploadComplete: () => void;
}

export const ProcessDetailsModal: React.FC<ProcessDetailsModalProps> = ({ process, onClose, onUploadComplete }) => {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (process) {
            fetchComments(process.id);

            const channel = supabase
                .channel(`process_comments:${process.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'process_comments',
                        filter: `process_id=eq.${process.id}`
                    },
                    (payload) => {
                        setComments(current => [payload.new, ...current]);
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [process]);

    const fetchComments = async (processId: string) => {
        const { data } = await supabase
            .from('process_comments')
            .select('*, profiles:user_id(full_name, avatar_url)')
            .eq('process_id', processId)
            .order('created_at', { ascending: false });

        if (data) setComments(data);
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !process) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            const { error } = await (supabase
                .from('process_comments')
                .insert([{
                    process_id: process.id,
                    content: newComment,
                    user_id: user.id,
                }] as any));

            if (error) throw error;
            setNewComment('');
        } catch (err) {
            console.error('Error adding comment:', err);
            toast.error('Erro ao adicionar comentário');
        }
    };

    if (!process) return null;

    return (
        <Modal
            isOpen={!!process}
            onClose={onClose}
            title="Dossiê Processual"
        >
            <div className="space-y-10">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <h3 className="text-4xl font-black text-white tracking-tighter leading-none italic font-serif gold-gradient-text">{process.title}</h3>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">{process.number}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-3">Cliente Relacionado</span>
                        <p className="text-xl font-black text-white uppercase tracking-tight">{process.client}</p>
                    </div>
                    <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-3">Valor da Causa</span>
                        <p className="text-xl font-black text-gold-500 tracking-tight">{process.value}</p>
                    </div>
                </div>

                <AIInsightsPanel
                    processId={process.id}
                    processNumber={process.number}
                    processTitle={process.title}
                    court={process.court || 'Não informado'}
                    movements={[]}
                />

                <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-3">
                        <FileText size={16} className="text-gold-600" /> Documentação
                    </h4>
                    <FileUploader
                        entityType="processes"
                        entityId={process.id}
                        onUploadComplete={onUploadComplete}
                    />
                </div>

                <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-3">
                        <MessageSquare size={16} className="text-gold-600" /> Histórico & Comentários
                    </h4>

                    <div className="bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800/50 p-6 space-y-6">
                        <form onSubmit={handleCommentSubmit} className="relative">
                            <input
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Adicionar nota estratégica..."
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-gold-500 outline-none transition-all pr-14"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-2 p-2 text-gold-500 hover:text-gold-400 transition-colors"
                            >
                                <Send size={20} />
                            </button>
                        </form>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {comments.length === 0 ? (
                                <p className="text-[10px] text-zinc-600 uppercase tracking-widest text-center py-4 italic">Nenhum comentário registrado</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/30 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-gold-500 uppercase tracking-widest">
                                                {comment.profiles?.full_name || 'Membro do Office'}
                                            </span>
                                            <span className="text-[9px] text-zinc-600 font-mono">
                                                {new Date(comment.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-300 leading-relaxed">{comment.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-zinc-900">
                    <button onClick={onClose} className="w-full py-6 bg-zinc-900 text-zinc-400 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800">Fechar Dossiê</button>
                </div>
            </div>
        </Modal>
    );
};
