import { apiUrl } from '../config.js';

export async function login(email, password) {
  const response = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en login');
  }

  const data = await response.json();
  localStorage.setItem('stech-auth-token', data.token);
  localStorage.setItem('stech-auth-email', data.email);
  return data;
}

export async function verifyToken() {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(apiUrl('/auth/verify'), {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });

    return response.ok;
  } catch {
    return false;
  }
}

export function logout() {
  localStorage.removeItem('stech-auth-token');
  localStorage.removeItem('stech-auth-email');
  window.location.href = '/';
}

export function getToken() {
  return localStorage.getItem('stech-auth-token');
}

export function isAuthenticated() {
  return !!getToken();
}

export function getAuthHeaders() {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

export async function uploadFile(file) {
  const { apiUrl } = await import('../config.js');
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(apiUrl('/upload'), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Error al subir archivo');
  }

  return await response.json();
}
