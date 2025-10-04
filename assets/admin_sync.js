// Admin settings sync with backend API (Flask on :5000)
(function(){
  // Use the same host as the page so it works across devices
  const API_BASE = `${location.protocol}//${location.hostname}:5000/api/admin`;

  async function getSettings() {
    const res = await fetch(`${API_BASE}/settings`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`GET settings failed: ${res.status}`);
    return res.json();
  }

  async function putSettings(payload) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`PUT settings failed: ${res.status}`);
    return res.json();
  }

  async function deleteSettings() {
    const res = await fetch(`${API_BASE}/settings`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`DELETE settings failed: ${res.status}`);
    return res.json();
  }

  async function getEvent(type) {
    const res = await fetch(`${API_BASE}/events/${encodeURIComponent(type)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`GET event ${type} failed: ${res.status}`);
    return res.json();
  }

  async function putEvent(type, payload) {
    const res = await fetch(`${API_BASE}/events/${encodeURIComponent(type)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`PUT event ${type} failed: ${res.status}`);
    return res.json();
  }

  async function syncNow() {
    const settings = await getSettings();
    if (settings && typeof settings === 'object') {
      localStorage.setItem('admin_settings', JSON.stringify(settings));
      if (typeof settings.timer_disabled !== 'undefined') {
        localStorage.setItem('admin_timer_disabled', settings.timer_disabled ? 'true' : 'false');
      }
    }
    return settings;
  }

  // Status indicator (online/offline)
  function ensureStatusIndicator(){
    let el = document.getElementById('backendStatus');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'backendStatus';
    el.textContent = 'Backend: …';
    el.style.position = 'fixed';
    el.style.left = '8px';
    el.style.bottom = '8px';
    el.style.zIndex = '9999';
    el.style.padding = '4px 8px';
    el.style.borderRadius = '12px';
    el.style.fontSize = '11px';
    el.style.fontWeight = '600';
    el.style.background = '#222';
    el.style.color = '#fff';
    el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    document.body.appendChild(el);
    return el;
  }
  function setStatus(online){
    const el = ensureStatusIndicator();
    if (online){
      el.textContent = 'Backend: Online';
      el.style.background = '#136f3d';
    } else {
      el.textContent = 'Backend: Offline';
      el.style.background = '#8a1f1f';
    }
  }

  // Periodic polling to live‑update localStorage across tabs/devices
  let pollTimer = null;
  function startPolling(intervalMs = 30000){
    if (pollTimer) clearInterval(pollTimer);
    const pollOnce = async () => {
      try {
        await syncNow();
        setStatus(true);
      } catch (e) {
        setStatus(false);
      }
    };
    pollOnce();
    pollTimer = setInterval(pollOnce, intervalMs);
  }

  window.AdminAPI = { getSettings, putSettings, deleteSettings, getEvent, putEvent, syncNow, startPolling, setStatus };

  document.addEventListener('DOMContentLoaded', () => {
    // Initial sync and begin polling
    syncNow().then(() => setStatus(true)).catch(() => setStatus(false));
    startPolling(30000);
  });
})();