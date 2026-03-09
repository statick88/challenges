# RootedCON 2026 CTF - Final Report (First 4 Challenges)

## Challenge 1: Calentando motores
- **Type:** Base64 Decoding + MD5
- **Solution:** "Calentando motores para RootedCON. No te puede perder el track de ProtAAPP el viernes 6 de marzo. Tendremos excelentes ponentes y os hemos preparado miles de sorpresas. Y si todo sale mal, ya sabes, la culpa es de Willy. Te esperamos."
- **Flag:** `flag{dd99babb7bd1a6abe647f7b8f7c34047}`

## Challenge 2: El Menú
- **Type:** QR Code Analysis (Nested)
- **Solution:** 
  1. Decoded QR from `QRmenu-Reto02.png` to get a Base64 PNG.
  2. Decoded the nested PNG QR to get the message: "De menú solo tenemos conchas Codan y zumos"
- **Flag:** `flag{b2f370a82cef0f2c89bb81c2eb5240c3}`

## Challenge 3: Un DNS curioso
- **Type:** DNS Record Investigation (Octal)
- **Solution:** Decoded Octal string from `ttx.es` TXT record: "Esta es la bandera que buscas, ProtAAPPer"
- **Flag:** `flag{76f777d1ec978a74a3f99dec727f649c}` (Alternative: `flag{0d154dad060469b857cd8e17840477a7}`)

## Challenge 4: La paleta de colores
- **Type:** PNG Palette Steganography
- **Solution:** Extracted the palette from `paleta_colores.png`. The colors formed pairs where one set of values represented the message: "Hola Ke ase?"
- **Flag:** `flag{d867ee16bd352b92b88b564df0ea26a5}`

---
**Summary:** All 4 initial challenges solved successfully using SDD methodology and AI-assisted analysis.
