#!/usr/bin/env python3
"""
Script para agregar hints a los desafíos CTF existentes
"""

import json

# Leer el archivo JSON
with open(
    "/Users/statick/apps/cursos/landing-page/src/data/all-challenges.json",
    "r",
    encoding="utf-8",
) as f:
    data = json.load(f)

# Hints por defecto para cada desafío CTF (ajustar según corresponda)
hints_map = {
    "academy/nmap-default": {
        "hint1": "¿Qué opción de nmap escanea todos los puertos?",
        "hint2": "Usa -p- para escanear todos los puertos TCP",
        "hint3": "El puerto 31337 contiene la flag",
    },
    "crypto/caesar-cipher": {
        "hint1": "Es un cifrado de sustitución monoalfabética",
        "hint2": "ROT13 es un caso especial con desplazamiento de 13",
        "hint3": "Usa el comando tr para transformar caracteres",
    },
    "forensics/hidden-in-plainsight": {
        "hint1": "Revisa las cadenas ocultas en la imagen",
        "hint2": "Usa strings y steghide",
        "hint3": 'La password es "secret"',
    },
    "forensics/hidden-metadata-pdf": {
        "hint1": "Los metadatos del PDF contienen información",
        "hint2": "Usa exiftool para extraer metadatos",
        "hint3": "Busca campos como Producer o Creator",
    },
    "forensics/log-hunt": {
        "hint1": "Los logs del servidor contienen la flag",
        "hint2": "Usa grep para buscar patrones específicos",
        "hint3": 'Busca "HTB{" o "flag" en los logs',
    },
}

# Agregar hints a los desafíos CTF
for challenge in data.get("ctf", []):
    challenge_id = challenge.get("id")
    if challenge_id in hints_map:
        challenge["hints"] = hints_map[challenge_id]
    else:
        challenge["hints"] = {
            "hint1": "Analiza el escenario cuidadosamente",
            "hint2": "Revisa las herramientas mencionadas en el writeup",
            "hint3": "Piensa fuera de lo común",
        }

# Guardar el archivo actualizado
with open(
    "/Users/statick/apps/cursos/landing-page/src/data/all-challenges.json",
    "w",
    encoding="utf-8",
) as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ CTF hints added successfully!")
