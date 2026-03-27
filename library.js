let allSamples = [];

async function loadSamples() {
  try {
    showLoading(true);
    // Supabase v2 fix:
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showToast('Not logged in', 'error');
      return;
    }
    const { data, error } = await supabase
      .from('samples')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    allSamples = data || [];
    displaySamples(allSamples);
  } catch (error) {
    console.error('Error loading samples:', error);
    showToast('Error loading samples: ' + error.message, 'error');
  } finally {
    showLoading(false);
  }
}

document.getElementById('searchInput').addEventListener('input', filterSamples);
document.getElementById('genreFilter').addEventListener('change', filterSamples);

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
        <button class="btn btn-primary" onclick="playSample('${sample.file_url}')">▶ Play</button>
        <button class="btn btn-danger" onclick="deleteSample(${sample.id})">🗑</button>
      </div>
    </div>
  `).join('');
}

function playSample(url) {
  const audio = new Audio(url);
  audio.play().catch(err => showToast('Error playing audio', 'error'));
}

async function deleteSample(sampleId) {
  if (!confirm('Delete this sample?')) return;
  try {
    showLoading(true);
    const sample = allSamples.find(s => s.id === sampleId);
    const filepath = sample.file_url.split('/').slice(-2).join('/');
    await supabase.storage.from('samples').remove([filepath]);
    const { error } = await supabase
      .from('samples')
      .delete()
      .eq('id', sampleId);
    if (error) throw error;
    showToast('Sample deleted', 'success');
    await loadSamples();
  } catch (error) {
    console.error('Delete error:', error);
    showToast('Error deleting sample', 'error');
  } finally {
    showLoading(false);
  }
}

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
