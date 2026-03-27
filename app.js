// Main app initialization

function showLoading(show) {
  document.getElementById('loading').style.display = show ? 'flex' : 'none';
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Initialize
console.log('BakeryBeats Sample Cloud loaded');
