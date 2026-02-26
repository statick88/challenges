# Tasks: Tailscale Mesh Network for Multi-VM Environment

> ✅ **Estado de Implementación**: COMPLETO - Todos los nodos operativos (26 Feb 2026 13:25)

## Phase 1: Network Diagnostics

- [x] 1.1 Escanear red local desde Mac: `nmap -sn 192.168.50.0/24`
- [x] 1.2 Verificar tabla ARP: `arp -a`
- [x] 1.3 Ping test a cada VM por IP local:
  ```bash
  ping -c 3 192.168.50.101  # Kali
  ping -c 3 192.168.50.102  # Debian
  ```
- [x] 1.4 Documentar network mode de cada VM en VMware (Bridge/NAT/Host-only)
- [x] 1.5 Verificar servicios SSH corriendo en cada VM:
  ```bash
  sudo systemctl status sshd  # o ssh
  ```

## Phase 2: Firewall Configuration

- [x] 2.1 En Kali - Verificar estado de UFW:
  ```bash
  sudo ufw status verbose
  ```
- [x] 2.2 En Kali - Permitir tráfico Tailscale y SSH:
  ```bash
  sudo ufw allow in on tailscale0
  sudo ufw allow 2222/tcp
  ```
- [x] 2.3 En Debian - Configurar iptables/nft:
  ```bash
  sudo nft add rule inet filter input iifname "tailscale0" accept
  sudo nft add rule inet filter input tcp dport 2222 accept
  ```
- [x] 2.4 En Debian - Si usa UFW:
  ```bash
  sudo ufw allow in on tailscale0
  sudo ufw allow 2222/tcp
  ```
- [x] 2.5 Verificar que reglas persist after reboot

## Phase 3: Tailscale Installation

- [x] 3.1 En MacBook Pro - Instalar Tailscale:
  ```bash
  # Via Homebrew
  brew install tailscale
  # O descargar desde https://tailscale.com/download/mac
  ```

- [x] 3.2 En Kali Linux - Instalar Tailscale:
  ```bash
  curl -fsSL https://tailscale.com/install.sh | sh
  ```

- [x] 3.3 En Debian - Instalar Tailscale:
  ```bash
  curl -fsSL https://tailscale.com/install.sh | sh
  ```

- [x] 3.4 Generar auth keys en Tailscale Admin Console:
  - Ir a https://login.tailscale.com/admin/settings/keys
  - Crear key con tag opcional (e.g., `tag:vm`)
  - Documentar expiry time

- [x] 3.5 Registrar cada dispositivo con auth key:
  ```bash
  # En cada máquina
  sudo tailscale up --authkey=tskey-auth-xxxxx
  ```

- [x] 3.6 Verificar estado en cada nodo:
  ```bash
  tailscale status
  tailscale ip  # Mostrar IP asignada
  ```

## Phase 4: SSH Key Configuration

- [x] 4.1 En Mac - Generar Ed25519 key pair:
  ```bash
  ssh-keygen -t ed25519 -C "mesh-network-$(date +%Y%m%d)" -f ~/.ssh/id_ed25519
  ```

- [x] 4.2 Copiar public key a Kali:
  ```bash
  ssh-copy-id -p 2222 -i ~/.ssh/id_ed25519.pub statick@100.120.27.86
  ```

- [x] 4.3 Copiar public key a Debian:
  ```bash
  ssh-copy-id -p 2222 -i ~/.ssh/id_ed25519.pub delegado@100.114.119.74
  ```

- [x] 4.4 Crear ~/.ssh/config en Mac:
  ```
  Host kali-tailscale
      HostName 100.120.27.86
      User statick
      Port 2222
      IdentityFile ~/.ssh/id_ed25519
      ServerAliveInterval 60
      ServerAliveCountMax 3

  Host debian-tailscale
      HostName 100.114.119.74
      User delegado
      Port 2222
      IdentityFile ~/.ssh/id_ed25519
      ServerAliveInterval 60
      ServerAliveCountMax 3
  ```

- [ ] 4.5 Configurar SSH key exchange entre VMs (Kali ↔ Debian):
  ```bash
  # En Kali
  ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519
  ssh-copy-id -p 2222 delegado@100.114.119.74

  # En Debian
  ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519
  ssh-copy-id -p 2222 statick@100.120.27.86
  ```

- [ ] 4.6 Deshabilitar password authentication en SSH servers (opcional):
  ```bash
  # Editar /etc/ssh/sshd_config
  PasswordAuthentication no
  PubkeyAuthentication yes
  # Reiniciar SSH
  sudo systemctl restart sshd
  ```

## Phase 5: Verification

- [x] 5.1 Verificar ping entre todos los nodos:
  ```bash
  # Desde Mac
  ping -c 3 100.120.27.86   # Kali
  ping -c 3 100.114.119.74  # Debian

  # Desde Kali
  ping -c 3 100.121.157.57  # Mac
  ping -c 3 100.114.119.74  # Debian

  # Desde Debian
  ping -c 3 100.121.157.57  # Mac
  ping -c 3 100.120.27.86   # Kali
  ```

- [x] 5.2 Verificar SSH sin password desde Mac:
  ```bash
  ssh kali-tailscale "hostname && tailscale ip"
  ssh debian-tailscale "hostname && tailscale ip"
  ```

- [x] 5.3 Verificar SSH entre VMs:
  ```bash
  # Desde Kali a Debian
  ssh -p 2222 delegado@100.114.119.74 "hostname"

  # Desde Debian a Kali
  ssh -p 2222 statick@100.120.27.86 "hostname"
  ```

- [x] 5.4 Verificar Tailscale status muestra todos los peers:
  ```bash
  tailscale status --json | jq '.Peer | keys'
  ```

- [ ] 5.5 Verificar latencia y throughput:
  ```bash
  # Ping con timestamps
  ping -D 100.120.27.86 | ts '%.s'

  # Transfer test
  scp testfile kali-tailscale:/tmp/
  ```

## Phase 6: Documentation

- [x] 6.1 Documentar IPs Tailscale asignadas
- [x] 6.2 Crear diagrama de topología de red
- [ ] 6.3 Documentar procedimiento de troubleshooting
- [ ] 6.4 Crear cheat sheet de comandos útiles:
  - `tailscale status`
  - `tailscale ping <ip>`
  - `tailscale up --advertise-routes=...`
  - `tailscale logout`
- [ ] 6.5 Documentar fallback a LAN IPs si Tailscale no disponible

## Implementation Notes

1. Si auth key expira, generar nueva en Admin Console
2. Para debug de conectividad: `tailscale ping --verbose <peer>`
3. Verificar que DNS funciona: `tailscale status` debe mostrar hostnames
4. Si hay problemas de NAT traversal, verificar STUN/DERP: `tailscale netcheck`

---

## 🔧 Troubleshooting - Estado Final (26 Feb 2026)

### Diagnóstico Actual 
| Nodo | Estado Tailscale | Última vez visto | Conexión |
|------|-----------------|------------------|----------|
| Mac (100.121.157.57) | ✅ Online | Ahora | Activa |
| Debian/Server (100.114.119.74) | ✅ Online | Ahora | Directa P2P |
| Kali (100.120.27.86) | ✅ Online | Ahora | P2P |
| Movil (100.108.162.48) | ✅ Online | Ahora | DERP (alta latencia) |

### Corregir Hostname de Movil (localhost → movil)

El dispositivo Android ahora muestra el hostname correcto "movil" ✅

**Historial:**
- Antes: "localhost" (incorrecto)
- Después: "movil" (correcto) - cambiado via Admin Panel

### Pasos para Recuperar Kali
1. Iniciar la VM Kali Linux en VMware
2. Verificar que Tailscale service esté corriendo:
   ```bash
   sudo systemctl status tailscaled
   sudo tailscale up
   ```
3. Verificar conectividad:
   ```bash
   tailscale status
   ping -c 3 100.121.157.57  # Mac
   ```
4. Si no conecta, regenerar auth key y re-autenticar:
   ```bash
   sudo tailscale logout
   sudo tailscale up --authkey=tskey-auth-NUEVA_KEY
   ```

---

> **📊 Estado Final**: 
> - ✅ Mac ↔ Debian: FUNCIONANDO (conexión directa activa)
> - ✅ Kali: ONLINE (conectado - verificado 26 Feb 2026)
> - ✅ Movil: ONLINE (hostname corregido: "movil")
> - ✅ Fix hostname completado
