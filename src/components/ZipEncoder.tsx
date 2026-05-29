import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiUpload, FiCopy, FiDownload, FiTrash2, FiFileText, FiShare2, FiArrowRight, FiCheck, FiShield, FiZap, FiGlobe, FiLock } from 'react-icons/fi';

type Mode = 'encode' | 'decode';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ZipEncoder: React.FC = () => {
  const [mode, setMode] = useState<Mode>('encode');
  const [base64Result, setBase64Result] = useState<string>('');
  const [base64Input, setBase64Input] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const base64FileInputRef = useRef<HTMLInputElement>(null);
  const toastId = useRef(0);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  // Load from URL on component mount
  useEffect(() => {
    loadFromURL();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    
    if (sharedData) {
      try {
        const decodedData = JSON.parse(atob(sharedData));
        setBase64Result(decodedData.base64);
        setFileName(decodedData.fileName);
        setMode('encode');
        window.history.replaceState({}, document.title, window.location.pathname);
        showToast('Dados carregados do link compartilhado');
      } catch (error) {
        console.error('Erro ao carregar dados da URL:', error);
      }
    }
  };

  const shareViaURL = () => {
    if (!base64Result || !fileName) {
      showToast('Nenhum resultado para compartilhar', 'error');
      return;
    }

    try {
      const dataToShare = { fileName, base64: base64Result };
      const encodedData = btoa(JSON.stringify(dataToShare));
      const shareURL = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
      
      navigator.clipboard.writeText(shareURL).then(() => {
        showToast('Link copiado! Acesse de qualquer dispositivo.');
      }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = shareURL;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Link copiado!');
      });
    } catch {
      showToast('Erro ao gerar link. Arquivo muito grande.', 'error');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (mode === 'encode') processFile(file);
      else processBase64File(file);
    }
  };

  const handleBase64FileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processBase64File(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      if (mode === 'encode') processFile(file);
      else processBase64File(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const processFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      showToast('Selecione apenas arquivos .zip', 'error');
      return;
    }

    setIsLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const base64 = result.split(',')[1] || result;
      setBase64Result(base64);
      setIsLoading(false);
      showToast(`${file.name} convertido com sucesso!`);
    };

    reader.onerror = () => {
      showToast('Erro ao ler o arquivo', 'error');
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const processBase64File = (file: File) => {
    setIsLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setBase64Input(result);
      setIsLoading(false);
      showToast('Arquivo Base64 carregado');
    };

    reader.onerror = () => {
      showToast('Erro ao ler o arquivo', 'error');
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const decodeBase64 = () => {
    if (!base64Input.trim()) {
      showToast('Insira uma string Base64 válida', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const cleanBase64 = base64Input.replace(/\s/g, '');
      
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
        throw new Error('String Base64 inválida');
      }

      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'decoded_file.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsLoading(false);
      showToast('ZIP decodificado e baixado!');
    } catch {
      setIsLoading(false);
      showToast('Erro ao decodificar. Verifique o Base64.', 'error');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(base64Result);
      setCopySuccess(true);
      showToast('Base64 copiado!');
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      showToast('Erro ao copiar', 'error');
    }
  };

  const downloadBase64 = () => {
    const element = document.createElement('a');
    const file = new Blob([base64Result], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName.replace('.zip', '')}_base64.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Download iniciado');
  };

  const clearResult = () => {
    setBase64Result('');
    setBase64Input('');
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (base64FileInputRef.current) base64FileInputRef.current.value = '';
  };

  const formatBytes = (chars: number) => {
    const bytes = Math.ceil(chars * 0.75);
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-surface-950 bg-mesh bg-grid relative">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-500/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-emerald-500/8 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="badge bg-brand-500/15 text-brand-300 border border-brand-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              v1.0 — 100% Local
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            <span className="text-white">Base64</span>{' '}
            <span className="text-gradient">Vault</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Converta <span className="text-white font-medium">.zip</span> para Base64 e vice-versa.
            Rápido, seguro e sem enviar nada a servidores.
          </p>
        </header>

        {/* Mode Selector */}
        <div className="flex justify-center mb-10 animate-fade-in-up" style={{ animationDelay: '.1s' }}>
          <div className="inline-flex p-1.5 rounded-2xl bg-white/[.04] border border-white/[.06] backdrop-blur-sm">
            <button
              onClick={() => setMode('encode')}
              className={`relative px-6 sm:px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                mode === 'encode'
                  ? 'text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode === 'encode' && (
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 shadow-glow-brand" />
              )}
              <span className="relative flex items-center gap-2">
                <FiLock className="w-4 h-4" />
                Encode
                <span className="hidden sm:inline text-xs opacity-70">.zip → Base64</span>
              </span>
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`relative px-6 sm:px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                mode === 'decode'
                  ? 'text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode === 'decode' && (
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-glow-emerald" />
              )}
              <span className="relative flex items-center gap-2">
                <FiArrowRight className="w-4 h-4" />
                Decode
                <span className="hidden sm:inline text-xs opacity-70">Base64 → .zip</span>
              </span>
            </button>
          </div>
        </div>

        {/* ─── ENCODE MODE ─── */}
        {mode === 'encode' && (
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '.15s' }}>
            {/* Drop zone */}
            <div className="glass-card glass-card-hover p-8">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`drop-zone p-10 sm:p-14 ${isDragOver ? 'border-brand-400 bg-brand-500/10 scale-[1.01]' : ''}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${isDragOver ? 'bg-brand-500/20 scale-110' : 'bg-white/[.05]'}`}>
                  <FiUpload className={`w-7 h-7 transition-colors ${isDragOver ? 'text-brand-300' : 'text-slate-400'}`} />
                </div>
                <p className="text-base sm:text-lg text-slate-300 mb-1 font-medium">
                  Arraste seu <span className="text-white">.zip</span> aqui
                </p>
                <p className="text-sm text-slate-500">
                  ou clique para selecionar
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Result */}
            {base64Result && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="glass-card p-6 sm:p-8">
                  {/* Result header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">Resultado Base64</h2>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <FiFileText className="w-3.5 h-3.5" />
                          {fileName}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                        <span>{base64Result.length.toLocaleString()} chars</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                        <span>~{formatBytes(base64Result.length)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={copyToClipboard} className="btn-primary">
                        {copySuccess ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                        {copySuccess ? 'Copiado!' : 'Copiar'}
                      </button>
                      <button onClick={downloadBase64} className="btn-ghost">
                        <FiDownload className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                      <button onClick={clearResult} className="btn-danger">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Code block */}
                  <div className="code-block max-h-72 break-all whitespace-pre-wrap">
                    {base64Result}
                  </div>
                </div>

                {/* Share & Export */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-card glass-card-hover p-6 group">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/25 transition-colors">
                        <FiShare2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1">Compartilhar via Link</h3>
                        <p className="text-sm text-slate-400 mb-4">Gera URL para acessar de qualquer dispositivo</p>
                        <button onClick={shareViaURL} className="btn-success w-full">
                          <FiGlobe className="w-4 h-4" /> Gerar Link
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card glass-card-hover p-6 group">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/25 transition-colors">
                        <FiDownload className="w-5 h-5 text-brand-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1">Exportar Arquivo</h3>
                        <p className="text-sm text-slate-400 mb-4">Baixa .txt para transferência manual</p>
                        <button onClick={downloadBase64} className="btn-primary w-full">
                          <FiDownload className="w-4 h-4" /> Baixar .txt
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── DECODE MODE ─── */}
        {mode === 'decode' && (
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '.15s' }}>
            <div className="glass-card p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6">Entrada Base64</h2>

              {/* Paste area */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-300 mb-2">Cole a string Base64</label>
                <textarea
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                  placeholder="Cole sua string Base64 aqui..."
                  className="w-full h-36 p-4 rounded-xl bg-surface-950/80 border border-white/[.06] text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/30 transition-all text-sm font-mono"
                />
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={decodeBase64}
                    disabled={!base64Input.trim() || isLoading}
                    className="btn-success disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none"
                  >
                    <FiDownload className="w-4 h-4" />
                    Decodificar e Baixar ZIP
                  </button>
                  {base64Input && (
                    <button onClick={clearResult} className="btn-ghost">
                      <FiTrash2 className="w-4 h-4" /> Limpar
                    </button>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[.06]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest bg-surface-900/80">ou</span>
                </div>
              </div>

              {/* Upload Base64 file */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Upload de arquivo .txt com Base64</label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => base64FileInputRef.current?.click()}
                  className={`drop-zone p-8 ${isDragOver ? 'border-emerald-400 bg-emerald-500/10' : ''}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/[.05] flex items-center justify-center mb-3">
                    <FiFileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-300 font-medium">Arraste um .txt aqui</p>
                  <p className="text-xs text-slate-500 mt-0.5">ou clique para selecionar</p>
                  <input
                    ref={base64FileInputRef}
                    type="file"
                    accept=".txt"
                    onChange={handleBase64FileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Loaded Base64 preview */}
            {base64Input && (
              <div className="glass-card p-6 sm:p-8 animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">Base64 Carregado</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{base64Input.length.toLocaleString()} caracteres</p>
                  </div>
                  <button onClick={decodeBase64} disabled={isLoading} className="btn-success">
                    <FiDownload className="w-4 h-4" /> Decodificar
                  </button>
                </div>
                <div className="code-block max-h-48 break-all whitespace-pre-wrap">
                  {base64Input.substring(0, 500)}
                  {base64Input.length > 500 && (
                    <span className="text-slate-500"> ... (truncado)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-surface-950/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card p-8 flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-brand-500/30 border-t-brand-400 animate-spin" />
              <span className="text-sm font-medium text-slate-300">
                {mode === 'encode' ? 'Codificando...' : 'Decodificando...'}
              </span>
            </div>
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '.25s' }}>
          {[
            { icon: FiShield, label: 'Processamento Local', desc: 'Nada é enviado a servidores' },
            { icon: FiZap, label: 'Ultra Rápido', desc: 'Conversão instantânea no browser' },
            { icon: FiGlobe, label: 'Compartilhável', desc: 'Links acessíveis de qualquer PC' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3 p-4 rounded-xl bg-white/[.02] border border-white/[.04]">
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-slate-600">
          <p>Base64 Vault &middot; Open Source &middot; Nenhum dado coletado</p>
        </footer>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium text-white shadow-lg animate-fade-in-up ${
              t.type === 'success' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500' :
              t.type === 'error' ? 'bg-gradient-to-r from-red-600 to-red-500' :
              'bg-gradient-to-r from-brand-600 to-brand-500'
            }`}
          >
            {t.type === 'success' && <FiCheck className="w-4 h-4" />}
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZipEncoder;