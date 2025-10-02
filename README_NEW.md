# ZIP to Base64 Encoder

Uma aplicação web simples e eficiente para converter arquivos .zip em Base64.

## 🚀 Funcionalidades

- **Upload de Arquivos**: Suporte a drag & drop e seleção manual de arquivos .zip
- **Conversão Rápida**: Processamento client-side para máxima segurança e velocidade
- **Interface Intuitiva**: Design moderno e responsivo com Tailwind CSS
- **Múltiplas Opções de Saída**: 
  - Copiar para área de transferência
  - Download como arquivo .txt
  - Visualização do resultado na tela
- **Informações Detalhadas**: Exibe nome do arquivo e tamanho do resultado

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

1. **Abra a aplicação** no navegador (http://localhost:5173/)
2. **Selecione um arquivo .zip**:
   - Arraste e solte na área de upload, ou
   - Clique na área para abrir o seletor de arquivos
3. **Aguarde o processamento** (automático)
4. **Use o resultado**:
   - Clique em "Copiar" para copiar o Base64 para área de transferência
   - Clique em "Download" para baixar como arquivo .txt
   - Use "Limpar" para processar um novo arquivo

## 🔒 Segurança

- **Processamento Local**: Todo processamento é feito no navegador (client-side)
- **Sem Upload**: Os arquivos não são enviados para nenhum servidor
- **Privacidade Total**: Seus dados permanecem 100% privados

## 📱 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões modernas)
- **Dispositivos**: Desktop, tablet e mobile
- **Formatos**: Apenas arquivos .zip são aceitos

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