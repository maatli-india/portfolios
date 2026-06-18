/**
 * STAG Admin — User detail page
 */
(function () {
  'use strict';

  // ── Auth guard ──────────────────────────────────────────────────────────────
  const token = localStorage.getItem(TOKEN_KEY);
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
      localStorage.clear();
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
  const tabLoaded = { details: false, requests: false, booked: false, bank: false, availability: false, location: false };
  let _cachedUser = null;
  let _cachedLocations = [];

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
    if (name === 'bank' && !tabLoaded.bank) {
      tabLoaded.bank = true;
      loadBankAccount();
    }
    if (name === 'availability' && !tabLoaded.availability) {
      tabLoaded.availability = true;
      loadAvailabilityTab();
    }
    if (name === 'location' && !tabLoaded.location) {
      tabLoaded.location = true;
      loadLocationTab();
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
  function renderDetails(u, locations) {
    const phone    = ((u.phoneExt || '') + (u.phone || '')) || '—';
    const rating   = u.ratings != null
      ? `${Number(u.ratings).toFixed(1)} (${u.ratingCount || 0})`
      : '—';
    const isFemale = u.gender === 'female';
    const isAvailable = u.status === 'active';

    // Compact availability toggle row (female users only)
    const availabilityRow = isFemale ? `
      <p class="detail-section-title" style="margin-top:24px">Availability</p>
      <div class="detail-grid">
        <div class="detail-field" style="grid-column:1/-1">
          <div class="avail-toggle-row">
            <span class="avail-toggle-label">Status</span>
            <label class="toggle-switch" title="Toggle availability">
              <input type="checkbox" id="availToggleInput" ${isAvailable ? 'checked' : ''}>
              <span class="toggle-track"></span>
            </label>
            <span class="avail-status-text" id="availStatusText" style="color:${isAvailable ? '#50c878' : 'var(--muted)'}">
              ${isAvailable ? 'Available' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    ` : '';

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

      ${availabilityRow}
    `;

    // Wire toggle switch
    const toggleInput = document.getElementById('availToggleInput');
    if (toggleInput) {
      toggleInput.addEventListener('change', async () => {
        toggleInput.disabled = true;
        const { ok, data: updated } = await apiAbs(
          API_BASE + '/v1/users/' + encodeURIComponent(userId) + '/toggle-available',
          { method: 'PATCH' }
        );
        if (!ok) {
          toast('Failed to update availability');
          toggleInput.checked = !toggleInput.checked; // revert
          toggleInput.disabled = false;
          return;
        }
        // Update status text + colour immediately without full reload
        const nowAvailable = updated && updated.status === 'active';
        const statusText = document.getElementById('availStatusText');
        if (statusText) {
          statusText.textContent = nowAvailable ? 'Available' : 'Inactive';
          statusText.style.color = nowAvailable ? '#50c878' : 'var(--muted)';
        }
        toggleInput.checked = nowAvailable;
        toggleInput.disabled = false;
        toast('Availability updated');
        // Reset availability tab so it re-renders next time
        tabLoaded.availability = false;
        // Update cached user status
        if (_cachedUser) _cachedUser.status = updated ? updated.status : (nowAvailable ? 'active' : 'inactive');
      });
    }

    tabLoaded.details = true;
  }

  // ── Availability tab ─────────────────────────────────────────────────────────
  function loadAvailabilityTab() {
    const u = _cachedUser;
    const container = document.getElementById('availabilityBody');
    if (!u) { container.innerHTML = '<p style="color:var(--muted)">No data.</p>'; return; }

    const isAvailable = u.status === 'active';
    const changelog = Array.isArray(u.availabilityChangelog) ? u.availabilityChangelog : [];

    container.innerHTML = `
      <p class="detail-section-title">Current Availability</p>
      <div class="detail-grid" style="margin-bottom:24px">
        <div class="detail-field" style="grid-column:1/-1">
          <div class="avail-toggle-row">
            <span class="avail-toggle-label">Status</span>
            <label class="toggle-switch" title="Toggle availability">
              <input type="checkbox" id="availToggleInput2" ${isAvailable ? 'checked' : ''}>
              <span class="toggle-track"></span>
            </label>
            <span class="avail-status-text" id="availStatusText2" style="color:${isAvailable ? '#50c878' : 'var(--muted)'}">
              ${isAvailable ? 'Available' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <p class="detail-section-title">Availability History
        <span style="font-size:0.75rem;font-weight:400;color:var(--muted);margin-left:8px">(${changelog.length} record${changelog.length !== 1 ? 's' : ''})</span>
      </p>
      ${changelog.length === 0
        ? '<p style="color:var(--muted);font-size:0.85rem;padding:8px 0">No history yet.</p>'
        : `<div class="table-wrap" style="margin-top:0">
            <table class="data-table">
              <thead><tr><th>Changed At</th><th>Changed By</th><th>Role</th><th>To Status</th></tr></thead>
              <tbody>
                ${[...changelog].reverse().map(entry => `
                  <tr>
                    <td style="color:var(--muted)">${fmtDate(entry.changedAt)}</td>
                    <td style="font-family:monospace;font-size:0.78rem">${esc(entry.changedBy) || '—'}</td>
                    <td>${entry.changedByRole === 'admin'
                      ? '<span class="badge badge-blocked">Admin</span>'
                      : '<span class="badge badge-active">User</span>'}</td>
                    <td>${badge(entry.toStatus, statusMap)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>`}
    `;

    // Wire second toggle
    const t2 = document.getElementById('availToggleInput2');
    if (t2) {
      t2.addEventListener('change', async () => {
        t2.disabled = true;
        const { ok, data: updated } = await apiAbs(
          API_BASE + '/v1/users/' + encodeURIComponent(userId) + '/toggle-available',
          { method: 'PATCH' }
        );
        if (!ok) {
          toast('Failed to update availability');
          t2.checked = !t2.checked;
          t2.disabled = false;
          return;
        }
        toast('Availability updated');
        // Refresh availability tab fully
        if (updated && _cachedUser) _cachedUser.status = updated.status;
        tabLoaded.availability = false;
        tabLoaded.details = false;
        loadAvailabilityTab();
        tabLoaded.availability = true;
      });
    }
  }

  // ── Location tab ─────────────────────────────────────────────────────────────
  function loadLocationTab() {
    const locs = _cachedLocations;
    const container = document.getElementById('locationBody');

    container.innerHTML = `
      <p class="detail-section-title">Current Location
        <span style="font-size:0.75rem;font-weight:400;color:var(--muted);margin-left:8px">(${locs.length} record${locs.length !== 1 ? 's' : ''})</span>
      </p>
      ${locs.length === 0
        ? '<p style="color:var(--muted);font-size:0.85rem;padding:8px 0">No location data available.</p>'
        : `<div class="table-wrap" style="margin-top:0">
            <table class="data-table">
              <thead><tr><th>Name</th><th>Address</th><th>Lat</th><th>Lng</th><th>Updated</th></tr></thead>
              <tbody>
                ${locs.map(loc => `
                  <tr>
                    <td>${esc(loc.name) || '—'}</td>
                    <td>${esc(loc.address) || '—'}</td>
                    <td style="font-family:monospace;font-size:0.78rem">${loc.lat != null ? loc.lat : '—'}</td>
                    <td style="font-family:monospace;font-size:0.78rem">${loc.lng != null ? loc.lng : '—'}</td>
                    <td style="color:var(--muted)">${fmtDate(loc.updated_at)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>`}
    `;
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
  // ── Bank Account tab ──────────────────────────────────────────────────────────────
  async function loadBankAccount() {
    const container = document.getElementById('bankAccountBody');
    container.innerHTML = '<div class="detail-loading">Loading bank account…</div>';

    const { ok, data } = await apiAbs(
      API_BASE + '/v1/users/' + encodeURIComponent(userId) + '/bank-account'
    );

    if (!ok || !data || !data.accountNumber) {
      container.innerHTML = `
        <div class="table-empty" style="padding:40px 0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          <p>No bank account on file</p>
        </div>`;
      return;
    }

    container.innerHTML = `
      <p class="detail-section-title">Bank Account Details</p>
      <div class="detail-grid">
        ${field('Account Holder', esc(data.accountHolderName) || '—')}
        ${field('Account Number', `<span style="font-family:monospace;letter-spacing:0.08em">${esc(data.accountNumber)}</span>`)}
        ${field('IFSC Code',      `<span style="font-family:monospace">${esc(data.ifsc) || '—'}</span>`)}
        ${field('Bank Name',      esc(data.bankName) || '—')}
        ${field('Account Type',   esc(data.accountType) || '—')}
      </div>`;
  }
  // ── Load ────────────────────────────────────────────────────────────────────
  async function load() {
    // Fetch user + location in parallel
    const [userRes, locRes] = await Promise.all([
      apiAbs(API_BASE + '/v1/users/' + encodeURIComponent(userId)),
      apiAbs(API_BASE + '/v1/userlocation/user-locations/' + encodeURIComponent(userId)),
    ]);

    const data = userRes.data;
    if (!userRes.ok || !data || !data.id) {
      hero.innerHTML = '<div class="detail-error">User not found.</div>';
      return;
    }
    console.log('[STAG Admin] User detail page loaded for userId:', userId, '— name:', data.name);

    // The endpoint returns a single UserLocation object (not an array)
    const locations = (locRes.ok && locRes.data && locRes.data.id)
      ? [locRes.data]
      : [];

    // Cache for tab loaders
    _cachedUser = data;
    _cachedLocations = locations;
    // Reset lazy tabs so they re-render with fresh data
    tabLoaded.availability = false;
    tabLoaded.location = false;
    tabLoaded.details = false;

    renderHero(data);
    renderDetails(data, locations);

    // Show female-only tabs
    const bankTab = document.getElementById('bankTab');
    const availabilityTab = document.getElementById('availabilityTab');
    const locationTab = document.getElementById('locationTab');
    if (data.gender === 'female') {
      if (bankTab) bankTab.style.display = '';
      if (availabilityTab) availabilityTab.style.display = '';
      if (locationTab) locationTab.style.display = '';
    }

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