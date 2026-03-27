// Supabase Configuration (100% FREE!)
// Anon Public Key is SAFE to share - it's designed for frontend apps
// https://supabase.com -> API Settings

const SUPABASE_URL = "https://vymnlmwhbjszdqifnsck.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5bW5sbXdoYmpzemRxaWZuc2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MzM2OTEsImV4cCI6MjA5MDIwOTY5MX0.R1sDGeEtpkeTn8TvTP7JoGirAC4L1jS_49bFVS039mc";

// Initialize Supabase
const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('🎵 BakeryBeats Sample Cloud - Supabase Connected!');
console.log('✅ Zero costs - Forever free!');
