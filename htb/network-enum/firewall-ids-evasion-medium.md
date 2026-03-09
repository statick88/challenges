---
title: "Firewall and IDS/IPS Evasion - Medium Lab"
category: htb
difficulty: medium
tags: [nmap, firewall, ids, ips, evasion, dns, udp, nslookup, dig]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Network Enumeration with Nmap
section: 11
flag: HTB{GoTtgUnyze9Psw4vGjcuMpHRp}
---

# Firewall and IDS/IPS Evasion - Medium Lab

## Objective

Find the DNS server version of a target with stricter IDS/IPS and firewall configurations.

---

## Scenario

After the first test, administrators improved their security configurations. They mentioned the host as a "publicly accessible server" - suggesting DNS service (port 53/UDP) is likely open.

**Key Requirement**: Must use UDP protocol (DNS uses UDP 53 by default).

---

## DNS Version Enumeration

### Method 1: nslookup (Passive - No Root Required)

```bash
nslookup -type=txt -class=chaos version.bind 10.129.4.95
```

Output:
```
Server:		10.129.4.95
Address:	10.129.4.95#53

version.bind	text = "HTB{GoTtgUnyze9Psw4vGjcuMpHRp}"
```

**Result**: Flag obtained immediately without triggering IDS/IPS.

### Method 2: dig (Alternative)

```bash
dig @10.129.4.95 version.bind chaos txt
```

---

## Answer

**DNS Server Version**: `HTB{GoTtgUnyze9Psw4vGjcuMpHRp}`

---

## Technical Explanation

### What is version.bind?

- Special DNS record in the **CHAOS class** (not IN/Internet class)
- Used by BIND DNS servers to report their version
- Security risk: attackers use it to identify vulnerable versions

### Query Breakdown

| Component | Meaning |
|-----------|---------|
| `-type=txt` | Request TXT record type |
| `-class=chaos` | Use CHAOS class (not default Internet class) |
| `version.bind` | Special hostname for version query |
| `10.129.4.95` | Target DNS server |

### Why This Works

1. **UDP Protocol**: DNS queries use UDP by default
2. **Passive**: No port scanning, just a legitimate DNS query
3. **CHAOS Class**: Most DNS servers still respond to CHAOS queries
4. **Public Server**: Administrators must allow DNS queries for public access

---

## Failed Nmap Attempt

```bash
sudo nmap -sU -p 53 --script=dns-version-bind --source-port 53 10.129.4.95
```

Error:
```
NSE: failed to initialize the script engine:
'dns-version-bind' did not match a category, filename, or directory
```

**Reason**: On macOS Homebrew, the script name is `dns-version`, not `dns-version-bind`.

Correct command:
```bash
sudo nmap -sU -p 53 --script=dns-version --source-port 53 10.129.4.95
```

---

## Evasion Techniques Used

| Technique | Purpose | Why It Worked |
|-----------|---------|---------------|
| DNS query | Legitimate traffic | IDS doesn't flag normal DNS |
| UDP protocol | Required by challenge | DNS uses UDP by default |
| CHAOS class | Version disclosure | BIND servers respond |
| nslookup/dig | No port scanning | Completely passive |

---

## Security Recommendations

For administrators to prevent this disclosure:

```bash
# In named.conf.options
options {
    version "not disclosed";
    # or completely disable
    version none;
}
```

---

## Key Learnings

1. **Passive DNS queries** bypass IDS/IPS that focus on port scanning
2. **version.bind** is a legacy feature that should be disabled
3. **nslookup/dig** are quieter than Nmap for DNS enumeration
4. **UDP scans** require root privileges on most systems
5. **Source port manipulation** (`--source-port 53`) can bypass some firewalls

---

## Status

**COMPLETED**

- Date: 2026-02-20
- Time: ~2 minutes
- Method: Passive DNS query (nslookup)
- Alerts triggered: 0
- Difficulty: Medium
