/**
 * STAG Admin — API configuration
 *
 * Change API_BASE to point to your stag server.
 * Local dev:   http://localhost:8080
 * Production:  https://api.stag.org.in  (or wherever nginx proxies /stag)
 */
const API_BASE       = 'http://localhost:8080/stag';
const LOGIN_ENDPOINT = `${API_BASE}/v1/admin/signin`;
const DASH_ENDPOINT  = `${API_BASE}/v1/admin-dash`;
const TOKEN_KEY      = 'stag_admin_token';
const ADMIN_INFO_KEY = 'stag_admin_info';
