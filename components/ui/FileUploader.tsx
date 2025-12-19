import React, { useState } from 'react';
import { Upload, X, File, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

interface FileUploaderProps {
    entityType: 'processes' | 'clients' | 'tasks';
    entityId: string;
    onUploadComplete?: (url: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ entityType, entityId, onUploadComplete }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { officeId } = useAuth();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);
        setSuccess(false);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${officeId}/${entityType}/${entityId}/${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('legal-documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('legal-documents')
                .getPublicUrl(filePath);

            // Audit log the upload
            await supabase.from('audit_logs').insert([{
                user_id: (await supabase.auth.getUser()).data.user?.id,
                office_id: officeId,
                action: 'UPLOAD',
                entity_type: 'document',
                entity_id: entityId,
                new_data: { fileName: file.name, filePath }
            }]);

            setSuccess(true);
            if (onUploadComplete) onUploadComplete(publicUrl);
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer upload do arquivo.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <input
                    type="file"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    id="file-upload"
                />
                <div className={`p-8 border-2 border-dashed rounded-[2rem] transition-all flex flex-col items-center justify-center gap-4 ${uploading ? 'bg-zinc-900/50 border-gold-500/50' : error ? 'bg-red-500/5 border-red-500/20' : success ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-950 border-zinc-800 hover:border-gold-500/50 hover:bg-zinc-900/50'}`}>
                    {uploading ? (
                        <>
                            <Loader2 size={32} className="text-gold-500 animate-spin" />
                            <p className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Enviando Arquivo Alpha...</p>
                        </>
                    ) : success ? (
                        <>
                            <CheckCircle2 size={32} className="text-emerald-500" />
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Upload Concluído com Sucesso</p>
                        </>
                    ) : error ? (
                        <>
                            <AlertCircle size={32} className="text-red-500" />
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</p>
                        </>
                    ) : (
                        <>
                            <div className="p-4 bg-gold-600/10 rounded-2xl text-gold-500">
                                <Upload size={24} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-black text-white uppercase tracking-tight mb-1">Anexar Documento Alpha</p>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">PDF, DOCX ou Imagens (Máx 10MB)</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
