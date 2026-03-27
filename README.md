# 🎵 BakeryBeats Sample Cloud

A cloud-based sample library manager for music producers. Upload, organize, and manage your drum samples, loops, and sound packs in one place.

## Features

✨ **User Authentication**
- Sign up / Login with email
- Secure account management

📤 **Sample Upload**
- Drag & drop audio files
- Multi-file upload support
- Tag samples by genre, BPM, and style

📚 **Sample Library**
- Organized grid view
- Search functionality
- Filter by genre
- Play samples directly
- Delete unwanted samples

☁️ **Cloud Storage**
- Firebase Cloud Storage
- Secure file management
- Backup in the cloud

## Getting Started

### 1. Firebase Setup

1. Go to [firebase.google.com](https://firebase.google.com)
2. Create a new Firebase project
3. Enable **Authentication** (Email/Password)
4. Enable **Cloud Storage**
5. Enable **Firestore Database**
6. Copy your Firebase config

### 2. Configure

Update `config.js` with your Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Deploy

- Option A: Deploy to GitHub Pages
- Option B: Deploy to Firebase Hosting
- Option C: Any static hosting (Netlify, Vercel, etc.)

## Usage

1. **Create Account**: Sign up with your email
2. **Upload Samples**: Drag & drop or click to upload
3. **Organize**: Add genre, BPM, and style tags
4. **Manage**: Search, filter, play, and delete samples
5. **Play**: Click play button to preview any sample

## Technologies

- Firebase Auth
- Firebase Cloud Storage
- Firestore Database
- Vanilla JavaScript
- CSS3

## Roadmap

- [ ] Sample packs
- [ ] Sharing features
- [ ] Advanced search & filters
- [ ] Integration with BakeryBeats Beat Maker
- [ ] Export to DAWs
- [ ] Usage statistics
- [ ] Favorites & collections
- [ ] Collaborative libraries

## Security

Firebase handles:
- Encrypted data transmission (HTTPS)
- User authentication
- Database access rules
- File permissions

## License

MIT

---

Made for music producers 🎵
