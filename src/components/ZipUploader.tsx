import React, { useState, useRef, useCallback } from 'react';
import { FiUpload, FiCheck, FiAlertCircle, FiFile, FiX, FiSend } from 'react-icons/fi';

interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  message: string;
  apiResponse: string | null;
}

const ZipUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    message: '',
    apiResponse: null,
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (f: File): string | null => {
    if (!f.name.toLowerCase().endsWith('.zip')) {
      return 'Apenas arquivos .zip são aceitos.';
    }
    return null;
  };

  const handleSelect = useCallback((f: File) => {
    const error = validateFile(f);
    if (error) {
      setUploadState({ status: 'error', message: error, apiResponse: null });
      return;
    }
    setFile(f);
    setUploadState({ status: 'idle', message: '', apiResponse: null });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleSelect(f);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleSelect(f);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const clearFile = () => {
    setFile(null);
    setUploadState({ status: 'idle', message: '', apiResponse: null });
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadState({ status: 'error', message: 'Selecione um arquivo antes de enviar.', apiResponse: null });
      return;
    }

    setUploadState({ status: 'uploading', message: 'Enviando...', apiResponse: null });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://webhook-proxy-eosin.vercel.app/api/upload', {
        method: 'POST',
        body: formData,
      });

      let body: string;
      try {
        const json = await response.json();
        body = JSON.stringify(json, null, 2);
      } catch {
        body = await response.text();
      }

      if (!response.ok) {
        setUploadState({
          status: 'error',
          message: `Erro HTTP ${response.status}: ${response.statusText}`,
          apiResponse: body,
        });
        return;
      }

      setUploadState({
        status: 'success',
        message: `Upload concluído com sucesso! (${response.status})`,
        apiResponse: body,
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setUploadState({
        status: 'error',
        message: `Falha na requisição: ${errorMsg}`,
        apiResponse: null,
      });
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
  };

  return (
    <section className="animate-fade-in-up">
      <div className="glass-card p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
            <FiSend className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Upload Direto</h2>
            <p className="text-sm text-slate-400">Envie um .zip diretamente para a API</p>
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`drop-zone p-8 sm:p-10 mb-6 ${isDragOver ? 'border-amber-400 bg-amber-500/10 scale-[1.01]' : ''}`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${isDragOver ? 'bg-amber-500/20 scale-110' : 'bg-white/[.05]'}`}>
            <FiUpload className={`w-6 h-6 transition-colors ${isDragOver ? 'text-amber-300' : 'text-slate-400'}`} />
          </div>
          <p className="text-base text-slate-300 mb-1 font-medium">
            Arraste seu <span className="text-white">.zip</span> aqui
          </p>
          <p className="text-sm text-slate-500">ou clique para selecionar</p>
          <input
            ref={inputRef}
            type="file"
            accept=".zip"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>

        {/* Selected file info */}
        {file && (
          <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white/[.03] border border-white/[.06] mb-6 animate-fade-in">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                <FiFile className="w-4 h-4 text-brand-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
              </div>
            </div>
            <button onClick={clearFile} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[.06] transition-colors flex-shrink-0">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!file || uploadState.status === 'uploading'}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none"
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            boxShadow: file && uploadState.status !== 'uploading'
              ? '0 1px 2px rgba(0,0,0,.2), 0 0 0 1px rgba(245,158,11,.3) inset'
              : 'none',
          }}
        >
          {uploadState.status === 'uploading' ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <FiUpload className="w-4 h-4" />
              Fazer Upload
            </>
          )}
        </button>

        {/* Status message */}
        {uploadState.status !== 'idle' && uploadState.status !== 'uploading' && (
          <div
            className={`mt-6 p-4 rounded-xl border animate-fade-in-up ${
              uploadState.status === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-red-500/10 border-red-500/20'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {uploadState.status === 'success' ? (
                <FiCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <FiAlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              )}
              <p className={`text-sm font-medium ${uploadState.status === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
                {uploadState.message}
              </p>
            </div>

            {uploadState.apiResponse && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Resposta da API</p>
                <div className="code-block max-h-48 break-all whitespace-pre-wrap text-xs">
                  {uploadState.apiResponse}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ZipUploader;
