# ZIP Base64 Converter

Uma aplicação web completa para converter arquivos .zip em Base64 e vice-versa, **com funcionalidades de salvamento sem precisar de backend!**

## 🚀 Funcionalidades

### 🔒 Modo Encode (.zip → Base64)
- **Upload de Arquivos**: Suporte a drag & drop e seleção manual de arquivos .zip
- **Conversão Rápida**: Processamento client-side para máxima segurança e velocidade
- **Múltiplas Opções de Saída**: 
  - Copiar para área de transferência
  - Download como arquivo .txt
  - Visualização do resultado na tela

### 🔓 Modo Decode (Base64 → .zip)
- **Dois Métodos de Entrada**:
  - Colar string Base64 diretamente em uma textarea
  - Upload de arquivo .txt contendo Base64
- **Validação Automática**: Verifica se a string Base64 é válida
- **Download Direto**: Converte e baixa automaticamente o arquivo .zip
- **Tratamento de Erros**: Feedback claro em caso de Base64 inválido

### 💾 **Funcionalidades de Salvamento (SEM BACKEND!)**
- **LocalStorage**: Salva até 10 arquivos no navegador atual
- **URL Sharing**: Gera links para acessar de qualquer PC/dispositivo
- **Download Automático**: Baixa arquivos .txt para transferência manual
- **Gerenciamento**: Lista, carrega e exclui arquivos salvos

### ✨ Recursos Gerais
- **Interface Intuitiva**: Design moderno e responsivo com Tailwind CSS
- **Alternância de Modos**: Botões para alternar entre encode e decode
- **Informações Detalhadas**: Exibe nome do arquivo e tamanho do resultado
- **Processamento Local**: 100% seguro - nenhum dado é enviado para servidores

## 🌐 Acesso de Outros PCs (Sem Backend!)

### Método 1: URL Compartilhada (RECOMENDADO)
1. Faça encode do arquivo
2. Clique em "Gerar Link" 
3. Copie a URL gerada
4. Acesse a URL de qualquer PC/dispositivo
5. O arquivo será carregado automaticamente

### Método 2: Download e Upload Manual
1. Faça encode do arquivo
2. Clique em "Baixar .txt"
3. Transfira o arquivo .txt para outro PC
4. No outro PC, use modo "Decode" → "Upload de Arquivo Base64"

### Método 3: LocalStorage (Mesmo Navegador)
1. Faça encode e clique em "Salvar no Navegador"
2. Acesse "Ver Arquivos Salvos"
3. Funciona apenas no mesmo navegador/dispositivo

## 🛠️ Tecnologias Utilizadas

- **React 19** - Biblioteca JavaScript para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Vite** - Build tool moderna e rápida
- **React Icons** - Ícones para interface
- **Browser APIs**: LocalStorage, URL params, File API

## 📦 Instalação e Uso

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Navegue até o diretório
cd obk-encondebase64-v1

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Deploy no GitHub Pages
```bash
# Build para produção
npm run build

# O conteúdo da pasta 'dist' pode ser usado no GitHub Pages
```

## 🎯 Como Usar

### Modo Encode (.zip → Base64)
1. **Selecione o modo "Encode"** no topo da página
2. **Selecione um arquivo .zip**:
   - Arraste e solte na área de upload, ou
   - Clique na área para abrir o seletor de arquivos
3. **Aguarde o processamento** (automático)
4. **Escolha como salvar**:
   - **Salvar Localmente**: Para uso no mesmo navegador
   - **Gerar Link**: Para acessar de outros PCs
   - **Baixar .txt**: Para transferência manual

### Modo Decode (Base64 → .zip)
1. **Selecione o modo "Decode"** no topo da página
2. **Escolha o método de entrada**:
   - **Método 1**: Cole a string Base64 na área de texto
   - **Método 2**: Arraste ou selecione um arquivo .txt contendo Base64
3. **Clique em "Decodificar e Baixar ZIP"**
4. **O arquivo .zip será baixado automaticamente**

## 🔒 Segurança e Privacidade

- **Processamento Local**: Todo processamento é feito no navegador (client-side)
- **Sem Upload**: Os arquivos não são enviados para nenhum servidor
- **Privacidade Total**: Seus dados permanecem 100% privados
- **URLs Seguras**: Dados codificados na própria URL (sem servidor)
- **LocalStorage**: Dados ficam apenas no seu navegador

## 📱 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões modernas)
- **Dispositivos**: Desktop, tablet e mobile
- **GitHub Pages**: Totalmente compatível
- **Formatos de Entrada**: 
  - Encode: Arquivos .zip
  - Decode: Strings Base64 ou arquivos .txt

## 🧪 Exemplos de Uso

### Casos de Uso Comuns
- **Trabalho Remoto**: Encode no escritório, decode em casa
- **Backup de Arquivos**: Converter arquivos .zip em Base64 para armazenamento
- **Transmissão de Dados**: Enviar arquivos compactados via APIs que só aceitam texto
- **Desenvolvimento**: Incorporar recursos binários em código como strings
- **Colaboração**: Compartilhar arquivos via URLs sem serviços de upload

### Exemplo Prático: Acessar de Outro PC
```
1. PC A: Encode arquivo.zip → Gera link
2. Compartilha: https://seusite.github.io?data=eyJ0aW1lc3RhbXAiOjE2OTQ...
3. PC B: Acessa o link → Arquivo carregado automaticamente
4. PC B: Pode decodificar de volta para .zip
```

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto é de uso livre para fins educacionais e pessoais.

## 🆘 Suporte

Se encontrar algum problema ou tiver sugestões, abra uma issue no repositório.

## 📋 Changelog

### v2.0.0 - Funcionalidades de Salvamento
- ✅ LocalStorage para salvar até 10 arquivos
- ✅ URL sharing para acesso cross-device
- ✅ Download automático de arquivos Base64
- ✅ Interface para gerenciar arquivos salvos
- ✅ Carregamento automático via URL

### v1.0.0 - Versão Inicial
- ✅ Encode de arquivos .zip para Base64
- ✅ Decode de Base64 para arquivos .zip
- ✅ Interface com alternância de modos
- ✅ Suporte a drag & drop
- ✅ Dois métodos de entrada para decode
- ✅ Validação de Base64
- ✅ Processamento 100% client-side