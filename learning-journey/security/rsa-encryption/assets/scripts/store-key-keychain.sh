#!/bin/bash
# store-key-keychain.sh
# Almacena una clave RSA en macOS Keychain con codificación Base64

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
Uso: $0 <clave-archivo> [nombre-servicio]

Argumentos:
  clave-archivo    Ruta al archivo de clave privada (PEM)
  nombre-servicio  Nombre del servicio en Keychain (opcional)

Ejemplo:
  $0 ~/.ssh/id_rsa my-ssh-key
  $0 /path/to/server.key production-api-key
EOF
  exit 1
fi

KEY_FILE="$1"
SERVICE_NAME="${2:-$(basename "$KEY_FILE")}"
ACCOUNT="${USER:-$(whoami)}"

if [ ! -f "$KEY_FILE" ]; then
  error "El archivo '$KEY_FILE' no existe"
fi

if ! openssl rsa -in "$KEY_FILE" -check -noout 2>/dev/null; then
  error "El archivo '$KEY_FILE' no es una clave RSA válida"
fi

if security find-generic-password -a "$ACCOUNT" -s "$SERVICE_NAME" &>/dev/null; then
  info "Ya existe una entrada con el nombre '$SERVICE_NAME'"
  read -p "¿Deseas actualizarla? (s/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Ss]$ ]]; then
    security delete-generic-password -a "$ACCOUNT" -s "$SERVICE_NAME"
    info "Entrada anterior eliminada"
  else
    error "Operación cancelada"
  fi
fi

ENCODED_KEY=$(cat "$KEY_FILE" | base64)

security add-generic-password \
  -a "$ACCOUNT" \
  -s "$SERVICE_NAME" \
  -w "$ENCODED_KEY"

if security find-generic-password -a "$ACCOUNT" -s "$SERVICE_NAME" -w &>/dev/null; then
  success "Clave almacenada exitosamente"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 Detalles:"
  echo "   Cuenta:    $ACCOUNT"
  echo "   Servicio:  $SERVICE_NAME"
  echo "   Archivo:   $KEY_FILE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Para recuperar la clave, usa:"
  echo "  retrieve-key-keychain.sh $SERVICE_NAME"
else
  error "No se pudo verificar el almacenamiento"
fi
