// Global configuration for backend provider selection
// Set BACKEND_PROVIDER to 'flask' (default) or 'lovable'
// For Lovable Cloud (Supabase), provide project URL and anon key
window.__GRID_CONFIG__ = {
  BACKEND_PROVIDER: 'flask', // 'flask' or 'lovable'
  // Lovable (Supabase) project settings
  LOVABLE_PROJECT_URL: '', // e.g. 'https://your-project-ref.supabase.co'
  LOVABLE_ANON_KEY: '', // public anon key
  // Optional: route writes through an Edge Function (service role) for strict validation
  LOVABLE_USE_EDGE_FUNCTION: false,
  // Optional: enable realtime channel subscription for instant propagation
  LOVABLE_ENABLE_REALTIME: true,
  // Flask (SQLite) backend host overrides for cross-device access
  // Set to your server's LAN IP if other devices connect via that IP
  FLASK_API_HOST: '', // e.g. '192.168.1.5'
  FLASK_API_PORT: 5000
};