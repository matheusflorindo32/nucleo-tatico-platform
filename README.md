<div align="center">

# NÚCLEO TÁTICO PLATFORM

### Arquitetura full-stack para uma plataforma educacional orientada por dados

[![Status](https://img.shields.io/badge/status-base%20de%20produto-F59E0B?style=flat-square)](#status-e-escopo)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=111827)](frontend/)
[![Node.js](https://img.shields.io/badge/Node.js-API-339933?style=flat-square&logo=nodedotjs&logoColor=white)](backend/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?style=flat-square&logo=postgresql&logoColor=white)](backend/)
[![Site](https://img.shields.io/badge/ABRIR-NÚCLEO%20TÁTICO-D4AF37?style=for-the-badge)](https://www.nucleotatico.com)

</div>

---

## Visão geral

O **Núcleo Tático Platform** é a base técnica de uma plataforma para preparação de concursos públicos. O monorepo organiza frontend, backend e tipos compartilhados, com foco em evolução modular, indicadores de aprendizagem e personalização futura.

## Arquitetura

| Workspace | Responsabilidade | Stack principal |
|---|---|---|
| `frontend/` | interface, navegação e visualização de progresso | React, TypeScript, Vite, TanStack Query, Zustand |
| `backend/` | API, autenticação e regras de negócio | Node.js, Express, TypeScript |
| `shared/` | tipos e utilitários comuns | TypeScript |
| persistência | dados estruturados e migrações | PostgreSQL, Prisma |
| apoio | cache, segurança e comunicação | Redis, JWT, Socket.io |

## Capacidades projetadas

- organização de cursos, módulos e exercícios;
- plano de estudo e acompanhamento de progresso;
- indicadores educacionais;
- autenticação e perfis;
- personalização de conteúdo;
- recomendações assistidas por dados;
- experiência responsiva.

## Execução local

### Pré-requisitos

- Node.js 18+;
- npm;
- PostgreSQL;
- Redis quando os módulos dependentes estiverem habilitados.

```bash
git clone https://github.com/matheusflorindo32/nucleo-tatico-platform.git
cd nucleo-tatico-platform
npm install
cp .env.example .env
npm run dev
```

Comandos úteis:

```bash
npm run build
npm run test
npm run lint
npm run type-check
```

## Organização

```text
nucleo-tatico-platform/
├── frontend/
├── backend/
├── shared/
├── docs/
├── scripts/
└── package.json
```

## Status e escopo

Este repositório representa uma **base de produto em desenvolvimento**. Funcionalidades descritas como projetadas ou planejadas não devem ser interpretadas como serviço público já disponível. O produto institucional publicado e suas entregas devem ser consultados no [site oficial](https://www.nucleotatico.com).

Modelos de IA, recomendações e métricas educacionais exigem validação, transparência, proteção de dados e supervisão humana antes de uso em produção.

## Competências demonstradas

`Arquitetura Full-Stack` · `React` · `Node.js` · `TypeScript` · `PostgreSQL` · `Prisma` · `Produto Educacional`

---

<div align="center">

**“Não negocie com sua mente.”**  
Desenvolvido por **Matheus Florindo de Deus**  
[Núcleo Tático](https://www.nucleotatico.com) · [Tropa Científica](https://www.tropacientifica.com) · [GitHub](https://github.com/matheusflorindo32)

</div>
