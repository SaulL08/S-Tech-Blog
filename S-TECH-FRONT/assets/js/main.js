// path: S-TECH-FRONT/assets/js/main.js
import { $, $$, inject, setActiveNav } from './core/dom.js';

const DARK_KEY = 'stech-dark';

const routes = {
  '/': { view: '/S-TECH-FRONT/assets/pages/home.html', module: './pages/home.js' },
  '/articulos': { view: '/S-TECH-FRONT/assets/pages/articulos.html', module: './pages/articulos.js' },
  '/sobre': { view: '/S-TECH-FRONT/assets/pages/sobre.html', module: './pages/sobre.js' },
  '/soporte': { view: '/S-TECH-FRONT/assets/pages/soporte.html', module: './pages/soporte.js' }
};

async function loadPage(hash) {
  const path = hash.replace('#', '') || '/';
  
  if (path.startsWith('/articulo/')) {
    await inject('#view', '/S-TECH-FRONT/assets/pages/articulo.html');
    const mod = await import('./pages/articulo.js');
    if (mod.onload) mod.onload();
    setActiveNav('#/articulos');
    return;
  }

  if (path.startsWith('/editor')) {
    window.location.href = '/S-TECH-FRONT/pages/editor.html' + hash;
    return;
  }

  if (path === '/login') {
    window.location.href = '/S-TECH-FRONT/pages/login.html';
    return;
  }
  
  const route = routes[path] || routes['/'];

  await inject('#view', route.view);

  const mod = await import(route.module);
  if (mod.onload) mod.onload();

  setActiveNav('#' + path);
}

async function initApp() {
  await inject('#header', '/S-TECH-FRONT/assets/layouts/header.html');
  await inject('#footer', '/S-TECH-FRONT/assets/layouts/footer.html');

  if (localStorage.getItem(DARK_KEY) === '1') {
    document.documentElement.classList.add('dark');
  }

  setTimeout(async () => {
    const toggleDark = $('#toggle-dark');
    if (toggleDark) {
      toggleDark.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem(DARK_KEY, document.documentElement.classList.contains('dark') ? '1' : '0');
      });
    }

    $$('[data-go]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.hash = btn.dataset.go;
        // Cerrar menú móvil al navegar
        const nav = $('#main-nav');
        if (nav) nav.classList.remove('open');
      });
    });

    // Configurar menú móvil
    setupMobileMenu();
    
    // Configurar búsqueda móvil
    setupMobileSearch();
    
    // Configurar buscador
    setupSearch();
    
    // Mostrar botón de editor si está autenticado
    await setupEditorAccess();
    
    // Configurar botón de login/logout
    setupLoginButton();
  }, 100);

  window.addEventListener('hashchange', () => loadPage(window.location.hash));

  await loadPage(window.location.hash);
}

function setupSearch() {
  const searchInput = $('#search');
  if (!searchInput) return;

  let searchTimeout;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim().toLowerCase();

    searchTimeout = setTimeout(() => {
      if (query.length === 0) {
        // Si está vacío, restaurar todos los artículos
        const currentHash = window.location.hash.replace('#', '') || '/';
        if (currentHash === '/' || currentHash === '/articulos') {
          loadPage(window.location.hash);
        }
        return;
      }

      if (query.length < 2) return; // Mínimo 2 caracteres

      // Buscar en todos los artículos
      searchArticles(query);
    }, 300); // Debounce de 300ms
  });

  // Limpiar búsqueda al cambiar de página
  window.addEventListener('hashchange', () => {
    if (searchInput) {
      searchInput.value = '';
    }
  });
}

async function searchArticles(query) {
  try {
    const response = await fetch(apiUrl('/posts'));
    const posts = await response.json();

    const results = posts.filter(post => {
      const searchText = `${post.title} ${post.excerpt} ${post.cat} ${post.content}`.toLowerCase();
      return searchText.includes(query);
    });

    // Renderizar resultados
    const grid = $('#grid');
    if (!grid) return;

    if (results.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px;">
          <h3 style="margin-bottom: 12px;">No se encontraron resultados</h3>
          <p style="color: var(--muted-dark);">Intenta con otros términos de búsqueda</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = results.map(p => `
      <article class="card" data-id="${p._id}" style="cursor: pointer;">
        <span class="badge">${p.cat}</span>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
        <div class="meta">Por ${p.author} • ${p.date} • ${p.read}</div>
      </article>
    `).join('');

    grid.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        window.location.hash = `#/articulo/${id}`;
      });
    });

    // Mostrar contador de resultados
    const searchInfo = document.createElement('p');
    searchInfo.style.cssText = 'grid-column: 1/-1; color: var(--muted-dark); margin-bottom: 16px; font-weight: 600;';
    searchInfo.textContent = `Se encontraron ${results.length} artículo${results.length !== 1 ? 's' : ''} para "${query}"`;
    grid.insertBefore(searchInfo, grid.firstChild);

  } catch (error) {
    console.error('Error en búsqueda:', error);
  }
}

async function setupEditorAccess() {
  try {
    const { isAuthenticated, getToken } = await import('./services/auth.service.js');
    const editorBtn = $('#btn-editor');
    
    const token = getToken();
    const isAuth = isAuthenticated();
    
    console.log('🔍 Debug Editor Button:', { 
      btnExists: !!editorBtn, 
      hasToken: !!token,
      isAuth: isAuth
    });
    
    if (editorBtn && isAuth) {
      editorBtn.style.display = 'inline-flex';
      editorBtn.addEventListener('click', () => {
        window.location.hash = '#/editor';
      });
      console.log('✅ Editor button configured and visible');
    } else if (editorBtn) {
      console.log('ℹ️ Editor button hidden - User not authenticated');
    }
  } catch (error) {
    console.error('❌ Error al configurar acceso al editor:', error);
  }
}

function setupLoginButton() {
  const loginBtn = $('#btn-login');
  if (!loginBtn) return;

  import('./services/auth.service.js').then(({ isAuthenticated, logout }) => {
    if (isAuthenticated()) {
      // Si está autenticado, mostrar ícono de logout
      loginBtn.innerHTML = '<i class="ph ph-sign-out"></i>';
      loginBtn.title = 'Cerrar Sesión';
      loginBtn.addEventListener('click', () => {
        logout();
        window.location.reload();
      });
    } else {
      // Si no está autenticado, mostrar ícono de login
      loginBtn.addEventListener('click', () => {
        window.location.hash = '#/login';
      });
    }
  });
}

function setupMobileMenu() {
  const menuToggle = $('#menu-toggle');
  const nav = $('#main-nav');
  
  if (!menuToggle || !nav) return;

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const icon = menuToggle.querySelector('i');
    
    if (nav.classList.contains('open')) {
      icon.className = 'ph ph-x';
    } else {
      icon.className = 'ph ph-list';
    }
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      nav.classList.remove('open');
      const icon = menuToggle.querySelector('i');
      icon.className = 'ph ph-list';
    }
  });
}

function setupMobileSearch() {
  const searchToggle = $('#btn-search-toggle');
  const searchClose = $('#btn-search-close');
  const searchContainer = $('#mobile-search-container');
  const searchInput = $('#search-mobile');
  
  if (!searchToggle || !searchContainer) return;

  searchToggle.addEventListener('click', () => {
    searchContainer.classList.add('open');
    setTimeout(() => searchInput?.focus(), 300);
  });

  if (searchClose) {
    searchClose.addEventListener('click', () => {
      searchContainer.classList.remove('open');
      searchInput.value = '';
    });
  }

  // Cerrar búsqueda con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchContainer.classList.contains('open')) {
      searchContainer.classList.remove('open');
      searchInput.value = '';
    }
  });

  // Sincronizar búsqueda móvil con la función principal
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      const query = e.target.value.trim().toLowerCase();
      
      if (query.length < 2) {
        const mainInput = $('#search');
        if (mainInput) mainInput.value = '';
        return;
      }

      debounceTimer = setTimeout(() => {
        // Sincronizar con input principal para usar la misma función de búsqueda
        const mainInput = $('#search');
        if (mainInput) {
          mainInput.value = query;
          const event = new Event('input', { bubbles: true });
          mainInput.dispatchEvent(event);
        }
      }, 300);
    });
  }
}

initApp();
