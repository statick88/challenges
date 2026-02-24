#!/bin/bash
# retrieve-key-keychain.sh
# Recupera una clave RSA de macOS Keychain y la decodifica de Base64

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

error() {
  echo -e "${RED}❌ ERROR: $1${NC}" >&2
  exit 1
}

success() {
  echo -e "${GREEN}✅ $1${NC}"
}

info() {
  echo -e "${YELLOW}ℹ️  $1${NC}"
}

if [ $# -lt 1 ]; then
  cat <<EOF
Uso: $0 <nombre-servicio> [archivo-salida]

Argumentos:
  nombre-servicio  Nombre del servicio en Keychain
  archivo-salida   Archivo donde guardar la clave (opcional)
                   Si no se especifica, muestra en stdout

Ejemplos:
  $0 my-ssh-key                    # Muestra la clave en pantalla
  $0 my-ssh-key ~/.ssh/restored_key # Guarda en archivo
  $0 production-api-key /tmp/api.pem
EOF
  exit 1
fi

SERVICE_NAME="$1"
OUTPUT_FILE="${2:-}"
ACCOUNT="${USER:-$(whoami)}"

if ! security find-generic-password -a "$ACCOUNT" -s "$SERVICE_NAME" &>/dev/null; then
  error "No se encontró ninguna entrada con el nombre '$SERVICE_NAME'"
fi

ENCODED_KEY=$(security find-generic-password -a "$ACCOUNT" -s "$SERVICE_NAME" -w 2>/dev/null)

if [ -z "$ENCODED_KEY" ]; then
  error "No se pudo recuperar la clave"
fi

DECODED_KEY=$(echo "$ENCODED_KEY" | base64 -d)

if ! echo "$DECODED_KEY" | openssl rsa -check -noout 2>/dev/null; then
  error "La clave recuperada no es válida o está corrupta"
fi

if [ -n "$OUTPUT_FILE" ]; then
  echo "$DECODED_KEY" > "$OUTPUT_FILE"
  chmod 600 "$OUTPUT_FILE"
  
  success "Clave recuperada y guardada en '$OUTPUT_FILE'"
  
  if openssl rsa -in "$OUTPUT_FILE" -check -noout 2>/dev/null; then
    success "Verificación de integridad exitosa"
  else
    error "La clave guardada no pasa la verificación de integridad"
  fi
  
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 Detalles:"
  echo "   Servicio:  $SERVICE_NAME"
  echo "   Archivo:   $OUTPUT_FILE"
  echo "   Permisos:  $(stat -f '%Lp' "$OUTPUT_FILE")"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
  echo "$DECODED_KEY"
fi
