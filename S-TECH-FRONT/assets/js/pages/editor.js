import { $ } from '../core/dom.js';
import { isAuthenticated, getAuthHeaders, uploadFile, logout } from '../services/auth.service.js';
import { getArticleById } from '../services/article.service.js';
import { apiUrl, CONFIG } from '../config.js';
import { toast } from '../core/toast.js';

let editor;
let currentArticleId = null;
let autoSaveInterval;

// Verificar autenticación
if (!isAuthenticated()) {
  toast.error('Debes iniciar sesión para acceder al editor');
  setTimeout(() => {
    window.location.href = '/S-TECH-FRONT/pages/login.html';
  }, 2000);
}

export async function onload() {
  // Obtener ID del artículo si estamos editando
  const hash = window.location.hash;
  const match = hash.match(/#\/editor\/(.+)/);
  if (match) {
    currentArticleId = match[1];
    await loadArticleForEdit(currentArticleId);
  }

  initTinyMCE();
  setupEventListeners();
  startAutoSave();
}

function initTinyMCE() {
  const isDark = document.documentElement.classList.contains('dark');
  
  tinymce.init({
    selector: '#content',
    height: 600,
    menubar: true,
    promotion: false,
    branding: false,
    skin: isDark ? 'oxide-dark' : 'oxide',
    content_css: isDark ? 'dark' : 'default',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount', 'codesample'
    ],
    toolbar: 'undo redo | blocks | bold italic underline strikethrough | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | forecolor backcolor | ' +
      'table tabledelete | tableprops tablerowprops tablecellprops | ' +
      'tableinsertrowbefore tableinsertrowafter tabledeleterow | ' +
      'tableinsertcolbefore tableinsertcolafter tabledeletecol | ' +
      'link image media codesample | removeformat code fullscreen',
    content_style: isDark 
      ? 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; background:#0f172a; color:#e2e8f0; }' 
      : 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; }',
    images_upload_handler: async (blobInfo, progress) => {
      try {
        const file = blobInfo.blob();
        const result = await uploadFile(file);
        return `${CONFIG.API_URL.replace('/api', '')}${result.url}`;
      } catch (error) {
        throw new Error('Error al subir imagen: ' + error.message);
      }
    },
    file_picker_callback: function(callback, value, meta) {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      
      if (meta.filetype === 'image') {
        input.setAttribute('accept', 'image/*');
      } else if (meta.filetype === 'media') {
        input.setAttribute('accept', 'video/*');
      } else {
        input.setAttribute('accept', '*/*');
      }

      input.onchange = async function() {
        const file = this.files[0];
        try {
          const result = await uploadFile(file);
          callback(`${CONFIG.API_URL.replace('/api', '')}${result.url}`, { title: file.name });
        } catch (error) {
          toast.error('Error al subir archivo');
        }
      };

      input.click();
    },
    setup: (ed) => {
      editor = ed;
    }
  });
}

async function loadArticleForEdit(id) {
  try {
    const article = await getArticleById(id);
    
    $('#title').value = article.title;
    $('#cat').value = article.cat;
    $('#read').value = article.read;
    $('#excerpt').value = article.excerpt;
    $('#imageUrl').value = article.imageUrl || '';
    $('#videoUrl').value = article.videoUrl || '';
    $('#article-id').value = article._id;
    
    // Esperar a que TinyMCE esté listo
    const waitForEditor = setInterval(() => {
      if (editor) {
        editor.setContent(article.content);
        clearInterval(waitForEditor);
      }
    }, 100);
  } catch (error) {
    alert('Error al cargar artículo: ' + error.message);
  }
}

function setupEventListeners() {
  $('#btn-back').addEventListener('click', () => {
    const hasContent = $('#title').value || $('#excerpt').value || (editor && editor.getContent().trim());
    if (hasContent && !confirm('¿Seguro que quieres salir? Los cambios no guardados se perderán.')) {
      return;
    }
    window.location.hash = '#/';
  });

  $('#btn-draft').addEventListener('click', () => saveArticle(false));
  $('#btn-publish').addEventListener('click', () => saveArticle(true));
  $('#btn-subscribers').addEventListener('click', showSubscribers);

  // Botón de modo oscuro
  const toggleDark = $('#toggle-dark');
  const DARK_KEY = 'stech-dark';
  
  // Inicializar estado
  if (localStorage.getItem(DARK_KEY) === '1') {
    document.documentElement.classList.add('dark');
    toggleDark.innerHTML = '<i class="ph ph-sun"></i>';
  } else {
    toggleDark.innerHTML = '<i class="ph ph-moon"></i>';
  }
  
  toggleDark.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(DARK_KEY, isDark ? '1' : '0');
    toggleDark.innerHTML = isDark ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
    
    // Reiniciar TinyMCE con el tema correcto
    if (editor) {
      const content = editor.getContent();
      tinymce.remove('#content');
      initTinyMCE();
      
      // Restaurar contenido después de reiniciar
      setTimeout(() => {
        if (editor) {
          editor.setContent(content);
        }
      }, 500);
    }
  });

  // Botones de upload
  document.querySelectorAll('.btn-upload').forEach(btn => {
    btn.addEventListener('click', () => handleFileUpload(btn.dataset.target));
  });
}

async function handleFileUpload(targetField) {
  const fileInput = $('#file-input');
  
  if (targetField === 'imageUrl') {
    fileInput.setAttribute('accept', 'image/*');
  } else if (targetField === 'videoUrl') {
    fileInput.setAttribute('accept', 'video/*');
  }

  fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;

    try {
      const result = await uploadFile(file);
      $(`#${targetField}`).value = `${CONFIG.API_URL.replace('/api', '')}${result.url}`;
      toast.success('Archivo subido exitosamente');
    } catch (error) {
      toast.error('Error al subir archivo: ' + error.message);
    }
  };

  fileInput.click();
}

async function saveArticle(publish = false) {
  const title = $('#title').value.trim();
  const cat = $('#cat').value;
  const excerpt = $('#excerpt').value.trim();
  const content = editor.getContent();
  const read = $('#read').value.trim() || '5 min';
  const imageUrl = $('#imageUrl').value.trim();
  const videoUrl = $('#videoUrl').value.trim();

  if (!title || !cat || !excerpt || !content) {
    toast.warning('Por favor completa todos los campos requeridos');
    return;
  }

  const articleData = {
    title,
    cat,
    excerpt,
    content,
    read,
    imageUrl,
    videoUrl,
    author: 'Saúl Turbi',
    date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  try {
    const url = currentArticleId 
      ? apiUrl(`/posts/${currentArticleId}`)
      : apiUrl('/posts');
    
    const method = currentArticleId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(articleData)
    });

    if (!response.ok) throw new Error('Error al guardar');

    const result = await response.json();
    localStorage.removeItem('stech-editor-draft');
    
    toast.success(publish ? 'Artículo publicado exitosamente' : 'Borrador guardado', 2000);
    setTimeout(() => {
      window.location.hash = `#/articulo/${result._id}`;
    }, 2000);
  } catch (error) {
    toast.error('Error al guardar: ' + error.message);
  }
}

function startAutoSave() {
  autoSaveInterval = setInterval(() => {
    if (editor && editor.getContent().trim()) {
      const draft = {
        title: $('#title').value,
        cat: $('#cat').value,
        excerpt: $('#excerpt').value,
        content: editor.getContent(),
        timestamp: Date.now()
      };
      localStorage.setItem('stech-editor-draft', JSON.stringify(draft));
    }
  }, 30000); // Cada 30 segundos
}

// Cargar borrador si existe
window.addEventListener('load', () => {
  const draft = localStorage.getItem('stech-editor-draft');
  if (draft && !currentArticleId) {
    if (confirm('Se encontró un borrador guardado. ¿Deseas recuperarlo?')) {
      const data = JSON.parse(draft);
      $('#title').value = data.title || '';
      $('#cat').value = data.cat || '';
      $('#excerpt').value = data.excerpt || '';
      if (editor) {
        editor.setContent(data.content || '');
      }
    }
  }
});

// Limpiar intervalo al salir
window.addEventListener('beforeunload', () => {
  clearInterval(autoSaveInterval);
});

async function showSubscribers() {
  try {
    toast.info('Cargando suscriptores...', 1000);
    
    const response = await fetch(apiUrl('/subscribers'), {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Error al cargar suscriptores');
    }

    const data = await response.json();
    
    // Crear modal con los suscriptores
    showSubscribersModal(data.subscribers, data.total);
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error al cargar suscriptores. Verifica tu conexión.');
  }
}

function showSubscribersModal(subscribers, total) {
  // Crear modal
  const modal = document.createElement('div');
  modal.className = 'subscribers-modal';
  modal.innerHTML = `
    <div class="subscribers-modal-content">
      <div class="subscribers-modal-header">
        <h2>
          <i class="ph-fill ph-users-three"></i>
          Suscriptores Activos
        </h2>
        <button class="modal-close" onclick="this.closest('.subscribers-modal').remove()">
          <i class="ph ph-x"></i>
        </button>
      </div>
      <div class="subscribers-modal-body">
        <div class="subscribers-stats">
          <div class="stat-card">
            <i class="ph-fill ph-envelope"></i>
            <div>
              <span class="stat-number">${total}</span>
              <span class="stat-label">Suscriptores</span>
            </div>
          </div>
        </div>
        <div class="subscribers-list">
          ${subscribers.length === 0 
            ? '<p class="no-subscribers">📭 No hay suscriptores aún</p>'
            : subscribers.map((sub, i) => `
              <div class="subscriber-item">
                <div class="subscriber-number">${i + 1}</div>
                <div class="subscriber-info">
                  <span class="subscriber-email">${sub.email}</span>
                  <span class="subscriber-date">
                    <i class="ph ph-calendar"></i>
                    ${new Date(sub.subscribedAt).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            `).join('')
          }
        </div>
      </div>
      <div class="subscribers-modal-footer">
        <button class="btn-secondary" onclick="this.closest('.subscribers-modal').remove()">
          Cerrar
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Cerrar con ESC
  const closeOnEsc = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', closeOnEsc);
    }
  };
  document.addEventListener('keydown', closeOnEsc);
  
  // Cerrar al hacer clic fuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
      document.removeEventListener('keydown', closeOnEsc);
    }
  });
}

onload();
