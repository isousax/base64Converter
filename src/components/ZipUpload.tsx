import { useState } from 'react';
import { FiUpload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const UPLOAD_URL = 'https://webhook-proxy-eosin.vercel.app/api/upload';

const ZipUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseData, setResponseData] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setResponseMessage('');
    setResponseData('');
    setErrorMessage('');

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
      setFile(null);
      setErrorMessage('Por favor, selecione um arquivo .zip válido.');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Selecione um arquivo .zip antes de enviar.');
      return;
    }

    setIsUploading(true);
    setResponseMessage('');
    setResponseData('');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      let formatted = text;
      try {
        formatted = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        // mantem o texto original se não for JSON
      }

      setResponseMessage('Upload concluído com sucesso.');
      setResponseData(formatted);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido durante o upload.';
      setErrorMessage(`Falha no upload: ${message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Upload de ZIP</h2>
          <p className="text-gray-600 mt-1">
            Selecione um arquivo <strong>.zip</strong> e envie diretamente para a API proxy.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <FiUpload className="text-xl" />
          Endpoint: <span className="font-medium text-gray-700">webhook-proxy-eosin.vercel.app/api/upload</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.5fr_1fr] items-end">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Arquivo ZIP</span>
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            className="mt-2 block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isUploading ? 'Enviando...' : 'Upload'}
        </button>
      </div>

      {file && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          <p><strong>Arquivo selecionado:</strong> {file.name}</p>
          <p><strong>Tamanho:</strong> {(file.size / 1024).toFixed(2)} KB</p>
        </div>
      )}

      {responseMessage && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <div className="flex items-center gap-2 font-medium">
            <FiCheckCircle />
            {responseMessage}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <div className="flex items-center gap-2 font-medium">
            <FiAlertCircle />
            {errorMessage}
          </div>
        </div>
      )}

      {responseData && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-slate-50 p-4 text-sm text-gray-800">
          <h3 className="mb-2 text-base font-semibold text-gray-900">Resposta da API</h3>
          <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap break-words text-xs text-gray-800">
            {responseData}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ZipUpload;
