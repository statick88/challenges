# Proposal: Sistema de Citas IEEE para Curso SDD

## Intent

Implementar un sistema de referencias bibliográficas IEEE nativo de Quarto que:
1. Use el formato correcto de BibTeX para IEEE
2. Genere hipervínculos automáticos en las referencias
3. Cite inline donde se utilizan los conceptos
4. Mantenga narrativa de investigador en ciberseguridad

## Scope

### In Scope
- Actualizar `references.bib` con formato IEEE correcto
- Agregar `link-citations: true` y `csl: ieee.csl` en configuración
- Citas inline en todos los módulos donde se mencionan conceptos
- Verificar que Quarto genera hipervínculos automáticamente

### Out of Scope
- Cambiar contenido narrativo del curso
- Agregar nuevas referencias no mencionadas

## Approach

1. **Configurar Quarto** para IEEE con hipervínculos
2. **Actualizar references.bib** con URLs correctas
3. **Agregar citas inline** donde se usan conceptos
4. **Verificar render** con hipervínculos funcionando

## Risks

- Bajo: Quarto maneja IEEE nativamente, solo requiere configuración correcta

## Rollback

Revertir commits si las citas no generan hipervínculos
