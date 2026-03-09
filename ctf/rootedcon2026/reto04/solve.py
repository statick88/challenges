from PIL import Image
import hashlib

def get_palette():
    img = Image.open("data/raw/rootedcon26/reto04/paleta_colores.png")
    palette = img.getpalette()
    if not palette:
        print("No palette found (not an indexed PNG).")
        return
    
    # Palette is R,G,B,R,G,B...
    colors = []
    for i in range(0, len(palette), 3):
        r, g, b = palette[i], palette[i+1], palette[i+2]
        if r == 0 and g == 0 and b == 0 and i > 0: # Stop if we hit padding
             break
        colors.append((r, g, b))
    
    print(f"Colors in palette: {len(colors)}")
    for i, c in enumerate(colors):
        print(f"Color {i}: {c} -> ASCII: {chr(c[0]) if 32 <= c[0] <= 126 else '?'}{chr(c[1]) if 32 <= c[1] <= 126 else '?'}{chr(c[2]) if 32 <= c[2] <= 126 else '?'}")

    # Try concatenating all R, G, B values
    all_bytes = []
    for c in colors:
        all_bytes.extend(c)
    
    decoded = "".join(chr(b) for b in all_bytes if 32 <= b <= 126)
    print(f"All ASCII printable from palette: {decoded}")

if __name__ == "__main__":
    get_palette()
