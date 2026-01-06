import React, { useState, useMemo } from 'react';
import { X, Download, FileText, Image as ImageIcon, File, ZoomIn, ZoomOut } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentViewerProps {
    fileUrl: string;
    fileName: string;
    fileType: string;
    onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
    fileUrl,
    fileName,
    fileType,
    onClose,
}) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [imageLoaded, setImageLoaded] = useState(false);

    const isPDF = fileType?.toLowerCase().includes('pdf');
    const isImage = fileType?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|bmp)/i);
    const isWord = fileType?.toLowerCase().match(/\.(doc|docx)/i);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.click();
    };

    const renderContent = () => {
        if (isPDF) {
            return (
                <div className="flex flex-col items-center space-y-6">
                    <div className="flex items-center gap-4 bg-slate-100 dark:bg-zinc-900 px-6 py-4 rounded-2xl">
                        <button
                            onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl transition-all"
                            disabled={scale <= 0.5}
                        >
                            <ZoomOut size={20} />
                        </button>
                        <span className="text-sm font-black text-slate-600 dark:text-zinc-400 min-w-[60px] text-center">
                            {Math.round(scale * 100)}%
                        </span>
                        <button
                            onClick={() => setScale(s => Math.min(2.0, s + 0.25))}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl transition-all"
                            disabled={scale >= 2.0}
                        >
                            <ZoomIn size={20} />
                        </button>
                        <div className="h-6 w-px bg-slate-300 dark:bg-zinc-700 mx-2" />
                        <button
                            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                            disabled={pageNumber <= 1}
                            className="px-4 py-2 bg-slate-200 dark:bg-zinc-800 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="text-sm font-black text-slate-600 dark:text-zinc-400">
                            {pageNumber} / {numPages}
                        </span>
                        <button
                            onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                            disabled={pageNumber >= numPages}
                            className="px-4 py-2 bg-slate-200 dark:bg-zinc-800 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50"
                        >
                            Próxima
                        </button>
                    </div>

                    <div className="overflow-auto max-h-[70vh] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl">
                        <Document
                            file={fileUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={
                                <div className="flex items-center justify-center p-20">
                                    <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            }
                            error={
                                <div className="p-20 text-center text-red-500">
                                    Erro ao carregar PDF. <button onClick={() => window.location.reload()} className="underline">Tentar novamente</button>
                                </div>
                            }
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                            />
                        </Document>
                    </div>
                </div>
            );
        }

        if (isImage) {
            return (
                <div className="flex flex-col items-center space-y-6">
                    <div className="flex items-center gap-4 bg-slate-100 dark:bg-zinc-900 px-6 py-4 rounded-2xl">
                        <button
                            onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl transition-all"
                        >
                            <ZoomOut size={20} />
                        </button>
                        <span className="text-sm font-black text-slate-600 dark:text-zinc-400 min-w-[60px] text-center">
                            {Math.round(scale * 100)}%
                        </span>
                        <button
                            onClick={() => setScale(s => Math.min(3.0, s + 0.25))}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl transition-all"
                        >
                            <ZoomIn size={20} />
                        </button>
                    </div>

                    <div className="overflow-auto max-h-[70vh] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl bg-slate-100 dark:bg-zinc-900 p-8">
                        <img
                            src={fileUrl}
                            alt={fileName}
                            className="transition-transform"
                            style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
                            onLoad={() => setImageLoaded(true)}
                        />
                        {!imageLoaded && (
                            <div className="flex items-center justify-center p-20">
                                <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (isWord) {
            return (
                <div className="p-20 text-center space-y-6">
                    <FileText size={64} className="mx-auto text-blue-500" />
                    <div>
                        <h3 className="text-2xl font-black text-slate-950 dark:text-white mb-2">Visualização de Word</h3>
                        <p className="text-slate-600 dark:text-zinc-400 font-bold mb-6">
                            Para visualizar arquivos .docx, faça o download do arquivo.
                        </p>
                        <button
                            onClick={handleDownload}
                            className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:scale-105"
                        >
                            Download do Arquivo
                        </button>
                    </div>
                </div>
            );
        }

        // Fallback para outros tipos
        return (
            <div className="p-20 text-center space-y-6">
                <File size={64} className="mx-auto text-slate-400" />
                <div>
                    <h3 className="text-2xl font-black text-slate-950 dark:text-white mb-2">Tipo de arquivo não suportado</h3>
                    <p className="text-slate-600 dark:text-zinc-400 font-bold mb-6">
                        Faça o download para visualizar este arquivo.
                    </p>
                    <button
                        onClick={handleDownload}
                        className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:scale-105"
                    >
                        Download do Arquivo
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-zinc-950 rounded-[3rem] max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-3xl border border-slate-200 dark:border-zinc-800">
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-slate-200 dark:border-zinc-900">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gold-500/10 rounded-2xl">
                            {isPDF ? <FileText className="text-gold-600" size={24} /> :
                                isImage ? <ImageIcon className="text-gold-600" size={24} /> :
                                    <File className="text-gold-600" size={24} />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight leading-none">{fileName}</h2>
                            <p className="text-xs font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest mt-1">Visualização Alpha</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDownload}
                            className="p-4 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-slate-600 dark:text-zinc-400 hover:text-gold-600 transition-all shadow-sm"
                        >
                            <Download size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-4 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-slate-600 dark:text-zinc-400 hover:text-red-500 transition-all shadow-sm"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-10 overflow-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
