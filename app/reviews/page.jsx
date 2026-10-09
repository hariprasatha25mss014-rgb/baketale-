'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Smooth from '../../components/Smooth';
import { CartProvider } from '../../components/Cart';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const INITIAL_REVIEWS = [];

const FLAVOUR_FILTERS = ['All', 'Nutella Hazelnut', 'Lotus Biscoff', 'Sicilian Pistachio', 'Classic Chocolate', 'Assorted Box'];

const FLAVOUR_OPTIONS = [
  { name: 'Nutella Hazelnut', img: '/assets/brownies/nutella.webp' },
  { name: 'Lotus Biscoff', img: '/assets/brownies/biscoff.webp' },
  { name: 'Sicilian Pistachio', img: '/assets/brownies/pistachio.webp' },
  { name: 'Classic Chocolate', img: '/assets/brownies/classic.webp' },
  { name: 'Oreo Cookies & Cream', img: '/assets/brownies/oreo.webp' },
  { name: 'Assorted Box', img: '/assets/brownies/gift_box.webp' }
];

const RATING_LABELS = {
  5: '5 / 5 · Heavenly! (Exceptional)',
  4: '4 / 5 · Super Fudgy! (Great)',
  3: '3 / 5 · Good Batch!',
  2: '2 / 5 · Fair',
  1: '1 / 5 · Needs Work'
};

function FeedbackContent() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [toast, setToast] = useState('');
  const [customPhoto, setCustomPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    city: '',
    flavour: 'Nutella Hazelnut',
    rating: 5,
    quote: '',
    photo: '/assets/brownies/nutella.webp'
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('baketale-polaroid-reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(r =>
            r && r.name &&
            !r.name.toLowerCase().includes('sample') &&
            !r.name.toLowerCase().includes('aarav') &&
            !r.name.toLowerCase().includes('test')
          );
          setReviews(cleaned);
        }
      }
    } catch { }

    if (typeof window !== 'undefined' && window.location.search.includes('write=true')) {
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleCustomImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Please choose an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setCustomPhoto(result);
        setForm(prev => ({
          ...prev,
          photo: result
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeCustomPhoto = () => {
    setCustomPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    const defaultOption = FLAVOUR_OPTIONS.find(f => f.name === form.flavour) || FLAVOUR_OPTIONS[0];
    setForm(prev => ({
      ...prev,
      photo: defaultOption.img
    }));
  };

  const selectFlavour = (flavourName, imgPath) => {
    setForm(prev => ({
      ...prev,
      flavour: flavourName,
      photo: customPhoto || imgPath
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) return;

    const newPolaroid = {
      id: Date.now(),
      name: form.name.trim(),
      city: form.city.trim() || 'India',
      flavour: form.flavour,
      rating: Number(form.rating),
      date: 'Just now',
      photo: form.photo,
      quote: form.quote.trim(),
      pinColor: '#d99f46',
      rotate: Math.floor(Math.random() * 6) - 3
    };

    const updated = [newPolaroid, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem('baketale-polaroid-reviews', JSON.stringify(updated));
    } catch { }

    setShowModal(false);
    setToast('✨ Your story has been pinned to the Wall of Fudgy Moments!');
    setCustomPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setForm({
      name: '',
      city: '',
      flavour: 'Nutella Hazelnut',
      rating: 5,
      quote: '',
      photo: '/assets/brownies/nutella.webp'
    });
  };

  const filteredReviews = activeFilter === 'All'
    ? reviews
    : reviews.filter(r => r.flavour.toLowerCase().includes(activeFilter.toLowerCase()));

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1) + ' ★'
    : '-- ★';

  return (
    <div className="bt-site" id="top">
      <Navbar />

      <main className="feedback-page">
        {/* Hero Header Section */}
        <section className="feedback-hero">
          <div className="feedback-hero__badge">
            <span>✦ REAL CRAVINGS & UNFORGETTABLE MOMENTS ✦</span>
          </div>
          <h1>The Baketale <i>Wall of Fudgy Moments</i></h1>
          <p className="feedback-hero__sub">
            Authentic customer reviews, love notes, and polaroid memories pinned by brownie connoisseurs across India.
          </p>

          <div className="feedback-hero__actions">
            <button className="btn btn--solid btn--insta-glow" onClick={() => setShowModal(true)}>
              Pin Your Polaroid Story ✍
            </button>
            <a href="/menu" className="btn btn--ghost">
              Explore Menu →
            </a>
          </div>
        </section>

        {/* Highlight Stats Bar */}
        <section className="feedback-stats">
          <div className="feedback-stats__wrap">
            <div className="stat-card">
              <span className="stat-card__val">{avgRating}</span>
              <span className="stat-card__lbl">Average Rating</span>
            </div>
            <div className="stat-card__divider" />
            <div className="stat-card">
              <span className="stat-card__val">{reviews.length}</span>
              <span className="stat-card__lbl">Verified Customer Stories</span>
            </div>
            <div className="stat-card__divider" />
            <div className="stat-card">
              <span className="stat-card__val">100%</span>
              <span className="stat-card__lbl">Real Couverture Chocolate</span>
            </div>
          </div>
        </section>

        {/* Filter Pills Bar */}
        <section className="feedback-filter-section">
          <div className="feedback-filter-wrap">
            <span className="filter-lbl">Filter by Flavour:</span>
            <div className="filter-pills">
              {FLAVOUR_FILTERS.map((filter) => (
                <button
                  key={filter}
                  className={`filter-pill ${activeFilter === filter ? 'is-active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Polaroid Memory Wall Gallery */}
        <section className="feedback-grid-section">
          {filteredReviews.length === 0 ? (
            <div className="feedback-empty">
              <div className="feedback-empty__icon">📸</div>
              <h3>No polaroid stories pinned yet</h3>
              <p>Be the first to taste our handcrafted brownies and share your photo on the wall!</p>
              <button className="btn btn--solid btn--insta" onClick={() => setShowModal(true)}>
                Pin The First Story ✍
              </button>
            </div>
          ) : (
            <div className="feedback-grid">
              {filteredReviews.map((r, i) => (
                <motion.article
                  key={r.id || i}
                  className="polaroid-card"
                  style={{
                    '--pin-color': r.pinColor || '#d99f46',
                    '--card-rotate': `${r.rotate || 0}deg`
                  }}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
                >
                  <div className="polaroid-pin" />

                  <div className="polaroid-photo-frame">
                    <img src={r.photo || '/assets/brownies/nutella.webp'} alt={r.flavour} />
                    <span className="polaroid-badge">{r.flavour}</span>
                  </div>

                  <div className="polaroid-caption">
                    <div className="polaroid-stars">
                      {'★'.repeat(r.rating || 5)}
                    </div>
                    <blockquote className="polaroid-quote">
                      “{r.quote}”
                    </blockquote>
                    <footer className="polaroid-author">
                      <strong>— {r.name}</strong>
                      <small>{r.city} · {r.date}</small>
                    </footer>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        {/* Floating Write Review Modal with Custom Image Upload Option */}
        <AnimatePresence>
          {showModal && (
            <div className="feedback-modal-scrim">
              <motion.div
                className="feedback-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
              />

              <motion.div
                className="feedback-modal"
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="feedback-modal__head">
                  <div>
                    <span className="eyebrow" style={{ color: '#d99f46' }}>SHARE YOUR EXPERIENCE</span>
                    <h2>Pin Your <i>Polaroid Memory</i></h2>
                  </div>
                  <button className="feedback-modal__close" onClick={() => setShowModal(false)} aria-label="Close modal">
                    ✕
                  </button>
                </div>

                <div className="feedback-modal__body">
                  <form onSubmit={handleSubmit} className="feedback-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Your Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Priya Sharma"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>City / Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Mumbai, MH"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Custom Image Upload Option */}
                    <div className="form-group">
                      <label>Photo * (Upload your brownie photo or choose a flavour)</label>
                      <div
                        style={{
                          border: '2px dashed rgba(184, 91, 43, 0.35)',
                          borderRadius: '16px',
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.6)',
                          marginBottom: '14px',
                          textAlign: 'center'
                        }}
                      >
                        {customPhoto ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center' }}>
                            <img
                              src={customPhoto}
                              alt="Uploaded brownie preview"
                              style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <div style={{ textAlign: 'left' }}>
                              <b style={{ display: 'block', fontSize: '0.85rem', color: '#261107' }}>Custom Photo Attached ✓</b>
                              <button
                                type="button"
                                onClick={removeCustomPhoto}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#dc2743',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  padding: '4px 0'
                                }}
                              >
                                Remove custom photo ✕
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              id="custom-image-upload"
                              accept="image/*"
                              onChange={handleCustomImageUpload}
                              style={{ display: 'none' }}
                            />
                            <label
                              htmlFor="custom-image-upload"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 18px',
                                background: '#261107',
                                color: '#ffffff',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease'
                              }}
                            >
                              <span>📷 Upload Your Brownie Photo</span>
                            </label>
                            <p style={{ margin: '8px 0 0', fontSize: '0.72rem', color: '#735345', opacity: 0.8 }}>
                              Attach an image from your device (JPG, PNG, WebP)
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Preset Flavour Selector Chips */}
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#735345', display: 'block', marginBottom: '8px' }}>
                        Or select preset flavour brownie:
                      </span>
                      <div className="flavour-chip-grid">
                        {FLAVOUR_OPTIONS.map((f) => (
                          <button
                            type="button"
                            key={f.name}
                            className={`flavour-chip ${form.flavour === f.name && !customPhoto ? 'is-selected' : ''}`}
                            onClick={() => selectFlavour(f.name, f.img)}
                          >
                            <img src={f.img} alt={f.name} className="flavour-chip__thumb" />
                            <span>{f.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Star Rating Interactive Buttons */}
                    <div className="form-group">
                      <label>Star Rating *</label>
                      <div className="star-picker">
                        <div className="star-buttons">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              className={`star-btn ${ (hoverRating || form.rating) >= star ? 'is-active' : '' }`}
                              onClick={() => setForm({ ...form, rating: star })}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              aria-label={`Rate ${star} stars`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <span className="star-picker__label">
                          {RATING_LABELS[hoverRating || form.rating]}
                        </span>
                      </div>
                    </div>

                    {/* Review Quote Textarea */}
                    <div className="form-group">
                      <label>Your Review / Story *</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Tell us about the fudgy texture, chocolate aroma, or birthday moment..."
                        value={form.quote}
                        onChange={(e) => setForm({ ...form, quote: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn btn--solid btn--wide btn--insta btn--glow">
                      Pin Polaroid Story to Wall ✦
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              className="toast on"
              initial={{ y: 80, x: '-50%', opacity: 0 }}
              animate={{ y: 0, x: '-50%', opacity: 1 }}
              exit={{ y: 80, x: '-50%', opacity: 0 }}
              role="status"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <Smooth>
      <CartProvider>
        <FeedbackContent />
      </CartProvider>
    </Smooth>
  );
}
