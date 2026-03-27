// Supabase Configuration (100% FREE!)
// https://supabase.com -> Create Project -> Copy these keys

const SUPABASE_URL = "YOUR_SUPABASE_URL";     // https://xxx.supabase.co
const SUPABASE_KEY = "YOUR_SUPABASE_KEY";     // anon public key

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('Supabase initialized - No costs! 🎉');
