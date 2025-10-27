// Página de soporte
import { $, $$ } from '../core/dom.js';
import { sendSupportMessage, reportProblem } from '../services/support.service.js';
import { toast } from '../core/toast.js';

// Inicializar página
async function init() {
  await setupForms();
  autoFillReportUrl();
}

// Configurar formularios
async function setupForms() {
  const contactForm = $('#contactForm');
  const reportForm = $('#reportForm');

  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }

  if (reportForm) {
    reportForm.addEventListener('submit', handleReportSubmit);
  }
}

// Manejar envío de formulario de contacto
async function handleContactSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="ph ph-spinner"></i> Enviando...';

  try {
    await sendSupportMessage(data);
    e.target.reset();
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Enviar mensaje';
  }
}

// Manejar envío de formulario de reporte
async function handleReportSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="ph ph-spinner"></i> Reportando...';

  try {
    await reportProblem(data);
    e.target.reset();
    autoFillReportUrl(); // Re-autocompletar URL
  } catch (error) {
    console.error('Error al reportar problema:', error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="ph ph-warning-circle"></i> Reportar problema';
  }
}

// Auto-completar URL del reporte con la página anterior
function autoFillReportUrl() {
  const urlInput = $('#reportUrl');
  if (urlInput && !urlInput.value) {
    // Si viene de otra página, usar el referrer
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
      urlInput.value = document.referrer;
    }
  }
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
