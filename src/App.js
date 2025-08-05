import React, { useRef, useState } from 'react';
import './App.css';
import EmojiPicker from 'emoji-picker-react';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, orderBy, limit, addDoc, serverTimestamp, query, doc, deleteDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, browserLocalPersistence } from 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import defaultAvatar from './assets/image.png';

const firebaseConfig = {
  apiKey: "AIzaSyCvVbSRN7njV0x7YxZV_V7lmbuw9Zu3NA4",
  authDomain: "superchat-7c5a6.firebaseapp.com",
  projectId: "superchat-7c5a6",
  storageBucket: "superchat-7c5a6.firebasestorage.app",
  messagingSenderId: "812857147700",
  appId: "1:812857147700:web:96e4d09404ca3ed805a561",
  measurementId: "G-2TP12NM64G",
  databaseURL: "https://superchat-7c5a6.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Set persistence - wrap in async function
const setPersistence = async () => {
  try {
    await auth.setPersistence(browserLocalPersistence);
  } catch (error) {
    console.error("Auth persistence error:", error);
  }
};
setPersistence();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>SuperChat</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <div className="sign-in-container">
      <h2>Welcome to SuperChat</h2>
      <p>Join the conversation!</p>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => signOut(auth)}>Sign Out</button>
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = collection(firestore, 'messages');
  const q = query(messagesRef, orderBy('createdAt'), limit(500));

  const [messages] = useCollectionData(q, { idField: 'id' });
  const [formValue, setFormValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [error, setError] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!formValue.trim()) return;
    const { uid, photoURL, displayName } = auth.currentUser;
    try {
      await addDoc(messagesRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid,
        photoURL: photoURL || defaultAvatar,
        displayName: displayName || 'Anonymous',
        replyTo: replyTo ? replyTo : null
      });
      setFormValue('');
      setReplyTo(null);
      dummy.current.scrollIntoView({ behavior: 'smooth' });
      setError(null);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  const onEmojiClick = (emojiData) => {
    setFormValue(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <>
      <main>
        {messages && messages.map(msg => (
          <ChatMessage 
            key={msg.id} 
            message={msg} 
            onReply={() => setReplyTo(msg)}
            onCopy={() => navigator.clipboard.writeText(msg.text)}
            onDelete={async () => {
              try {
                await firestoreDeleteMessage(msg.id);
              } catch (e) {
                setError("Failed to delete message.");
              }
            }}
          />
        ))}
        <span ref={dummy}></span>
      </main>

      {replyTo && (
        <div className="reply-preview">
          <span>Replying to: </span>
          <span className="reply-text">{replyTo.text}</span>
          <button onClick={() => setReplyTo(null)}>Cancel</button>
        </div>
      )}

      <form onSubmit={sendMessage}>
        <div className="input-container">
          <button 
            type="button" 
            className="emoji-button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className="emoji-picker-container">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                autoFocusSearch={false}
                width={300}
                height={400}
              />
            </div>
          )}
          <input 
            value={formValue} 
            onChange={(e) => setFormValue(e.target.value)} 
            placeholder="Type your message..."
            maxLength={500}
          />
          <button type="submit" disabled={!formValue.trim()}>Send</button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
    </>
  );

// Helper to delete message
async function firestoreDeleteMessage(id) {
  const messageDoc = doc(firestore, 'messages', id);
  await deleteDoc(messageDoc);
}
}

function ChatMessage(props) {
  const { text, uid, photoURL, displayName, replyTo } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL || defaultAvatar} alt={displayName} />
      <div className="message-content">
        <span className="username">{displayName}</span>
        {replyTo && (
          <div className="reply-to">
            <span className="reply-username">{replyTo.displayName || 'Anonymous'}</span>
            <span className="reply-text">{replyTo.text}</span>
          </div>
        )}
        <div style={{ position: 'relative' }}>
          <p>{text}</p>
          <button className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)} title="Message actions">
            ⋮
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={() => { props.onCopy(); setDropdownOpen(false); }}>Copy</button>
              <button onClick={() => { props.onReply(); setDropdownOpen(false); }}>Reply</button>
              {uid === auth.currentUser.uid && (
                <button onClick={() => { props.onDelete(); setDropdownOpen(false); }}>Delete</button>
              )}
              {uid === auth.currentUser.uid && (
                <button onClick={() => { /* TODO: Implement edit feature */ setDropdownOpen(false); }}>Edit</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
