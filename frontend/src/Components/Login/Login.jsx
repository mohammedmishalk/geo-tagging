import React, { useEffect, useRef } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

function LocationCapture() {
  const navigate = useNavigate();
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) {
      console.log('Already attempted, skipping.');
      return;
    }
    attempted.current = true;

    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      // navigate('/home');
      return;
    }

    console.log('Requesting geolocation…');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('Got position:', position);
        const { latitude, longitude } = position.coords;
        try {
          const token = localStorage.getItem('token');
          console.log('Sending to API:', latitude, longitude);
          const resp = await axios.post(
            '/user/save-location',
            { latitude, longitude },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('API response:', resp.data);
        } catch (err) {
          console.error('API error:', err);
        } finally {
          // once you confirm it’s working, you can uncomment this
          // navigate('/home');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        // navigate('/home');
      }
    );
  }, []); // no navigate dep needed here

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
      <h2 style={{ color: '#444', marginBottom: '10px' }}>
        Your OTP will be sent 📩
      </h2>
      <p style={{ color: '#777' }}>
        Enjoy your movie 🎬
      </p>
    </div>
  );
}

export default LocationCapture;
