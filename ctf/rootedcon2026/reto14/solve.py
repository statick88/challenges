import base64

def decode_file(f_name):
    path = f'data/raw/rootedcon26/reto14/{f_name}'
    with open(path, 'r') as f:
        content = f.read().strip()
    
    if f_name == 'File01.txt':
        # Octal
        return ''.join(chr(int(x, 8)) for x in content.split())
    elif f_name == 'File02.txt':
        # Base32
        return base64.b32decode(content.replace(' ', '')).decode(errors='ignore')
    elif f_name == 'File03.txt':
        # Hex
        return ''.join(chr(int(x, 16)) for x in content.split())
    elif f_name == 'File04.txt':
        # Decimal
        return ''.join(chr(int(x)) for x in content.split())
    elif f_name == 'File05.txt':
        # Binary
        return ''.join(chr(int(x, 2)) for x in content.split())
    elif f_name == 'File06.txt':
        # Base64
        return base64.b64decode(content).decode(errors='ignore')
    return ""

def main():
    files = [f'File{i:02d}.txt' for i in range(1, 7)]
    for f_name in files:
        decoded = decode_file(f_name)
        print(f"--- {f_name} (Length: {len(decoded)}) ---")
        print(decoded[:500]) # Print first 500 chars to see the structure
        print("\n" + "="*50 + "\n")

if __name__ == "__main__":
    main()
