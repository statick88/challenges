# Design: SSH Tunnel Workaround for ISP-Blocked Streaming Sites

## Technical Approach

Create an SSH SOCKS proxy tunnel from Kali Linux VM to the host machine, enabling traffic redirection through the host's unrestricted internet connection. This bypasses ISP-level IP blocking for specific streaming services.

## Architecture Decisions

### Decision: SSH SOCKS Tunnel vs VPN Solution

**Choice**: SSH SOCKS proxy (ssh -D)
**Alternatives considered**: 
- Tailscale exit node (blocked because Kali had no internet)
- OpenVPN/WireGuard tunnel
- Proxychains with external proxy

**Rationale**: SSH SOCKS is already available on both systems, requires no additional software installation, and provides sufficient bandwidth for streaming audio/video.

### Decision: Environment Variable Proxy Configuration

**Choice**: Set http_proxy/https_proxy environment variables
**Alternatives considered**:
- ProxyChains configuration
- System-wide proxy settings
- Application-specific proxy configuration

**Rationale**: Environment variables are the simplest method and work for most CLI tools (curl, wget) and some applications. Browser traffic can be tunneled through the SSH port directly if needed.

## Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        Kali Linux VM                              │
│  ┌─────────────┐     ┌─────────────────┐                       │
│  │ curl/wget   │────►│ SOCKS Proxy      │                       │
│  │ (HTTP/HTTPS)│     │ localhost:1080   │                       │
│  └─────────────┘     └────────┬────────┘                       │
│                               │                                  │
│                        ┌──────▼──────┐                           │
│                        │ SSH Client  │                           │
│                        │ ssh -D 1080 │                           │
│                        └──────┬──────┘                           │
└──────────────────────────────┼──────────────────────────────────┘
                               │ SSH Tunnel (encrypted)
                               │ Tailscale IP / LAN IP
┌──────────────────────────────▼──────────────────────────────────┐
│                        Host Machine (macOS)                       │
│  ┌─────────────┐     ┌─────────────────┐                       │
│  │ SSH Server  │────►│ Internet        │──────► exa m.net etc.
│  │ Port 22     │     │ (Unrestricted)  │                       │
│  └─────────────┘     └─────────────────┘                       │
└──────────────────────────────────────────────────────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `openspec/changes/ssh-tunnel-workaround/proposal.md` | Create | Initial proposal |
| `openspec/changes/ssh-tunnel-workaround/specs/tunnel/spec.md` | Create | Requirements specification |
| `openspec/changes/ssh-tunnel-workaround/design.md` | Create | This document |

## Interface Configuration

### SSH Tunnel Command
```bash
ssh -D 1080 -f -N user@host-ip
```
- `-D 1080`: Create SOCKS proxy on local port 1080
- `-f`: Fork to background
- `-N`: Don't execute remote command (tunnel only)

### Proxy Environment Variables
```bash
export http_proxy=socks5://127.0.0.1:1080
export https_proxy=socks5://127.0.0.1:1080
```

### Cleanup Commands
```bash
# Kill SSH tunnel
pkill -f "ssh -D 1080"

# Remove proxy environment variables
unset http_proxy https_proxy
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Connectivity | SSH tunnel establishes | Verify process is running, port is listening |
| Proxy | SOCKS proxy accepts connections | curl with --socks5 localhost:1080 |
| Integration | Blocked sites accessible | HTTP 200 from streaming URLs |
| Cleanup | Tunnel closes cleanly | Process terminates, port freed |

## Migration / Rollback

No migration required. This is a temporary workaround.

**Rollback steps:**
1. Kill SSH tunnel process: `pkill -f "ssh -D 1080"`
2. Unset proxy variables: `unset http_proxy https_proxy`
3. Restore direct network access (reconfigure VM network adapter)

## Open Questions

None. The solution is straightforward and tested.

## Notes

- This is a temporary workaround, not a permanent solution
- For permanent solution, consider:
  - Configuring VM network adapter to Bridge mode
  - Using a commercial VPN service
  - Contacting ISP to unblock specific IPs
