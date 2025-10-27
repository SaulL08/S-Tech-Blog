
import { fetchAndRenderPosts } from '../services/posts.service.js';
import { isAuthenticated } from '../services/auth.service.js';
import { $ } from '../core/dom.js';

export function onload() {
  fetchAndRenderPosts('#grid');
  setupAdminButtons();
}

function setupAdminButtons() {
  if (!isAuthenticated()) return;

  // Buscar el contenedor principal y agregar botón de nuevo artículo
  const mainContainer = document.querySelector('.posts-page') || document.querySelector('main');
  if (!mainContainer) return;

  const btnContainer = document.createElement('div');
  btnContainer.className = 'admin-actions';
  btnContainer.innerHTML = `
    <button id="btn-new-article" class="btn-new-article">
      <i class="ph ph-plus-circle"></i> Nuevo Artículo
    </button>
  `;

  // Insertar antes del grid
  const grid = $('#grid');
  grid.parentNode.insertBefore(btnContainer, grid);

  $('#btn-new-article').addEventListener('click', () => {
    window.location.hash = '#/editor';
  });
}