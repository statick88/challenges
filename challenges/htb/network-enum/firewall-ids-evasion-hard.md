---
title: "Firewall and IDS/IPS Evasion - Hard Lab"
category: htb
difficulty: hard
tags: [nmap, firewall, ids, ips, evasion, netcat, source-port, db2, ibm-db2]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Network Enumeration with Nmap
section: 12
flag: HTB{kjnsdf2n982n1827eh76238s98di1w6}
---

# Firewall and IDS/IPS Evasion - Hard Lab

## Objective

Identify the version of a service running on a target with strict IDS/IPS and firewall configurations.

---

## Scenario

After previous tests, administrators improved their security configurations. They mentioned the host as a "publicly accessible server that requires large amounts of data transfer" - suggesting a data-heavy service.

---

## Initial Reconnaissance

### Port Discovery

```bash
# Scan with source-port bypass found open port
sudo nmap --source-port 53 -sV -p 8080,8443,9000,10000,50000-50010 10.129.2.47
```

Result:
```
PORT      STATE  SERVICE          VERSION
50000/tcp open   tcpwrapped
```

### Problem

- Port 50000 showed as `open tcpwrapped`
- Service detection failed due to TCP Wrappers
- IDS blocked Nmap scripts (`db2-das-info`)
- Standard connections timed out

---

## Failed Attempts

| Technique | Command | Result |
|-----------|---------|--------|
| Direct connection | `nc 10.129.2.47 50000` | Timeout |
| Nmap with source-port | `nmap --source-port 53 -sV -p 50000` | `tcpwrapped` |
| Nmap scripts | `nmap --script=db2-das-info` | `filtered` |
| Metasploit db2_version | `msfconsole` | No results |
| Fragmentation | `nmap -f --source-port 53` | `tcpwrapped` |

---

## Solution: Netcat with Source Port Binding

### Key Insight

The firewall allows traffic **from** port 53 (DNS). By binding our local port to 53, we bypass the firewall rules.

### Command

```bash
sudo nc -p 53 10.129.2.47 50000
```

### Result

```
220 HTB{kjnsdf2n982n1827eh76238s98di1w6}
```

**The service responded with its banner containing the flag!**

---

## Technical Explanation

### How Source Port Bypass Works

```
┌─────────────────┐                    ┌─────────────────┐
│   Kali Linux    │                    │    Target       │
│ Port: 53 (DNS)  │ ─────────────────► │ Port: 50000     │
│ (bound locally) │                    │ (IBM DB2)       │
└─────────────────┘                    └─────────────────┘
         │                                    │
         │    Firewall Rule:                  │
         │    "Allow traffic FROM port 53"    │
         └────────────────────────────────────┘
```

### Why `sudo` is Required

- Ports below 1024 are privileged ports
- Linux requires root privileges to bind to ports < 1024
- Port 53 is used by DNS, a trusted service

### Why Netcat Works and Nmap Doesn't

| Tool | Behavior |
|------|----------|
| Nmap | Sends probe packets, IDS detects patterns |
| Netcat | Simple TCP connection, appears as legitimate traffic |

---

## Alert Management

| Stage | Alerts Used | Alerts Remaining |
|-------|-------------|------------------|
| Initial scans | 12 | 63 |
| Final solution | 0 (passive) | 63 |

The netcat approach was **completely passive** - no IDS alerts triggered.

---

## Service Identified

| Property | Value |
|----------|-------|
| Port | 50000/tcp |
| Service | IBM DB2 |
| Banner | `220 HTB{kjnsdf2n982n1827eh76238s98di1w6}` |

---

## Answer

**Flag**: `HTB{kjnsdf2n982n1827eh76238s98di1w6}`

---

## Key Learnings

### 1. Source Port Manipulation

Binding to trusted source ports bypasses many firewall rules:

| Source Port | Service | Trust Level |
|-------------|---------|-------------|
| 20 | FTP Data | High |
| 53 | DNS | Very High |
| 80 | HTTP | Medium |
| 443 | HTTPS | High |

### 2. Simple Tools Can Bypass Complex Defenses

- Nmap's sophisticated scans were blocked by IDS
- Simple netcat connection with source-port bypass worked
- Sometimes simpler is better for evasion

### 3. TCP Wrappers

- `tcpwrapped` indicates TCP Wrappers protection
- Doesn't mean the service is unreachable
- Just requires proper connection method

### 4. Privileged Ports

- Ports < 1024 require root access
- These ports are trusted by firewalls
- DNS (53) is commonly whitelisted

---

## Evasion Techniques Summary

| Technique | Effectiveness | IDS Impact |
|-----------|---------------|------------|
| Source Port 53 | ✅ Very High | None |
| Decoys (-D RND:5) | Medium | Spread across IPs |
| Fragmentation (-f) | Low-Medium | May bypass |
| Bad Checksum (--badsum) | Low | Some IDS ignore |
| Netcat (passive) | ✅ Very High | None |

---

## Alternative Commands

```bash
# Using ncat (same result)
sudo ncat -p 53 10.129.2.47 50000

# Sending data to trigger response
echo "" | sudo nc -p 53 -w 5 10.129.2.47 50000

# With timeout
sudo timeout 10 nc -p 53 10.129.2.47 50000
```

---

## Status

**COMPLETED**

- Date: 2026-02-20
- Time: ~2 hours
- Method: Netcat with source-port 53
- Alerts triggered: 0 (passive technique)
- Difficulty: Hard
- Flag: `HTB{kjnsdf2n982n1827eh76238s98di1w6}`
