import { supabase } from '../supabase';

interface AuditLogOptions {
    userId: string;
    officeId: string;
    action: string;
    entityType: string;
    entityId?: string;
    oldData?: any;
    newData?: any;
}

export const logAudit = async (options: AuditLogOptions) => {
    try {
        const { error } = await supabase.from('audit_logs').insert({
            user_id: options.userId,
            office_id: options.officeId,
            action: options.action,
            entity_type: options.entityType,
            entity_id: options.entityId,
            old_data: options.oldData,
            new_data: options.newData,
        } as any);

        if (error) {
            console.error('Failed to log audit:', error);
        }
    } catch (err) {
        console.error('Audit log error:', err);
    }
};
