import { supabase } from './supabase';

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Permission {
    canViewClients: boolean;
    canEditClients: boolean;
    canDeleteClients: boolean;
    canViewProcesses: boolean;
    canEditProcesses: boolean;
    canDeleteProcesses: boolean;
    canViewFinancial: boolean;
    canEditFinancial: boolean;
    canDeleteFinancial: boolean;
    canViewDocuments: boolean;
    canUploadDocuments: boolean;
    canDeleteDocuments: boolean;
    canManageUsers: boolean;
    canManageOffice: boolean;
}

/**
 * Matriz de permissões por role
 */
const ROLE_PERMISSIONS: Record<UserRole, Permission> = {
    owner: {
        canViewClients: true,
        canEditClients: true,
        canDeleteClients: true,
        canViewProcesses: true,
        canEditProcesses: true,
        canDeleteProcesses: true,
        canViewFinancial: true,
        canEditFinancial: true,
        canDeleteFinancial: true,
        canViewDocuments: true,
        canUploadDocuments: true,
        canDeleteDocuments: true,
        canManageUsers: true,
        canManageOffice: true,
    },
    admin: {
        canViewClients: true,
        canEditClients: true,
        canDeleteClients: true,
        canViewProcesses: true,
        canEditProcesses: true,
        canDeleteProcesses: true,
        canViewFinancial: true,
        canEditFinancial: true,
        canDeleteFinancial: false, // Não pode deletar registros financeiros
        canViewDocuments: true,
        canUploadDocuments: true,
        canDeleteDocuments: true,
        canManageUsers: true,
        canManageOffice: false,
    },
    member: {
        canViewClients: true,
        canEditClients: true,
        canDeleteClients: false,
        canViewProcesses: true,
        canEditProcesses: true,
        canDeleteProcesses: false,
        canViewFinancial: false, // Membros não veem financeiro
        canEditFinancial: false,
        canDeleteFinancial: false,
        canViewDocuments: true,
        canUploadDocuments: true,
        canDeleteDocuments: false,
        canManageUsers: false,
        canManageOffice: false,
    },
    viewer: {
        canViewClients: true,
        canEditClients: false,
        canDeleteClients: false,
        canViewProcesses: true,
        canEditProcesses: false,
        canDeleteProcesses: false,
        canViewFinancial: false,
        canEditFinancial: false,
        canDeleteFinancial: false,
        canViewDocuments: true,
        canUploadDocuments: false,
        canDeleteDocuments: false,
        canManageUsers: false,
        canManageOffice: false,
    },
};

/**
 * Obtém permissões do usuário atual
 */
export async function getUserPermissions(): Promise<Permission> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Usuário não autenticado');
    }

    // Buscar role do usuário no office
    const { data: member } = await supabase
        .from('office_members')
        .select('role')
        .eq('user_id', user.id)
        .single();

    const role = (member?.role as UserRole) || 'viewer';
    return ROLE_PERMISSIONS[role];
}

/**
 * Verifica se usuário tem permissão específica
 */
export async function hasPermission(permissionKey: keyof Permission): Promise<boolean> {
    try {
        const permissions = await getUserPermissions();
        return permissions[permissionKey];
    } catch {
        return false;
    }
}

/**
 * Gera código de convite único
 */
export async function generateInviteCode(
    officeId: number,
    role: UserRole = 'member',
    expiresInDays: number = 7
): Promise<string> {
    const code = generateRandomCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const { error } = await supabase
        .from('office_invites')
        .insert({
            code,
            office_id: officeId,
            role,
            expires_at: expiresAt.toISOString(),
            used: false,
        });

    if (error) throw error;

    return code;
}

/**
 * Valida e usa código de convite
 */
export async function redeemInviteCode(code: string, userId: string): Promise<{
    success: boolean;
    officeId?: number;
    role?: UserRole;
    error?: string;
}> {
    // Buscar convite
    const { data: invite, error: fetchError } = await supabase
        .from('office_invites')
        .select('*')
        .eq('code', code)
        .eq('used', false)
        .single();

    if (fetchError || !invite) {
        return { success: false, error: 'Código de convite inválido' };
    }

    // Verificar expiração
    if (new Date(invite.expires_at) < new Date()) {
        return { success: false, error: 'Código de convite expirado' };
    }

    // Adicionar usuário ao office
    const { error: memberError } = await supabase
        .from('office_members')
        .insert({
            office_id: invite.office_id,
            user_id: userId,
            role: invite.role,
        });

    if (memberError) {
        return { success: false, error: 'Erro ao adicionar ao escritório' };
    }

    // Marcar convite como usado
    await supabase
        .from('office_invites')
        .update({ used: true, used_by: userId, used_at: new Date().toISOString() })
        .eq('code', code);

    return {
        success: true,
        officeId: invite.office_id,
        role: invite.role,
    };
}

/**
 * Gera código alfanumérico aleatório
 */
function generateRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
