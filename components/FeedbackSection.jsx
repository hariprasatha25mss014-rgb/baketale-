'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function FeedbackSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('baketale-polaroid-reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setReviews(parsed);
        }
      }
    } catch {}
  }, []);

  return (
    <section className="feedback-section" id="reviews">
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">THE POLAROID ROADMAP</p>
          <h2>Customer <i>Stories</i></h2>
          <p className="head__sub">Real feedback pinned along our artisanal brownie journey across India.</p>
        </div>

        {reviews.length === 0 ? (
          <div className="feedback-empty-state" style={{ background: '#ffffff', borderRadius: 24, padding: '40px 20px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: 600, margin: '0 auto' }}>
            <div style={{ fontSize: '2rem', color: '#d99f46', marginBottom: 12 }}>✦</div>
            <h3 style={{ fontSize: '1.5rem', color: '#261107', marginBottom: 8 }}>No Customer Stories Pinned Yet</h3>
            <p style={{ color: '#735345', fontSize: '0.95rem', marginBottom: 20 }}>
              Be the first to taste our handcrafted brownies and pin your polaroid story on our wall!
            </p>
            <a href="/reviews?write=true" className="btn btn--solid btn--insta">
              Pin Your Polaroid Story ✍
            </a>
          </div>
        ) : (
          <div className="feedback-grid">
            {reviews.slice(0, 3).map((p, i) => (
              <motion.div
                key={p.id || i}
                className="feedback-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                <div className="feedback-photo-box">
                  <img src={p.photo || '/assets/brownies/classic.webp'} alt={p.flavour} />
                  <span className="feedback-flavour-badge">{p.flavour}</span>
                </div>
                <div className="feedback-body">
                  <div className="stars">{'★'.repeat(p.rating || 5)}</div>
                  <p className="feedback-quote">“{p.quote}”</p>
                  <footer>
                    <b>— {p.name}</b>
                    <small>{p.city}</small>
                  </footer>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="feedback-cta" style={{ textAlign: 'center', marginTop: '40px' }}>
          <a href="/reviews" className="bt-pill">
            {reviews.length > 0 ? 'View All Polaroid Stories & Pin Yours' : 'Visit Feedback Wall & Pin Yours'} <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
