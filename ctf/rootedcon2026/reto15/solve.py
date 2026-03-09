import zipfile

def crack_zip(zip_path, wordlist_path):
    with open(wordlist_path, 'r') as f:
        passwords = f.read().splitlines()
    
    zf = zipfile.ZipFile(zip_path)
    for pwd in passwords:
        try:
            zf.extractall(pwd=pwd.encode(), path="data/raw/rootedcon26/reto15/final_extraction/")
            print(f"PASSWORD FOUND: {pwd}")
            return pwd
        except (RuntimeError, zipfile.BadZipFile):
            continue
    print("Password not found in wordlist.")
    return None

if __name__ == "__main__":
    crack_zip("data/raw/rootedcon26/reto15/layers/4ccc6e6e58aa3f714b749cc4eae9b3f50be8a74fe07748c61b4aa82c8d6cebe8/lib/firmware/atmega644_crash_dump.bin", "data/raw/rootedcon26/reto15/custom_wordlist.txt")
