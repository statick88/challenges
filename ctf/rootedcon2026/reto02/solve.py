import cv2
import hashlib
import base64
import os

def decode_qr(image_path):
    print(f"Analyzing {image_path}...")
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Could not read image {image_path}")
        return None
    
    detector = cv2.QRCodeDetector()
    data, bbox, straight_qrcode = detector.detectAndDecode(img)
    
    if not data:
        print(f"No QR code found in {image_path}")
        return None

    print(f"Decoded Data from {image_path}: {data[:50]}...")
    
    # Check if data is another PNG (Base64)
    if data.startswith("iVBORw0KGgoAAAANSUhEUgAA"):
        print("Detected Base64 PNG in QR data. Decoding nested image...")
        nested_path = "data/raw/rootedcon26/reto02/nested.png"
        with open(nested_path, "wb") as f:
            f.write(base64.b64decode(data))
        return decode_qr(nested_path)
    else:
        md5_hash = hashlib.md5(data.encode('utf-8')).hexdigest()
        print(f"FINAL Decoded Data: {data}")
        print(f"MD5 Hash: {md5_hash}")
        print(f"Flag: flag{{{md5_hash}}}")
        return data

if __name__ == "__main__":
    decode_qr("data/raw/rootedcon26/reto02/QRmenu-Reto02.png")
