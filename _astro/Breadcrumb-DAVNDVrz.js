import { e as createAstro, c as createComponent, m as maybeRenderHead, b as renderTemplate, d as addAttribute } from './astro/server-DYxzlhiQ.js';
import 'piccolore';
import 'clsx';

const $$Astro = createAstro("https://statick88.github.io");
const $$Breadcrumb = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Breadcrumb;
  const { items } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<nav class="flex mb-6" aria-label="Breadcrumb"> <ol class="flex items-center space-x-2"> ${items.map((item, index) => renderTemplate`<li class="flex items-center"> ${index > 0 && renderTemplate`<span class="text-gray-500 mx-2">/</span>`} ${item.href ? renderTemplate`<a${addAttribute(item.href, "href")} class="text-cyan-400 hover:text-cyan-300 transition-colors"> ${item.label} </a>` : renderTemplate`<span class="text-gray-300 font-medium">${item.label}</span>`} </li>`)} </ol> </nav>`;
}, "/home/runner/work/challenges/challenges/src/components/Breadcrumb.astro", void 0);

export { $$Breadcrumb as $ };
