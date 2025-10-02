# ZIP Base64 Converter

Uma aplicação web completa para converter arquivos .zip em Base64 e vice-versa.

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

### ✨ Recursos Gerais
- **Interface Intuitiva**: Design moderno e responsivo com Tailwind CSS
- **Alternância de Modos**: Botões para alternar entre encode e decode
- **Informações Detalhadas**: Exibe nome do arquivo e tamanho do resultado
- **Processamento Local**: 100% seguro - nenhum dado é enviado para servidores

## 🛠️ Tecnologias Utilizadas

- **React 19** - Biblioteca JavaScript para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Vite** - Build tool moderna e rápida
- **React Icons** - Ícones para interface

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

### Build para Produção
```bash
# Gerar build otimizado
npm run build

# Visualizar build localmente
npm run preview
```

## 🎯 Como Usar

### Modo Encode (.zip → Base64)
1. **Selecione o modo "Encode"** no topo da página
2. **Selecione um arquivo .zip**:
   - Arraste e solte na área de upload, ou
   - Clique na área para abrir o seletor de arquivos
3. **Aguarde o processamento** (automático)
4. **Use o resultado**:
   - Clique em "Copiar" para copiar o Base64 para área de transferência
   - Clique em "Download" para baixar como arquivo .txt
   - Use "Limpar" para processar um novo arquivo

### Modo Decode (Base64 → .zip)
1. **Selecione o modo "Decode"** no topo da página
2. **Escolha o método de entrada**:
   - **Método 1**: Cole a string Base64 na área de texto
   - **Método 2**: Arraste ou selecione um arquivo .txt contendo Base64
3. **Clique em "Decodificar e Baixar ZIP"**
4. **O arquivo .zip será baixado automaticamente**

## 🔒 Segurança

- **Processamento Local**: Todo processamento é feito no navegador (client-side)
- **Sem Upload**: Os arquivos não são enviados para nenhum servidor
- **Privacidade Total**: Seus dados permanecem 100% privados
- **Validação**: Verificação automática da integridade do Base64

## 📱 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões modernas)
- **Dispositivos**: Desktop, tablet e mobile
- **Formatos de Entrada**: 
  - Encode: Arquivos .zip
  - Decode: Strings Base64 ou arquivos .txt

## 🧪 Exemplos de Uso

### Casos de Uso Comuns
- **Backup de Arquivos**: Converter arquivos .zip em Base64 para armazenamento em bancos de dados
- **Transmissão de Dados**: Enviar arquivos compactados via APIs que só aceitam texto
- **Desenvolvimento**: Incorporar recursos binários em código como strings
- **Recuperação**: Decodificar Base64 recebido de APIs ou bancos de dados

### Dicas
- Para arquivos grandes, o processo pode demorar alguns segundos
- O tamanho do Base64 será aproximadamente 33% maior que o arquivo original
- Mantenha uma cópia do Base64 em local seguro antes de fechar a página

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

### v1.0.0
- ✅ Encode de arquivos .zip para Base64
- ✅ Decode de Base64 para arquivos .zip
- ✅ Interface com alternância de modos
- ✅ Suporte a drag & drop
- ✅ Dois métodos de entrada para decode
- ✅ Validação de Base64
- ✅ Processamento 100% client-side