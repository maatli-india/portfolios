/**
 * STAG Admin — Login page logic
 */
(function () {
  'use strict';

  // Redirect to dashboard if already logged in
  if (sessionStorage.getItem(TOKEN_KEY)) {
    window.location.href = 'dashboard.html';
    return;
  }

  const form       = document.getElementById('loginForm');
  const errorBox   = document.getElementById('loginError');
  const btnLabel   = document.getElementById('btnLabel');
  const btnSpinner = document.getElementById('btnSpinner');
  const loginBtn   = document.getElementById('loginBtn');

  function setLoading(on) {
    loginBtn.disabled   = on;
    btnLabel.hidden     = on;
    btnSpinner.hidden   = !on;
  }

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden      = false;
  }

  function hideError() {
    errorBox.hidden = true;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideError();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      showError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      // Uses the existing admin sign-in API (/v1/admin/signin).
      // The field accepts either the admin email or username.
      const res = await fetch(LOGIN_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        showError(json.message || json.error || 'Invalid credentials.');
        return;
      }

      // SignIn returns the token object directly: { accessToken, expiresIn, type }
      const token = json.accessToken || (json.data && json.data.accessToken) || json.token;
      if (!token) {
        showError('Unexpected response from server.');
        return;
      }

      sessionStorage.setItem(TOKEN_KEY, token);

      // The sign-in endpoint returns only the token, so derive minimal display info.
      const adminInfo = { username, role: 'admin' };
      sessionStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(adminInfo));

      window.location.href = 'dashboard.html';

    } catch (err) {
      showError('Network error — ' + err.message);
    } finally {
      setLoading(false);
    }
  });
})();
