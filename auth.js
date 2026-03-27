// Supabase Authentication (Free Email/Password)

function showAuthSection() {
  document.getElementById('authSection').style.display = 'flex';
  document.getElementById('appSection').style.display = 'none';
}

function showAppSection() {
  document.getElementById('authSection').style.display = 'none';
  document.getElementById('appSection').style.display = 'flex';
  const user = supabase.auth.user();
  document.getElementById('userEmail').textContent = user ? user.email : 'User';
}

// Toggle forms
document.getElementById('showSignup').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'flex';
});

document.getElementById('showLogin').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 'flex';
  document.getElementById('signupForm').style.display = 'none';
});

// Login
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  try {
    showLoading(true);
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) throw error;
    showToast('Logged in successfully!', 'success');
  } catch (error) {
    showToast('Login failed: ' + error.message, 'error');
  } finally {
    showLoading(false);
  }
});

// Signup
document.getElementById('signupBtn').addEventListener('click', async () => {
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const password2 = document.getElementById('signupPassword2').value;

  if (!email || !password || !password2) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  if (password !== password2) {
    showToast('Passwords do not match', 'error');
    return;
  }

  if (password.length < 6) {
    showToast('Password must be at least 6 characters', 'error');
    return;
  }

  try {
    showLoading(true);
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    showToast('Account created! Check your email to confirm.', 'success');
  } catch (error) {
    showToast('Signup failed: ' + error.message, 'error');
  } finally {
    showLoading(false);
  }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    showToast('Logged out successfully', 'success');
  } catch (error) {
    showToast('Logout failed: ' + error.message, 'error');
  }
});

// Auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    showAppSection();
    loadSamples();
  } else {
    showAuthSection();
  }
});
