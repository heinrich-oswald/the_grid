// Admin settings sync with backend API (Flask on :5000)
(function(){
  const CFG = window.__GRID_CONFIG__ || {};
  const provider = (CFG.BACKEND_PROVIDER || 'flask').toLowerCase();
  // Cross-device host override support
  const API_HOST = CFG.FLASK_API_HOST || location.hostname;
  const API_PORT = CFG.FLASK_API_PORT || 5000;
  const API_BASE = `${location.protocol}//${API_HOST}:${API_PORT}/api/admin`;

  async function getSettings() {
    const headers = {};
    const token = (CFG.ADMIN_API_TOKEN || localStorage.getItem('admin_api_token') || '').trim();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/settings`, { cache: 'no-store', headers });
    if (!res.ok) throw new Error(`GET settings failed: ${res.status}`);
    return res.json();
  }

  async function putSettings(payload) {
    const headers = { 'Content-Type': 'application/json' };
    const token = (CFG.ADMIN_API_TOKEN || localStorage.getItem('admin_api_token') || '').trim();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`PUT settings failed: ${res.status}`);
    return res.json();
  }

  async function deleteSettings() {
    const headers = {};
    const token = (CFG.ADMIN_API_TOKEN || localStorage.getItem('admin_api_token') || '').trim();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/settings`, { method: 'DELETE', headers });
    if (!res.ok) throw new Error(`DELETE settings failed: ${res.status}`);
    return res.json();
  }

  async function getEvent(type) {
    const headers = {};
    const token = (CFG.ADMIN_API_TOKEN || localStorage.getItem('admin_api_token') || '').trim();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/events/${encodeURIComponent(type)}`, { cache: 'no-store', headers });
    if (!res.ok) throw new Error(`GET event ${type} failed: ${res.status}`);
    return res.json();
  }

  async function putEvent(type, payload) {
    const headers = { 'Content-Type': 'application/json' };
    const token = (CFG.ADMIN_API_TOKEN || localStorage.getItem('admin_api_token') || '').trim();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/events/${encodeURIComponent(type)}`, {
      method: 'PUT',
      headers,
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

  // Lovable (Supabase) provider
  async function makeSupabase(){
    if (!CFG.LOVABLE_PROJECT_URL || !CFG.LOVABLE_ANON_KEY) throw new Error('Lovable Cloud config missing');
    if (!window.supabase || !window.supabase.createClient) throw new Error('Supabase client not loaded');
    return window.supabase.createClient(CFG.LOVABLE_PROJECT_URL, CFG.LOVABLE_ANON_KEY);
  }
  const TABLE = 'grid_admin_settings';
  async function getSettingsLovable(){
    const supa = await makeSupabase();
    const { data, error } = await supa.from(TABLE).select('payload').eq('id', 1).maybeSingle();
    if (error) throw error;
    return data ? (data.payload || null) : null;
  }
  async function putSettingsLovable(payload){
    const supa = await makeSupabase();
    if (CFG.LOVABLE_USE_EDGE_FUNCTION) {
      const { data, error } = await supa.functions.invoke('validate-admin-settings', { body: payload });
      if (error) throw error;
      return data || { ok: true };
    } else {
      const { error } = await supa.from(TABLE).upsert({ id: 1, payload, updated_at: new Date().toISOString() }, { onConflict: 'id' });
      if (error) throw error;
      return { ok: true };
    }
  }
  async function deleteSettingsLovable(){
    const supa = await makeSupabase();
    if (CFG.LOVABLE_USE_EDGE_FUNCTION) {
      const { data, error } = await supa.functions.invoke('delete-admin-settings', {});
      if (error) throw error;
      return data || { ok: true };
    } else {
      const { error } = await supa.from(TABLE).delete().eq('id', 1);
      if (error) throw error;
      return { ok: true };
    }
  }
  async function getEventLovable(type){
    const s = await getSettingsLovable();
    const ev = (s && s.events) || {};
    return ev[type] || {};
  }
  async function putEventLovable(type, updates){
    const current = (await getSettingsLovable()) || {};
    current.events = current.events || {};
    const prev = current.events[type] || {};
    current.events[type] = { ...prev, ...updates };
    await putSettingsLovable(current);
    return current.events[type];
  }

  const AdminAPIImpl = (provider === 'lovable') ? {
    getSettings: getSettingsLovable,
    putSettings: putSettingsLovable,
    deleteSettings: deleteSettingsLovable,
    getEvent: getEventLovable,
    putEvent: putEventLovable,
  } : {
    getSettings,
    putSettings,
    deleteSettings,
    getEvent,
    putEvent,
  };

  // Supabase realtime: instant propagation of changes
  let realtimeChannel = null;
  async function startRealtime(){
    // Lovable (Supabase) realtime
    if (provider === 'lovable' && CFG.LOVABLE_ENABLE_REALTIME) {
      try {
        const supa = await makeSupabase();
        realtimeChannel = supa.channel('grid_admin_settings_changes');
        realtimeChannel.on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: TABLE,
          filter: 'id=eq.1'
        }, (payload) => {
          try {
            const newPayload = payload?.new?.payload;
            if (newPayload && typeof newPayload === 'object') {
              localStorage.setItem('admin_settings', JSON.stringify(newPayload));
              if (typeof newPayload.timer_disabled !== 'undefined') {
                localStorage.setItem('admin_timer_disabled', newPayload.timer_disabled ? 'true' : 'false');
              }
            }
          } catch (e) {}
        }).subscribe((status) => {
          // If realtime is connected, reduce polling frequency
          if (status === 'SUBSCRIBED') {
            if (pollTimer) {
              clearInterval(pollTimer);
              pollTimer = setInterval(async () => {
                try { await syncNow(); setStatus(true); } catch (e) { setStatus(false); }
              }, 60000); // fallback polling every 60s
            }
          }
        });
      } catch (e) {
        // realtime setup failed; keep normal polling
      }
      return;
    }

    // Flask SSE realtime
    try {
      const token = (CFG.ADMIN_API_TOKEN || localStorage.getItem('admin_api_token') || '').trim();
      const baseUrl = `${location.protocol}//${API_HOST}:${API_PORT}/api/admin/stream`;
      const sseUrl = token ? `${baseUrl}?token=${encodeURIComponent(token)}` : baseUrl;
      const es = new EventSource(sseUrl);
      es.onopen = () => {
        // Connected: reduce polling to 60s fallback
        if (pollTimer) {
          clearInterval(pollTimer);
          pollTimer = setInterval(async () => {
            try { await syncNow(); setStatus(true); } catch (e) { setStatus(false); }
          }, 60000);
        }
        setStatus(true);
      };
      es.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          const newSettings = msg?.settings;
          if (newSettings && typeof newSettings === 'object') {
            localStorage.setItem('admin_settings', JSON.stringify(newSettings));
            if (typeof newSettings.timer_disabled !== 'undefined') {
              localStorage.setItem('admin_timer_disabled', newSettings.timer_disabled ? 'true' : 'false');
            }
          }
        } catch (e) {}
      };
      es.onerror = () => { setStatus(false); };
    } catch (e) {
      // SSE not available; keep normal polling
    }
  }

  window.AdminAPI = { ...AdminAPIImpl, syncNow, startPolling, startRealtime, setStatus };

  document.addEventListener('DOMContentLoaded', () => {
    // Initial sync and begin polling
    syncNow().then(() => setStatus(true)).catch(() => setStatus(false));
    startPolling(30000);
    startRealtime();
  });
})();