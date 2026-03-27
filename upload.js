// Upload functionality

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
  fileInput.files = e.dataTransfer.items;
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
  let failCount = 0;

  for (const file of selectedFiles) {
    try {
      showLoading(true);
      
      // Create unique filename
      const timestamp = Date.now();
      const filename = `${auth.currentUser.uid}/${genre}/${timestamp}-${file.name}`;
      
      // Upload to storage
      const storageRef = storage.ref(filename);
      await storageRef.put(file);
      
      // Get download URL
      const url = await storageRef.getDownloadURL();
      
      // Save metadata to Firestore
      await db.collection('samples').add({
        userId: auth.currentUser.uid,
        filename: file.name,
        genre: genre,
        bpm: bpm,
        style: style,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        url: url,
        uploadedAt: new Date(),
        type: file.type
      });
      
      successCount++;
    } catch (error) {
      console.error('Upload error:', error);
      failCount++;
    }
  }

  showLoading(false);
  document.getElementById('uploadProgress').style.display = 'none';
  
  if (failCount === 0) {
    showToast(`Successfully uploaded ${successCount} sample(s)!`, 'success');
  } else {
    showToast(`Uploaded ${successCount}, failed ${failCount}`, 'error');
  }

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
