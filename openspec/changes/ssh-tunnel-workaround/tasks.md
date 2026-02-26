# Tasks: SSH Tunnel Workaround for ISP-Blocked Streaming Sites

## Phase 1: Preparation

- [ ] 1.1 Verify SSH server is enabled on host machine (System Settings > Sharing > Remote Login)
- [ ] 1.2 Confirm Tailscale connectivity between Kali and host machine
- [ ] 1.3 Verify SSH credentials are available for host machine

## Phase 2: SSH Tunnel Setup

- [ ] 2.1 From Kali Linux, establish SSH SOCKS tunnel: `ssh -D 1080 -f -N user@host-ip`
- [ ] 2.2 Verify SOCKS proxy is listening on localhost:1080 using `netstat` or `ss`
- [ ] 2.3 Configure proxy environment variables on Kali:
  ```bash
  export http_proxy=socks5://127.0.0.1:1080
  export https_proxy=socks5://127.0.0.1:1080
  ```

## Phase 3: Verification

- [ ] 3.1 Test blocked site access from Kali: `curl -I https://examplestream.net/video/`
- [ ] 3.2 Verify HTTP 200 response is returned
- [ ] 3.3 Test second streaming site: `curl -I https://radiolocal.fm/`
- [ ] 3.4 Open browser on host machine and verify streaming URLs load

## Phase 4: Documentation

- [ ] 4.1 Document SSH tunnel command for future reference
- [ ] 4.2 Document proxy configuration commands
- [ ] 4.3 Document cleanup procedure (pkill, unset proxy)
- [ ] 4.4 Create runbook for troubleshooting connection issues

## Phase 5: Cleanup (Rollback)

- [ ] 5.1 Kill SSH tunnel process: `pkill -f "ssh -D 1080"`
- [ ] 5.2 Remove proxy environment variables: `unset http_proxy https_proxy`
- [ ] 5.3 Verify port 1080 is freed

## Implementation Notes

1. If initial connection fails, verify host IP is reachable from Kali
2. Use Tailscale IP if direct LAN access is unavailable
3. For persistent tunnel, consider using `autossh` with `-M` monitoring port
