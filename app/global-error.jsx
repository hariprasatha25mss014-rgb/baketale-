'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#140804',
        color: '#fbf5ed',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '480px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Baketale</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.85, marginBottom: '24px' }}>
            We encountered a critical application error. Please reload the page to continue.
          </p>
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
              cursor: 'pointer'
            }}
          >
            Reload Baketale
          </button>
        </div>
      </body>
    </html>
  );
}
