/* Unified Admin Sync – Cloud API only
 * Removes legacy LAN/local provider logic. Uses a single API_BASE_URL.
 */

(() => {
  const CFG = window.__GRID_CONFIG__ || {};
  const API_BASE = (CFG.API_BASE_URL || localStorage.getItem('API_BASE_URL') || 'http://localhost:3000/api/admin').replace(/\/$/, '');
  const LS = {
    token: localStorage.getItem('admin_api_token') || CFG.ADMIN_API_TOKEN || '',
    settings: null,
  };

  const authHeader = () => (LS.token ? { Authorization: `Bearer ${LS.token}` } : {});

  async function checkDbHealth() {
    try {
      const res = await fetch(`${API_BASE}/db_health`, { headers: { ...authHeader() } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const driver = data.driver || 'unknown';
      const statusText = data.ok ? `Online · DB: ${driver}` : `Offline · DB: ${driver}`;
      return { ok: !!data.ok, text: statusText };
    } catch (e) {
      return { ok: false, text: `Error: ${String(e.message || e)}` };
    }
  }

  async function fetchSettings() {
    const res = await fetch(`${API_BASE}/settings`, { headers: { 'Accept': 'application/json', ...authHeader() } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    LS.settings = json;
    try { localStorage.setItem('admin_settings', JSON.stringify(json)); } catch {}
    return json;
  }

  async function pushSettings(next) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(next || {}),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    LS.settings = json;
    try { localStorage.setItem('admin_settings', JSON.stringify(json)); } catch {}
    return json;
  }

  async function getEventPayload(type) {
    const res = await fetch(`${API_BASE}/events/${encodeURIComponent(type)}`, { headers: { 'Accept': 'application/json', ...authHeader() } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function setEventPayload(type, data) {
    const res = await fetch(`${API_BASE}/events/${encodeURIComponent(type)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(data || {}),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  let sseClient = null;
  function initSse() {
    try {
      const baseUrl = `${API_BASE}/stream`;
      const sseUrl = LS.token ? `${baseUrl}?token=${encodeURIComponent(LS.token)}` : baseUrl;
      if (sseClient && typeof sseClient.close === 'function') {
        try { sseClient.close(); } catch {}
      }
      sseClient = new EventSource(sseUrl, { withCredentials: false });
      sseClient.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data || '{}');
          if (data && data.type === 'settings_updated') {
            if (data.settings) {
              LS.settings = data.settings;
              try { localStorage.setItem('admin_settings', JSON.stringify(data.settings)); } catch {}
            }
          }
        } catch {}
      };
      sseClient.onerror = (err) => {
        // Errors are expected until backend becomes reachable; no-op.
      };
      return sseClient;
    } catch (e) {
      return null;
    }
  }

  // Expose globals expected by admin.html
  window.checkDbHealth = checkDbHealth;
  window.fetchSettings = fetchSettings;
  window.pushSettings = pushSettings;
  window.getEventPayload = getEventPayload;
  window.setEventPayload = setEventPayload;
  window.initSse = initSse;
  // Compatibility alias for existing admin.html handlers expecting AdminAPI
  window.AdminAPI = Object.assign({}, window.AdminAPI || {}, {
    getDbHealth: checkDbHealth,
    fetchSettings,
    pushSettings,
    getEventPayload,
    setEventPayload,
    initSse,
  });
})();