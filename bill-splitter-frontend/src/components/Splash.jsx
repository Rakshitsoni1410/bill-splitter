import { useEffect, useState } from 'react';

export default function Splash() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 2, 100));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(135deg, #0d0d14 0%, #1a1a2e 50%, #0d0d14 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, gap: '32px'
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', animation: 'fadeUp 0.6s ease forwards' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem', margin: '0 auto 20px',
          boxShadow: '0 16px 48px rgba(108,99,255,0.4)',
          animation: 'float 3s ease-in-out infinite'
        }}>💸</div>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '2.5rem', fontWeight: 800,
          background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 8
        }}>BillSplitter</h1>
        <p style={{ color: '#8888aa', fontSize: '1rem' }}>Split smarter. Settle faster.</p>
      </div>

      {/* Progress Bar */}
      <div style={{ width: 200 }}>
        <div style={{
          height: 4, background: '#2a2a45', borderRadius: 2, overflow: 'hidden'
        }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'linear-gradient(90deg, #6c63ff, #ff6584)',
            borderRadius: 2, transition: 'width 0.04s linear'
          }} />
        </div>
        <p style={{ color: '#8888aa', fontSize: '0.8rem', textAlign: 'center', marginTop: 8 }}>
          Loading...
        </p>
      </div>
    </div>
  );
}