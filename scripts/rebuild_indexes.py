import os
def get_html(t, c):
    return f'<!DOCTYPE html><html><head><meta charset="UTF-8"><title>{t}</title><style>body{{font-family:sans-serif;padding:2rem}} .item{{background:#f0f0f0;margin:0.5rem 0;padding:1rem;border-radius:8px}} a{{color:#005b96;font-weight:bold;text-decoration:none}}</style></head><body><h1>{t}</h1>{c}<br><a href="../">Volver</a></body></html>'
def gen(d, t):
    path = os.path.join("/Users/statick/apps/cursos", d)
    if not os.path.exists(path): return
    items = ""
    scan = path
    pref = ""
    if os.path.exists(os.path.join(path, "retos")): scan = os.path.join(path, "retos"); pref = "retos/"
    elif os.path.exists(os.path.join(path, "days")): scan = os.path.join(path, "days"); pref = "days/"
    for f in sorted(os.listdir(scan)):
        if f.startswith(".") or f == "index.html": continue
        name = f.replace(".md", "").replace("-", " ").title()
        is_dir = os.path.isdir(os.path.join(scan, f))
        target = f + ("/README.md" if is_dir else "")
        items += f'<div class="item"><a href="{pref}{target}">{name}</a></div>'
    with open(os.path.join(path, "index.html"), "w") as f: f.write(get_html(t, items))
gen("htb", "🎯 Hack The Box")
gen("devops", "♾️ DevOps Journey")
gen("docker", "🐳 Docker & Containers")
gen("picoctf", "🚩 PicoCTF Prep")
gen("ctf/rootedcon2026", "🏁 RootedCON 2026")
