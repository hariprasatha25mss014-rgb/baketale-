'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { CartProvider } from '../components/Cart';

export default function NotFound() {
  return (
    <CartProvider>
      <Navbar />
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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: '540px',
          background: 'rgba(251, 245, 237, 0.05)',
          border: '1.5px solid rgba(217, 159, 70, 0.35)',
          borderRadius: '28px',
          padding: '48px 32px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(16px)'
        }}
      >
        <span style={{
          display: 'inline-block',
          fontSize: '3.8rem',
          marginBottom: '12px'
        }}>
          🍫
        </span>

        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(2.4rem, 5vw, 3.4rem)',
          fontWeight: 900,
          color: '#ffffff',
          marginBottom: '12px',
          lineHeight: 1.05
        }}>
          404 · Crumbled Away
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: 'rgba(251, 245, 237, 0.85)',
          lineHeight: 1.6,
          marginBottom: '32px'
        }}>
          The page or confection you are looking for has already melted or been devoured. Return to the bakery to explore our fresh fudgy brownies!
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '999px',
              background: '#d99f46',
              color: '#140804',
              fontWeight: 800,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(217, 159, 70, 0.35)'
            }}
          >
            ← Back to Fresh Brownies
          </Link>
          <a
            href="https://instagram.com/baketalee"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(220, 39, 67, 0.35)'
            }}
          >
            Ask us on Instagram @baketalee ↗
          </a>
        </div>
      </motion.div>
    </div>
    </CartProvider>
  );
}
