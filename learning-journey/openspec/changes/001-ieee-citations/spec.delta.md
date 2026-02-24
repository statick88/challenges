# Spec Delta: Sistema de Citas IEEE

## Requirements

### REQ-1: Formato IEEE Nativo de Quarto
The system SHALL use Quarto's native IEEE citation format.
- MUST include `csl: ieee.csl` or use default IEEE style
- MUST include `link-citations: true` for clickable references
- MUST include `bibliography: references.bib` in each module

### REQ-2: Hipervínculos en Referencias
The system SHALL generate clickable links in the references section.
- URLs MUST be clickable hyperlinks
- DOIs MUST link to https://doi.org/{doi}
- Online sources MUST show full URL as clickable link

### REQ-3: Citas Inline Donde se Usan Conceptos
Each reference SHALL be cited where the concept is introduced.
- NOT just at the end in a "References" section
- MUST use `[@citationkey]` format inline
- Multiple citations: `[@cite1; @cite2]`

### REQ-4: Referencias IEEE Completas
The bibliography file SHALL include complete IEEE-formatted entries.

| Cita | Autor | Título | URL |
|------|-------|--------|-----|
| @karpathy2025vibe | A. Karpathy | Vibe Coding | https://x.com/karpathy/status/... |
| @bockeler2025sdd | B. Böckeler | Understanding Spec-Driven Development | https://martinfowler.com/articles/... |
| @brooker2025kiro | M. Brooker | Kiro and the Future of Development | https://aws.amazon.com/blogs/developer/... |
| @delimarsky2025speckit | D. Delimarsky | GitHub Spec Kit | https://github.com/github/spec-kit |
| @precursor2025manifesto | Precursor | Context Architecture Manifesto | https://precursor.dev/manifesto |
| @strategyradar2025tdd | StrategyRadar.ai | Task-Driven Development with AI | https://strategyradar.ai/guides/... |
| @engram2025memory | Gentleman Programming | Engram: Persistent Memory | https://github.com/Gentleman-Programming/engram |
| @anthropic2025mcp | Anthropic | Model Context Protocol | https://modelcontextprotocol.io |
| @yc2025ai | Y Combinator | YC Winter 2025 Batch Statistics | https://www.ycombinator.com/blog/... |
| @saavedra2026sdd | D. Saavedra | SDD Course | https://statick88.github.io |

### REQ-5: Narrativa de Investigador
Content SHALL maintain narrative of software researcher entering cybersecurity.
- "Como investigador en desarrollo de software..."
- Referencias a papers y fuentes académicas
- Tono académico pero accesible

## Scenarios

### SCENARIO-1: Usuario Lee Módulo y Ve Cita
**Given** un usuario lee el módulo 00-contexto-historico.qmd
**When** encuentra la definición de "vibe coding"
**Then** ve la cita inline `[@karpathy2025vibe]`
**And** puede hacer clic en la referencia al final para ir al tweet original

### SCENARIO-2: Usuario Ve Referencias al Final
**Given** un usuario llega a la sección de referencias
**When** ve la lista de referencias IEEE
**Then** cada URL es un hipervínculo clickeable
**And** el formato sigue IEEE (autor, título, año, URL)

### SCENARIO-3: Múltiples Citas en Un Concepto
**Given** el módulo 02-comparativa-herramientas.qmd
**When** se comparan herramientas SDD
**Then** se citan múltiples fuentes `[@bockeler2025sdd; @brooker2025kiro; @delimarsky2025speckit]`
