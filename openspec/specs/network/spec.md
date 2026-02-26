# Delta for Tailscale Mesh Network

## ADDED Requirements

### Requirement: Tailscale Mesh VPN Connectivity

The system MUST provide a mesh VPN network that enables direct connectivity between all nodes regardless of underlying network configuration (Bridge/NAT/Host-only).

#### Scenario: All nodes register with Tailscale network

- GIVEN Tailscale is installed on MacBook Pro, Kali Linux VM, and Debian VM
- WHEN each node executes `tailscale up --authkey=<auth-key>`
- THEN each node receives a unique Tailscale IP in the 100.64.0.0/10 range
- AND all nodes appear as peers in `tailscale status` output

#### Scenario: Ping connectivity between all nodes

- GIVEN all nodes are registered in the Tailscale network
- WHEN user executes `ping <tailscale-ip>` from any node to any other node
- THEN ICMP packets are delivered successfully
- AND latency is acceptable for interactive SSH sessions (< 50ms typical)

#### Scenario: SSH connection via Tailscale IP

- GIVEN SSH server is running on target node and SSH client has valid key
- WHEN user connects via `ssh -p 2222 user@<tailscale-ip>`
- THEN SSH session is established without password prompt
- AND connection works regardless of VM network mode (Bridge/NAT)

### Requirement: SSH Key-Based Authentication

The system MUST support passwordless SSH authentication using Ed25519 keys between all nodes.

#### Scenario: SSH key distribution to VMs

- GIVEN Ed25519 key pair exists on source machine
- WHEN user executes `ssh-copy-id -p 2222 user@<tailscale-ip>`
- THEN public key is added to `~/.ssh/authorized_keys` on target machine
- AND subsequent SSH connections do not require password

#### Scenario: SSH config simplifies connections

- GIVEN `~/.ssh/config` contains host definitions with Tailscale IPs
- WHEN user executes `ssh kali-tailscale` or `ssh debian-tailscale`
- THEN connection is established using configured parameters
- AND no manual IP or port specification is required

#### Scenario: Cross-VM SSH connectivity

- GIVEN SSH keys are exchanged between Kali and Debian VMs
- WHEN user on Kali executes `ssh -p 2222 delegado@100.114.119.74`
- THEN SSH session to Debian is established without password
- AND same works in reverse direction (Debian to Kali)

### Requirement: Firewall Configuration for Tailscale

The system MUST allow Tailscale traffic through firewall rules while maintaining security.

#### Scenario: UFW allows Tailscale interface traffic

- GIVEN UFW is active on a VM
- WHEN admin executes `sudo ufw allow in on tailscale0`
- THEN all traffic on the tailscale0 interface is permitted
- AND SSH on port 2222 is accessible via Tailscale IP

#### Scenario: iptables/nftables configuration persists

- GIVEN iptables or nftables rules allow Tailscale traffic
- WHEN system is rebooted
- THEN firewall rules are restored from persistent configuration
- AND Tailscale connectivity is maintained after reboot

## MODIFIED Requirements

None.

## REMOVED Requirements

None.

## Technical Preconditions

### Network Topology

- **MacBook Pro (Host)**: macOS with internet connectivity, VMware/VirtualBox installed
- **Kali Linux VM**: Running in VMware/VirtualBox, network mode Bridge or NAT
- **Debian VM**: Running in VMware/VirtualBox, network mode Bridge or NAT
- **Tailscale Account**: Valid account with admin access for auth key generation

### Tailscale Requirements

- Tailscale client MUST be installed on all nodes
- Auth keys MUST be generated before installation (with appropriate expiry)
- Internet connectivity required for initial device registration
- DERP relay servers accessible for NAT traversal

### SSH Requirements

- SSH server MUST be running on all nodes
- SSH port MUST be accessible (22 on Mac, 2222 on VMs recommended)
- User accounts MUST exist on each machine for SSH access

### Firewall Requirements

- UFW/iptables/nftables MUST allow Tailscale interface (tailscale0)
- SSH port MUST be open for incoming connections
- Rules SHOULD persist across reboots

## Verification Criteria

- [ ] All 3 nodes show in `tailscale status` with assigned IPs
- [ ] Ping successful between all node pairs (Mac↔Kali, Mac↔Debian, Kali↔Debian)
- [ ] SSH from Mac to Kali works without password: `ssh -p 2222 statick@100.120.27.86`
- [ ] SSH from Mac to Debian works without password: `ssh -p 2222 delegado@100.114.119.74`
- [ ] SSH between VMs works without password
- [ ] SSH config aliases work: `ssh kali-tailscale`, `ssh debian-tailscale`
- [ ] Firewall rules allow Tailscale traffic
- [ ] Connectivity persists after VM network mode change
- [ ] Connectivity persists after host network change (WiFi ↔ Ethernet)
