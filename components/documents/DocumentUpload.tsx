import React, { useState, useCallback } from 'react';
import { Upload, X, FileText, Image, File, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

interface DocumentUploadProps {
    clientId: number;
    onSuccess?: () => void;
}

interface UploadingFile {
    file: File;
    progress: number;
    error?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ clientId, onSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const { officeId } = useAuth();

    const ACCEPTED_TYPES = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const validateFile = (file: File): string | null => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            return 'Tipo de arquivo não suportado. Use PDF, imagens (JPG, PNG, GIF, WEBP) ou Word (DOC, DOCX).';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'Arquivo muito grande. Tamanho máximo: 10MB.';
        }
        return null;
    };

    const uploadFile = async (file: File): Promise<void> => {
        const error = validateFile(file);
        if (error) {
            toast.error(error);
            return;
        }

        setUploadingFiles(prev => [
            ...prev,
            { file, progress: 0 },
        ]);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            // Generate unique file path
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${officeId}/${clientId}/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError, data } = await supabase.storage
                .from('client-documents')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('client-documents')
                .getPublicUrl(filePath);

            // Save metadata to database
            const { error: dbError } = await supabase
                .from('client_documents')
                .insert({
                    client_id: clientId,
                    office_id: officeId,
                    file_name: file.name,
                    file_path: filePath,
                    file_type: file.type,
                    file_size: file.size,
                    uploaded_by: user.id,
                });

            if (dbError) throw dbError;

            setUploadingFiles(prev =>
                prev.map(f =>
                    f.file === file ? { ...f, progress: 100 } : f
                )
            );

            toast.success(`${file.name} enviado com sucesso!`);

            // Remove from uploading list after delay
            setTimeout(() => {
                setUploadingFiles(prev => prev.filter(f => f.file !== file));
            }, 2000);

            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(`Erro ao enviar ${file.name}`);

            setUploadingFiles(prev =>
                prev.map(f =>
                    f.file === file ? { ...f, error: error.message } : f
                )
            );
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            Array.from(e.dataTransfer.files).forEach(uploadFile);
        }
    }, [clientId, officeId]);

    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            Array.from(e.target.files).forEach(uploadFile);
        }
    };

    const getFileIcon = (type: string) => {
        if (type.includes('pdf')) return <FileText className="text-red-500" size={32} />;
        if (type.includes('image')) return <Image className="text-blue-500" size={32} />;
        return <File className="text-slate-500" size={32} />;
    };

    return (
        <div className="space-y-6">
            {/* Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-[2.5rem] p-12 text-center transition-all cursor-pointer ${dragActive
                        ? 'border-gold-500 bg-gold-500/10'
                        : 'border-slate-300 dark:border-zinc-800 hover:border-gold-500'
                    }`}
            >
                <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="space-y-6">
                    <div className="p-6 bg-slate-100 dark:bg-zinc-950 rounded-3xl border border-slate-200 dark:border-zinc-800 w-fit mx-auto">
                        <Upload size={48} className="text-gold-600" />
                    </div>

                    <div>
                        <h3 className="text-xl font-black text-slate-950 dark:text-white mb-2">
                            Arraste e solte arquivos aqui
                        </h3>
                        <p className="text-sm font-bold text-slate-500 dark:text-zinc-500">
                            ou clique para selecionar
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="px-4 py-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full text-[10px] font-black text-slate-600 dark:text-zinc-400 uppercase tracking-widest">
                            PDF
                        </span>
                        <span className="px-4 py-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full text-[10px] font-black text-slate-600 dark:text-zinc-400 uppercase tracking-widest">
                            Imagens
                        </span>
                        <span className="px-4 py-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full text-[10px] font-black text-slate-600 dark:text-zinc-400 uppercase tracking-widest">
                            Word
                        </span>
                        <span className="px-4 py-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full text-[10px] font-black text-slate-600 dark:text-zinc-400 uppercase tracking-widest">
                            Máx: 10MB
                        </span>
                    </div>
                </div>
            </div>

            {/* Uploading Files List */}
            {uploadingFiles.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-sm font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">
                        Enviando
                    </h4>
                    {uploadingFiles.map((item, index) => (
                        <div
                            key={index}
                            className="premium-card p-6 rounded-2xl flex items-center gap-4"
                        >
                            {getFileIcon(item.file.type)}

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-slate-950 dark:text-white truncate">
                                    {item.file.name}
                                </p>
                                <p className="text-xs font-bold text-slate-400 dark:text-zinc-600">
                                    {(item.file.size / 1024).toFixed(2)} KB
                                </p>

                                {item.error ? (
                                    <div className="flex items-center gap-2 mt-2 text-red-500">
                                        <AlertCircle size={14} />
                                        <span className="text-xs font-bold">{item.error}</span>
                                    </div>
                                ) : (
                                    <div className="mt-3">
                                        <div className="h-2 bg-slate-200 dark:bg-zinc-900 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gold-600 transition-all duration-300"
                                                style={{ width: `${item.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {item.progress === 100 && (
                                <div className="text-emerald-500 font-black text-xs uppercase">
                                    ✓ Completo
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
