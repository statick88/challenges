# Proposal: SSH Tunnel Workaround for ISP-Blocked Streaming Sites

## Intent

Enable access to streaming radio stations that are blocked by the local ISP by creating an SSH SOCKS tunnel through a remote machine with unrestricted internet access.

## Scope

### In Scope
- Create SSH tunnel from Kali Linux VM to host machine
- Configure SOCKS proxy on Kali to route traffic through host
- Verify access to blocked streaming sites
- Document the complete workaround procedure

### Out of Scope
- Permanent VPN solution (Tailscale exit node configuration)
- Network infrastructure changes (VM network adapter reconfiguration)
- DNS-level blocking bypass

## Approach

1. **Identify the problem**: ISP blocks IP ranges used by streaming services
2. **Create SSH tunnel**: Use Kali as SOCKS proxy tunnel to host machine
3. **Configure proxy on Kali**: Set http_proxy and https_proxy environment variables
4. **Verify access**: Test connectivity to blocked streaming sites
5. **Document procedure**: Create runbook for future reference

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| Kali Linux VM | Temporary workaround | SSH SOCKS tunnel to host |
| Host machine (macOS) | SSH server | Acts as proxy exit point |
| Streaming sites | Accessible | Via tunneled connection |

## Technical Details

### Initial State
- Host machine: macOS with direct internet access (192.168.50.100)
- Kali Linux VM: Running in VirtualBox/VMware with restricted network
- Tailscale: Both machines connected to same tailnet

### Solution Architecture
```
┌─────────────┐         SSH Tunnel          ┌─────────────┐         Internet
│    Kali     │ ──────────────────────────► │     Mac     │ ───────────────► examplestream.net
│ (proxy 1080)│    (100.64.20.150)        │ (192.168.50.100)│
└─────────────┘                             └─────────────┘
```

### Commands Used
1. Activate SSH on host: System Settings > General > Sharing > Remote Login
2. Create tunnel from Kali:
   ```bash
   ssh -D 1080 -f -N user@100.64.20.100
   ```
3. Configure proxy on Kali:
   ```bash
   export http_proxy=socks5://127.0.0.1:1080
   export https_proxy=socks5://127.0.0.1:1080
   ```

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| SSH connection drops | Medium | Use autossh for reconnection |
| Performance degradation | Low | Acceptable for streaming |
| Security concerns | Low | Local tunnel, no external exposure |

## Rollback Plan

Simply close the SSH tunnel process on Kali:
```bash
pkill -f "ssh -D 1080"
unset http_proxy https_proxy
```

## Dependencies

- SSH server running on host machine
- Valid SSH credentials for host
- Tailscale network connectivity between machines

## Success Criteria

- [x] Kali Linux can access blocked streaming sites via SSH tunnel
- [x] Both streaming URLs accessible:
  - https://examplestream.net/video/
  - https://radiolocal.fm/
- [x] Procedure documented for future reference

## Complemento: Tailscale Mesh Network

> **Referencia**: `openspec/changes/tailscale-mesh-network/`

El workaround de SSH tunnel documentado en esta propuesta fue posteriormente reemplazado por una solucion permanente basada en Tailscale mesh network.

### IPs Asignadas por Tailscale

| Maquina | Tailscale IP |
|---------|--------------|
| Mac | 100.121.157.57 |
| Kali | 100.120.27.86 |
| Debian | 100.114.119.74 |

### Expansion del Problema Original

El problema inicial (conexion Kali → Mac para bypass de ISP) evoluciono para incluir una tercera maquina:

- **Estado inicial**: Kali Linux VM → Mac (host) para acceso a streaming
- **Estado final**: Mesh network de 3 nodos (Mac, Kali, Debian) con comunicacion bidireccional

### Insight Clave

Tailscale proporciona una solucion permanente que funciona independientemente del modo de red de VMware (Bridge/NAT). Esto elimina la necesidad de:

1. SSH tunnels manuales
2. Configuracion de proxy SOCKS
3. Dependencia del modo de red de la VM

La mesh network de Tailscale crea un overlay network que opera por encima de cualquier configuracion de red subyacente, garantizando conectividad directa entre todos los nodos del tailnet.
