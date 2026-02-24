import { c as createComponent, m as maybeRenderHead, a as renderScript, b as renderTemplate, e as createAstro, h as renderSlot, r as renderComponent, g as renderHead, d as addAttribute } from './astro/server-rsk8FMOR.js';
import 'piccolore';
/* empty css                         */
import 'clsx';

const $$ThemeToggle = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<button id="theme-toggle" class="theme-toggle" type="button" aria-label="Cambiar tema" title="Cambiar tema claro/oscuro" data-astro-cid-x3pjskd3> <!-- Icono Sol (visible en tema oscuro) --> <svg class="icon-sun w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-x3pjskd3> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" data-astro-cid-x3pjskd3></path> </svg> <!-- Icono Luna (visible en tema claro) --> <svg class="icon-moon w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-x3pjskd3> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" data-astro-cid-x3pjskd3></path> </svg> </button>  ${renderScript($$result, "/Users/statick/apps/cursos/landing-page/src/components/ThemeToggle.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/statick/apps/cursos/landing-page/src/components/ThemeToggle.astro", void 0);

const $$LanguageToggle = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<button id="lang-toggle" class="lang-toggle" type="button" aria-label="Cambiar idioma" title="Cambiar idioma" data-astro-cid-lb7h3eps> <span class="lang-text" data-astro-cid-lb7h3eps>EN</span> </button>  ${renderScript($$result, "/Users/statick/apps/cursos/landing-page/src/components/LanguageToggle.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/statick/apps/cursos/landing-page/src/components/LanguageToggle.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://statick88.github.io");
const $$MainLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MainLayout;
  const { title, description = "Plataforma interactiva de desaf\xEDos t\xE9cnicos - Linux, Docker, DevOps, CTF" } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="es" data-astro-cid-ouamjn2i> <head><meta charset="UTF-8"><meta name="description"', '><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', '><meta name="theme-color" content="#4c80cc"><title>', `</title><!-- Preconnect for fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><!-- Script para prevenir flash de tema incorrecto --><script>
      const theme = (() => {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
          return localStorage.getItem('theme');
        }
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
        return 'light';
      })();
      
      if (theme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.add('dark');
      }
    <\/script><!-- Cache busting: Verificar versi\xF3n y recargar si hay cambios --><script>
      (function() {
        const BUILD_VERSION = '{BUILD_TIMESTAMP}';
        const CACHE_KEY = 'tech-challenges-build-version';
        
        // Verificar si hay nueva versi\xF3n
        const storedVersion = localStorage.getItem(CACHE_KEY);
        
        if (storedVersion && storedVersion !== BUILD_VERSION) {
          // Nueva versi\xF3n detectada, limpiar cache y recargar
          console.log('\u{1F195} Nueva versi\xF3n detectada. Actualizando...');
          if ('caches' in window) {
            caches.keys().then(names => {
              names.forEach(name => caches.delete(name));
            });
          }
          localStorage.setItem(CACHE_KEY, BUILD_VERSION);
          window.location.reload();
        } else if (!storedVersion) {
          localStorage.setItem(CACHE_KEY, BUILD_VERSION);
        }
      })();
    <\/script>`, '</head> <body class="min-h-screen flex flex-col" data-astro-cid-ouamjn2i> <!-- Header --> <header class="sticky top-0 z-50 border-b" style="background-color: var(--color-bg); border-color: var(--color-border);" data-astro-cid-ouamjn2i> <div class="container mx-auto px-4 py-4 flex items-center justify-between" data-astro-cid-ouamjn2i> <!-- Logo / Brand --> <a href="/" class="flex items-center gap-3 group" data-astro-cid-ouamjn2i> <span class="text-2xl" data-astro-cid-ouamjn2i>\u{1F680}</span> <span class="font-bold text-lg transition-colors group-hover:text-accent" style="color: var(--color-text);" data-astro-cid-ouamjn2i>\nTech Challenges\n</span> </a> <!-- Navigation --> <nav class="hidden md:flex items-center gap-6" data-astro-cid-ouamjn2i> <a href="/challenges/" class="nav-link" data-astro-cid-ouamjn2i>Dashboard</a> <a href="/challenges/linux/" class="nav-link" data-astro-cid-ouamjn2i>Linux</a> <a href="/challenges/docker/" class="nav-link" data-astro-cid-ouamjn2i>Docker</a> <a href="/challenges/devops/" class="nav-link" data-astro-cid-ouamjn2i>DevOps</a> <a href="/challenges/ctf/" class="nav-link" data-astro-cid-ouamjn2i>CTF</a> <a href="/challenges/htb/" class="nav-link" data-astro-cid-ouamjn2i>HTB</a> </nav> <!-- Theme Toggle --> <div class="flex items-center gap-4" data-astro-cid-ouamjn2i> ', " ", ' <!-- Mobile Menu Button --> <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg border transition-colors" style="background-color: var(--color-bg-card); border-color: var(--color-border);" aria-label="Men\xFA" data-astro-cid-ouamjn2i> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-ouamjn2i> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" data-astro-cid-ouamjn2i></path> </svg> </button> </div> </div> <!-- Mobile Navigation --> <div id="mobile-menu" class="hidden md:hidden border-t" style="border-color: var(--color-border); background-color: var(--color-bg-card);" data-astro-cid-ouamjn2i> <nav class="container mx-auto px-4 py-4 flex flex-col gap-2" data-astro-cid-ouamjn2i> <a href="/challenges/" class="mobile-nav-link" data-astro-cid-ouamjn2i>Dashboard</a> <a href="/challenges/linux/" class="mobile-nav-link" data-astro-cid-ouamjn2i>\u{1F427} Linux</a> <a href="/challenges/docker/" class="mobile-nav-link" data-astro-cid-ouamjn2i>\u{1F433} Docker</a> <a href="/challenges/devops/" class="mobile-nav-link" data-astro-cid-ouamjn2i>\u2699\uFE0F DevOps</a> <a href="/challenges/ctf/" class="mobile-nav-link" data-astro-cid-ouamjn2i>\u{1F6A9} CTF</a> <a href="/challenges/htb/" class="mobile-nav-link" data-astro-cid-ouamjn2i>\u{1F3AF} HTB</a> </nav> </div> </header> <!-- Main Content --> <main class="flex-1" data-astro-cid-ouamjn2i> ', " </main>  ", "</body></html>"])), addAttribute(description, "content"), addAttribute(Astro2.generator, "content"), title, renderHead(), renderComponent($$result, "LanguageToggle", $$LanguageToggle, { "data-astro-cid-ouamjn2i": true }), renderComponent($$result, "ThemeToggle", $$ThemeToggle, { "data-astro-cid-ouamjn2i": true }), renderSlot($$result, $$slots["default"]), renderScript($$result, "/Users/statick/apps/cursos/landing-page/src/layouts/MainLayout.astro?astro&type=script&index=0&lang.ts"));
}, "/Users/statick/apps/cursos/landing-page/src/layouts/MainLayout.astro", void 0);

export { $$MainLayout as $ };
