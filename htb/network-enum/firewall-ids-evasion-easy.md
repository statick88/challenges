---
title: "Firewall and IDS/IPS Evasion - Easy Lab"
category: htb
difficulty: easy
tags: [nmap, firewall, ids, ips, evasion, os-detection, passive-enumeration]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Network Enumeration with Nmap
section: 10
---

# Firewall and IDS/IPS Evasion - Easy Lab

## Objective

Identify the operating system of a target machine protected by IDS/IPS without triggering too many alerts.

---

## Scenario

The target has IDS/IPS protection that monitors network traffic. A status page shows alert count - exceeding 100 alerts will fail the challenge. We must identify the OS using low-profile techniques.

---

## Initial Assessment

### Status Page Check

```bash
curl http://10.129.4.94/status.php
```

Output:
```
Recorded alerts:	50
/ 100 alerts
```

**Analysis**: 50 alerts already recorded. We have 50 remaining before failure. Must use passive/low-profile techniques.

---

## Passive OS Fingerprinting

### Method 1: HTTP Server Header

```bash
curl -I http://10.129.4.94
```

Output:
```
HTTP/1.1 200 OK
Date: Fri, 20 Feb 2026 05:25:27 GMT
Server: Apache/2.4.29 (Ubuntu)
Last-Modified: Thu, 10 Sep 2020 02:14:12 GMT
ETag: "2c39-5aeec1fc9d59d"
Accept-Ranges: bytes
Content-Length: 11321
Content-Type: text/html
```

**Finding**: `Apache/2.4.29 (Ubuntu)` - Server explicitly identifies as Ubuntu.

### Method 2: SSH Banner Grabbing

```bash
nc -nv 10.129.4.94 22
```

Output:
```
Connection to 10.129.4.94 port 22 [tcp/*] succeeded!
SSH-2.0-OpenSSH_7.6p1 Ubuntu-4ubuntu0.7
```

**Finding**: `Ubuntu-4ubuntu0.7` - SSH daemon confirms Ubuntu.

### Method 3: TTL Analysis

```bash
ping -c 1 10.129.4.94
```

Output:
```
64 bytes from 10.129.4.94: icmp_seq=0 ttl=63 time=120.793 ms
```

**Finding**: TTL=63 indicates Linux (default TTL=64, decremented by 1 network hop).

---

## OS Indicators Summary

| Method | Indicator | OS |
|--------|-----------|-----|
| HTTP Header | `Apache/2.4.29 (Ubuntu)` | Ubuntu |
| SSH Banner | `Ubuntu-4ubuntu0.7` | Ubuntu |
| TTL Value | 63 (Linux default: 64) | Linux |

---

## Answer

**Ubuntu**

All three passive methods confirmed the target is running Ubuntu Linux.

---

## Key Learnings

1. **Passive > Active**: Service banners often reveal OS information without triggering IDS/IPS
2. **HTTP Server Header**: Apache often includes OS in version string
3. **SSH Banner**: OpenSSH packages typically include distribution info
4. **TTL Fingerprinting**: 
   - Linux: TTL ≈ 64
   - Windows: TTL ≈ 128
   - Cisco/Network devices: TTL ≈ 255

---

## Failed Attempts (Requires Root)

```bash
# ACK scan - requires root
nmap -sA -p 22,80,443 --source-port 53 10.129.4.94
# Error: You requested a scan type which requires root privileges.

# OS detection - requires root
nmap -O -T2 --max-retries 1 10.129.4.94
# Error: TCP/IP fingerprinting (for OS scan) requires root privileges.
```

**Note**: On macOS, these scans require `sudo`. However, passive methods provided the answer without needing elevated privileges.

---

## Evasion Techniques Reference

| Technique | Purpose | IDS Impact |
|-----------|---------|------------|
| Passive banner grabbing | OS/service info | None |
| `curl -I` | HTTP headers | Minimal |
| `nc` connection | Service banners | Minimal |
| `--source-port 53` | Appear as DNS | Low |
| `-D RND:5` | Decoys | Spread across IPs |
| `-sA` | ACK scan | Harder to detect |
| `-T2` or `-T1` | Slow timing | Less suspicious |

---

## Status

**COMPLETED** 

- Date: 2026-02-20
- Time: ~5 minutes
- Alerts used: 0 (passive only)
- Difficulty: Easy
