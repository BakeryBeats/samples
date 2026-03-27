// Library management

let allSamples = [];

async function loadSamples() {
  try {
    showLoading(true);
    const snapshot = await db.collection('samples')
      .where('userId', '==', auth.currentUser.uid)
      .orderBy('uploadedAt', 'desc')
      .get();

    allSamples = [];
    snapshot.forEach(doc => {
      allSamples.push({
        id: doc.id,
        ...doc.data()
      });
    });

    displaySamples(allSamples);
  } catch (error) {
    console.error('Error loading samples:', error);
    showToast('Error loading samples: ' + error.message, 'error');
  } finally {
    showLoading(false);
  }
}

function displaySamples(samples) {
  const grid = document.getElementById('samplesGrid');
  
  if (samples.length === 0) {
    grid.innerHTML = '<div class="empty-state"><p>📭 No samples yet. Upload your first sample!</p></div>';
    return;
  }

  grid.innerHTML = samples.map(sample => `
    <div class="sample-card">
      <div class="sample-name" title="${sample.filename}">${sample.filename}</div>
      <div class="sample-meta">
        <span class="tag genre">${sample.genre}</span>
        ${sample.bpm !== 'N/A' ? `<span class="tag bpm">${sample.bpm} BPM</span>` : ''}
        ${sample.style !== 'N/A' ? `<span class="tag style">${sample.style}</span>` : ''}
      </div>
      <div class="sample-size">Size: ${sample.size}</div>
      <div class="sample-controls">
        <button class="btn btn-primary" onclick="playSample('${sample.url}')">▶ Play</button>
        <button class="btn btn-danger" onclick="deleteSample('${sample.id}')">🗑</button>
      </div>
    </div>
  `).join('');
}

function playSample(url) {
  const audio = new Audio(url);
  audio.play().catch(err => showToast('Error playing audio: ' + err.message, 'error'));
}

async function deleteSample(sampleId) {
  if (!confirm('Delete this sample?')) return;

  try {
    showLoading(true);
    const sample = allSamples.find(s => s.id === sampleId);
    
    // Delete from storage
    const storageRef = storage.refFromURL(sample.url);
    await storageRef.delete();
    
    // Delete from Firestore
    await db.collection('samples').doc(sampleId).delete();
    
    showToast('Sample deleted', 'success');
    await loadSamples();
  } catch (error) {
    console.error('Delete error:', error);
    showToast('Error deleting sample: ' + error.message, 'error');
  } finally {
    showLoading(false);
  }
}

// Search and filter
document.getElementById('searchInput').addEventListener('input', filterSamples);
document.getElementById('genreFilter').addEventListener('change', filterSamples);

function filterSamples() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const genre = document.getElementById('genreFilter').value;

  const filtered = allSamples.filter(sample => {
    const matchSearch = sample.filename.toLowerCase().includes(search);
    const matchGenre = genre === '' || sample.genre === genre;
    return matchSearch && matchGenre;
  });

  displaySamples(filtered);
}
