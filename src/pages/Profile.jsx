import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name || 'Unknown User');
            setPhone(data.phone || 'Not Provided');
          }
        } catch (err) {
          console.error('❌ Error fetching profile:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [user]);

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '2rem', color: '#555' }}>Loading profile...</p>;
  }

  return (
    <div style={cardStyle}>
      <div style={avatarStyle}>{name ? name.charAt(0).toUpperCase() : '👤'}</div>
      <h2 style={nameStyle}>{name}</h2>
      <p style={emailStyle}>{user?.email}</p>
      <p style={phoneStyle}>📞 {phone}</p>
    </div>
  );
};

const cardStyle = {
  maxWidth: '360px',
  margin: '4rem auto',
  padding: '2rem',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(12px)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  color: '#fff',
  textAlign: 'center',
  border: '1px solid rgba(255, 255, 255, 0.2)',
};

const avatarStyle = {
  width: '70px',
  height: '70px',
  margin: '0 auto 1rem',
  borderRadius: '50%',
  backgroundColor: '#ffffff33',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#fff',
};

const nameStyle = {
  fontSize: '24px',
  marginBottom: '0.25rem',
};

const emailStyle = {
  fontSize: '14px',
  opacity: 0.8,
  marginBottom: '0.25rem',
};

const phoneStyle = {
  fontSize: '14px',
  opacity: 0.8,
};

export default Profile;
