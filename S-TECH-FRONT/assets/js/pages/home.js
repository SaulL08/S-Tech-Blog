/**
 * Página principal (Home)
 * - Hero carousel con artículos destacados
 * - Sección de estadísticas (artículos, vistas, lectores)
 * - Grid de todos los artículos
 */

import { fetchAndRenderPosts } from '../services/posts.service.js';
import { apiUrl } from '../config.js';

// Variables globales del carousel
let currentSlide = 0;
let heroCarouselPosts = [];
let autoPlayInterval;

/**
 * Función principal que se ejecuta al cargar la página
 */
export async function onload() {
  await loadHeroCarousel();
  await loadStats();
  fetchAndRenderPosts('#grid');
}

/**
 * Carga y calcula las estadísticas del blog
 * - Total de artículos
 * - Total de vistas acumuladas
 * - Lectores únicos estimados (vistas / 2)
 */
async function loadStats() {
  try {
    const response = await fetch(apiUrl('/posts'));
    if (!response.ok) return;
    
    const posts = await response.json();
    const totalArticles = posts.length;
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalReaders = Math.floor(totalViews / 2);
    
    // Actualizar DOM con animación de contador
    const articlesEl = document.getElementById('totalArticles');
    const viewsEl = document.getElementById('totalViews');
    const readersEl = document.getElementById('totalReaders');
    
    if (articlesEl) animateCounter(articlesEl, totalArticles);
    if (viewsEl) animateCounter(viewsEl, totalViews);
    if (readersEl) animateCounter(readersEl, totalReaders);
    
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  }
}

/**
 * Anima un contador de 0 al valor objetivo
 * @param {HTMLElement} element - Elemento donde mostrar el contador
 * @param {number} target - Valor objetivo
 */
function animateCounter(element, target) {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 30);
}

/**
 * Carga los 5 artículos más recientes para el carousel hero
 */
async function loadHeroCarousel() {
  try {
    const response = await fetch(apiUrl('/posts?limit=5&sort=-createdAt'));
    
    if (!response.ok) throw new Error('Error al cargar artículos');
    
    heroCarouselPosts = await response.json();
    
    if (heroCarouselPosts.length === 0) {
      document.querySelector('.hero-carousel').style.display = 'none';
      return;
    }
    
    renderHeroCarousel();
    setupHeroCarouselControls();
    startAutoPlay();
  } catch (error) {
    console.error('❌ Error al cargar hero carousel:', error);
    document.querySelector('.hero-carousel').style.display = 'none';
  }
}

/**
 * Renderiza los slides del carousel y los indicadores
 */
function renderHeroCarousel() {
  const track = document.getElementById('heroCarouselTrack');
  const indicators = document.getElementById('heroCarouselIndicators');
  
  if (!track || !heroCarouselPosts.length) return;

  // Renderizar slides
  track.innerHTML = heroCarouselPosts.map(post => {
    const imageUrl = post.imageUrl || '';
    const hasImage = imageUrl && imageUrl.trim() !== '';
    
    return `
      <div class="hero-slide" onclick="window.location.hash = '#/articulo/${post._id}'">
        <div class="hero-slide-image ${!hasImage ? 'no-image' : ''}">
          ${hasImage 
            ? `<img src="${imageUrl}" alt="${post.title}" onerror="this.parentElement.classList.add('no-image'); this.style.display='none';">` 
            : `<i class="ph ph-article"></i>`
          }
        </div>
        <div class="hero-slide-content">
          <span class="hero-slide-badge">${post.cat}</span>
          <h1 class="hero-slide-title">${post.title}</h1>
          <p class="hero-slide-excerpt">${post.excerpt}</p>
          <div class="hero-slide-meta">
            <span><i class="ph ph-user"></i> ${post.author}</span>
            <span><i class="ph ph-clock"></i> ${post.read}</span>
            <span><i class="ph ph-calendar"></i> ${post.date}</span>
          </div>
          <button class="hero-slide-cta">
            Leer más
            <i class="ph-bold ph-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Renderizar indicadores
  indicators.innerHTML = heroCarouselPosts.map((_, i) => 
    `<div class="hero-indicator ${i === 0 ? 'active' : ''}" data-slide="${i}"></div>`
  ).join('');
}

/**
 * Configura los controles del carousel:
 * - Botones prev/next
 * - Indicadores clickeables
 * - Touch/swipe para móvil
 * - Navegación con teclado (flechas)
 * - Pausa autoplay al hover
 */
function setupHeroCarouselControls() {
  const prevBtn = document.getElementById('heroCarouselPrev');
  const nextBtn = document.getElementById('heroCarouselNext');
  const indicators = document.getElementById('heroCarouselIndicators');
  
  if (prevBtn) prevBtn.onclick = (e) => {
    e.stopPropagation();
    moveSlide(-1);
  };
  
  if (nextBtn) nextBtn.onclick = (e) => {
    e.stopPropagation();
    moveSlide(1);
  };
  
  if (indicators) {
    indicators.addEventListener('click', (e) => {
      if (e.target.classList.contains('hero-indicator')) {
        const slide = parseInt(e.target.dataset.slide);
        goToSlide(slide);
      }
    });
  }

  // Touch events para móvil (swipe)
  const track = document.getElementById('heroCarouselTrack');
  if (track) {
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      stopAutoPlay();
    });

    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
    });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) moveSlide(1);
        else moveSlide(-1);
      }
      
      isDragging = false;
      startAutoPlay();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveSlide(-1);
    if (e.key === 'ArrowRight') moveSlide(1);
  });

  // Pausar autoplay al pasar el mouse por encima
  const heroCarousel = document.querySelector('.hero-carousel');
  if (heroCarousel) {
    heroCarousel.addEventListener('mouseenter', stopAutoPlay);
    heroCarousel.addEventListener('mouseleave', startAutoPlay);
  }
}

/**
 * Mueve el carousel en la dirección especificada
 * @param {number} direction - -1 para anterior, 1 para siguiente
 */
function moveSlide(direction) {
  currentSlide += direction;
  
  if (currentSlide < 0) currentSlide = heroCarouselPosts.length - 1;
  if (currentSlide >= heroCarouselPosts.length) currentSlide = 0;
  
  updateCarousel();
}

/**
 * Navega a un slide específico
 * @param {number} slideIndex - Índice del slide (0-based)
 */
function goToSlide(slideIndex) {
  if (slideIndex >= 0 && slideIndex < heroCarouselPosts.length) {
    currentSlide = slideIndex;
    updateCarousel();
    stopAutoPlay();
    setTimeout(startAutoPlay, 8000); // Reanudar después de 8s
  }
}

/**
 * Actualiza la posición del carousel y los indicadores activos
 */
function updateCarousel() {
  const track = document.getElementById('heroCarouselTrack');
  const indicators = document.querySelectorAll('.hero-indicator');
  
  if (!track) return;
  
  const offset = currentSlide * 100;
  track.style.transform = `translateX(-${offset}%)`;
  
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSlide);
  });
}

/**
 * Inicia el autoplay del carousel (cambia cada 6 segundos)
 */
function startAutoPlay() {
  stopAutoPlay();
  autoPlayInterval = setInterval(() => {
    moveSlide(1);
  }, 6000);
}

/**
 * Detiene el autoplay del carousel
 */
function stopAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
}