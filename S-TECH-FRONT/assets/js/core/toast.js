// Sistema de notificaciones toast elegante
import { $ } from './dom.js';

let toastContainer = null;

function initToastContainer() {
  if (toastContainer) return;
  
  toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);
}

/**
 * Muestra una notificación toast
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duración en ms (default: 3000)
 */
export function showToast(message, type = 'info', duration = 3000) {
  initToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icons = {
    success: '<i class="ph-fill ph-check-circle"></i>',
    error: '<i class="ph-fill ph-x-circle"></i>',
    warning: '<i class="ph-fill ph-warning-circle"></i>',
    info: '<i class="ph-fill ph-info"></i>'
  };
  
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Cerrar">
      <i class="ph ph-x"></i>
    </button>
  `;
  
  toastContainer.appendChild(toast);
  
  // Animar entrada
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Configurar cierre
  const closeBtn = toast.querySelector('.toast-close');
  const closeToast = () => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  };
  
  closeBtn.addEventListener('click', closeToast);
  
  // Auto-cerrar
  if (duration > 0) {
    setTimeout(closeToast, duration);
  }
  
  return toast;
}

// Shortcuts
export const toast = {
  success: (msg, duration) => showToast(msg, 'success', duration),
  error: (msg, duration) => showToast(msg, 'error', duration),
  warning: (msg, duration) => showToast(msg, 'warning', duration),
  info: (msg, duration) => showToast(msg, 'info', duration)
};
