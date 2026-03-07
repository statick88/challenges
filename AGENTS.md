# AGENTS.md - Guidelines for AI Coding Agents

This file provides comprehensive guidelines for AI agents working in the technical challenges repository - a unified DevOps learning platform containing Linux, Docker, DevOps, and CTF challenges.

---

## 🏗️ Repository Overview

### **Project Type**: Interactive Learning Platform with Dashboard

- **Primary Content**: Markdown files with technical challenges and detailed solutions
- **Frontend**: Astro 5.x + Tailwind CSS with dynamic routing
- **Structure**: Unified repository with four main programs (Linux, Docker, DevOps, CTF)
- **Purpose**: Learning progress tracking with interactive challenge visualization
- **Target Audience**: DevOps learners, system administrators, security enthusiasts

### **Architecture**:

```
technical-challenges/
├── challenges/              # Challenge content organized by program
│   ├── linux/              # Linux system administration challenges
│   ├── docker/             # Docker containerization challenges
│   ├── devops/            # 100 Days DevOps challenges
│   └── ctf/               # Capture The Flag challenges
│       ├── crypto/        # Cryptography challenges
│       ├── web/           # Web security challenges
│       ├── pwn/           # Binary exploitation
│       ├── forensics/     # Digital forensics
│       ├── reversing/     # Reverse engineering
│       └── misc/          # Miscellaneous challenges
├── src/                    # Astro source code
│   ├── components/        # Reusable Astro components
│   │   ├── ChallengeModal.astro    # Modal for challenge solutions
│   │   └── ChallengeCard.astro     # Card component for listings
│   ├── layouts/           # Page layouts
│   ├── pages/             # Route pages
│   │   ├── challenges/    # Dynamic challenge routes
│   │   │   ├── linux/
│   │   │   │   └── [id].astro      # Individual Linux challenge pages
│   │   │   ├── docker/
│   │   │   │   └── [id].astro      # Individual Docker challenge pages
│   │   │   ├── devops/
│   │   │   │   └── [id].astro      # Individual DevOps challenge pages
│   │   │   └── ctf/
│   │   │       └── [...slug].astro # CTF challenges with nested routes
│   │   └── index.astro    # Dashboard homepage
│   ├── utils/             # Utility functions
│   │   └── challenge-parser.ts     # Markdown parser for challenges
│   └── styles/            # Global styles
├── dist/                   # Build output (Astro static generation)
├── scripts/                # Automation and validation scripts
│   ├── validation/        # Challenge validation scripts
│   └── generate-challenges-data.js
├── templates/              # Reusable documentation templates
│   └── ctf-*.md           # CTF challenge templates by category
├── docs/                  # Setup guides and best practices
├── assets/                 # Shared resources
└── README.md              # Main repository portal
```

---

## 🎯 Spec-Driven Development (SDD) - Gentleman Programming

> 📚 **Basado en**: Gentleman Programming Book - "Cómo ser TONY STARK con IA"
> 
> El SDD es una metodología que combina Spec-Driven Development con Agentes IA, Subagentes y Memoria Persistente para crear un flujo de trabajo profesional de desarrollo de software.

### **Filosofía SDD**

Según el **Gentleman Programming Book**, el desarrollo de software con IA requiere un enfoque sistemático donde la especificación precede a la implementación. Este enfoque garantiza que:

1. **La IA nunca asume** - Siempre trabaja con specs documentadas
2. **El cambio es trazable** - Cada modificación pasa por un proceso formal
3. **El conocimiento persiste** - Las decisiones se guardan en memoria para referencia futura
4. **La verificación es automática** - La implementación se valida contra specs antes de archivar

> 💡 **Cita del Gentleman Programming Book**: *"El agente que asume es el enemigo de la calidad. Un agente profesional trabaja con specs, no con suposiciones."*

---

### **Flujo SDD Completo**

El flujo SDD sigue el ciclo: **Proposal → Specs → Design → Tasks → Apply → Verify → Archive**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FLUJO SDD - GENTLEMAN PROGRAMMING                  │
│                                                                              │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐                │
│   │ PROPOSE │───►│  SPEC   │───►│ DESIGN  │───►│  TASKS  │                │
│   └─────────┘    └─────────┘    └─────────┘    └─────────┘                │
│        │                                               │                    │
│        │                                               ▼                    │
│        │                                        ┌─────────┐                │
│        │                                        │  APPLY  │                │
│        │                                        └─────────┘                │
│        │                                               │                    │
│        │                                               ▼                    │
│        │                                        ┌─────────┐                │
│        └───────────────────────────────────────►│ VERIFY  │                │
│                                                 └─────────┘                │
│                                                        │                    │
│                                                        ▼                    │
│                                                 ┌─────────┐                │
│                                                 │ ARCHIVE │                │
│                                                 └─────────┘                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### **Comandos SDD**

| Comando | Propósito | Skill SDD |
|---------|-----------|------------|
| `/sdd:init` | Inicializar openspec/ en el proyecto | `sdd-init` |
| `/sdd:explore <topic>` | Explorar ideas e investigar | `sdd-explore` |
| `/sdd:new <change-name>` | Crear nueva propuesta de cambio | `sdd-propose` |
| `/sdd:spec` | Escribir especificaciones (delta specs) | `sdd-spec` |
| `/sdd:design` | Crear documento de diseño técnico | `sdd-design` |
| `/sdd:tasks` | Desglosar en tareas ejecutables | `sdd-tasks` |
| `/sdd:ff <name>` | Fast-forward: crear todos los artifacts | - |
| `/sdd:apply` | Implementar las tareas | `sdd-apply` |
| `/sdd:verify` | Validar implementación vs specs | `sdd-verify` |
| `/sdd:archive` | Sincronizar specs y archivar cambio | `sdd-archive` |

---

### **Estructura openspec/**

```
proyecto/
└── openspec/
    ├── config.yaml                 # Configuración del proyecto SDD
    ├── specs/                     # Specs principales (fuente de verdad)
    │   └── {domain}/
    │       └── spec.md
    ├── design/                    # Documentos de diseño
    │   └── {domain}/
    │       └── design.md
    └── changes/                   # Cambios en progreso y archivados
        ├── {change-name}/
        │   ├── proposal.md        # Intención del cambio
        │   ├── specs/            # Delta specs (específicos del cambio)
        │   │   └── {domain}/
        │   │       └── spec.md
        │   ├── design.md         # Diseño del cambio
        │   ├── tasks.md          # Checklist de tareas
        │   └── verify-report.md   # Reporte de verificación
        └── archive/              # Cambios completados
            └── YYYY-MM-DD-{change-name}/
```

---

### **Protocolo de Memoria (Engram)**

> 📚 **Referencia**: Gentleman Programming Book - Capítulo de Memoria Persistente

El protocolo de memoria es **OBLIGATORIO** según las prácticas de Gentleman Programming. El agente debe guardar en Engram:

#### **Cuándo Guardar (OBLIGATORIO)**

1. **Decisiones de Arquitectura**:
   ```typescript
   // Guardar con: mem_save
   {
     title: "Chose Zustand over Redux",
     type: "decision",
     content: "**What**: Replaced express-session with jsonwebtoken\n**Why**: Session storage doesn't scale\n**Learned**: Must set httpOnly and secure flags"
   }
   ```

2. **Bugs Encontrados y Fixes**:
   ```typescript
   {
     title: "Fixed N+1 query in UserList",
     type: "bugfix",
     content: "**What**: Added eager loading with include()\n**Where**: src/store/user.ts"
   }
   ```

3. **Patrones Establecidos**:
   ```typescript
   {
     title: "Naming convention: use camelCase for APIs",
     type: "pattern"
   }
   ```

4. **Preferencias del Usuario**:
   ```typescript
   {
     title: "User prefers Tailwind over CSS modules",
     type: "preference",
     scope: "personal"
   }
   ```

#### **Cuándo Buscar**

- El usuario pregunta: "¿recuerdas cómo...?"
- Antes de empezar tarea similar a trabajo anterior
- Cuando el usuario menciona tema sin contexto

#### **Session Summary (OBLIGATORIO)**

Al terminar cada sesión, el agente debe llamar a `mem_session_summary`:

```markdown
## Goal
[Qué estábamos trabajando]

## Instructions
[Preferencias descubiertas]

## Discoveries
- [Hallazgos técnicos, gotchas]

## Accomplished
- ✅ [Tarea completada 1]
- ✅ [Tarea completada 2]

## Next Steps
- [Qué falta por hacer]

## Relevant Files
- path/to/file.ts — [qué hace]
```

> 💡 **Cita del Gentleman Programming Book**: *"La memoria es lo que diferencia a un agente profesional de uno amateur. Sin memoria, cada sesión empieza desde cero."*

---

### **Skills SDD Disponibles**

| Skill Canonical | Fuente primaria | Espejos compatibles | Propósito |
|-------|----------|-----------|-----------|
| `sdd-init` | `~/.agents/skills/sdd-init/` | `~/.kilocode/skills/sdd-init/`, `~/.claude/skills/sdd-init/` | Bootstrap de openspec/ |
| `sdd-explore` | `~/.agents/skills/sdd-explore/` | `~/.kilocode/skills/sdd-explore/`, `~/.claude/skills/sdd-explore/` | Investigar código existente |
| `sdd-propose` | `~/.agents/skills/sdd-propose/` | `~/.kilocode/skills/sdd-propose/`, `~/.claude/skills/sdd-propose/` | Crear propuesta de cambio |
| `sdd-spec` | `~/.agents/skills/sdd-spec/` | `~/.kilocode/skills/sdd-spec/`, `~/.claude/skills/sdd-spec/` | Escribir especificaciones |
| `sdd-design` | `~/.agents/skills/sdd-design/` | `~/.kilocode/skills/sdd-design/`, `~/.claude/skills/sdd-design/` | Diseño técnico |
| `sdd-tasks` | `~/.agents/skills/sdd-tasks/` | `~/.kilocode/skills/sdd-tasks/`, `~/.claude/skills/sdd-tasks/` | Desglose de tareas |
| `sdd-apply` | `~/.agents/skills/sdd-apply/` | `~/.kilocode/skills/sdd-apply/`, `~/.claude/skills/sdd-apply/` | Implementar tareas |
| `sdd-verify` | `~/.agents/skills/sdd-verify/` | `~/.kilocode/skills/sdd-verify/`, `~/.claude/skills/sdd-verify/` | Validar vs specs |
| `sdd-archive` | `~/.agents/skills/sdd-archive/` | `~/.kilocode/skills/sdd-archive/`, `~/.claude/skills/sdd-archive/` | Archivar cambio |

---

### **Matriz SDD Multi-Agente (gentle-ai + openspec)**

`gentle-ai` estandariza el workflow SDD para que el mismo proceso funcione con cualquier agente de codificación.

| Agente IA | Entrada principal | Skills/Config recomendada | Resultado |
|-----------|-------------------|---------------------------|-----------|
| **Codex** | `AGENTS.md` + `openspec/` | `~/.agents/skills/sdd-*` y/o `~/.codex/skills/*` | Mismo flujo SDD completo |
| **Claude Code** | `~/.claude/AGENTS.md` + `openspec/` | `~/.claude/skills/sdd-*` (sync con `~/.agents/skills`) | Mismo flujo SDD completo |
| **Kilo Code** | `~/.kilocode/custom_modes.yaml` + `openspec/` | `~/.kilocode/skills/sdd-*` | Mismo flujo SDD completo |
| **OpenCode** | Config de OpenCode + `openspec/` | `~/.codex/skills/opencode` + `~/.agents/skills/sdd-*` | Mismo flujo SDD completo |
| **Amp** | Config de Amp + `openspec/` | `~/.codex/skills/amp` + `~/.agents/skills/sdd-*` | Mismo flujo SDD completo |

#### **Reglas de Organización Unificadas**

1. **Un solo estándar de specs**: todas las decisiones viven en `openspec/` (fuente de verdad).
2. **Un solo set canonical de skills SDD**: mantener `~/.agents/skills/sdd-*` como base y sincronizar espejos.
3. **Mismos comandos en todos los agentes**: `/sdd:init`, `/sdd:new`, `/sdd:spec`, `/sdd:design`, `/sdd:tasks`, `/sdd:apply`, `/sdd:verify`, `/sdd:archive`.
4. **Memoria persistente transversal**: usar Engram MCP para decisiones, bugs, patrones y preferencias.
5. **Verificación obligatoria**: no archivar cambios sin `sdd-verify`.

#### **Resource-Aware Skill Loading (Refactor 2026)**

Para optimizar recursos (tokens, latencia y contexto), el enrutamiento de skills queda centralizado en:

- `openspec/skill-router.yaml`
- `openspec/config.yaml` (`skill_router.strategy: minimal-load`)

Política mínima obligatoria:

1. Cargar máximo `3` skills concurrentes.
2. Activar máximo `2` MCP servers simultáneamente.
3. Mantener `engram` como memoria base y activar `context7/spec-coding` solo por fase.
4. Descargar skills de fase al completar cada comando SDD.
5. Bloquear `/sdd:apply` sin `tasks.md` y `/sdd:archive` sin `verify-report.md`.

---

### **Ejemplo Práctico: tailscale-mesh-network**

A continuación un ejemplo real de cómo se aplicó SDD en este proyecto:

#### **1. Proposal** (`sdd-propose`)
```markdown
# Proposal: Tailscale Mesh Network for Multi-VM Environment

## Intent
Establecer una red privada mesh entre MacBook Pro, Kali Linux VM y Debian VM...

## Scope
- Instalar y configurar Tailscale en las 3 máquinas
- Configurar SSH con autenticación de clave pública
- Documentar la topología de red
```

#### **2. Specs** (`sdd-spec`)
```markdown
# Delta for Tailscale Mesh Network

## ADDED Requirements

### Requirement: Tailscale Mesh VPN Connectivity
The system MUST provide a mesh VPN network...

#### Scenario: All nodes register with Tailscale network
- GIVEN Tailscale is installed on all nodes
- WHEN each node executes `tailscale up --authkey=<auth-key>`
- THEN each node receives a unique Tailscale IP
```

#### **3. Design** (`sdd-design`)
```markdown
# Design: Tailscale Mesh Network

## Technical Approach
Usar Tailscale como overlay network para crear una mesh VPN...

## Architecture Decisions
- **Decision**: Tailscale vs ZeroTier vs WireGuard
- **Choice**: Tailscale
- **Rationale**: NAT traversal automático, setup simplificado con auth keys
```

#### **4. Tasks** (`sdd-tasks`)
```markdown
## Phase 1: Network Diagnostics
- [x] 1.1 Escanear red local desde Mac
- [x] 1.2 Verificar tabla ARP

## Phase 2: Firewall Configuration
- [x] 2.1 Verificar estado de UFW
- [ ] 2.2 Configurar reglas de firewall
```

#### **5. Verify Report** (`sdd-verify`)
```markdown
## Verification Report

### Completeness
| Tasks Total | Completed | Incomplete |
|-------------|-----------|------------|
| 26          | 17        | 9          |

### Verdict: ⚠️ PASS WITH WARNINGS
```

#### **6. Archive**
- Specs delta → se copian a `openspec/specs/network/spec.md`
- Change folder → se mueve a `openspec/changes/archive/YYYY-MM-DD-{change-name}/`

---

### **Integración con Engram**

Según el **Gentleman Programming Book**, el agente debe:

1. **Guardar automáticamente** cada decisión de implementación
2. **Buscar proactivamente** antes de empezar trabajo similar
3. **Al final de sesión**, siempre hacer `mem_session_summary`

```bash
# Verificar que Engram esté corriendo
curl http://127.0.0.1:7437/health

# Ver contexto reciente
engram context

# Buscar decisiones previas
engram search "tailscale"
```

---

### **Mejores Prácticas SDD**

> 📚 **Basado en**: Gentleman Programming Book - Best Practices

1. **Nunca archivar sin verificar** - Siempre ejecutar `sdd-verify` antes de archivar
2. **Mantener specs sincronizadas** - Los cambios deben reflejarse en specs principales
3. **Documentar el estado real** - Las tasks deben reflejar el estado actual de implementación
4. **Usar memoria proactivamente** - Buscar decisiones previas antes de asumir
5. **Nunca asumir** - Si hay duda, preguntar al usuario o buscar en memoria

---

### **Referencias**

- **Gentleman Programming Book**: https://the-amazing-gentleman-programming-book.vercel.app/en
- **OpenSpec**: https://openspec.dev/
- **gentle-ai**: https://github.com/Gentleman-Programming/gentle-ai
- **Video**: https://www.youtube.com/watch?v=c5Gwx0RcxNE
- **Engram**: https://github.com/Gentleman-Programming/engram
- **MCP Spec**: https://modelcontextprotocol.io
- **Skills SDD (canonical)**: `~/.agents/skills/sdd-*/`
- **Espejos de skills**: `~/.kilocode/skills/sdd-*/`, `~/.claude/skills/sdd-*/`
- **Configuración Local Kilo**: `~/.kilocode/kilocode.json`, `~/.kilocode/custom_modes.yaml`
- **Router SDD del proyecto**: `openspec/skill-router.yaml`

---

## 🎨 Narrative Style Guidelines

### **Role-Based Storytelling**

Each challenge category requires a distinct instructional voice and perspective:

#### **Linux Challenges - SysAdmin Instructor**

- **Voice**: Professional, methodical, security-conscious
- **Perspective**: "Think like a Senior System Administrator"
- **Key Elements**:
  - Pre-execution verification ("measure twice, cut once")
  - Deep architectural explanations (/etc/passwd internals, permission systems)
  - Security best practices and troubleshooting scenarios
  - Real-world enterprise considerations
- **Template Structure**:

  ```markdown
  ## 🎓 Del Instructor: [Context setting]

  > 💭 Mentalidad de SysAdmin: [Critical thinking principle]

  ## 🎭 Escenario Real: [Business context]

  ## 🧠 La Arquitectura: [Deep technical explanation]

  ## 🛠️ Implementación Profesional: [Step-by-step with reasoning]

  ## 🎯 Análisis Post-Implementación: [What was built]

  ## 🎓 Reflexión Final: [Mentalidad desarrollada]
  ```

#### **CTF Challenges - Ethical Hacker Instructor**

- **Voice**: Curious, skeptical, investigative
- **Perspective**: "Think like an Ethical Hacker / Forensic Analyst"
- **Key Elements**:
  - Suspicious mindset ("appearances deceive")
  - OSINT methodology (Intelligence gathering)
  - Attack/defense scenarios with real case studies
  - Tool arsenals and automation scripts
- **Template Structure**:

  ```markdown
  ## 🎓 Del Instructor: [Security mindset]

  > 🎯 Mentalidad de Hacker: [Trust nothing principle]

  ## 🎭 El Escenario: [Incident response scenario]

  ## 🧠 Fundamentos de Análisis: [Forensic methodology]

  ## 🔍 Metodología de Investigación: [Systematic approach]

  ## 🛠️ Arsenal de Herramientas: [Tools used]

  ## 🎯 Lecciones del Mundo Real: [Real attack cases]
  ```

#### **HTB Academy Challenges**

HTB Academy integrates picoCTF challenges with enhanced Ethical Hacker narratives, focusing on practical forensics, cryptography, and web security skills. Recent additions include:

- **Reto 01 - Hidden Confidential Document** (`challenges/ctf/reto01/`): Forensics challenge extracting metadata from PDF files using base64 decoding and exiftool.
- **Reto 02 - Server Log Hunt** (`challenges/ctf/reto02/`): Log analysis challenge searching for fragmented flags in Apache server logs using grep and regex patterns.
- **Reto 03 - Hidden in Image** (`challenges/ctf/reto03/`): Steganography challenge extracting hidden data from JPEG images using steghide and password-based extraction.

Each HTB Academy challenge follows the Ethical Hacker template with:

- Suspicious mindset ("appearances deceive" - files can hide secrets)
- OSINT methodology for intelligence gathering
- Tool arsenals (exiftool, grep, steghide, strings)
- Real-world attack case studies (data exfiltration, log poisoning)
- Step-by-step forensic investigation workflows

#### **Docker Challenges - Platform Engineer Instructor**

- **Voice**: Architectural, scalability-focused, automation-oriented
- **Perspective**: "Think like a Platform Engineer / DevOps Architect"
- **Key Elements**:
  - Scale considerations (10, 100, 1000 servers)
  - Infrastructure as Code mindset
  - Production readiness checklists
  - Observability and monitoring from day one
- **Template Structure**:

  ```markdown
  ## 🎓 Del Instructor: [Platform thinking]

  > 🎯 Mentalidad DevOps: [Design before implementation]

  ## 🎭 Escenario Empresarial: [Production migration scenario]

  ## 🧠 Arquitectura: [Container ecosystem deep dive]

  ## 🛠️ Implementación Profesional: [Enterprise-grade setup]

  ## 📊 Checklist de Producción: [Operational readiness]

  ## 🎓 Reflexión Final: [From installer to engineer]
  ```

#### **DevOps Challenges - DevOps Coach**

- **Voice**: Process-oriented, CI/CD focused, collaborative
- **Perspective**: "Think like a DevOps Culture Champion"
- **Key Elements**:
  - Automation and pipeline thinking
  - Collaboration between dev and ops
  - Metrics and continuous improvement
  - Toolchain integration

### **Common Narrative Elements**

All challenge types should include:

- 🎓 **Instructor Persona**: Expert voice with teaching mindset
- 🎭 **Real-world Scenarios**: Business contexts, not abstract exercises
- 🧠 **Mentalidad del Rol**: Mindset and thinking patterns
- 💭 **Pensamiento Crítico**: "Why" before "how"
- ⚠️ **Advertencias**: Common pitfalls and mistakes
- 🎓 **Lecciones Aprendidas**: Key takeaways and insights
- 🚀 **Próximos Pasos**: Career roadmap and progression

---

## 🛠️ Build/Lint/Test Commands

### **Frontend Build (Astro)**

```bash
# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Production build (generates static site in dist/)
npm run build

# Preview production build locally
npm run preview

# Generate challenge data for dashboard
node scripts/generate-challenges-data.js
```

### **Challenge Validation Suite**

Run validation before committing to ensure content quality:

```bash
# Run all validations
npm run validate:all

# Individual validators
npm run validate              # Structure validation (naming patterns)
npm run validate:frontmatter  # Front matter checks (YAML schema)
npm run validate:consistency  # Cross-file consistency checks
npm run validate:health       # Repository health report

# JSON output for CI/CD integration
npm run validate -- --json

# Single challenge validation
challenge_file="challenges/linux/retos/01-creacion-usuarios/README.md"
node scripts/validation/validate-structure.js "$challenge_file"
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | No errors (warnings may exist) |
| 1 | Errors found |
| 2 | Fatal system error |

### **Markdown Quality Assurance**

```bash
# Install validation tools globally
npm install -g markdownlint-cli2 markdown-link-check

# Validate markdown syntax
markdownlint-cli2 "challenges/**/*.md" "docs/**/*.md"

# Check for broken links
find challenges/ -name "*.md" -exec markdown-link-check {} \;
```

### **Frontend Testing**

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Validate Astro components
npx astro check

# Lint CSS and JS
npm run lint
```

---

## 📋 Content Creation Guidelines

### **Challenge Documentation Structure**

Each challenge must follow this comprehensive structure:

````markdown
---
title: "Descriptive Challenge Title"
category: [linux|docker|devops|ctf]
difficulty: [1-5 or easy|medium|hard]
tags: [relevant, technical, tags]
date: YYYY-MM-DD
status: [completed|in_progress|ready]
[ctf-specific:]
platform: [picoCTF|HTB|etc.]
flag: [CTF flag value]
---

# 🎓 [Challenge Title]

## [Role-specific subtitle]

---

👨‍🏫 **Del Instructor**: [Expert introduction and mindset context]

> 💭 **Mentalidad [del Rol]**: [Key thinking principle]

---

## 🎭 [Escenario Real/El Caso/Contexto Empresarial]

[Detailed scenario setting with business context]

**Tu misión como [rol]**: [Specific objectives]

## 🧠 [Fundamentos/Arquitectura/Conceptos Clave]

[Deep technical explanation with diagrams if needed]

## 🛠️ [Implementación/Investigación/Solución Paso a Paso]

### Paso 1: [Action Name]

```bash
# Command with detailed explanation in comments
command --with --options
```
````

**Análisis**: [Why this command, what each option does]

> 💡 **Nota técnica**: [Important technical insight]

### Paso 2: [Next Action]

...

## ✅ [Checklist de Verificación/Validación]

- [ ] [Verification item 1]
- [ ] [Verification item 2]

## 🎓 [Lo Que Acabas de Aprender/Reflexión Final]

[Key concepts, best practices, mentalidad desarrollada]

## 🚀 [Próximos Pasos/Siguientes Retos]

[Roadmap and progression path]

## 📚 [Recursos/Referencias]

[Links to documentation, tools, further reading]

---

## ✅ Estado

**[ESTADO]** 🎉

- 📅 Fecha: YYYY-MM-DD
- ⏱️ Tiempo: XX minutos
- 🎯 Dificultad: [level]

````

### **Markdown Rendering Requirements**

When displaying markdown content in Astro pages:

1. **Install marked library**:
   ```bash
   npm install marked
````

2. **Import and use in Astro pages**:

   ```astro
   ---
   import { marked } from 'marked';

   // Parse markdown to HTML
   const htmlContent = marked.parse(markdownContent);
   ---

   <div class="markdown-body" set:html={htmlContent} />
   ```

3. **Required CSS for .markdown-body**:

   ```css
   .markdown-body {
     font-family:
       system-ui,
       -apple-system,
       sans-serif;
     line-height: 1.8;
     color: #e5e7eb;
   }

   .markdown-body h1 {
     font-size: 2rem;
     font-weight: 700;
     color: #f97316;
     margin: 2rem 0 1rem;
     padding-bottom: 0.5rem;
     border-bottom: 1px solid #374151;
   }

   .markdown-body h2 {
     font-size: 1.5rem;
     font-weight: 600;
     color: #22d3ee;
     margin: 1.75rem 0 1rem;
   }

   .markdown-body h3 {
     font-size: 1.25rem;
     font-weight: 600;
     color: #a5f3fc;
     margin: 1.5rem 0 0.75rem;
   }

   .markdown-body code {
     background: rgba(6, 182, 212, 0.15);
     color: #22d3ee;
     padding: 0.2rem 0.5rem;
     border-radius: 0.375rem;
     font-family: "SF Mono", Monaco, monospace;
   }

   .markdown-body pre {
     background: #0f172a;
     padding: 1rem;
     border-radius: 0.75rem;
     overflow-x: auto;
     border: 1px solid #1e293b;
   }

   .markdown-body pre code {
     background: transparent;
     padding: 0;
     color: #a5b4fc;
   }

   .markdown-body table {
     width: 100%;
     margin: 1rem 0;
     border-collapse: collapse;
   }

   .markdown-body th {
     background: rgba(55, 65, 81, 0.5);
     color: #fbbf24;
     font-weight: 600;
     padding: 0.75rem;
     border: 1px solid #374151;
   }

   .markdown-body td {
     color: #d1d5db;
     padding: 0.75rem;
     border: 1px solid #374151;
   }
   ```

### **Front Matter Schema**

```yaml
---
# Required fields
title: "string" # Descriptive title
category: "string" # linux|docker|devops|ctf
difficulty: number|string # 1-5 or easy/medium/hard
tags: # Array of relevant tags
  - tag1
  - tag2
date: "YYYY-MM-DD" # ISO 8601 format
status: "string" # completed|in_progress|ready

# Optional fields
duration: "XX minutes" # Estimated completion time
platform: "string" # For CTF: picoCTF, HTB, etc.
flag: "string" # For CTF challenges (use carefully)
author: "string" # Original author
---
```

---

## 🎨 Component Guidelines

### **ChallengeModal Component**

Used to display step-by-step solutions in an interactive modal.

**Props Interface**:

```typescript
interface Step {
  title: string;
  commands?: string[];
  output?: string;
  explanation?: string;
}

interface ChallengeModalProps {
  id: string;
  title: string;
  category: string;
  difficulty?: string;
  flag?: string;
  steps?: Step[];
  summary?: string;
  tools?: string[];
  verification?: string[];
  troubleshooting?: string;
  learnings?: string[];
}
```

**Usage**:

```astro
<ChallengeModal
  id={id}
  title={cleanTitle}
  category="linux"
  difficulty={frontMatter.difficulty}
  steps={steps}
  summary={summary}
  verification={['Item 1', 'Item 2']}
/>
```

### **Dynamic Routing**

**File Structure for Dynamic Routes**:

```
src/pages/challenges/
├── linux/
│   └── [id].astro           # Matches /challenges/linux/01-creacion-usuarios
├── docker/
│   └── [id].astro           # Matches /challenges/docker/reto-1-install
├── devops/
│   └── [id].astro           # Matches /challenges/devops/day-01-linux-user-setup
└── ctf/
    └── [...slug].astro      # Matches /challenges/ctf/crypto/caesar-cipher
```

**getStaticPaths Pattern**:

```astro
---
export async function getStaticPaths() {
  const basePath = './challenges/category';
  const paths = [];

  // Read challenge files
  const files = fs.readdirSync(basePath)
    .filter(f => f.endsWith('.md'));

  files.forEach(file => {
    paths.push({
      params: { id: file.replace('.md', '') }
    });
  });

  return paths;
}
---
```

---

## 🔧 Development Patterns

### **Parsing Challenge Data**

```typescript
// src/utils/challenge-parser.ts
import fs from "fs";

export function parseFrontMatter(content: string): Record<string, any> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const yaml = match[1];
  const frontMatter: Record<string, any> = {};

  yaml.split("\n").forEach((line) => {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) {
      let value = m[2].trim().replace(/^["']|["']$/g, "");
      if (value.startsWith("[")) {
        frontMatter[m[1]] = value
          .replace(/[\[\]]/g, "")
          .split(",")
          .map((v: string) => v.trim().replace(/['"]/g, ""));
      } else {
        frontMatter[m[1]] = value;
      }
    }
  });

  return frontMatter;
}
```

### **Extracting Steps from Markdown**

````typescript
interface Step {
  title: string;
  commands?: string[];
  output?: string;
  explanation?: string;
}

function parseSteps(content: string): Step[] {
  const steps: Step[] = [];
  const mainContent = content.replace(/^---[\s\S]*?---/, "");

  // Match step sections
  const stepMatches = mainContent.match(
    /(?:### \d+\.|###\s+)([^\n]+)\n([\s\S]*?)(?=(?:### \d+\.|###\s+)|## |$)/g,
  );

  if (stepMatches) {
    stepMatches.forEach((step: string) => {
      const titleMatch = step.match(/(?:### \d+\.|###\s+)([^\n]+)/);
      const title = titleMatch ? titleMatch[1].trim() : "Paso";

      const cmdBlock = step.match(/```bash\n([\s\S]*?)```/);
      const cmds = cmdBlock
        ? cmdBlock[1]
            .split("\n")
            .filter((c: string) => c.trim() && !c.trim().startsWith("#"))
            .map((c: string) => c.trim())
        : [];

      steps.push({ title, commands: cmds });
    });
  }

  return steps;
}
````

---

## 🏷️ Naming Conventions

### **Challenge Files**

- **Linux**: `XX-descripcion-del-reto/README.md`
  - Example: `01-creacion-usuarios/README.md`
- **Docker**: `reto-XX-descripcion.md`
  - Example: `reto-1-install-docker.md`
- **DevOps**: `day-XX-descripcion.md`
  - Example: `day-01-linux-user-setup.md`
- **CTF**:
  - Root: `retoXX-writeup.md`
  - Subdirectories: `[category]/descripcion.md`
  - HTB Academy: `retoXX/` directories with README.md, writeup files, and challenge assets
  - Examples: `crypto/caesar-cipher.md`, `reto01/README.md`, `reto02/server.log`

### **Astro Files**

- **Pages**: `[param].astro` for dynamic routes
- **Components**: `PascalCase.astro`
- **Layouts**: `LayoutName.astro`

### **Variables and Functions**

- **TypeScript/JavaScript**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Components**: PascalCase
- **Files**: kebab-case

---

## ⚠️ Error Handling

### **Build Errors**

- **Missing marked import**: Ensure `npm install marked` is run
- **Type errors**: Check that `marked.parse()` receives a string
- **Routing errors**: Verify `getStaticPaths()` returns valid params

### **Content Errors**

- **Invalid front matter**: Must be valid YAML between `---` markers
- **Broken links**: Use relative paths for internal links
- **Missing sections**: All narrative sections must be present

### **Validation Errors**

```bash
# If validation fails, check:
1. Front matter syntax (no tabs, proper YAML)
2. File naming conventions
3. Required sections present
4. Links not broken
```

---

## 📊 Quality Checklist

### **Before Committing**

- [ ] Content follows role-based narrative style
- [ ] Front matter is complete and valid
- [ ] Markdown renders correctly with marked
- [ ] Code blocks specify language
- [ ] All steps have explanations
- [ ] Challenge has verification checklist
- [ ] No sensitive data (passwords, keys) exposed
- [ ] Links are relative (not absolute URLs)
- [ ] Build succeeds (`npm run build`)
- [ ] Validation passes (`npm run validate:all`)

### **Content Review**

- [ ] Narrative voice matches challenge category
- [ ] Real-world scenario provided
- [ ] Mentalidad del Rol section included
- [ ] Technical explanations are clear
- [ ] Troubleshooting section included
- [ ] Próximos pasos / Roadmap provided
- [ ] Cheat sheet or quick reference included

---

## 🔒 Security Reminders

- **Never commit real credentials** (use training/test values only)
- **Flag values** should be in CTF writeups but marked clearly
- **SSH keys** and certificates go in `.gitignore`
- **Server IPs** in examples should be from RFC 1918 (private ranges)
- **Training environments** only - never production credentials

---

## 🚀 Deployment

### **Static Site Generation**

```bash
# Build for production
npm run build

# Output goes to dist/
# Deploy dist/ to any static host:
# - Vercel
# - Netlify
# - GitHub Pages
# - AWS S3
```

### **Environment Variables**

Create `.env` for local development (not committed):

```
PUBLIC_SITE_URL=http://localhost:4322
```

---

## 📚 Additional Resources

### **Documentation**

- [Astro Docs](https://docs.astro.build)
- [Tailwind CSS](https://tailwindcss.com)
- [Marked.js](https://marked.js.org)
- [Challenge Narrative Templates](./landing-page/templates/)

### **Scripts Reference**

- `npm run validate` - Validate challenge structure
- `npm run validate:frontmatter` - Check front matter
- `npm run validate:consistency` - Cross-file validation
- `npm run validate:health` - Repository health
- `npm run validate:all` - Run all validators

---

_AGENTS.md v2.2 | Last Updated: 2026-02-26 | Repository: Technical Challenges_
_Compatible con SDD + Gentleman Programming Book_
