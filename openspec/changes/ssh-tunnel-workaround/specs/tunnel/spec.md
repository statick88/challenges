# Delta for SSH Tunnel Workaround

## ADDED Requirements

### Requirement: SSH SOCKS Tunnel for Network Circumvention

The system MUST provide a mechanism to route network traffic through an SSH SOCKS proxy when direct internet access is restricted.

#### Scenario: Kali establishes SSH tunnel to host machine

- GIVEN Kali Linux VM has SSH client installed and host machine has SSH server running
- WHEN user executes `ssh -D 1080 -f -N user@host-ip` on Kali
- THEN SSH tunnel is created on local port 1080
- AND all traffic sent to localhost:1080 is forwarded through the SSH connection to the host machine

#### Scenario: Applications use SOCKS proxy for outbound traffic

- GIVEN SSH SOCKS tunnel is active on localhost:1080
- WHEN user sets environment variables `http_proxy` and `https_proxy` to `socks5://127.0.0.1:1080`
- THEN HTTP/HTTPS requests are routed through the SOCKS proxy
- AND destination servers see traffic originating from the host machine's public IP

#### Scenario: Streaming sites become accessible via tunnel

- GIVEN SOCKS proxy is configured with http_proxy/https_proxy
- WHEN user attempts to access blocked streaming URLs (e.g., https://examplestream.net/video/)
- THEN the request succeeds with HTTP 200 response
- AND the streaming content loads in the browser

## MODIFIED Requirements

None.

## REMOVED Requirements

None.

## Technical Preconditions

### Network Topology

- **Host machine**: macOS with direct internet access via WiFi/Ethernet
- **VM**: Kali Linux running in VirtualBox/VMware with restricted network (NAT/Docker mode)
- **Tailscale**: Both machines connected to same tailnet for initial connectivity discovery

### SSH Server Requirements

- SSH server MUST be enabled on host machine
- User MUST have valid credentials or SSH key authentication
- SSH port (default 22 or custom) MUST be accessible from VM

## Verification Criteria

- [ ] SSH tunnel establishes successfully from Kali to host
- [ ] SOCKS proxy accepts connections on localhost:1080
- [ ] http_proxy/https_proxy environment variables enable HTTP traffic through proxy
- [ ] Previously blocked streaming sites return HTTP 200
- [ ] Tunnel can be terminated cleanly without leaving orphan processes
