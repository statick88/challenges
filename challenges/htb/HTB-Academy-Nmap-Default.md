---
tags: HTB, Academy, Nmap, Enumeration
---

# HTB Academy - Nmap Default

## Challenge Information
- **Platform**: Hack The Box Academy
- **Module**: Nmap
- **Difficulty**: Beginner
- **IP**: 10.129.43.41
- **Date Completed**: 2026-02-11

## Objectives
1. Find all TCP ports on the target
2. Enumerate the hostname of the target (case-sensitive)

## Reconnaissance
- Connected to HTB VPN using OpenVPN config `academy-regular.ovpn`
- Connected to Pwnbox via SSH: `ssh htb-ac-2300153@htb-qyd5plq1et.htb-cloud.com`
- Target IP: 10.129.43.41

## Enumeration
### Port Scanning
- Command: `nmap -p- 10.129.43.41`
- Result: 7 open TCP ports discovered

### Service Enumeration
- Command: `nmap -sV 10.129.43.41`
- Output:
```
Starting Nmap 7.94SVN ( https://nmap.org ) at 2026-02-10 23:07 CST
Nmap scan report for 10.129.43.41
Host is up (0.077s latency).
Not shown: 993 closed tcp ports (reset)
PORT      STATE SERVICE     VERSION
22/tcp    open  ssh         OpenSSH 7.6p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)
80/tcp    open  http        Apache httpd 2.4.29 ((Ubuntu))
110/tcp   open  pop3        Dovecot pop3d
139/tcp   open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
143/tcp   open  imap        Dovecot imapd (Ubuntu)
445/tcp   open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
31337/tcp open  Elite?
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port31337-TCP:V=7.94SVN%I=7%D=2/10%Time=698C0E88%P=x86_64-pc-linux-gnu%
SF:r(GetRequest,1F,"220\x20HTB{pr0F7pDv3r510nb4nn3r}\r\n");
Service Info: Host: NIX-NMAP-DEFAULT; OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

## Answers
1. **Total TCP ports**: 7
   - Open ports: 22 (SSH), 80 (HTTP), 110 (POP3), 139 (NetBIOS), 143 (IMAP), 445 (NetBIOS), 31337 (Elite?)

2. **Hostname**: NIX-NMAP-DEFAULT
   - Found in Service Info section of nmap output

## Key Learnings
- Nmap `-p-` scans all 65535 ports
- Nmap `-sV` performs service version detection
- Hostname enumeration can be done via service banners or reverse DNS
- HTB Academy labs provide guided learning for basic tools

## Commands Used
- `openvpn academy-regular.ovpn` - Connect to HTB VPN
- `ssh htb-ac-2300153@htb-qyd5plq1et.htb-cloud.com` - Connect to Pwnbox
- `nmap -p- 10.129.43.41` - Full port scan
- `nmap -sV 10.129.43.41` - Service enumeration

## Notes
- Target runs Ubuntu Linux
- Services include SSH, HTTP, POP3, IMAP, Samba
- Port 31337 shows a custom service with HTB flag in banner