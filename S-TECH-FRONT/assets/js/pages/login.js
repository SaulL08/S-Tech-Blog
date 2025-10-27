import { login } from '../services/auth.service.js';
import { $ } from '../core/dom.js';

const form = $('#login-form');
const errorMessage = $('#error-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = $('#email').value.trim();
  const password = $('#password').value;

  errorMessage.textContent = '';
  errorMessage.style.display = 'none';

  try {
    await login(email, password);
    window.location.href = '/#/';
  } catch (error) {
    errorMessage.textContent = error.message || 'Credenciales inválidas';
    errorMessage.style.display = 'block';
  }
});

// Si ya está autenticado, redirigir
if (localStorage.getItem('stech-auth-token')) {
  window.location.href = '/#/';
}
