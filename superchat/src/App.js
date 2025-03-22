import React, { useRef, useState } from 'react';
import './App.css';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, orderBy, limit, addDoc, serverTimestamp, query } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// Import default avatar
import defaultAvatar from './assets/image.png';

const firebaseConfig = {
  apiKey: "AIzaSyCvVbSRN7njV0x7YxZV_V7lmbuw9Zu3NA4",
  authDomain: "superchat-7c5a6.firebaseapp.com",
  projectId: "superchat-7c5a6",
  storageBucket: "superchat-7c5a6.firebasestorage.app",
  messagingSenderId: "812857147700",
  appId: "1:812857147700:web:96e4d09404ca3ed805a561",
  measurementId: "G-2TP12NM64G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

// Debug Firebase initialization
console.log('Firebase initialized with config:', {
  projectId: firebaseConfig.projectId,
  databaseURL: firebaseConfig.databaseURL
});

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚡ SuperChat</h1>
        {user && <SignOut />}
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  return (
    <div className="sign-in-container">
      <h2>SUPERCHAT</h2>
      <p>Where Conversations Flow</p>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  )
}

function SignOut() {
  return (
    <button className="sign-out" onClick={() => signOut(auth)}>
      Sign Out
    </button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const [error, setError] = useState('');
  const [formValue, setFormValue] = useState('');
  const [user] = useAuthState(auth);

  const messagesRef = collection(firestore, 'messages');
  const q = query(
    messagesRef,
    orderBy('createdAt', 'desc'),
    limit(50)  // Increased limit for better conversation context
  );
  
  const [messages, loading, error2] = useCollectionData(q, { 
    idField: 'id',
    snapshotListenOptions: { includeMetadataChanges: true }
  });

  React.useEffect(() => {
    if (messages && dummy.current) {
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be signed in to send messages');
      return;
    }

    if (!formValue.trim()) {
      return;
    }

    try {
      const { uid, photoURL, displayName } = user;
      
      await addDoc(messagesRef, {
        text: formValue.trim(),
        createdAt: serverTimestamp(),
        uid,
        photoURL: photoURL || defaultAvatar,
        displayName: displayName || 'Anonymous'
      });

      setFormValue('');
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message: ' + err.message);
    }
  }

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  if (error2) {
    return <div className="error">Error loading messages: {error2.message}</div>;
  }

  return (<>
    <main>
      <span ref={dummy}></span>
      {messages && messages.slice().reverse().map(msg => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </main>

    <form onSubmit={sendMessage}>
      <input 
        value={formValue} 
        onChange={(e) => setFormValue(e.target.value)} 
        placeholder="Type your message here..."
        maxLength={500}
      />
      <button type="submit" disabled={!formValue.trim()}>
        Send
      </button>
    </form>
    {error && <p className="error">{error}</p>}
  </>)
}

function ChatMessage(props) {
  const { text, uid, photoURL, displayName } = props.message;
  const [user] = useAuthState(auth);
  const messageClass = uid === user?.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img 
        src={photoURL || defaultAvatar} 
        alt={displayName || 'User avatar'} 
        title={displayName || 'Anonymous'}
      />
      <div className="message-content">
        {displayName && <span className="username">{displayName}</span>}
        <p>{text}</p>
      </div>
    </div>
  )
}

export default App;