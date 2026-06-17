/**
 * STAG Admin — Dashboard logic
 */
(function () {
  'use strict';

  // ── Auth guard ──────────────────────────────────────────────────────────────
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  const adminInfo = JSON.parse(sessionStorage.getItem(ADMIN_INFO_KEY) || '{}');
  const roleLabel = (adminInfo.role || 'admin');
  const nameLabel = adminInfo.username || adminInfo.email || 'Admin';
  const avatarChar = nameLabel.charAt(0).toUpperCase();

  // Populate sidebar profile
  const profileAvatar = document.getElementById('profileAvatar');
  const profileName   = document.getElementById('profileName');
  const profileRole   = document.getElementById('profileRole');
  if (profileAvatar) profileAvatar.textContent = avatarChar;
  if (profileName)   profileName.textContent   = nameLabel;
  if (profileRole)   profileRole.textContent   = roleLabel;

  // Populate header
  const headerAvatar    = document.getElementById('headerAvatar');
  const headerAdminName = document.getElementById('headerAdminName');
  const adminBadge      = document.getElementById('adminBadge');
  if (headerAvatar)    headerAvatar.textContent    = avatarChar;
  if (headerAdminName) headerAdminName.textContent = nameLabel;
  if (adminBadge)      adminBadge.textContent      = roleLabel;

  // ── Fetch helpers ───────────────────────────────────────────────────────────
  // apiAbs fetches an absolute URL with auth + shared 401 handling.
  async function apiAbs(url, opts = {}) {
    const res = await fetch(url, {
      ...opts,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + token,
        ...(opts.headers || {}),
      },
    });
    if (res.status === 401) {
      sessionStorage.clear();
      window.location.href = 'index.html';
      return null;
    }
    return res.json();
  }

  // api targets the admin-dash endpoints (stats/requests/reports/support).
  function api(path, opts = {}) {
    return apiAbs(DASH_ENDPOINT + path, opts);
  }

  // ── Toast ───────────────────────────────────────────────────────────────────
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function badge(val, map) {
    if (!val) return '<span class="badge badge-inactive">—</span>';
    const cls = map[val] || 'badge-inactive';
    return `<span class="badge ${cls}">${val}</span>`;
  }

  const statusMap = {
    active: 'badge-active', blocked: 'badge-blocked', inactive: 'badge-inactive',
    premium: 'badge-premium', banned: 'badge-banned', basic: 'badge-basic', deleted: 'badge-deleted',
  };
  const reqStatusMap = {
    pending: 'badge-pending', accepted: 'badge-accepted', confirmed: 'badge-confirmed',
    completed: 'badge-completed', cancelled: 'badge-cancelled', rejected: 'badge-rejected',
    expired: 'badge-expired', blocked: 'badge-blocked',
    confirm_intended: 'badge-pending', payment_initiated: 'badge-pending',
    verified: 'badge-accepted',
  };
  const genderMap = { male: 'badge-male', female: 'badge-female' };
  const ticketStatusMap = { open: 'badge-open', closed: 'badge-closed' };

  function fmtDate(str) {
    if (!str) return '—';
    const d = new Date(str);
    return isNaN(d) ? str : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function fmtCurrency(n) {
    if (n == null) return '—';
    return '₹' + Number(n).toFixed(2);
  }

  function shortId(id) {
    if (!id) return '—';
    return id.length > 12 ? id.slice(0, 8) + '…' : id;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Builds the avatar markup: real profile pic if present, otherwise an
  // initial-letter fallback (the initial is rendered via CSS ::before and
  // shown if the image is missing or fails to load).
  function avatarHtml(u, size) {
    const initial = ((u.name || '?').trim().charAt(0) || '?').toUpperCase();
    const cls = 'ucell-avatar' + (size === 'lg' ? ' ucell-avatar-lg' : '');
    const img = u.profilePicUrl
      ? `<img src="${esc(u.profilePicUrl)}" alt="" onerror="this.style.display='none'">`
      : '';
    return `<span class="${cls}" data-initial="${esc(initial)}">${img}</span>`;
  }

  // ── Pagination renderer ──────────────────────────────────────────────────────
  function renderPagination(containerId, currentPage, totalPages, onPageChange) {
    const el = document.getElementById(containerId);
    el.innerHTML = '';
    if (totalPages <= 1) return;

    const prev = document.createElement('button');
    prev.className = 'page-btn';
    prev.textContent = '‹';
    prev.disabled = currentPage <= 1;
    prev.onclick = () => onPageChange(currentPage - 1);
    el.appendChild(prev);

    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end   = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    for (let p = start; p <= end; p++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (p === currentPage ? ' active' : '');
      btn.textContent = p;
      btn.onclick = () => onPageChange(p);
      el.appendChild(btn);
    }

    const next = document.createElement('button');
    next.className = 'page-btn';
    next.textContent = '›';
    next.disabled = currentPage >= totalPages;
    next.onclick = () => onPageChange(currentPage + 1);
    el.appendChild(next);
  }

  // ── Navigation ───────────────────────────────────────────────────────────────
  const sections = ['overview', 'users', 'requests', 'reports', 'support', 'misc'];
  const sectionTitles = {
    overview: 'Overview', users: 'Users', requests: 'Club Requests',
    reports: 'Reports', support: 'Support Tickets', misc: 'Miscellaneous',
  };

  function activateSection(name) {
    console.log('[STAG Admin] Navigating to section:', name, '—', sectionTitles[name] || name);
    sections.forEach(s => {
      document.getElementById('section-' + s).classList.toggle('hidden', s !== name);
    });
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.section === name);
    });
    document.getElementById('pageTitle').textContent = sectionTitles[name];

    if (name === 'overview') loadStats();
    if (name === 'users')    loadUsers(1);
    if (name === 'requests') loadRequests(1);
    if (name === 'reports')  loadReports(1);
    if (name === 'support')  loadSupport(1);
    if (name === 'misc')     loadMisc();

    // close sidebar on mobile
    document.getElementById('sidebar').classList.remove('open');
  }

  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); activateSection(el.dataset.section); });
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'index.html';
  });

  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('visible');
  });
  document.getElementById('sidebarOverlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('visible');
  });

  // ── Overview / Stats ─────────────────────────────────────────────────────────
  async function loadStats() {
    const json = await api('/stats');
    if (!json || !json.success) return;
    const d = json.data;
    const map = {
      totalUsers: d.totalUsers, activeUsers: d.activeUsers, blockedUsers: d.blockedUsers,
      totalRequests: d.totalRequests, pendingRequests: d.pendingRequests,
      completedRequests: d.completedRequests, totalReports: d.totalReports, openTickets: d.openTickets,
    };
    Object.entries(map).forEach(([k, v]) => {
      const el = document.getElementById('v-' + k);
      if (el) { el.textContent = v != null ? v.toLocaleString() : '—'; }
      const card = document.getElementById('stat-' + k);
      if (card) card.classList.remove('loading');
    });
  }

  // ── Users ─────────────────────────────────────────────────────────────────────
  let userPage = 1;

  async function loadUsers(p) {
    userPage = p;
    const search = document.getElementById('userSearch').value.trim();
    const status = document.getElementById('userStatusFilter').value;
    const gender = document.getElementById('userGenderFilter').value;

    const params = new URLSearchParams({ page: p, limit: 20 });
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (gender) params.set('gender', gender);

    // Uses the existing admin user API: GET /v1/users (returns Paged{total,page,limit,items}).
    const json = await apiAbs(API_BASE + '/v1/users?' + params);
    if (!json || !Array.isArray(json.items)) { toast('Failed to load users'); return; }

    const items = json.items;
    const total = json.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / (json.limit || 20)));
    const tbody = document.getElementById('usersBody');
    const empty = document.getElementById('usersEmpty');

    if (!items || items.length === 0) {
      tbody.innerHTML = '';
      empty.classList.remove('hidden');
      document.getElementById('usersPagination').innerHTML = '';
      return;
    }
    empty.classList.add('hidden');

    tbody.innerHTML = items.map(u => `
      <tr>
        <td>
          <div class="ucell">
            ${avatarHtml(u)}
            <div class="ucell-meta">
              <a class="user-name-link" href="user.html?id=${encodeURIComponent(u.id)}">${esc(u.name) || '—'}</a>
              <span class="ucell-email">${esc(u.email) || '—'}</span>
            </div>
          </div>
        </td>
        <td>${esc((u.phoneExt || '') + (u.phone || '')) || '—'}</td>
        <td>${badge(u.gender, genderMap)}</td>
        <td>${badge(u.status, statusMap)}</td>
        <td style="color:var(--muted)">${fmtDate(u.createdAt)}</td>
        <td>
          <a class="btn-ghost" href="user.html?id=${encodeURIComponent(u.id)}">View</a>
        </td>
      </tr>
    `).join('');

    renderPagination('usersPagination', p, totalPages, loadUsers);
  }

  document.getElementById('userSearchBtn').addEventListener('click', () => loadUsers(1));
  document.getElementById('userSearch').addEventListener('keydown', e => { if (e.key === 'Enter') loadUsers(1); });
  document.getElementById('userStatusFilter').addEventListener('change', () => loadUsers(1));
  document.getElementById('userGenderFilter').addEventListener('change', () => loadUsers(1));

  // Live search: debounce so we don't hammer the API on every keystroke.
  let _userSearchTimer;
  document.getElementById('userSearch').addEventListener('input', e => {
    clearTimeout(_userSearchTimer);
    // Immediate reset when field is cleared; short debounce while typing.
    const delay = e.target.value.trim() === '' ? 0 : 300;
    _userSearchTimer = setTimeout(() => loadUsers(1), delay);
  });

  // ── User detail modal ────────────────────────────────────────────────────────
  window.viewUser = async function (id) {
    const json = await api('/users/' + id);
    if (!json || !json.success) { toast('Failed to load user'); return; }
    const u = json.data;

    document.getElementById('modalBody').innerHTML = `
      <div class="modal-field"><span class="mf-label">Name</span><span class="mf-value">${u.name || '—'}</span></div>
      <div class="modal-field"><span class="mf-label">Phone</span><span class="mf-value">${u.phoneExt || ''}${u.phone || '—'}</span></div>
      <div class="modal-field"><span class="mf-label">Email</span><span class="mf-value">${u.email || '—'}</span></div>
      <div class="modal-field"><span class="mf-label">Gender</span><span class="mf-value">${badge(u.gender, genderMap)}</span></div>
      <div class="modal-field"><span class="mf-label">Status</span><span class="mf-value">${badge(u.status, statusMap)}</span></div>
      <div class="modal-field"><span class="mf-label">Rating</span><span class="mf-value">${u.ratings != null ? u.ratings.toFixed(1) + ' ('+u.ratingCount+')' : '—'}</span></div>
      <div class="modal-field"><span class="mf-label">Charge</span><span class="mf-value">${u.chargeAmount ? fmtCurrency(u.chargeAmount) : '—'}</span></div>
      <div class="modal-field"><span class="mf-label">Joined</span><span class="mf-value">${fmtDate(u.createdAt)}</span></div>
      <div class="modal-field"><span class="mf-label">Referral</span><span class="mf-value">${u.referralCode || '—'}</span></div>
      <div class="modal-field"><span class="mf-label">ID</span><span class="mf-value" style="font-size:0.73rem">${u.id || '—'}</span></div>
    `;

    const isBlocked = u.status === 'blocked';
    document.getElementById('modalActions').innerHTML = `
      ${isBlocked
        ? `<button class="btn-success" onclick="setUserStatus('${u.id}', 'active')">Unblock User</button>`
        : `<button class="btn-danger"  onclick="setUserStatus('${u.id}', 'blocked')">Block User</button>`
      }
    `;

    document.getElementById('userModal').classList.remove('hidden');
  };

  window.setUserStatus = async function (id, status) {
    const json = await api('/users/' + id + '/status', {
      method: 'POST',
      body:   JSON.stringify({ status }),
    });
    if (!json || !json.success) { toast('Failed to update status'); return; }
    toast('User status updated to: ' + status);
    closeModal();
    loadUsers(userPage);
  };

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('userModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  function closeModal() {
    document.getElementById('userModal').classList.add('hidden');
  }

  // ── Requests ─────────────────────────────────────────────────────────────────
  let reqPage = 1;

  // The app endpoint GET /v1/request/user/{userId} requires a valid UUID in the
  // path, but for admin tokens the service ignores it and returns all users'
  // requests. We pass the nil UUID as a harmless placeholder.
  const REQ_PLACEHOLDER_ID = '00000000-0000-0000-0000-000000000000';

  async function loadRequests(p) {
    reqPage = p;
    const status = document.getElementById('reqStatusFilter').value;
    const timeline = document.getElementById('reqTimelineFilter').value;
    const params = new URLSearchParams({ page: p, limit: 20 });
    if (status) params.set('status', status);
    if (timeline) params.set('timeline', timeline);

    const json = await apiAbs(API_BASE + '/v1/request/user/' + REQ_PLACEHOLDER_ID + '?' + params);
    if (!json || !Array.isArray(json.items)) { toast('Failed to load requests'); return; }

    const items = json.items;
    const total = json.total || 0;
    const limit = json.limit || 20;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const tbody = document.getElementById('requestsBody');
    const empty = document.getElementById('requestsEmpty');

    if (!items || items.length === 0) {
      tbody.innerHTML = '';
      empty.classList.remove('hidden');
      document.getElementById('requestsPagination').innerHTML = '';
      return;
    }
    empty.classList.add('hidden');

    tbody.innerHTML = items.map(req => `
      <tr class="clickable-row" onclick="window.location='request.html?id=${encodeURIComponent(req.id)}'" style="cursor:pointer">
        <td style="font-size:0.73rem;color:var(--muted);font-family:monospace">${req.id || '—'}</td>
        <td><strong>${req.clubName || '—'}</strong><br/><span style="font-size:0.75rem;color:var(--muted)">${req.clubAddress || ''}</span></td>
        <td style="font-size:0.78rem">${req.mUser ? (req.mUser.username || req.mUserId) : (req.mUserId || '—')}</td>
        <td style="font-size:0.78rem">${req.fUser ? (req.fUser.username || req.fUserId) : (req.fUserId || '—')}</td>
        <td>${badge(req.status, reqStatusMap)}</td>
        <td style="color:var(--muted)">${fmtDate(req.datetime)}</td>
        <td>${req.payment ? fmtCurrency(req.payment.mUserTotalPayable) : '—'}</td>
      </tr>
    `).join('');

    renderPagination('requestsPagination', p, totalPages, loadRequests);
  }

  document.getElementById('reqSearchBtn').addEventListener('click', () => loadRequests(1));
  document.getElementById('reqStatusFilter').addEventListener('change', () => loadRequests(1));
  document.getElementById('reqTimelineFilter').addEventListener('change', () => loadRequests(1));

  // ── Reports ──────────────────────────────────────────────────────────────────
  let reportPage = 1;

  async function loadReports(p) {
    reportPage = p;
    const params = new URLSearchParams({ page: p, limit: 20 });
    const json = await api('/reports/users?' + params);
    if (!json || !json.success) { toast('Failed to load reports'); return; }

    const { items, totalPages } = json.data;
    const tbody = document.getElementById('reportsBody');
    const empty = document.getElementById('reportsEmpty');

    if (!items || items.length === 0) {
      tbody.innerHTML = '';
      empty.classList.remove('hidden');
      document.getElementById('reportsPagination').innerHTML = '';
      return;
    }
    empty.classList.add('hidden');

    tbody.innerHTML = items.map(r => `
      <tr>
        <td><strong>${r.reportedUserName || '—'}</strong><br/><span style="font-size:0.73rem;color:var(--muted)">${shortId(r.reportedUserId)}</span></td>
        <td>${r.reason || '—'}</td>
        <td>${r.reportedByUserName || '—'}</td>
        <td><span class="badge badge-blocked">${r.reportCount || 1}</span></td>
        <td style="color:var(--muted)">${fmtDate(r.reportedAt)}</td>
      </tr>
    `).join('');

    renderPagination('reportsPagination', p, totalPages, loadReports);
  }

  // ── Support ──────────────────────────────────────────────────────────────────
  let supportPage = 1;

  async function loadSupport(p) {
    supportPage = p;
    const status = document.getElementById('supportStatusFilter').value;
    const params = new URLSearchParams({ page: p, limit: 20 });
    if (status) params.set('status', status);

    const json = await api('/support?' + params);
    if (!json || !json.success) { toast('Failed to load tickets'); return; }

    const { items, totalPages } = json.data;
    const tbody = document.getElementById('supportBody');
    const empty = document.getElementById('supportEmpty');

    if (!items || items.length === 0) {
      tbody.innerHTML = '';
      empty.classList.remove('hidden');
      document.getElementById('supportPagination').innerHTML = '';
      return;
    }
    empty.classList.add('hidden');

    tbody.innerHTML = items.map(t => `
      <tr>
        <td><strong>${t.title || '—'}</strong><br/><span style="font-size:0.75rem;color:var(--muted)">${t.description ? t.description.slice(0,60) + '…' : ''}</span></td>
        <td style="font-size:0.78rem;color:var(--muted)">${shortId(t.userId)}</td>
        <td>${badge(t.status, ticketStatusMap)}</td>
        <td style="color:var(--muted)">${fmtDate(t.createdAt)}</td>
      </tr>
    `).join('');

    renderPagination('supportPagination', p, totalPages, loadSupport);
  }

  document.getElementById('supportSearchBtn').addEventListener('click', () => loadSupport(1));
  document.getElementById('supportStatusFilter').addEventListener('change', () => loadSupport(1));

  // ── Miscellaneous ──────────────────────────────────────────────────────────
  let _miscLoaded = false;

  const _miscFields = [
    ['misc-maleGuidelines', 'maleGuidelines'],
    ['misc-femGuidelines',  'femaleGuidelines'],
    ['misc-maleAbout',      'maleAboutApp'],
    ['misc-femAbout',       'femaleAboutApp'],
    ['misc-maleFaq',        'maleFaq'],
    ['misc-femFaq',         'femaleFaq'],
    ['misc-support',        'supportCredentials'],
    ['misc-tnc',            'termsAndConditions'],
    ['misc-privacy',        'privacyPolicy'],
    ['misc-malePay',        'malePaymentPolicy'],
    ['misc-femPay',         'femalePaymentPolicy'],
    ['misc-maleCancel',     'maleCancellationPolicy'],
    ['misc-femCancel',      'femaleCancellationPolicy'],
    ['misc-maleRefund',     'maleRefundPolicy'],
    ['misc-femRefund',      'femaleRefundPolicy'],
  ];

  async function loadMisc() {
    if (_miscLoaded) return;
    const json = await apiAbs(API_BASE + '/v1/admin/settings');
    if (!json) { toast('Failed to load settings'); return; }
    _miscFields.forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.value = json[key] || '';
    });
    _miscLoaded = true;
  }

  async function saveMisc() {
    const payload = {};
    _miscFields.forEach(([id, key]) => {
      const el = document.getElementById(id);
      payload[key] = el ? el.value : '';
    });
    const result = await apiAbs(API_BASE + '/v1/admin/settings', {
      method: 'PATCH',
      body:   JSON.stringify(payload),
    });
    if (!result) { toast('Failed to save settings'); return; }
    toast('Settings saved successfully');
  }

  // ── Boot ────────────────────────────────────────────────────────────────────
  // Honour URL hash so back-links from other pages can land on a specific section.
  const _bootSection = window.location.hash.replace('#', '');
  activateSection(sections.includes(_bootSection) ? _bootSection : 'overview');

  document.getElementById('miscSaveBtn').addEventListener('click', saveMisc);

})();
