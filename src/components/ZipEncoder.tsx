import React, { useState, useRef, useEffect } from 'react';
import { FiUpload, FiCopy, FiDownload, FiTrash2, FiFileText, FiShare2 } from 'react-icons/fi';

type Mode = 'encode' | 'decode';

const ZipEncoder: React.FC = () => {
  const [mode, setMode] = useState<Mode>('encode');
  const [base64Result, setBase64Result] = useState<string>('');
  const [base64Input, setBase64Input] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const base64FileInputRef = useRef<HTMLInputElement>(null);

  // Load from URL on component mount
  useEffect(() => {
    loadFromURL();
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
        // Remove the URL parameter after loading
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Erro ao carregar dados da URL:', error);
      }
    }
  };

  const shareViaURL = () => {
    if (!base64Result || !fileName) {
      alert('Nenhum resultado para compartilhar');
      return;
    }

    try {
      const dataToShare = {
        fileName,
        base64: base64Result
      };
      
      const encodedData = btoa(JSON.stringify(dataToShare));
      const shareURL = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
      
      navigator.clipboard.writeText(shareURL).then(() => {
        alert('URL de compartilhamento copiada para área de transferência!\n\nVocê pode acessar este link em qualquer dispositivo para carregar o arquivo.');
      }).catch(() => {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = shareURL;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('URL de compartilhamento copiada!\n\nVocê pode acessar este link em qualquer dispositivo.');
      });
    } catch (error) {
      alert('Erro ao gerar URL de compartilhamento. O arquivo pode ser muito grande.');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (mode === 'encode') {
        processFile(file);
      } else {
        processBase64File(file);
      }
    }
  };

  const handleBase64FileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processBase64File(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (mode === 'encode') {
        processFile(file);
      } else {
        processBase64File(file);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const processFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      alert('Por favor, selecione apenas arquivos .zip');
      return;
    }

    setIsLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      // Remove o prefixo "data:application/zip;base64," se existir
      const base64 = result.split(',')[1] || result;
      setBase64Result(base64);
      setIsLoading(false);
    };

    reader.onerror = () => {
      alert('Erro ao ler o arquivo');
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
    };

    reader.onerror = () => {
      alert('Erro ao ler o arquivo');
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const decodeBase64 = () => {
    if (!base64Input.trim()) {
      alert('Por favor, insira uma string Base64 válida');
      return;
    }

    try {
      setIsLoading(true);
      
      // Limpa a string Base64 removendo espaços e quebras de linha
      const cleanBase64 = base64Input.replace(/\s/g, '');
      
      // Valida se é uma string Base64 válida
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
        throw new Error('String Base64 inválida');
      }

      // Converte Base64 para bytes
      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Cria o blob do arquivo ZIP
      const blob = new Blob([bytes], { type: 'application/zip' });
      
      // Cria link para download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'decoded_file.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsLoading(false);
      alert('Arquivo ZIP decodificado e baixado com sucesso!');
    } catch (error) {
      setIsLoading(false);
      alert('Erro ao decodificar: Verifique se a string Base64 está correta');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(base64Result);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert('Erro ao copiar para a área de transferência');
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
  };

  const clearResult = () => {
    setBase64Result('');
    setBase64Input('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (base64FileInputRef.current) {
      base64FileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerBase64FileInput = () => {
    base64FileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ZIP Base64 Converter
          </h1>
          <p className="text-gray-600">
            Converta arquivos .zip para Base64 ou decodifique Base64 de volta para .zip
          </p>
        </div>

        {/* Mode Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setMode('encode')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === 'encode'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🔒 Encode (.zip → Base64)
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === 'decode'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🔓 Decode (Base64 → .zip)
            </button>
          </div>
        </div>

        {/* Encode Mode */}
        {mode === 'encode' && (
          <>
            {/* Upload Area for ZIP files */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                onClick={triggerFileInput}
              >
                <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-lg text-gray-600 mb-2">
                  Arraste e solte seu arquivo .zip aqui ou clique para selecionar
                </p>
                <p className="text-sm text-gray-400">
                  Apenas arquivos .zip são aceitos
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

            {/* Result Area for Encode */}
            {base64Result && (
              <>
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Resultado Base64
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <FiCopy className="mr-2" />
                        {copySuccess ? 'Copiado!' : 'Copiar'}
                      </button>
                      <button
                        onClick={downloadBase64}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <FiDownload className="mr-2" />
                        Download
                      </button>
                      <button
                        onClick={clearResult}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <FiTrash2 className="mr-2" />
                        Limpar
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Arquivo:</strong> {fileName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Tamanho:</strong> {base64Result.length.toLocaleString()} caracteres
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <code className="text-sm text-gray-700 break-all whitespace-pre-wrap">
                      {base64Result}
                    </code>
                  </div>
                </div>

                {/* Save and Share Options */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    🌐 Compartilhar e Baixar
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-800 mb-2">
                        <FiShare2 className="inline mr-2" />
                        Compartilhar URL
                      </h4>
                      <p className="text-sm text-green-600 mb-3">
                        Gera link para acessar de qualquer PC
                      </p>
                      <button
                        onClick={shareViaURL}
                        className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Gerar Link
                      </button>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-medium text-purple-800 mb-2">
                        <FiDownload className="inline mr-2" />
                        Download Arquivo
                      </h4>
                      <p className="text-sm text-purple-600 mb-3">
                        Baixa .txt para transferir manualmente
                      </p>
                      <button
                        onClick={downloadBase64}
                        className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        Baixar .txt
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>💡 Opções:</strong><br/>
                      • <strong>Compartilhar URL:</strong> Melhor para acessar em outros dispositivos<br/>
                      • <strong>Download:</strong> Para backup ou transferência manual
                    </p>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Decode Mode */}
        {mode === 'decode' && (
          <>
            {/* Input Methods for Base64 */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Métodos de Entrada Base64
              </h2>
              
              {/* Method 1: Paste Base64 String */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Método 1: Colar String Base64
                </h3>
                <div className="space-y-4">
                  <textarea
                    value={base64Input}
                    onChange={(e) => setBase64Input(e.target.value)}
                    placeholder="Cole sua string Base64 aqui..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={decodeBase64}
                      disabled={!base64Input.trim() || isLoading}
                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <FiDownload className="mr-2" />
                      Decodificar e Baixar ZIP
                    </button>
                    <button
                      onClick={clearResult}
                      className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <FiTrash2 className="mr-2" />
                      Limpar
                    </button>
                  </div>
                </div>
              </div>

              {/* Method 2: Upload Base64 File */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Método 2: Upload de Arquivo Base64
                </h3>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer"
                  onClick={triggerBase64FileInput}
                >
                  <FiFileText className="mx-auto text-3xl text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">
                    Arraste e solte um arquivo .txt com Base64 ou clique para selecionar
                  </p>
                  <p className="text-sm text-gray-400">
                    Arquivos de texto (.txt) contendo Base64
                  </p>
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

            {/* Base64 Display for Decode Mode */}
            {base64Input && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Base64 Carregado
                  </h2>
                  <button
                    onClick={decodeBase64}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
                  >
                    <FiDownload className="mr-2" />
                    Decodificar e Baixar ZIP
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Tamanho:</strong> {base64Input.length.toLocaleString()} caracteres
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <code className="text-sm text-gray-700 break-all whitespace-pre-wrap">
                    {base64Input.substring(0, 500)}
                    {base64Input.length > 500 && '... (truncado para exibição)'}
                  </code>
                </div>
              </div>
            )}
          </>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">
                {mode === 'encode' ? 'Codificando arquivo...' : 'Decodificando Base64...'}
              </span>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Como usar:
          </h3>
          
          {mode === 'encode' ? (
            <div>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
                <li>Selecione "Encode" para converter .zip em Base64</li>
                <li>Arraste um arquivo .zip ou clique para selecionar</li>
                <li>Aguarde o processamento automático</li>
                <li>Escolha como compartilhar/baixar o resultado</li>
              </ol>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-800 mb-2">🌐 Opções de Acesso:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li><strong>• Compartilhar URL:</strong> Gera link para acessar de qualquer lugar</li>
                  <li><strong>• Download .txt:</strong> Arquivo para transferir manualmente</li>
                </ul>
              </div>
            </div>
          ) : (
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Selecione "Decode" para converter Base64 em .zip</li>
              <li>Cole a string Base64 na área de texto OU carregue um arquivo .txt</li>
              <li>Clique em "Decodificar e Baixar ZIP"</li>
              <li>O arquivo .zip será baixado automaticamente</li>
            </ol>
          )}
          
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>🌐 Acesso de Outros PCs:</strong><br/>
              • Use "Compartilhar URL" para acessar de qualquer dispositivo<br/>
              • URLs funcionam mesmo no GitHub Pages<br/>
              • Dados ficam codificados na própria URL (sem servidor)
            </p>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>🔒 Privacidade:</strong> Todo processamento é local. Nenhum arquivo é enviado para servidores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZipEncoder;