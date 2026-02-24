# Design: Sistema de Citas IEEE

## Architecture Decisions

### ADR-1: Usar IEEE CSL Nativo de Quarto
**Context**: Quarto soporta IEEE nativamente pero requiere configuración
**Decision**: Usar `link-citations: true` en `_quarto.yml` para hipervínculos automáticos
**Consequences**: URLs serán clickeables automáticamente

### ADR-2: Archivo references.bib por Directorio
**Context**: El curso está en `ai-workflows/`
**Decision**: Colocar `references.bib` en `ai-workflows/` y referenciarlo en cada `.qmd`
**Consequences**: Cada módulo puede agregar `bibliography: references.bib` en front matter

### ADR-3: Citas Inline, No Solo al Final
**Context**: Las citas deben aparecer donde se usa el concepto
**Decision**: Agregar `[@key]` después de cada mención de concepto
**Consequences**: El lector ve la fuente inmediatamente

## Technical Approach

### Paso 1: Actualizar _quarto.yml
```yaml
format:
  html:
    theme: solar
    toc: true
    code-fold: true
    highlight-style: github
    lang: es-ES
    link-citations: true
```

### Paso 2: Formato IEEE en references.bib
```bibtex
@online{karpathy2025vibe,
  author = {Karpathy, Andrej},
  title = {Vibe Coding},
  year = {2025},
  month = feb,
  url = {https://x.com/karpathy/status/1886192175589794371},
  urldate = {2026-02-24}
}
```

### Paso 3: Citas Inline en Cada Módulo
```markdown
En febrero 2025, Andrej Karpathy definió "vibe coding" 
como la práctica de generar código con IA sin entenderlo 
completamente [@karpathy2025vibe].
```

### Paso 4: Sección de Referencias
```markdown
## Referencias

::: {#refs}
:::
```

## Components Affected

| Archivo | Cambio |
|---------|--------|
| `_quarto.yml` | Agregar `link-citations: true` |
| `ai-workflows/references.bib` | Actualizar formato IEEE |
| `ai-workflows/*.qmd` | Agregar citas inline |

## Verification

1. Renderizar: `quarto render`
2. Verificar que cada `[1]` en el texto es un link a la referencia
3. Verificar que cada URL en referencias es clickeable
