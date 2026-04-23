# 🎯 Núcleo Tático - Plataforma Educacional Premium

**Plataforma de preparação para concursos públicos com inteligência artificial, personalização e resultados mensuráveis.**

## 🚀 Visão

Transformar a preparação para concursos públicos através de uma plataforma inteligente que combina conteúdo premium, algoritmos de personalização e métricas de desempenho para maximizar chances de aprovação.

## 🏗️ Arquitetura

```
nucleo-tatico-platform/
├── frontend/          # Aplicação React/Next.js
├── backend/           # API Node.js/Express
├── shared/           # Código compartilhado (types, utils)
├── docs/             # Documentação
└── scripts/          # Scripts de automação
```

## 🎯 Funcionalidades Principais

### 🎓 Conteúdo Educacional
- Cursos premium por área de concurso
- Módulos estruturados com progressão lógica
- Exercícios com feedback imediato
- Simulados realistas

### 🧠 Inteligência Artificial
- Sistema de recomendação neural
- Análise preditiva de desempenho
- Personalização dinâmica de conteúdo
- Otimização de plano de estudo

### 📈 Métricas e Analytics
- Dashboard de progresso personalizado
- KPIs educacionais e de negócio
- Alertas e insights preditivos
- Relatórios de desempenho

### 🎨 Experiência do Usuário
- Design System próprio e consistente
- Interface otimizada para aprendizado
- Experiência mobile-first
- Acessibilidade (WCAG 2.1)

## 🛠️ Tecnologias

### Frontend
- **React 18** com TypeScript
- **Next.js 14** (App Router)
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **TanStack Query** para gerenciamento de estado
- **Zustand** para estado global

### Backend
- **Node.js** com TypeScript
- **Express.js** para API
- **PostgreSQL** com Prisma ORM
- **Redis** para cache e sessões
- **JWT** para autenticação
- **Socket.io** para real-time

### IA/Machine Learning
- **TensorFlow.js** para modelos no browser
- **Python** para processamento pesado
- **scikit-learn** para algoritmos clássicos
- **LangChain** para processamento de texto

### Infraestrutura
- **Docker** para containerização
- **PostgreSQL** para dados estruturados
- **Redis** para cache
- **Prometheus/Grafana** para monitoramento
- **GitHub Actions** para CI/CD

## 🚀 Começando

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- Git

### Instalação Local

1. **Clone o repositório:**
```bash
git clone https://github.com/nucleo-tatico/platform.git
cd nucleo-tatico-platform
```

2. **Configure variáveis de ambiente:**
```bash
cp .env.example .env
# Edite .env com suas configurações
```

3. **Inicie com Docker:**
```bash
npm run docker:up
```

4. **Ou instale localmente:**
```bash
npm run setup
npm run dev
```

### URLs de Desenvolvimento
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Docs:** http://localhost:3000/api-docs
- **Grafana:** http://localhost:3001 (admin/admin)
- **Prometheus:** http://localhost:9090

## 📁 Estrutura do Projeto

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── app/          # Next.js App Router
│   ├── components/   # Componentes React
│   ├── lib/          # Utilitários, hooks
│   ├── styles/       # Estilos globais
│   └── types/        # Tipos TypeScript
├── public/           # Assets estáticos
└── package.json
```

### Backend (`/backend`)
```
backend/
├── src/
│   ├── api/          # Rotas da API
│   ├── middleware/   # Middlewares
│   ├── models/       # Modelos de dados
│   ├── services/     # Lógica de negócio
│   ├── utils/        # Utilitários
│   └── types/        # Tipos TypeScript
├── prisma/           # Schema e migrations
└── package.json
```

## 🧪 Testes

```bash
# Todos os testes
npm run test

# Testes do frontend
npm run test:frontend

# Testes do backend
npm run test:backend

# Testes E2E
npm run test:e2e
```

## 📈 Deployment

### Produção
```bash
# Build para produção
npm run build

# Deploy com Docker
docker-compose -f docker-compose.prod.yml up -d
```

### Staging
```bash
# Deploy para staging
npm run deploy:staging
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

- **Matheus Florindo** - Fundador & Product Owner
- **Equipe de Desenvolvimento** - Engenharia
- **Equipe de Conteúdo** - Especialistas em concursos
- **Equipe de Design** - UX/UI

## 📞 Contato

- **Website:** [nucleotatico.com.br](https://nucleotatico.com.br)
- **Email:** contato@nucleotatico.com.br
- **Telegram:** @nucleotatico

---

**"Não negocie com sua mente!"** - Foco em ação e resultados mensuráveis. ⚡