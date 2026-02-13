import { c as createComponent, m as maybeRenderHead, d as addAttribute, b as renderTemplate, a as renderScript, e as createAstro } from './astro/server-CtDjgMVI.js';
import 'piccolore';
import 'clsx';

const $$Astro = createAstro();
const $$ChallengeModal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ChallengeModal;
  const { id, title, category, difficulty, flag, steps, summary, tools, verification, troubleshooting, learnings } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`modal-${id}`, "id")} class="fixed inset-0 bg-black bg-opacity-50 hidden z-50" aria-hidden="true"> <div class="flex items-center justify-center min-h-screen p-4"> <div class="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"> <div class="p-6 border-b border-slate-700"> <div class="flex justify-between items-start"> <div> <h2 class="text-2xl font-bold text-gray-100">${title}</h2> <div class="flex items-center gap-4 mt-2 text-sm"> <span class="capitalize bg-slate-700 px-2 py-1 rounded">${category}</span> ${difficulty && renderTemplate`<span class="text-cyan-400">${difficulty}</span>`} ${flag && renderTemplate`<span class="text-green-400 font-mono">Flag: ${flag}</span>`} </div> </div> <button${addAttribute(`closeModal('${id}')`, "onclick")} class="text-gray-400 hover:text-white">
✕
</button> </div> </div> <div class="p-6"> ${steps && steps.length > 0 && renderTemplate`<div class="mb-6"> <h3 class="text-lg font-semibold text-cyan-400 mb-4">Pasos a Seguir</h3> ${steps.map((step, index) => renderTemplate`<div class="mb-4"> <h4 class="font-medium text-gray-200 mb-2">${index + 1}. ${step.title}</h4> ${step.commands && step.commands.length > 0 && renderTemplate`<pre class="bg-slate-900 p-3 rounded text-sm text-green-400 mb-2 overflow-x-auto">

                    <code>${step.commands.join("\n")}</code>
                  </pre>`} ${step.explanation && renderTemplate`<p class="text-gray-300 text-sm">${step.explanation}</p>`} </div>`)} </div>`} ${verification && verification.length > 0 && renderTemplate`<div class="mb-6"> <h3 class="text-lg font-semibold text-yellow-400 mb-4">Verificación</h3> <ul class="space-y-2"> ${verification.map((item) => renderTemplate`<li class="flex items-center text-gray-300"> <span class="text-green-400 mr-2">✓</span> ${item} </li>`)} </ul> </div>`} ${learnings && learnings.length > 0 && renderTemplate`<div class="mb-6"> <h3 class="text-lg font-semibold text-orange-400 mb-4">Lo Que Aprendiste</h3> <ul class="space-y-2"> ${learnings.map((learning) => renderTemplate`<li class="text-gray-300">• ${learning}</li>`)} </ul> </div>`} ${summary && renderTemplate`<div class="mb-6"> <h3 class="text-lg font-semibold text-purple-400 mb-4">Resumen</h3> <p class="text-gray-300">${summary}</p> </div>`} </div> </div> </div> </div> ${renderScript($$result, "/home/runner/work/challenges/challenges/src/components/ChallengeModal.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/challenges/challenges/src/components/ChallengeModal.astro", void 0);

export { $$ChallengeModal as $ };
