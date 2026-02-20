---
title: "Linux Fundamentals - Shortcuts and Tips"
category: htb
difficulty: easy
tags: [linux, shortcuts, tips, productivity]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 30
---

# Linux Fundamentals - Shortcuts and Tips

## Objetivo

Dominar los atajos de teclado de terminal para aumentar la productividad.

---

## Auto-Completado

| Atajo | Función |
|-------|---------|
| `[TAB]` | Auto-completar comando/archivo |
| `[TAB] [TAB]` | Mostrar opciones disponibles |

---

## Movimiento del Cursor

| Atajo | Función |
|-------|---------|
| `[CTRL] + A` | Inicio de línea |
| `[CTRL] + E` | Fin de línea |
| `[CTRL] + [←]` | Palabra anterior |
| `[CTRL] + [→]` | Siguiente palabra |
| `[ALT] + B` | Retroceder palabra |
| `[ALT] + F` | Avanzar palabra |

---

## Borrar Contenido

| Atajo | Función |
|-------|---------|
| `[CTRL] + U` | Borrar hasta inicio de línea |
| `[CTRL] + K` | Borrar hasta fin de línea |
| `[CTRL] + W` | Borrar palabra anterior |

---

## Pegar Contenido Borrado

| Atajo | Función |
|-------|---------|
| `[CTRL] + Y` | Pegar último texto borrado |

---

## Control de Procesos

| Atajo | Función |
|-------|---------|
| `[CTRL] + C` | Terminar proceso (SIGINT) |
| `[CTRL] + Z` | Suspender proceso (SIGTSTP) |
| `[CTRL] + D` | EOF / Cerrar STDIN |

---

## Historial de Comandos

| Atajo | Función |
|-------|---------|
| `[CTRL] + R` | Buscar en historial |
| `[↑]` | Comando anterior |
| `[↓]` | Comando siguiente |
| `!!` | Repetir último comando |
| `!n` | Ejecutar comando número n |
| `!string` | Último comando que empieza con string |

---

## Limpiar Terminal

| Atajo | Función |
|-------|---------|
| `[CTRL] + L` | Limpiar pantalla |
| `clear` | Comando equivalente |

---

## Navegación Entre Aplicaciones

| Atajo | Función |
|-------|---------|
| `[ALT] + [TAB]` | Cambiar aplicación |

---

## Zoom

| Atajo | Función |
|-------|---------|
| `[CTRL] + [+]` | Acercar |
| `[CTRL] + [-]` | Alejar |

---

## Jobs y Background

```bash
# Enviar a background
comando &

# Ver jobs
jobs

# Traer a foreground
fg %1

# Reanudar en background
bg %1
```

---

## Historial Útil

```bash
# Ver historial
history

# Ejecutar último comando
!!

# Ejecutar comando 42
!42

# Último comando que empieza con "sudo"
!sudo

# Buscar y ejecutar
!sudo:p  # Solo mostrar, no ejecutar
```

---

## Resumen Visual

```
┌─────────────────────────────────────────────────────┐
│                   CURSOR MOVEMENT                    │
├─────────────────────────────────────────────────────┤
│  CTRL+A ──► Inicio    CTRL+E ──► Fin               │
│  CTRL+W ──► Borra palabra   CTRL+U/K ──► Borra línea│
│  CTRL+Y ──► Pegar                               │
├─────────────────────────────────────────────────────┤
│                   PROCESS CONTROL                    │
├─────────────────────────────────────────────────────┤
│  CTRL+C ──► Terminar   CTRL+Z ──► Suspender        │
│  CTRL+D ──► EOF/Exit                               │
├─────────────────────────────────────────────────────┤
│                      HISTORY                         │
├─────────────────────────────────────────────────────┤
│  CTRL+R ──► Buscar    ↑/↓ ──► Navegar              │
│  !! ──► Repetir último                             │
└─────────────────────────────────────────────────────┘
```

---

## Lecciones Aprendidas

1. **[TAB]**: Tu mejor amigo para auto-completar
2. **CTRL+A/E**: Navegación rápida en línea
3. **CTRL+R**: Buscar comandos anteriores
4. **CTRL+C/Z**: Control de procesos
5. **!!**: Repetir último comando

---

## Referencias

- [Bash Manual](https://www.gnu.org/software/bash/manual/)
- [Readline Shortcuts](https://tiswww.case.edu/php/chet/readline/rluserman.html)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 30 - Shortcuts and Tips
- Tipo: Teoría
