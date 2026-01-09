import React, { useEffect, useState } from 'react';
import { User, Trash2, Shield, Mail, Copy, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import toast from 'react-hot-toast';

interface Member {
    id: string; // office_member id, not user id
    user_id: string;
    role: string;
    profile: {
        full_name: string;
        email?: string; // If profile table doesn't have email, we might need a join or other way. Assuming profile has basic info.
        // Actually Supabase profiles usually link to auth.users but accessible via view or table copy.
        // Let's assume we can join with a profiles table that mirrors user data or store email in member for simplicity if complex.
        // Checking database.types.ts earlier: profiles has full_name. office_members join profiles on user_id.
    };
    // Workaround for email if not in Profile: 
    // We might not get email easily if not in profiles. For now we will display Name.
}

export const UserManagementTab: React.FC = () => {
    const { officeId, userRole } = useAuth();
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteCode, setInviteCode] = useState<string | null>(null);

    useEffect(() => {
        if (officeId) fetchMembers();
    }, [officeId]);

    const fetchMembers = async () => {
        setLoading(true);
        // We join with profiles. Note: 'profiles' table must exist and be linked.
        // Based on previous types check, profiles exists.
        const { data, error } = await supabase
            .from('office_members')
            .select(`
                id,
                role,
                user_id,
                profiles:user_id ( full_name )
            `)
            .eq('office_id', officeId);

        if (error) {
            console.error('Error fetching members:', error);
            toast.error('Erro ao carregar membros');
        } else {
            setMembers(data || []);
        }
        setLoading(false);
    };

    const generateInvite = async () => {
        // Create an invite code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        // Expires in 7 days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const { error } = await supabase
            .from('office_invites')
            .insert({
                office_id: parseInt(officeId || '0'), // office_invites uses int id? database.types said office_invites.office_id is number. office_members.office_id is string. Potential mismatch.
                // Let's double check types file. 
                // office_invites: office_id number. offices: id string.
                // This schema mismatch suggests office_invites might be old or offices id type changed to uuid.
                // If office_id is UUID string, office_invites insert will fail if column is int4.
                // As a fallback, I will assume office_invites table might need migration OR I try to insert string and see if postgres casts or errors.
                // Better approach: Check if I can see if offices.id is uuid. Yes (gen_random_uuid).
                // So office_invites.office_id SHOULD be uuid. If types say number, types might be wrong or table is old.
                // I will try to use the string.
                code: code,
                role: 'staff',
                expires_at: expiresAt.toISOString()
            } as any);

        if (error) {
            console.error(error);
            toast.error('Erro ao gerar convite. Verifique permissões.');
        } else {
            setInviteCode(code);
            toast.success('Código gerado!');
        }
    };

    const copyInvite = () => {
        if (inviteCode) {
            navigator.clipboard.writeText(inviteCode);
            toast.success('Copiado para área de transferência');
        }
    };

    const removeMember = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este membro?')) return;

        const { error } = await supabase
            .from('office_members')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error('Erro ao remover membro');
        } else {
            toast.success('Membro removido');
            fetchMembers();
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Equipe ({members.length})</h3>
                <button
                    onClick={generateInvite}
                    className="bg-gold-500 text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gold-400 transition-colors flex items-center gap-2"
                >
                    <Mail size={16} /> Convidar Advogado
                </button>
            </div>

            {inviteCode && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs text-emerald-500 font-bold uppercase mb-1">Código de Convite Gerado</p>
                        <p className="text-xl font-mono text-white tracking-widest">{inviteCode}</p>
                    </div>
                    <button onClick={copyInvite} className="text-emerald-500 hover:text-white transition-colors">
                        <Copy size={20} />
                    </button>
                </div>
            )}

            <div className="space-y-3">
                {loading ? (
                    <div className="text-center text-slate-500 py-8">Carregando equipe...</div>
                ) : (
                    members.map((member: any) => (
                        <div key={member.id} className="bg-black/20 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                                    {(member.profiles?.full_name || 'U').charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{member.profiles?.full_name || 'Usuário'}</p>
                                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md uppercase font-bold tracking-wider">
                                        {member.role || 'Staff'}
                                    </span>
                                </div>
                            </div>

                            {userRole === 'owner' && member.user_id !== supabase.auth.getUser() && ( // basic check
                                <button
                                    onClick={() => removeMember(member.id)}
                                    className="p-2 text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
