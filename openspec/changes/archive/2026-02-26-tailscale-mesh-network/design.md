# Design: Tailscale Mesh Network for Multi-VM Environment

## Technical Approach

Usar Tailscale como overlay network para crear una mesh VPN entre los 3 dispositivos (MacBook Pro, Kali Linux VM, Debian VM). Esto permite comunicación directa sin importar la configuración de red subyacente de VMware/VirtualBox (Bridge, NAT, Host-only).

## Architecture Decisions

### Decision: Tailscale vs ZeroTier vs WireGuard

**Choice**: Tailscale

**Alternatives considered**:
- ZeroTier: Requiere más configuración manual, UI menos intuitiva
- WireGuard: Requiere configuración manual de keys y endpoints
- OpenVPN: Overhead significativo, complejo para mesh topology

**Rationale**: Tailscale proporciona NAT traversal automático, setup simplificado con auth keys, y dashboard centralizado para gestión de dispositivos. Ideal para entornos con VMs que cambian de IP frecuentemente.

### Decision: Auth Keys vs Interactive Login

**Choice**: Auth keys pre-generated

**Alternatives considered**:
- Interactive login via browser: Requiere GUI en cada VM
- OAuth flow: Más complejo para automatización

**Rationale**: Auth keys permiten automatización completa del registro de dispositivos y son ideales para VMs headless sin navegador web.

### Decision: SSH Key Authentication Method

**Choice**: Ed25519 keys sin password

**Alternatives considered**:
- RSA 4096-bit: Más compatible pero keys más grandes
- ECDSA: Menos auditable que Ed25519
- Password authentication: Menos seguro, susceptible a brute force

**Rationale**: Ed25519 ofrece mejor rendimiento y seguridad con keys más compactas. Sin password para automatización completa.

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Tailscale Coordination Server                        │
│                    (Manages peer discovery and DERP relays)                  │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
            ▼                       ▼                       ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│   MacBook Pro     │   │   Kali Linux VM   │   │     Debian VM     │
│ ┌───────────────┐ │   │ ┌───────────────┐ │   │ ┌───────────────┐ │
│ │ Tailscale     │ │   │ │ Tailscale     │ │   │ │ Tailscale     │ │
│ │ 100.121.157.57│ │   │ │ 100.120.27.86 │ │   │ │ 100.114.119.74│ │
│ └───────┬───────┘ │   │ └───────┬───────┘ │   │ └───────┬───────┘ │
│         │         │   │         │         │   │         │         │
│ ┌───────▼───────┐ │   │ ┌───────▼───────┐ │   │ ┌───────▼───────┐ │
│ │ SSH Server    │ │   │ │ SSH Server    │ │   │ │ SSH Server    │ │
│ │ Port 22       │ │   │ │ Port 2222     │ │   │ │ Port 2222     │ │
│ └───────────────┘ │   │ └───────────────┘ │   │ └───────────────┘ │
└───────────────────┘   └───────────────────┘   └───────────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Direct WireGuard    │
                    │   (P2P Encrypted)     │
                    │   No central relay    │
                    └───────────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `openspec/changes/tailscale-mesh-network/proposal.md` | Create | Initial proposal |
| `openspec/changes/tailscale-mesh-network/design.md` | Create | This document |
| `openspec/changes/tailscale-mesh-network/tasks.md` | Create | Implementation tasks |
| `openspec/changes/tailscale-mesh-network/specs/network/spec.md` | Create | Requirements specification |

## Network Topology

### Tailscale Network (Overlay)

| Nodo | Tailscale IP | Hostname | Role |
|------|-------------|----------|------|
| MacBook Pro | 100.121.157.57 | statick-mac | Control plane, primary |
| Kali Linux VM | 100.120.27.86 | kali-vm | Security testing |
| Debian VM | 100.114.119.74 | debian-vm | Development server |

### Local Network (Underlay)

| Nodo | Local IP | VMware Network | Gateway |
|------|----------|----------------|---------|
| MacBook Pro | 192.168.50.100 | Host | 192.168.50.1 |
| Kali Linux VM | 192.168.50.101 | NAT/Bridge | 192.168.50.1 |
| Debian VM | 192.168.50.102 | NAT/Bridge | 192.168.50.1 |

## SSH Configuration

### SSH Client Config (~/.ssh/config)

```
# Kali Linux via Tailscale
Host kali-tailscale
    HostName 100.120.27.86
    User statick
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60
    ServerAliveCountMax 3

# Debian via Tailscale
Host debian-tailscale
    HostName 100.114.119.74
    User delegado
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

### Authorized Keys Setup

```bash
# Generar Ed25519 key
ssh-keygen -t ed25519 -C "mesh-network" -f ~/.ssh/id_ed25519

# Copiar a cada VM
ssh-copy-id -p 2222 statick@100.120.27.86
ssh-copy-id -p 2222 delegado@100.114.119.74
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Connectivity | Tailscale status on all nodes | `tailscale status` shows all peers |
| Connectivity | Ping between all nodes | `ping 100.x.x.x` from each node |
| Authentication | SSH key-based login | `ssh user@tailscale-ip` without password |
| Integration | SSH between VMs | Kali → Debian and Debian → Kali |
| Performance | Latency over Tailscale | Compare ping times vs local network |
| Resilience | Reconnection after network change | Change VM network mode, verify reconnection |

## Migration / Rollback

### Initial Migration

1. Install Tailscale on all nodes
2. Register devices with auth keys
3. Configure SSH key authentication
4. Update ~/.ssh/config entries
5. Verify all connections

### Rollback Steps

```bash
# Disconnect specific node
tailscale logout

# Stop Tailscale service
sudo systemctl stop tailscaled

# Disable Tailscale service
sudo systemctl disable tailscaled

# Remove Tailscale completely
sudo apt remove tailscale
sudo rm -rf /var/lib/tailscale /etc/default/tailscale
```

## Open Questions

None. The solution is well-defined with clear implementation steps.

## Notes

- Tailscale IPs are stable across network changes (Bridge ↔ NAT)
- DERP relays used only when direct P2P connection not possible
- Consider enabling Tailscale's MagicDNS for hostname-based addressing
- Monitor tailnet status via `tailscale status` command
