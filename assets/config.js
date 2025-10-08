// Unified client config for cloud Admin API
// If you deploy your own API, update API_BASE_URL below.

(function(){
  var CFG = (window.__GRID_CONFIG__ || {});
  var override = (localStorage.getItem('API_BASE_URL') || '').trim();
  window.__GRID_CONFIG__ = Object.assign({}, CFG, {
    API_BASE_URL: override || 'https://the-grid-admin-1.onrender.com/api/admin'
  });
  // Compatibility alias for guides using APP_CONFIG; keeps existing consumers intact
  window.APP_CONFIG = Object.assign({}, window.APP_CONFIG || {}, window.__GRID_CONFIG__);
})();