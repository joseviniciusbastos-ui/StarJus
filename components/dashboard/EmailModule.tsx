import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { EmailSidebar } from './email/EmailSidebar';
import { EmailList, Email } from './email/EmailList';
import { EmailViewModal } from './email/EmailViewModal';
import { EmailComposeModal } from './email/EmailComposeModal';
import toast from 'react-hot-toast';

export const EmailModule: React.FC = () => {
    const { officeId, officeName } = useAuth();
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [loading, setLoading] = useState(true);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [activeFolder, setActiveFolder] = useState('inbox');

    useEffect(() => {
        if (officeId) fetchEmails();
    }, [officeId, activeFolder]);

    const fetchEmails = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('office_emails')
                .select('*')
                .eq('office_id', officeId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            // Basic filtering could happen here or in DB if category column exists/is populated
            // For now assuming all fetched are valid, we can filter by folder client side if needed
            const filteredData = (data || []).filter((e: any) => {
                if (activeFolder === 'inbox') return e.category === 'inbox' || !e.category;
                return e.category === activeFolder;
            });

            setEmails(filteredData as Email[]);
        } catch (error) {
            console.error('Error fetching emails:', error);
            // toast.error('Erro ao carregar emails');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (emailId: string) => {
        try {
            const { error } = await supabase
                .from('office_emails')
                .update({ is_read: true })
                .eq('id', emailId);

            if (error) throw error;

            setEmails(current =>
                current.map(e => e.id === emailId ? { ...e, is_read: true } : e)
            );
        } catch (error) {
            console.error('Error marking email as read:', error);
        }
    };

    const handleSendEmail = async (subject: string, content: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Save to database (Internal Record)
            const { error: dbError } = await supabase
                .from('office_emails')
                .insert({
                    office_id: officeId,
                    sender_name: user?.user_metadata?.full_name || user?.email,
                    sender_email: user?.email,
                    subject: subject,
                    content: content,
                    category: 'sent'
                });

            if (dbError) throw dbError;

            // 2. Trigger Real Email Sending via Edge Function
            await supabase.functions.invoke('send-email', {
                body: {
                    to: 'atendimento@starjus.com.br',
                    subject: subject,
                    content: content,
                    sender_name: user?.user_metadata?.full_name
                }
            });

            toast.success('Estratégia enviada com sucesso!');
            setIsComposeOpen(false);
            if (activeFolder === 'sent') fetchEmails();
        } catch (error) {
            console.error('Error sending email:', error);
            toast.error('Erro ao processar envio.');
        }
    };

    return (
        <div className="flex h-full bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in">
            <EmailSidebar
                officeName={officeName}
                unreadCount={emails.filter(e => !e.is_read).length}
                onCompose={() => setIsComposeOpen(true)}
                activeFolder={activeFolder}
                setActiveFolder={setActiveFolder}
            />

            <EmailList
                emails={emails}
                loading={loading}
                onRefresh={fetchEmails}
                onSelect={(email) => {
                    setSelectedEmail(email);
                    if (!email.is_read) markAsRead(email.id);
                }}
            />

            <EmailViewModal
                email={selectedEmail}
                onClose={() => setSelectedEmail(null)}
            />

            <EmailComposeModal
                isOpen={isComposeOpen}
                onClose={() => setIsComposeOpen(false)}
                onSend={handleSendEmail}
            />
        </div>
    );
};
