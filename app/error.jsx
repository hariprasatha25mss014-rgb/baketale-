'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log error to console / monitoring
    console.error('Baketale App Error Boundary Caught:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: 'radial-gradient(circle at center, #2e140a 0%, #140804 100%)',
      color: '#fbf5ed',
      padding: '24px',
      textAlign: 'center',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{
        maxWidth: '520px',
        background: 'rgba(251, 245, 237, 0.06)',
        border: '1.5px solid rgba(235, 177, 169, 0.4)',
        borderRadius: '28px',
        padding: '44px 32px',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(16px)'
      }}>
        <span style={{ fontSize: '3.6rem', display: 'inline-block', marginBottom: '10px' }}>
          ✨
        </span>

        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(2.2rem, 4.5vw, 3rem)',
          fontWeight: 900,
          color: '#ffffff',
          marginBottom: '12px'
        }}>
          A Small Baking Hiccup
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: 'rgba(251, 245, 237, 0.85)',
          lineHeight: 1.6,
          marginBottom: '28px'
        }}>
          Something unexpected happened while preparing this page. Don't worry, your cart and fresh brownies are safe!
        </p>

        {process.env.NODE_ENV !== 'production' && error?.message && (
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.82rem',
            fontFamily: 'monospace',
            color: '#ebb1a9',
            textAlign: 'left',
            marginBottom: '24px',
            wordBreak: 'break-word'
          }}>
            {error.message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => reset()}
            style={{
              padding: '14px 28px',
              borderRadius: '999px',
              background: '#d99f46',
              color: '#140804',
              fontWeight: 800,
              fontSize: '1rem',
              border: 0,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(217, 159, 70, 0.35)'
            }}
          >
            ↻ Try Baking Again
          </button>
          <Link
            href="/"
            style={{
              padding: '14px 28px',
              borderRadius: '999px',
              border: '2px solid rgba(251, 245, 237, 0.4)',
              color: '#fbf5ed',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none'
            }}
          >
            Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
