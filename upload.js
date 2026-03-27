// Supabase Storage Upload (1GB FREE)

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
let selectedFiles = [];

// Click to upload
dropZone.addEventListener('click', () => fileInput.click());

// Drag and drop
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('audio/'));
  if (files.length === 0) {
    showToast('Please drop audio files only', 'error');
    return;
  }
  
  selectedFiles = files;
  updateDropZoneText();
  uploadBtn.disabled = false;
});

// File input change
fileInput.addEventListener('change', (e) => {
  selectedFiles = Array.from(e.target.files);
  updateDropZoneText();
  uploadBtn.disabled = false;
});

function updateDropZoneText() {
  if (selectedFiles.length > 0) {
    dropZone.innerHTML = `<p>✓ ${selectedFiles.length} file(s) selected</p>`;
  }
}

// Upload handler
uploadBtn.addEventListener('click', async () => {
  if (selectedFiles.length === 0) return;

  const genre = document.getElementById('genreInput').value || 'Other';
  const bpm = document.getElementById('bpmInput').value || 'N/A';
  const style = document.getElementById('styleInput').value || 'N/A';

  uploadBtn.disabled = true;
  document.getElementById('uploadProgress').style.display = 'block';

  let successCount = 0;
  const user = supabase.auth.user();

  for (const file of selectedFiles) {
    try {
      showLoading(true);
      
      // Upload to Supabase Storage
      const filename = `${user.id}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('samples')
        .upload(filename, file);
      
      if (error) throw error;

      // Get public URL
      const { publicUrl } = supabase.storage
        .from('samples')
        .getPublicUrl(filename);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('samples')
        .insert([{
          user_id: user.id,
          filename: file.name,
          genre: genre,
          bpm: bpm,
          style: style,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          file_url: publicUrl,
          created_at: new Date().toISOString()
        }]);

      if (dbError) throw dbError;
      successCount++;
    } catch (error) {
      console.error('Upload error:', error);
    }
  }

  showLoading(false);
  document.getElementById('uploadProgress').style.display = 'none';
  
  showToast(`Successfully uploaded ${successCount} sample(s)!`, 'success');

  // Reset form
  selectedFiles = [];
  fileInput.value = '';
  uploadBtn.disabled = true;
  document.getElementById('genreInput').value = '';
  document.getElementById('bpmInput').value = '';
  document.getElementById('styleInput').value = '';
  dropZone.innerHTML = '<p>Drag & drop audio files here or click to browse</p>';
  
  // Reload samples
  await loadSamples();
});
