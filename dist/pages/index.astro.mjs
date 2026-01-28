/* empty css                                 */
import { c as createComponent, a as addAttribute, r as renderHead, b as renderSlot, d as renderTemplate, e as createAstro, m as maybeRenderHead, f as renderComponent } from '../chunks/astro/server_fSRWCAV5.mjs';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro$2 = createAstro();
const $$MainLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$MainLayout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Interactive dashboard tracking progress through Linux, Docker, and DevOps technical challenges"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title || "Challenges Dashboard - Technical Progress Tracker"}</title><link rel="stylesheet" href="/styles/global.css">${renderHead()}</head> <body class="bg-primary text-text font-sans"> <div class="min-h-screen"> ${renderSlot($$result, $$slots["default"])} </div>  </body> </html>`;
}, "/Users/statick/apps/cursos/challenges-dashboard/src/layouts/MainLayout.astro", void 0);

const $$Astro$1 = createAstro();
const $$HeroMetrics = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$HeroMetrics;
  const { data } = Astro2.props();
  return renderTemplate`${maybeRenderHead()}<div class="bg-primary rounded-xl p-6 mb-8 fade-in" data-astro-cid-yxiivkci> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-astro-cid-yxiivkci> <!-- Total Challenges --> <div class="text-center" data-astro-cid-yxiivkci> <div class="animated-counter text-6xl font-bold text-text"${addAttribute(data.totalChallenges, "data-target")} data-astro-cid-yxiivkci> ${data.totalChallenges} </div> <div class="text-muted text-sm mt-2" data-astro-cid-yxiivkci>Total Challenges</div> </div> <!-- Completed --> <div class="text-center" data-astro-cid-yxiivkci> <div class="animated-counter text-6xl font-bold text-success"${addAttribute(data.completed, "data-target")} data-astro-cid-yxiivkci> ${data.completed} </div> <div class="text-muted text-sm mt-2" data-astro-cid-yxiivkci>Completed</div> </div> <!-- Completion Rate --> <div class="text-center" data-astro-cid-yxiivkci> <div class="animated-counter text-6xl font-bold text-accent"${addAttribute(data.completionRate, "data-target")} data-astro-cid-yxiivkci> ${data.completionRate}%
</div> <div class="text-muted text-sm mt-2" data-astro-cid-yxiivkci>Completion Rate</div> </div> <!-- Streak --> <div class="text-center" data-astro-cid-yxiivkci> <div class="flex items-center justify-center space-x-2" data-astro-cid-yxiivkci> <span class="text-2xl" data-astro-cid-yxiivkci>🔥</span> <div class="animated-counter text-6xl font-bold text-warning"${addAttribute(data.streak, "data-target")} data-astro-cid-yxiivkci> ${data.streak} </div> </div> <div class="text-muted text-sm mt-2" data-astro-cid-yxiivkci>Day Streak</div> </div> </div> <!-- Last Updated --> <div class="text-center mt-6 text-muted text-sm" data-astro-cid-yxiivkci>
Last updated: ${new Date(data.lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })} </div> </div> `;
}, "/Users/statick/apps/cursos/challenges-dashboard/src/components/HeroMetrics.astro", void 0);

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const challengesData = await import('../chunks/challenges_DpkXPzHJ.mjs');
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "DevOps Challenges Dashboard" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-7xl mx-auto px-4 py-8"> <!-- Header --> <header class="text-center mb-12 fade-in"> <h1 class="text-4xl md:text-5xl font-bold text-text mb-4">
🚀 Technical Challenges Progress
</h1> <p class="text-lg text-muted max-w-2xl mx-auto">
Track your journey through Linux, Docker, and DevOps challenges. 
                Build skills, maintain streaks, and achieve mastery.
</p> </header> <!-- Hero Metrics --> ${renderComponent($$result2, "HeroMetrics", $$HeroMetrics, { "data": challengesData.default.overview })} <!-- Simple Progress Cards --> <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"> <!-- Linux Card --> <div class="bg-secondary rounded-xl p-6"> <div class="flex items-center mb-6"> <span class="text-3xl mr-3">🐧</span> <h3 class="text-text text-xl font-semibold">${challengesData.default.programs.linux.name} Challenges</h3> </div> <div class="mb-4"> <div class="relative w-full bg-secondary rounded-full h-3 overflow-hidden"> <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full" style="width: 22.2%"></div> </div> </div> <div class="text-center text-sm text-muted"> <span class="font-bold text-lg">${challengesData.default.programs.linux.completed}</span> completed
<span>of ${challengesData.default.programs.linux.total} total</span> <span class="block font-bold text-accent mt-1">22.2% progress</span> </div> </div> <!-- Docker Card --> <div class="bg-secondary rounded-xl p-6"> <div class="flex items-center mb-6"> <span class="text-3xl mr-3">🐳</span> <h3 class="text-text text-xl font-semibold">${challengesData.default.programs.docker.name} Challenges</h3> </div> <div class="mb-4"> <div class="relative w-full bg-secondary rounded-full h-3 overflow-hidden"> <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full" style="width: 20%"></div> </div> </div> <div class="text-center text-sm text-muted"> <span class="font-bold text-lg">${challengesData.default.programs.docker.completed}</span> completed
<span>of ${challengesData.default.programs.docker.total} total</span> <span class="block font-bold text-accent mt-1">20% progress</span> </div> </div> <!-- DevOps Card --> <div class="bg-secondary rounded-xl p-6"> <div class="flex items-center mb-6"> <span class="text-3xl mr-3">⚙️</span> <h3 class="text-text text-xl font-semibold">${challengesData.default.programs.devops.name} Challenges</h3> </div> <div class="mb-4"> <div class="relative w-full bg-secondary rounded-full h-3 overflow-hidden"> <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full" style="width: 4%"></div> </div> </div> <div class="text-center text-sm text-muted"> <span class="font-bold text-lg">${challengesData.default.programs.devops.completed}</span> completed
<span>of ${challengesData.default.programs.devops.total} total</span> <span class="block font-bold text-accent mt-1">4% progress</span> </div> </div> </section> <!-- Recent Activity --> <section class="bg-secondary rounded-xl p-6 mb-8"> <h3 class="text-text text-xl font-semibold mb-6 flex items-center"> <span class="text-2xl mr-3">📊</span>
Recent Activity
</h3> <div class="space-y-3"> ${challengesData.default.recentActivity.slice(0, 5).map((activity, index) => renderTemplate`<div class="flex items-center bg-primary rounded-lg p-3"> <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center mr-4"> <span class="text-lg">${activity.icon}</span> </div> <div class="flex-grow"> <div class="text-text text-sm font-medium">${activity.activity}</div> <div class="text-xs text-muted">${activity.program}</div> </div> <div class="text-xs text-muted">${index === 0 ? "Latest" : `${index + 1}h ago`}</div> </div>`)} </div> ${challengesData.default.recentActivity.length === 0 && renderTemplate`<div class="text-center text-muted py-8"> <span class="text-2xl mb-2">🎯</span>
No recent activity yet. Start completing challenges!
</div>`} </section> <!-- Skills Development --> <section class="bg-secondary rounded-xl p-6 mb-8"> <h3 class="text-text text-xl font-semibold mb-6 flex items-center"> <span class="text-2xl mr-3">🛠️</span>
Skills Development
</h3> <div class="text-center text-muted py-8"> <span class="text-2xl mb-2">🎓</span>
Skills will appear as you complete challenges
</div> </section> <!-- Footer --> <footer class="mt-16 text-center text-muted text-sm"> <div class="mb-4"> <div class="flex items-center justify-center space-x-4 mb-2"> <span>Built with</span> <span class="text-accent">❤️</span> <span>using</span> <span class="text-accent">Astro</span> <span>+</span> <span class="text-accent">Tailwind CSS</span> </div> <div class="flex items-center justify-center space-x-4 text-xs">
Auto-updated on every push • Real-time progress tracking
</div> </div> <div class="text-xs text-muted border-t border-secondary pt-4">
© 2026 Diego Saavedra • Technical Challenges Dashboard
<br> <span class="inline-block mt-2">
Last updated: ${new Date(challengesData.default.lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })} </span> </div> </footer> </main>  <div class="fixed bottom-6 right-6 z-50"> <button onclick="window.location.reload()" class="bg-accent hover:bg-emerald-400 text-primary font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2" title="Refresh Progress Data (Ctrl+R)"> <span>🔄</span> <span>Refresh</span> </button> </div>   ` })}`;
}, "/Users/statick/apps/cursos/challenges-dashboard/src/pages/index.astro", void 0);

const $$file = "/Users/statick/apps/cursos/challenges-dashboard/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
