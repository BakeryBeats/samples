const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
let selectedFiles = [];

dropZone.addEventListener('click', () => fileInput.click());
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
uploadBtn.addEventListener('click', async () => {
  if (selectedFiles.length === 0) return;
  const genre = document.getElementById('genreInput').value || 'Other';
  const bpm = document.getElementById('bpmInput').value || 'N/A';
  const style = document.getElementById('styleInput').value || 'N/A';
  uploadBtn.disabled = true;
  document.getElementById('uploadProgress').style.display = 'block';
  let successCount = 0;
  // Supabase v2 fix:
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return showToast('Not logged in', 'error');
  for (const file of selectedFiles) {
    try {
      showLoading(true);
      const filename = `${user.id}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('samples')
        .upload(filename, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage
        .from('samples')
        .getPublicUrl(filename);
      const publicUrl = urlData?.publicUrl;
      if (!publicUrl) throw new Error('Could not get public URL');
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
      console.error('[Upload] Error uploading file:', error.message);
    }
  }
  showLoading(false);
  document.getElementById('uploadProgress').style.display = 'none';
  if (successCount > 0) showToast(`Upload klaar!`, 'success');
  // Reset en samples opnieuw laden
  selectedFiles = [];
  fileInput.value = '';
  uploadBtn.disabled = true;
  document.getElementById('genreInput').value = '';
  document.getElementById('bpmInput').value = '';
  document.getElementById('styleInput').value = '';
  dropZone.innerHTML = '<p>Drag & drop audio files here or click to browse</p>';
  await loadSamples();
});
