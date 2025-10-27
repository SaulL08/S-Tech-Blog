
export const $ = (sel) => document.querySelector(sel);
export const $$ = (sel) => [...document.querySelectorAll(sel)];

export async function inject(id, url) {
  const el = $(id);
  if (!el) return;
  try {
    const res = await fetch(url);
    const html = await res.text();
    el.innerHTML = html;
  } catch (err) {
    console.error(`Error injecting ${url}:`, err);
  }
}

export function setActiveNav(hash) {
  const links = $$('[data-go]');
  links.forEach(link => {
    if (link.dataset.go === hash) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}