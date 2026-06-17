/**
 * STAG Admin — Club Request detail page
 */
(function () {
  'use strict';

  // ── Auth guard ──────────────────────────────────────────────────────────────
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  // ── Request id from query string ─────────────────────────────────────────────
  const requestId = new URLSearchParams(window.location.search).get('id');
  const content   = document.getElementById('reqContent');

  if (!requestId) {
    content.innerHTML = '<div class="detail-error">No request specified.</div>';
    return;
  }

  // ── Fetch helper ─────────────────────────────────────────────────────────────
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

  // ── Toast ─────────────────────────────────────────────────────────────────────
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

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

  function field(label, value) {
    return `
      <div class="detail-card">
        <div class="detail-card-label">${esc(label)}</div>
        <div class="detail-card-value">${value}</div>
      </div>`;
  }

  // ── User card (avatar + name → user detail page) ──────────────────────────────
  function userCard(u, role) {
    if (!u) {
      return `
        <div class="req-user-card">
          <div class="req-user-avatar-wrap">
            <span class="ucell-avatar ucell-avatar-lg" data-initial="?"></span>
          </div>
          <div class="req-user-role">${esc(role)}</div>
          <div class="req-user-name" style="color:var(--muted)">Unknown</div>
        </div>`;
    }

    const initial = ((u.username || '?').trim().charAt(0) || '?').toUpperCase();
    const avatarInner = u.profilePicUrl
      ? `<img src="${esc(u.profilePicUrl)}" alt="" onerror="this.style.display='none'">`
      : '';
    const href = u.id ? `user.html?id=${encodeURIComponent(u.id)}` : '#';

    return `
      <div class="req-user-card">
        <a href="${href}" class="req-user-avatar-wrap" title="View user profile">
          <span class="ucell-avatar ucell-avatar-lg avatar-clickable" data-initial="${esc(initial)}">${avatarInner}</span>
          <div class="req-user-avatar-overlay">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </div>
        </a>
        <div class="req-user-role">${esc(role)}</div>
        <a href="${href}" class="req-user-name user-name-link">${esc(u.username) || '—'}</a>
        ${u.phone ? `<div class="req-user-phone">${esc(u.phone)}</div>` : ''}
      </div>`;
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  function render(req) {
    const pay = req.payment;

    content.innerHTML = `
      <!-- Hero: status + club -->
      <div class="detail-hero" style="align-items:flex-start;gap:18px">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:10px">
            <div class="detail-hero-name" style="font-size:1.25rem">${esc(req.clubName) || '—'}</div>
            ${badge(req.status, reqStatusMap)}
          </div>
          <div style="color:var(--muted);font-size:0.85rem">${esc(req.clubAddress) || '—'}</div>
          <div style="color:var(--muted-mid);font-size:0.78rem;margin-top:6px">
            Scheduled: <strong style="color:var(--white)">${fmtDate(req.datetime)}</strong>
            ${req.timezone ? `<span style="margin-left:8px">(${esc(req.timezone)})</span>` : ''}
          </div>
        </div>
      </div>

      <!-- Participants -->
      <p class="detail-section-title">Participants</p>
      <div class="req-users-row">
        ${userCard(req.mUser, 'Male User (Creator)')}
        <div class="req-users-divider">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </div>
        ${userCard(req.fUser, 'Female User')}
      </div>

      <!-- Request info + Payment side by side -->
      <div class="req-info-row">
        <div class="req-info-col">
          <p class="detail-section-title" style="margin-top:0">Request Info</p>
          <div class="detail-grid req-info-grid">
            ${field('Request ID',   `<span style="font-family:monospace;font-size:0.8rem">${esc(req.id) || '—'}</span>`)}
            ${field('Status',       badge(req.status, reqStatusMap))}
            ${field('Scheduled At', fmtDate(req.datetime))}
            ${field('Timezone',     esc(req.timezone) || '—')}
            ${field('Club',         esc(req.clubName) || '—')}
            ${field('Address',      esc(req.clubAddress) || '—')}
            ${field('Place ID',     esc(req.placeId) || '—')}
            ${field('Created At',   fmtDate(req.createdAt))}
            ${field('Updated At',   fmtDate(req.updatedAt))}
            ${req.cancelledBy ? field('Cancelled By', esc(req.cancelledBy)) : ''}
            ${req.cancelledAt && req.cancelledAt !== '0001-01-01T00:00:00Z' ? field('Cancelled At', fmtDate(req.cancelledAt)) : ''}
            ${req.chatId ? field('Chat ID', `<span style="font-family:monospace;font-size:0.8rem">${esc(req.chatId)}</span>`) : ''}
          </div>
        </div>
        ${pay ? `
        <div class="req-info-col">
          <p class="detail-section-title" style="margin-top:0">Payment</p>
          <div class="detail-grid req-info-grid">
            ${field('Base Amount',        fmtCurrency(pay.fUserBaseAmount))}
            ${field('mUser Platform Fee', fmtCurrency(pay.mUserPlatformFee))}
            ${field('mUser GST',          fmtCurrency(pay.mUserGST))}
            ${field('mUser Total Paid',   fmtCurrency(pay.mUserTotalPayable))}
            ${field('fUser Platform Fee', fmtCurrency(pay.fUserPlatformFee))}
            ${field('fUser GST',          fmtCurrency(pay.fUserGST))}
            ${field('fUser Net Payout',   fmtCurrency(pay.fUserNetPayout))}
            ${pay.paymentStatus ? field('Payment Status', esc(pay.paymentStatus)) : ''}
            ${pay.payoutStatus  ? field('Payout Status',  esc(pay.payoutStatus))  : ''}
            ${pay.refundStatus  ? field('Refund Status',  esc(pay.refundStatus))  : ''}
            ${pay.refundAmount  ? field('Refund Amount',  fmtCurrency(pay.refundAmount)) : ''}
          </div>
        </div>
        ` : ''}
      </div>
    `;
  }

  // ── Load ──────────────────────────────────────────────────────────────────────
  async function load() {
    const { ok, data } = await apiAbs(API_BASE + '/v1/request/' + encodeURIComponent(requestId));
    if (!ok || !data || !data.id) {
      content.innerHTML = '<div class="detail-error">Request not found.</div>';
      return;
    }
    console.log('[STAG Admin] Request detail page loaded for id:', requestId);
    render(data);
    initLightbox();
  }

  load();
})();
