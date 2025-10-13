Frontend — KaizerHaus (React + Vite + TypeScript)

Interface web do restaurante KaizerHaus, construída com React (Vite + TypeScript).
Consome a API do backend KaizerHaus (FastAPI) via variável de ambiente VITE_API_URL.

✅ Pré-requisitos

Node.js 18+ (LTS recomendado)
• Windows/macOS/Linux: baixe no site oficial (nodejs.org).
• Verifique instalação: node -v e npm -v.
• Opcional: use gerenciador de versões (nvm/ volta) para facilitar upgrades.

Git
• Necessário para clonar o repositório (git-scm.com/downloads).

Backend em execução (opcional, mas recomendado)
• Por padrão, o frontend espera a API em http://localhost:8001.
• Ajuste a variável VITE_API_URL se a porta/host forem diferentes.

📦 Clonar o projeto

Execute: git clone https://github.com/<seu-usuario>/<seu-repo-frontend>.git.

Acesse a pasta: cd <seu-repo-frontend>.

🔐 Variáveis de ambiente (Vite)

Crie um arquivo .env na raiz do projeto.

Defina: VITE_API_URL=http://localhost:8001.

Importante: em projetos Vite, todas as variáveis acessíveis no código precisam começar com VITE_.

Após criar ou alterar o .env, reinicie o servidor do Vite.

No código, acesse via import.meta.env.VITE_API_URL.

📥 Instalar dependências

Instale as dependências com npm install (ou pnpm install / yarn).

Se ocorrer erro de peer dependencies, atualize o Node para a LTS mais recente ou use o gerenciador de pacotes de sua preferência.

▶️ Rodar em desenvolvimento

Inicie o Vite: npm run dev.

Acesse no navegador: normalmente http://localhost:5173.

Se precisar trocar a porta, execute npm run dev -- --port 5174 ou configure server.port no vite.config.ts.

🧱 Build e pré-visualização

Geração de build: npm run build (saída em dist/).

Pré-visualização local do build: npm run preview.

Para deploy (Vercel/Netlify/GitHub Pages), publique o conteúdo de dist/ e configure a variável VITE_API_URL no provedor.

🌐 CORS e comunicação com o backend

Garanta que o backend permite a origem do frontend (ex.: http://localhost:5173) em sua configuração de CORS.

Em produção, adicione o domínio real do frontend (ex.: https://app.seudominio.com) às origens permitidas no backend.

Se usar HTTPS no frontend e HTTP no backend, podem surgir avisos de “mixed content”; prefira HTTPS para ambos em produção.

🧭 Convenções e estrutura (sugestão)

src/ com subpastas: components/, pages/, routes/, contexts/, services/, styles/, assets/.

Serviço de API centralizado (ex.: services/api.ts) lendo import.meta.env.VITE_API_URL.

Rotas com react-router-dom conforme necessidade (ex.: páginas de Cardápio, Sacola, Admin, etc.).

Estilos: utilizar CSS/Tailwind conforme o projeto.

Tipos e interfaces TypeScript para dados (ex.: Produtos, Categorias, Pedidos).

🧰 Scripts comuns (npm)

npm run dev — inicia o servidor de desenvolvimento do Vite.

npm run build — gera build de produção.

npm run preview — pré-visualiza o build localmente.

npm run lint (se configurado) — validação de código.

npm run format (se configurado) — formatação (ex.: Prettier).

🗂️ .gitignore recomendado

node_modules/.

dist/.

.env, .env.local, .env.*.local.

Cache/artefatos da sua IDE: .idea/, .vscode/.

Arquivos temporários do SO (ex.: Thumbs.db, .DS_Store).

🧪 Teste rápido de integração

Certifique-se de que o backend está rodando em http://localhost:8001.

Garanta que o .env do frontend contém VITE_API_URL=http://localhost:8001.

Abra a aplicação (npm run dev) e realize uma chamada simples (ex.: listar categorias/produtos).

Se houver erro de rede, verifique CORS no backend e a URL em VITE_API_URL.

🆘 Solução de problemas

Variáveis do Vite não carregam: confirme o prefixo VITE_, salve o .env e reinicie o Vite.

CORS bloqueando requisições: inclua a origem do frontend no CORS do backend; confira se o token/headers estão corretos.

404 em rotas no refresh (SPA): configure fallback para index.html no provedor (Vercel/Netlify) ou use redirects apropriados.

Erros de tipagem TS: cheque versões de @types/react, typescript e libs; alinhe a versão do TS com o template do Vite.

Assets não encontrados em produção: use caminhos relativos ou import para imagens, e confira a base do Vite (base no vite.config.ts) se o app não estiver na raiz do domínio.

Build falha: rode npm ci para instalação limpa; verifique warnings de peer deps; ajuste versões no package.json.

Ambiente corporativo/Proxy: configure variáveis HTTP_PROXY/HTTPS_PROXY se necessário ou use npm config set proxy.

🚀 Deploy (visão geral)

Configure a variável VITE_API_URL no ambiente de produção do provedor (Vercel/Netlify/Render/etc.).

Faça o build no CI/CD ou localmente e publique a pasta dist/.

Habilite redirecionamento SPA (roteamento no client).

Garanta que o backend aceite a origem do domínio de produção em CORS.

Se usar domínio customizado, configure DNS/SSL (HTTPS) no provedor.

🔒 Boas práticas

Nunca versione arquivos .env.

Valide entradas do usuário no frontend e backend.

Trate estados de loading/erro em todas as telas de chamada à API.

Mantenha dependências atualizadas periodicamente.

Use mensagens de commit claras e padronizadas.