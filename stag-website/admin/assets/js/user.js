/**
 * STAG Admin — User detail page
 */
(function () {
  'use strict';

  // ── Auth guard ──────────────────────────────────────────────────────────────
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  // ── User id from query string ────────────────────────────────────────────────
  const userId = new URLSearchParams(window.location.search).get('id');
  const hero   = document.getElementById('userHero');

  if (!userId) {
    hero.innerHTML = '<div class="detail-error">No user specified.</div>';
    return;
  }

  // ── Fetch helper ────────────────────────────────────────────────────────────
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
      return { ok: false, data: null };
    }
    const data = await res.json().catch(() => null);
    return { ok: res.ok, data };
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
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  const statusMap = {
    active: 'badge-active', blocked: 'badge-blocked', inactive: 'badge-inactive',
    premium: 'badge-premium', banned: 'badge-banned', basic: 'badge-basic', deleted: 'badge-deleted',
  };
  const genderMap = { male: 'badge-male', female: 'badge-female' };

  const reqStatusMap = {
    pending: 'badge-pending', accepted: 'badge-accepted', confirmed: 'badge-confirmed',
    completed: 'badge-completed', cancelled: 'badge-cancelled', rejected: 'badge-rejected',
    expired: 'badge-expired', blocked: 'badge-blocked',
    confirm_intended: 'badge-pending', payment_initiated: 'badge-pending',
    verified: 'badge-accepted',
  };

  function badge(val, map) {
    if (!val) return '<span class="badge badge-inactive">—</span>';
    const cls = map[val] || 'badge-inactive';
    return `<span class="badge ${cls}">${esc(val)}</span>`;
  }

  function fmtDate(str) {
    if (!str) return '—';
    const d = new Date(str);
    if (isNaN(d) || d.getFullYear() < 1971) return '—';
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  function fmtCurrency(n) {
    if (n == null) return '—';
    return '₹' + Number(n).toFixed(2);
  }

  function shortId(id) {
    if (!id) return '—';
    return id.length > 12 ? id.slice(0, 8) + '…' : id;
  }

  function avatarHtml(u) {
    const initial = ((u.name || '?').trim().charAt(0) || '?').toUpperCase();
    if (u.profilePicUrl) {
      // Clickable — opens lightbox
      return `<span class="ucell-avatar ucell-avatar-lg avatar-clickable" data-initial="${esc(initial)}" id="heroAvatar" title="Click to enlarge">
        <img src="${esc(u.profilePicUrl)}" alt="" onerror="this.style.display='none'">
      </span>`;
    }
    return `<span class="ucell-avatar ucell-avatar-lg" data-initial="${esc(initial)}" id="heroAvatar"></span>`;
  }

  // ── Photo lightbox ───────────────────────────────────────────────────────────
  function initLightbox(picUrl) {
    if (!picUrl) return;
    const lb    = document.getElementById('photoLightbox');
    const img   = document.getElementById('lightboxImg');
    const close = document.getElementById('lightboxClose');
    const avatarEl = document.getElementById('heroAvatar');
    if (!lb || !img || !avatarEl) return;

    avatarEl.addEventListener('click', () => {
      img.src = picUrl;
      lb.classList.add('open');
    });
    close.addEventListener('click', () => lb.classList.remove('open'));
    lb.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('open'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
  }

  // ── Three-dot action menu ────────────────────────────────────────────────────
  let _menuOpen = false;
  function initActionMenu(u) {
    const btn  = document.getElementById('actionMenuBtn');
    const menu = document.getElementById('actionMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', e => {
      e.stopPropagation();
      _menuOpen = !_menuOpen;
      menu.classList.toggle('open', _menuOpen);
    });
    document.addEventListener('click', () => {
      if (_menuOpen) { _menuOpen = false; menu.classList.remove('open'); }
    });

    document.getElementById('menuToggleBan').addEventListener('click', toggleBan);
    document.getElementById('menuDeleteUser').addEventListener('click', deleteUser);
  }

  function field(label, value) {
    return `
      <div class="detail-card">
        <div class="detail-card-label">${esc(label)}</div>
        <div class="detail-card-value">${value}</div>
      </div>`;
  }

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

  // ── Tab switching ───────────────────────────────────────────────────────────
  const tabLoaded = { details: false, requests: false, booked: false };

  function activateTab(name) {
    console.log('[STAG Admin] User detail tab:', name);
    document.querySelectorAll('.user-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === name);
    });
    document.querySelectorAll('.user-tab-panel').forEach(panel => {
      panel.style.display = panel.id === 'tab-' + name ? '' : 'none';
    });

    // Lazy-load on first visit
    if (name === 'requests' && !tabLoaded.requests) {
      tabLoaded.requests = true;
      loadUserRequests(1);
    }
    if (name === 'booked' && !tabLoaded.booked) {
      tabLoaded.booked = true;
      loadBookedClubs(1);
    }
  }

  // ── Hero (always visible) ────────────────────────────────────────────────────
  function renderHero(u) {
    const isBanned = u.status === 'banned';
    hero.innerHTML = `
      <div class="detail-hero">
        ${avatarHtml(u)}
        <div class="detail-hero-info">
          <div class="detail-hero-name">${esc(u.name) || '—'}</div>
          <div class="detail-hero-badges">
            ${badge(u.gender, genderMap)}
            ${badge(u.status, statusMap)}
          </div>
          <div style="color:var(--muted);font-size:0.82rem">${esc(u.email) || '—'}</div>
        </div>
        <div class="action-menu-wrap">
          <button class="action-menu-btn" id="actionMenuBtn" title="Actions" aria-label="User actions">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
          </button>
          <div class="action-menu" id="actionMenu">
            <button class="action-menu-item ${isBanned ? 'item-success' : 'item-danger'}" id="menuToggleBan">
              ${isBanned ? 'Unban User' : 'Ban User'}
            </button>
            <button class="action-menu-item item-danger" id="menuDeleteUser">
              Delete User
            </button>
          </div>
        </div>
      </div>
    `;
    initLightbox(u.profilePicUrl);
    initActionMenu(u);
  }

  // ── Details tab content ──────────────────────────────────────────────────────
  function renderDetails(u) {
    const phone  = ((u.phoneExt || '') + (u.phone || '')) || '—';
    const rating = u.ratings != null
      ? `${Number(u.ratings).toFixed(1)} (${u.ratingCount || 0})`
      : '—';

    document.getElementById('tab-details').innerHTML = `
      <p class="detail-section-title">Contact</p>
      <div class="detail-grid">
        ${field('Email',        esc(u.email) || '—')}
        ${field('Phone',        esc(phone))}
        ${field('Date of Birth', esc(u.dateOfBirth) || '—')}
        ${field('Gender',       badge(u.gender, genderMap))}
      </div>

      <p class="detail-section-title">Account</p>
      <div class="detail-grid">
        ${field('Status',         badge(u.status, statusMap))}
        ${field('Rating',         esc(rating))}
        ${field('Total Bookings', u.totalCount != null ? esc(u.totalCount) : '—')}
        ${field('Charge Amount',  u.chargeAmount ? fmtCurrency(u.chargeAmount) : '—')}
        ${field('Referral Code',  esc(u.referralCode) || '—')}
        ${field('Referred By',    esc(u.referredByCode) || '—')}
      </div>

      <p class="detail-section-title">Timeline</p>
      <div class="detail-grid">
        ${field('Joined',       fmtDate(u.createdAt))}
        ${field('Last Updated', fmtDate(u.updatedAt))}
      </div>

      <p class="detail-section-title">Device</p>
      <div class="detail-grid">
        ${field('OS',           esc(u.deviceOs)      || '—')}
        ${field('OS Version',   esc(u.deviceOsVersion) || '—')}
        ${field('Device Model', esc(u.deviceModel)   || '—')}
        ${field('App Version',  esc(u.appVersion)    || '—')}
        ${field('Country',      esc(u.deviceCountry) || '—')}
      </div>
    `;

    tabLoaded.details = true;
  }

  async function toggleBan() {
    const { ok: loaded, data: current } = await apiAbs(API_BASE + '/v1/users/' + encodeURIComponent(userId));
    const isBanned = loaded && current && current.status === 'banned';
    const action   = isBanned ? 'unban' : 'ban';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    const { ok } = await apiAbs(
      API_BASE + '/v1/users/' + encodeURIComponent(userId) + '/toggle-ban',
      { method: 'PATCH' }
    );
    if (!ok) { toast('Failed to update user'); return; }
    toast('User status updated');
    load();
  }

  async function deleteUser() {
    if (!confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;
    const { ok } = await apiAbs(
      API_BASE + '/v1/users/' + encodeURIComponent(userId) + '/delete',
      { method: 'DELETE' }
    );
    if (!ok) { toast('Failed to delete user'); return; }
    toast('User deleted');
    setTimeout(() => { window.location.href = 'dashboard.html#users'; }, 1200);
  }

  // ── Club Requests tab ────────────────────────────────────────────────────────
  const REQ_PLACEHOLDER_ID = '00000000-0000-0000-0000-000000000000';
  let userReqPage = 1;

  async function loadUserRequests(p) {
    userReqPage = p;
    const status   = document.getElementById('userReqStatusFilter').value;
    const timeline = document.getElementById('userReqTimelineFilter').value;
    const params   = new URLSearchParams({ page: p, limit: 10, userId });
    if (status)   params.set('status', status);
    if (timeline) params.set('timeline', timeline);

    const { ok, data } = await apiAbs(
      API_BASE + '/v1/request/user/' + REQ_PLACEHOLDER_ID + '?' + params
    );
    const items      = ok && data && Array.isArray(data.items) ? data.items : null;
    const total      = (ok && data && data.total) || 0;
    const limit      = (ok && data && data.limit) || 10;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const tbody = document.getElementById('userReqBody');
    const empty = document.getElementById('userReqEmpty');

    if (!items || items.length === 0) {
      tbody.innerHTML = '';
      empty.classList.remove('hidden');
      document.getElementById('userReqPagination').innerHTML = '';
      return;
    }
    empty.classList.add('hidden');

    tbody.innerHTML = items.map(req => `
      <tr class="clickable-row" onclick="window.location='request.html?id=${encodeURIComponent(req.id)}'" style="cursor:pointer">
        <td style="font-size:0.73rem;color:var(--muted);font-family:monospace">${req.id || '—'}</td>
        <td><strong>${esc(req.clubName) || '—'}</strong><br/><span style="font-size:0.75rem;color:var(--muted)">${esc(req.clubAddress) || ''}</span></td>
        <td style="font-size:0.78rem">${req.mUser ? esc(req.mUser.username) : (req.mUserId || '—')}</td>
        <td style="font-size:0.78rem">${req.fUser ? esc(req.fUser.username) : (req.fUserId || '—')}</td>
        <td>${badge(req.status, reqStatusMap)}</td>
        <td style="color:var(--muted)">${fmtDate(req.datetime)}</td>
        <td>${req.payment ? fmtCurrency(req.payment.mUserTotalPayable) : '—'}</td>
      </tr>
    `).join('');

    renderPagination('userReqPagination', p, totalPages, loadUserRequests);
  }

  // ── Booked Clubs tab ─────────────────────────────────────────────────────────
  let bookedPage = 1;

  async function loadBookedClubs(p) {
    bookedPage = p;
    const paramsFwd = new URLSearchParams({
      page: p, limit: 10, userId,
      status: 'confirmed,verified,completed',
    });
    const paramsPast = new URLSearchParams({
      page: p, limit: 10, userId, timeline: 'past',
      status: 'confirmed,verified,completed',
    });

    const [fwd, past] = await Promise.all([
      apiAbs(API_BASE + '/v1/request/user/' + REQ_PLACEHOLDER_ID + '?' + paramsFwd),
      apiAbs(API_BASE + '/v1/request/user/' + REQ_PLACEHOLDER_ID + '?' + paramsPast),
    ]);

    const seen = new Set();
    const merged = [];
    for (const src of [fwd, past]) {
      if (src.ok && src.data && Array.isArray(src.data.items)) {
        for (const item of src.data.items) {
          if (!seen.has(item.id)) { seen.add(item.id); merged.push(item); }
        }
      }
    }

    const now = Date.now();
    merged.sort((a, b) => {
      const da = new Date(a.datetime), db = new Date(b.datetime);
      const aFuture = da > now, bFuture = db > now;
      if (aFuture && !bFuture) return -1;
      if (!aFuture && bFuture) return 1;
      return aFuture ? da - db : db - da;
    });

    const fwdTotal    = (fwd.ok  && fwd.data  && fwd.data.total)  || 0;
    const pastTotal   = (past.ok && past.data && past.data.total) || 0;
    const totalMerged = Math.min(fwdTotal + pastTotal, merged.length);
    const totalPages  = Math.max(1, Math.ceil(totalMerged / 10));

    const tbody = document.getElementById('bookedBody');
    const empty = document.getElementById('bookedEmpty');

    if (merged.length === 0) {
      tbody.innerHTML = '';
      empty.classList.remove('hidden');
      document.getElementById('bookedPagination').innerHTML = '';
      return;
    }
    empty.classList.add('hidden');

    tbody.innerHTML = merged.map(req => `
      <tr class="clickable-row" onclick="window.location='request.html?id=${encodeURIComponent(req.id)}'" style="cursor:pointer">
        <td><strong>${esc(req.clubName) || '—'}</strong></td>
        <td style="font-size:0.78rem;color:var(--muted)">${esc(req.clubAddress) || '—'}</td>
        <td>${badge(req.status, reqStatusMap)}</td>
        <td style="color:var(--muted)">${fmtDate(req.datetime)}</td>
        <td>${req.payment ? fmtCurrency(req.payment.mUserTotalPayable) : '—'}</td>
      </tr>
    `).join('');

    renderPagination('bookedPagination', p, totalPages, loadBookedClubs);
  }

  // ── Load ────────────────────────────────────────────────────────────────────
  async function load() {
    const { ok, data } = await apiAbs(API_BASE + '/v1/users/' + encodeURIComponent(userId));
    if (!ok || !data || !data.id) {
      hero.innerHTML = '<div class="detail-error">User not found.</div>';
      return;
    }
    console.log('[STAG Admin] User detail page loaded for userId:', userId, '— name:', data.name);

    renderHero(data);
    renderDetails(data);

    // Show tab bar and activate the Details tab
    const tabBar = document.getElementById('userTabs');
    tabBar.style.display = '';
    activateTab('details');

    // Wire tab buttons
    tabBar.querySelectorAll('.user-tab').forEach(btn => {
      btn.addEventListener('click', () => activateTab(btn.dataset.tab));
    });

    // Wire filter controls for Requests tab
    document.getElementById('userReqFilterBtn').addEventListener('click', () => loadUserRequests(1));
    document.getElementById('userReqStatusFilter').addEventListener('change', () => loadUserRequests(1));
    document.getElementById('userReqTimelineFilter').addEventListener('change', () => loadUserRequests(1));
  }

  load();
})();