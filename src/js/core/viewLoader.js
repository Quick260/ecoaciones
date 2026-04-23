import { getCache, setCache } from "./cache.js";

export async function loadView(name) {
  const cached = getCache(name);
  if (cached) return cached;

  const res = await fetch(`/src/pages/${name}/${name}.html`);
  const html = await res.text();

  setCache(name, html);
  return html;
}