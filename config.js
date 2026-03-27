// Supabase Configuration (100% FREE!)
// Anon Public Key is SAFE to share - it's designed for frontend apps

const SUPABASE_URL = "https://vymnlmwhbjszdqifnsck.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5bW5sbXdoYmpzemRxaWZuc2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MzM2OTEsImV4cCI6MjA5MDIwOTY5MX0.R1sDGeEtpkeTn8TvTP7JoGirAC4L1jS_49bFVS039mc";

// Wait for Supabase library to load
function initSupabase() {
  if (!window.supabase) {
    console.error('Supabase library not loaded!');
    setTimeout(initSupabase, 100);
    return;
  }
  
  try {
    const { createClient } = window.supabase;
    window.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase initialized!');
  } catch (error) {
    console.error('Supabase init error:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSupabase);
} else {
  initSupabase();
}
