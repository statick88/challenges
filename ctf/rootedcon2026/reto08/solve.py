def rot3_decode(s):
    r = ''
    for char in s:
        c = ord(char)
        if 32 <= c <= 126:
            # Formula from JS: ((c - 32 - 3 + 95) % 95) + 32
            # Which is ((c - 35) % 95) + 32
            decoded_char = chr(((c - 35) % 95) + 32)
            r += decoded_char
        else:
            r += char
    return r

encrypted_strings = [
    "xvhu",           # 0
    "def123",         # 1
    "xvxdulr",        # 2
    "dgplq",          # 3 (User)
    "tzhuwb",         # 4
    "UrrwhgFRQ",      # 5
    "Wu7fnSurwDDSS",  # 6 (Pass)
    "vxffhvv1kwpo",   # 7 (Redirect)
    "sdvvzrug",       # 8
    "QrPruhVhfuhwv",  # 9
    "Xvxdulr#r#Sdvvzrug#lqfruhfwrv.#Suxhed#gh#qxhyr" # 10 (Error)
]

print("Decoded Strings:")
for i, s in enumerate(encrypted_strings):
    print(f"{i}: {rot3_decode(s)}")

# Calculate Flag MD5? Or access the page?
# The flag is usually "flag{md5(solution)}"
# Let's see what the solution is. The page redirects to success.html?k=PASSWORD
# Maybe the flag is MD5(PASSWORD)
import hashlib
password = rot3_decode(encrypted_strings[6])
print(f"Password: {password}")
print(f"MD5(Password): {hashlib.md5(password.encode()).hexdigest()}")
