
import { getPosts } from '../core/http.js';

export async function fetchAndRenderPosts(container) {
  const el = document.querySelector(container);
  if (!el) return;

  el.innerHTML = '<p>Cargando...</p>';

  const posts = await getPosts();

  if (!posts.length) {
    el.innerHTML = '<p>No hay artículos disponibles.</p>';
    return;
  }

  el.innerHTML = posts.map(p => `
    <article class="card" data-id="${p._id}" style="cursor: pointer;">
      <span class="badge">${p.cat}</span>
      <h3>${p.title}</h3>
      <p>${p.excerpt}</p>
      <div class="meta">Por ${p.author} • ${p.date} • ${p.read}</div>
    </article>
  `).join('');

  el.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      window.location.hash = `#/articulo/${id}`;
    });
  });
}