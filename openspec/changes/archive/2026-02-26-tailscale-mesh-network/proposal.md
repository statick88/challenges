# Proposal: Tailscale Mesh Network for Multi-VM Environment

## Intent

Establecer una red privada mesh entre MacBook Pro (anfitrión), Kali Linux VM y Debian VM usando Tailscale para permitir comunicación directa sin importar la configuración de red subyacente (Bridge/NAT).

## Scope

### In Scope

- Instalar y configurar Tailscale en las 3 máquinas (Mac, Kali, Debian)
- Configurar SSH con autenticación de clave pública entre todos los nodos
- Documentar la topología de red y procedimientos de conexión
- Verificar conectividad bidireccional entre todos los dispositivos

### Out of Scope

- Configuración de exit nodes para tráfico externo
- Subnet routing hacia redes locales
- ACLs avanzadas y control de acceso granular
- Integration con identity providers externos

## Approach

1. **Diagnóstico inicial de red**: Mapear estado actual con nmap, arp, ping
2. **Identificar problemas de conectividad**: Analizar firewall UFW, iptables, VMware network modes
3. **Instalar Tailscale**: Deploy en Debian/Kali/Mac usando scripts oficiales
4. **Autenticar dispositivos**: Registrar cada máquina con auth keys pre-generated
5. **Configurar SSH key-based authentication**: Eliminar password authentication para mayor seguridad
6. **Verificar conectividad**: Ping tests y SSH tests entre todos los nodos

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| MacBook Pro (Host) | Network setup | Tailscale client, SSH server |
| Kali Linux VM | Network setup | Tailscale client, SSH client/server |
| Debian VM | Network setup | Tailscale client, SSH client/server |
| Tailscale Admin Console | Configuration | Device registration, auth keys |

## Technical Details

### Network Topology

| Nodo | IP Tailscale | IP Local | Hostname | SO |
|------|-------------|----------|----------|-----|
| MacBook Pro | 100.121.157.57 | 192.168.50.100 | statick-mac | macOS Sonoma |
| Kali Linux VM | 100.120.27.86 | 192.168.50.101 | kali-vm | Kali 2024.x |
| Debian VM | 100.114.119.74 | 192.168.50.102 | debian-vm | Debian 12 |

### SSH Configuration

| Nodo | Puerto SSH | Usuario |
|------|-----------|---------|
| Kali Linux | 2222 | statick |
| Debian | 2222 | delegado |
| MacBook Pro | 22 | statick |

### Solution Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Tailscale Mesh Network                        │
│                         (100.64.0.0/10 range)                        │
│                                                                      │
│   ┌──────────────┐         ┌──────────────┐         ┌──────────────┐│
│   │  MacBook Pro │◄───────►│  Kali Linux  │◄───────►│   Debian     ││
│   │100.121.157.57│         │100.120.27.86 │         │100.114.119.74││
│   │   (Host)     │         │     (VM)     │         │     (VM)     ││
│   └──────────────┘         └──────────────┘         └──────────────┘│
│          ▲                        ▲                        ▲        │
│          │                        │                        │        │
│          ▼                        ▼                        ▼        │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │              Direct SSH connectivity via Tailscale            │  │
│   │              Port 22 (Mac) / Port 2222 (VMs)                  │  │
│   └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| SSH timeout en conexiones lentas | Medium | Configurar ServerAliveInterval en SSH config |
| Auth key expiration | Low | Regenerar keys con longer expiry time |
| Tailscale service down | Low | Documentar fallback a LAN IPs |
| Firewall bloquea tráfico | Medium | Pre-configurar UFW/iptables rules |

## Rollback Plan

1. **Desconectar dispositivos de Tailscale**:
   ```bash
   tailscale logout
   ```

2. **Restaurar firewall rules**:
   ```bash
   # En cada VM
   sudo ufw reset
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Eliminar Tailscale** (si es necesario):
   ```bash
   sudo apt remove tailscale
   sudo rm -rf /var/lib/tailscale
   ```

## Dependencies

- Tailscale account activa con acceso admin
- Auth keys pre-generadas para cada dispositivo
- SSH server corriendo en cada máquina
- Conectividad a internet para registro inicial

## Success Criteria

- [x] Ping entre todos los nodos via Tailscale IPs
- [x] SSH sin password desde Mac a ambas VMs
- [x] SSH sin password entre VMs
- [x] Topología documentada con IPs y hostnames
- [x] Procedimientos de troubleshooting documentados
