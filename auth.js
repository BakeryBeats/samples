// Supabase Authentication - Supabase v2 compatible

function showAuthSection() {
  document.getElementById('authSection').style.display = 'flex';
  document.getElementById('appSection').style.display = 'none';
}

function showAppSection() {
  document.getElementById('authSection').style.display = 'none';
  document.getElementById('appSection').style.display = 'flex';
}

// Wait for Supabase to load
function initAuth() {
  if (!window.supabase) {
    setTimeout(initAuth, 100);
    return;
  }

  const supabase = window.supabase;

  // Toggle forms
  document.getElementById('showSignup')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'flex';
  });

  document.getElementById('showLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'flex';
    document.getElementById('signupForm').style.display = 'none';
  });

  // Login
  document.getElementById('loginBtn')?.addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      showLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showToast('Logged in successfully!', 'success');
      // Clear forms
      document.getElementById('loginEmail').value = '';
      document.getElementById('loginPassword').value = '';
    } catch (error) {
      showToast('Login failed: ' + error.message, 'error');
    } finally {
      showLoading(false);
    }
  });

  // Signup
  document.getElementById('signupBtn')?.addEventListener('click', async () => {
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
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      showToast('Account created! Check your email to confirm.', 'success');
      // Clear forms
      document.getElementById('signupEmail').value = '';
      document.getElementById('signupPassword').value = '';
      document.getElementById('signupPassword2').value = '';
    } catch (error) {
      showToast('Signup failed: ' + error.message, 'error');
    } finally {
      showLoading(false);
    }
  });

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      showToast('Logged out successfully', 'success');
    } catch (error) {
      showToast('Logout failed: ' + error.message, 'error');
    }
  });

  // Auth state listener - This handles showing/hiding sections and loading samples
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      showAppSection();
      // Update user email
      if (session.user) {
        document.getElementById('userEmail').textContent = session.user.email;
      }
      // Load samples after a brief delay to ensure app is ready
      setTimeout(() => loadSamples(), 100);
    } else {
      showAuthSection();
    }
  });
}

// Initialize auth when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}
