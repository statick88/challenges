import base64
import re

def analyze_eml():
    with open('data/raw/rootedcon26/reto10/suspicious-email.eml', 'r') as f:
        content = f.read()
    
    # Extract base64 block
    match = re.search(r'Content-Transfer-Encoding: base64\n\n(.*?)\n--BOUNDARY-MALWARE-202', content, re.DOTALL)
    if not match:
        print("Base64 block not found")
        return
        
    b64_data = match.group(1).replace('\n', '').replace(' ', '')
    try:
        data = base64.b64decode(b64_data)
    except Exception as e:
        print(f"Decode error: {e}")
        return
        
    print(f"Total data size: {len(data)}")
    
    # Find JPEG EOI
    eoi_pos = data.find(b'\xff\xd9')
    if eoi_pos != -1:
        print(f"JPEG End-of-Image (FF D9) found at offset {eoi_pos}")
        extra_data = data[eoi_pos+2:]
        if extra_data:
            print(f"Extra data found after JPEG ({len(extra_data)} bytes)")
            print(f"Hex dump (first 64 bytes): {extra_data[:64].hex()}")
            print(f"ASCII dump: {''.join(chr(b) if 32 <= b <= 126 else '.' for b in extra_data[:64])}")
            
            # Save extra data
            with open('data/raw/rootedcon26/reto10/malware_payload.bin', 'wb') as f:
                f.write(extra_data)
        else:
            print("No extra data after JPEG")
    else:
        print("JPEG End-of-Image (FF D9) NOT found. The file might be purely malicious or corrupted.")
        # Check for other magic bytes
        if data.startswith(b'MZ'):
            print("Found Windows Executable (MZ)")
        elif b'PowerShell' in data or b'powershell' in data:
            print("Found PowerShell reference")
        else:
            print(f"First 32 bytes (hex): {data[:32].hex()}")
            print(f"First 32 bytes (ASCII): {''.join(chr(b) if 32 <= b <= 126 else '.' for b in data[:32])}")

if __name__ == "__main__":
    analyze_eml()
