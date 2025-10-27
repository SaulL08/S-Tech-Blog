import { $ } from '../core/dom.js';
import { getArticleById, getRecommendedPosts } from '../services/article.service.js';
import { isAuthenticated, getAuthHeaders } from '../services/auth.service.js';
import { apiUrl } from '../config.js';

let currentFontSize = 1.05;
let isSpeaking = false;
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let currentArticleId = null;

export async function onload() {
  const hash = window.location.hash;
  const parts = hash.split('/');
  const id = parts[parts.length - 1];
  currentArticleId = id;

  if (!id || id === '#' || id === '') {
    window.location.hash = '#/';
    return;
  }

  const article = await getArticleById(id);
  
  if (!article) {
    $('#article-content').innerHTML = '<p>Artículo no encontrado</p>';
    return;
  }

  // Registrar vista
  await incrementView(id);

  renderArticle(article);
  loadRecommendations(id);
  loadComments(id);
  setupToolbar();
  setupCommentForm(id);
  setupArticleLike(id, article.likes || 0);
  setupAdminButtons(id);
}

async function incrementView(postId) {
  try {
    await fetch(apiUrl(`/posts/${postId}/view`), {
      method: 'POST'
    });
  } catch (error) {
    console.error('Error al registrar vista:', error);
  }
}

function renderArticle(article) {
  $('#article-cat').textContent = article.cat;
  $('#article-date').textContent = article.date;
  $('#article-read').textContent = article.read;
  $('#article-title').textContent = article.title;
  $('#article-author').textContent = article.author;
  
  // Mostrar vistas si existe el elemento
  const viewsElement = $('#article-views');
  if (viewsElement && article.views !== undefined) {
    viewsElement.textContent = `${article.views} vistas`;
  }
  
  if (article.imageUrl) {
    $('#article-image-container').innerHTML = `<img src="${article.imageUrl}" alt="${article.title}" />`;
  } else {
    $('#article-image-container').style.display = 'none';
  }

  if (article.videoUrl) {
    const isYouTube = article.videoUrl.includes('youtube.com') || article.videoUrl.includes('youtu.be');
    if (isYouTube) {
      const videoId = article.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      $('#article-video-container').innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`;
    } else {
      $('#article-video-container').innerHTML = `<video controls src="${article.videoUrl}"></video>`;
    }
  } else {
    $('#article-video-container').style.display = 'none';
  }
  
  $('#article-content').innerHTML = article.content || '<p>Contenido no disponible</p>';
}

async function loadRecommendations(currentId) {
  const posts = await getRecommendedPosts(currentId, 3);
  const grid = $('#recommendations-grid');
  
  if (!posts.length) {
    grid.innerHTML = '<p>No hay recomendaciones disponibles</p>';
    return;
  }

  grid.innerHTML = posts.map(p => `
    <article class="card" data-id="${p._id}" style="cursor: pointer;">
      <span class="badge">${p.cat}</span>
      <h3>${p.title}</h3>
      <p>${p.excerpt}</p>
      <div class="meta">Por ${p.author} • ${p.date}</div>
    </article>
  `).join('');

  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      window.location.hash = `#/articulo/${id}`;
    });
  });
}

function setupToolbar() {
  const content = $('#article-content');

  $('#btn-font-decrease')?.addEventListener('click', () => {
    if (currentFontSize > 0.8) {
      currentFontSize -= 0.1;
      content.style.fontSize = `${currentFontSize}rem`;
    }
  });

  $('#btn-font-increase')?.addEventListener('click', () => {
    if (currentFontSize < 1.5) {
      currentFontSize += 0.1;
      content.style.fontSize = `${currentFontSize}rem`;
    }
  });

  $('#btn-listen')?.addEventListener('click', () => {
    toggleSpeech();
  });

  $('#btn-share')?.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: $('#article-title').textContent,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  });
}

function toggleSpeech() {
  if (!speechSynthesis) {
    alert('Tu navegador no soporta síntesis de voz');
    return;
  }

  if (isSpeaking) {
    speechSynthesis.cancel();
    isSpeaking = false;
    $('#btn-listen').textContent = '🔊';
    return;
  }

  const text = $('#article-content').textContent;
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = 'es-ES';
  currentUtterance.rate = 0.9;

  currentUtterance.onend = () => {
    isSpeaking = false;
    $('#btn-listen').textContent = '🔊';
  };

  speechSynthesis.speak(currentUtterance);
  isSpeaking = true;
  $('#btn-listen').textContent = '⏸';
}

function loadComments(articleId) {
  fetch(apiUrl(`/posts/${articleId}/comments`))
    .then(res => res.json())
    .then(comments => renderComments(comments))
    .catch(err => {
      console.error('Error cargando comentarios:', err);
      $('#comments-list').innerHTML = '<p class="no-comments">Error cargando comentarios</p>';
    });
}

function renderComments(comments) {
  const list = $('#comments-list');
  
  if (!comments.length) {
    list.innerHTML = '<p class="no-comments">Sé el primero en comentar</p>';
    return;
  }

  list.innerHTML = comments.map(c => `
    <div class="comment-item" data-comment-id="${c._id}">
      <div class="comment-header">
        <span class="comment-name">${c.name}</span>
        <span class="comment-time">${new Date(c.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="comment-text">${c.text}</div>
      <button class="btn-like-comment" data-comment-id="${c._id}" title="Me gusta">
        <i class="ph ph-heart"></i>
        <span class="comment-likes-count">${c.likes || 0}</span>
      </button>
    </div>
  `).join('');

  list.querySelectorAll('.btn-like-comment').forEach(btn => {
    btn.addEventListener('click', () => handleCommentLike(btn.dataset.commentId));
  });
}

function setupCommentForm(articleId) {
  const form = $('#comment-form');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = $('#comment-name').value.trim();
    const email = $('#comment-email').value.trim();
    const text = $('#comment-text').value.trim();
    const subscribe = $('#subscribe-updates').checked;
    
    if (!name || !text) return;

    try {
      const res = await fetch(apiUrl(`/posts/${articleId}/comments`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: email || 'anon@example.com', text })
      });

      if (!res.ok) throw new Error('Error al publicar comentario');

      // Suscripción al newsletter con backend
      if (subscribe && email) {
        try {
          const subRes = await fetch(apiUrl('/subscribers/subscribe'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });

          const subData = await subRes.json();
          
          if (subData.alreadySubscribed) {
            alert('Comentario publicado. Ya estás suscrito a las notificaciones.');
          } else {
            alert('¡Comentario publicado y suscripción confirmada! Revisa tu email para verificar.');
          }
        } catch (subErr) {
          console.error('Error en suscripción:', subErr);
          alert('Comentario publicado, pero hubo un error al suscribirte. Intenta más tarde.');
        }
      } else {
        alert('Comentario publicado exitosamente');
      }

      form.reset();
      loadComments(articleId);
    } catch (err) {
      alert('Error al publicar el comentario. Intenta de nuevo.');
      console.error(err);
    }
  });
}

function setupArticleLike(articleId, initialLikes) {
  const btn = $('#btn-like');
  const counter = $('#article-likes-count');
  
  counter.textContent = initialLikes;
  
  const likedKey = `liked-article-${articleId}`;
  if (localStorage.getItem(likedKey)) {
    btn.classList.add('liked');
    btn.querySelector('i').classList.remove('ph-heart');
    btn.querySelector('i').classList.add('ph-heart-fill');
  }
  
  btn.addEventListener('click', async () => {
    if (localStorage.getItem(likedKey)) {
      alert('Ya has dado like a este artículo');
      return;
    }
    
    try {
      const res = await fetch(apiUrl(`/posts/${articleId}/like`), {
        method: 'POST'
      });
      
      if (!res.ok) throw new Error('Error al dar like');
      
      const data = await res.json();
      counter.textContent = data.likes;
      btn.classList.add('liked');
      btn.querySelector('i').classList.remove('ph-heart');
      btn.querySelector('i').classList.add('ph-heart-fill');
      localStorage.setItem(likedKey, 'true');
    } catch (err) {
      console.error('Error al dar like:', err);
    }
  });
}

async function handleCommentLike(commentId) {
  const likedKey = `liked-comment-${commentId}`;
  if (localStorage.getItem(likedKey)) {
    alert('Ya has dado like a este comentario');
    return;
  }
  
  try {
    const res = await fetch(apiUrl(`/posts/${currentArticleId}/comments/${commentId}/like`), {
      method: 'POST'
    });
    
    if (!res.ok) throw new Error('Error al dar like');
    
    const data = await res.json();
    const btn = document.querySelector(`[data-comment-id="${commentId}"]`);
    const counter = btn.querySelector('.comment-likes-count');
    counter.textContent = data.likes;
    btn.classList.add('liked');
    btn.querySelector('i').classList.remove('ph-heart');
    btn.querySelector('i').classList.add('ph-heart-fill');
    localStorage.setItem(likedKey, 'true');
  } catch (err) {
    console.error('Error al dar like:', err);
  }
}

function setupAdminButtons(articleId) {
  if (!isAuthenticated()) return;

  // Agregar botones de edición y eliminación al toolbar
  const toolbar = $('.article-toolbar');
  
  const editBtn = document.createElement('button');
  editBtn.id = 'btn-edit-article';
  editBtn.className = 'btn-admin';
  editBtn.innerHTML = '<i class="ph ph-pencil"></i> Editar';
  editBtn.title = 'Editar artículo';
  editBtn.addEventListener('click', () => {
    window.location.hash = `#/editor/${articleId}`;
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.id = 'btn-delete-article';
  deleteBtn.className = 'btn-admin btn-danger';
  deleteBtn.innerHTML = '<i class="ph ph-trash"></i> Eliminar';
  deleteBtn.title = 'Eliminar artículo';
  deleteBtn.addEventListener('click', () => deleteArticle(articleId));

  toolbar.appendChild(editBtn);
  toolbar.appendChild(deleteBtn);
}

async function deleteArticle(articleId) {
  if (!confirm('¿Estás seguro de eliminar este artículo? Esta acción no se puede deshacer.')) {
    return;
  }

  try {
    const response = await fetch(apiUrl(`/posts/${articleId}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Error al eliminar');

    alert('Artículo eliminado exitosamente');
    window.location.hash = '#/articulos';
  } catch (error) {
    alert('Error al eliminar artículo: ' + error.message);
  }
}
