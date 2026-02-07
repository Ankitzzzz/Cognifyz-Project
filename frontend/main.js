
(function () {
  const API_BASE = window.API_BASE || '';


  async function api(path, options = {}) {
    const res = await fetch(API_BASE + path, options);
    let body = null;

    try {
      body = await res.json();
    } catch (_) {}

    return { ok: res.ok, status: res.status, body };
  }

  function saveToken(token) {
    localStorage.setItem('token', token);
  }

  function getToken() {
    return localStorage.getItem('token');
  }

  function authHeaders(headers = {}) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  function escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }


  async function loadSubmissions() {
    const container = document.getElementById('submissionsList');
    if (!container) return;

    container.textContent = 'Loading...';

    const res = await api('/api/submissions');
    if (!res.ok) {
      container.textContent = 'Failed to load submissions.';
      return;
    }

    const submissions = res.body?.submissions || [];
    if (!submissions.length) {
      container.innerHTML = '<p>No submissions yet.</p>';
      return;
    }

    container.innerHTML = submissions
      .slice(-10)
      .reverse()
      .map(
        (s) => `
        <div class="submission">
          <strong>#${s.id}</strong>
          ${escapeHtml(s.name)} —
          <a href="mailto:${escapeHtml(s.email)}">${escapeHtml(s.email)}</a>

          <div class="muted small">
            ${new Date(s.createdAt).toLocaleString()}
          </div>

          <div>${escapeHtml(s.message)}</div>

          ${
            s.enriched
              ? `<div class="enriched small">
                  Enriched: ${escapeHtml(JSON.stringify(s.enriched))}
                </div>`
              : ''
          }
        </div>
      `
      )
      .join('');
  }

  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formMessage.textContent = '';

      const payload = {
        name: contactForm.name.value.trim(),
        email: contactForm.email.value.trim(),
        message: contactForm.message.value.trim()
      };

      const res = await api('/api/submissions', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        formMessage.textContent =
          res.body?.message || 'Submission failed';
        return;
      }

      contactForm.reset();
      formMessage.textContent = 'Submitted successfully.';
      loadSubmissions();
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        name: registerForm.name.value.trim(),
        email: registerForm.email.value.trim(),
        password: registerForm.password.value
      };

      const res = await api('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        alert('Register failed: ' + (res.body?.message || 'Error'));
        return;
      }

      saveToken(res.body.token);
      alert('Registered & logged in');
    });
  }


  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        email: loginForm.email.value.trim(),
        password: loginForm.password.value
      };

      const res = await api('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        alert('Login failed: ' + (res.body?.message || 'Error'));
        return;
      }

      saveToken(res.body.token);
      alert('Logged in');
    });
  }

  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', loadSubmissions);
  }

  document.addEventListener('DOMContentLoaded', loadSubmissions);
})();
