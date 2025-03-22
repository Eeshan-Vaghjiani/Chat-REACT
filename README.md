# ⚡ SuperChat

A modern, real-time chat application built with React and Firebase, featuring a sleek blue UI design and seamless user experience.

## ✨ Features

- **Real-time Messaging**: Instant message delivery powered by Firebase
- **Google Authentication**: Secure and easy sign-in with Google
- **Modern UI**: Clean and responsive design with smooth animations
- **User Avatars**: Automatic avatar integration from Google profiles
- **Message History**: Load up to 50 previous messages
- **Typing Indicators**: Visual feedback for message sending
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Deployment

To deploy this application using GitHub Pages:

1. Update your package.json:

```json
{
  "homepage": "https://your-username.github.io/superchat",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

2. Install GitHub Pages dependency:

```bash
npm install --save-dev gh-pages
```

3. Deploy to GitHub Pages:

```bash
npm run deploy
```

## 🛠️ Technologies Used

- React.js
- Firebase (Authentication, Firestore)
- CSS3 with modern features
- Google Authentication

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/superchat.git
cd superchat
```

2. Install dependencies:

```bash
npm install
```

3. Create a Firebase project and obtain your configuration:

   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication (Google sign-in)
   - Create a Firestore database
   - Get your Firebase configuration object

4. Create a `.env` file in the root directory:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

5. Start the development server:

```bash
npm start
```

## 🔒 Firebase Security Rules

Add these security rules to your Firebase console for proper authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
                   && request.resource.data.uid == request.auth.uid;
    }
  }
}
```

## 🎨 Features in Detail

### Real-time Chat

- Messages appear instantly
- Smooth animations for new messages
- Read receipts (coming soon)
- Emoji support (coming soon)

### User Experience

- Clean, intuitive interface
- Right-aligned messages for better readability
- Custom scrollbar design
- Loading animations
- Error handling with user feedback

### Authentication

- Secure Google sign-in
- Persistent login state
- User profile integration
- Anonymous fallback for display names

## 🔜 Upcoming Features

- [ ] Message reactions
- [ ] File sharing
- [ ] Dark/Light theme toggle
- [ ] User online status
- [ ] Message deletion
- [ ] Group chats

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Firebase team for the excellent documentation
- React community for inspiration and support
- All contributors who help improve the project

## 📧 Contact

Eeshan Vaghjiani - [![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white)](https://www.instagram.com/eeshan.04?igsh=MXI0NnBtY3VyeWp5aw%3D%3D&utm_source=qr)

Project Link: [https://github.com/Eeshan-Vaghjiani/Chatt-REACT](https://github.com/Eeshan-Vaghjiani/Chatt-REACT)

---

⭐️ If you found this project helpful, please give it a star!
