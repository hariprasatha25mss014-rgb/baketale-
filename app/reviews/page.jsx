'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Smooth from '../../components/Smooth';
import { CartProvider } from '../../components/Cart';
import Navbar from '../../components/Navbar';
import { Footer } from '../../components/Sections';

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
          setReviews(parsed);
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

  const selectFlavour = (flavourName, imgPath) => {
    setForm(prev => ({
      ...prev,
      flavour: flavourName,
      photo: imgPath
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

        {/* Filter Pills Tabs */}
        {reviews.length > 0 && (
          <section className="feedback-filter-section">
            <div className="feedback-filter-wrap">
              <span className="filter-lbl">Filter by Flavour:</span>
              <div className="filter-pills">
                {FLAVOUR_FILTERS.map((f) => (
                  <button
                    key={f}
                    className={`filter-pill ${activeFilter === f ? 'is-active' : ''}`}
                    onClick={() => setActiveFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Polaroid Review Cards Grid or Empty State */}
        <section className="feedback-grid-section">
          {filteredReviews.length === 0 ? (
            <div className="feedback-empty-state">
              <div className="empty-state-icon">✦</div>
              <h3>No Customer Stories Pinned Yet</h3>
              <p>Be the very first brownie connoisseur to share your story &amp; pin a polaroid moment on our wall!</p>
              <button className="btn btn--solid btn--insta-glow" onClick={() => setShowModal(true)}>
                Write the First Review ✍
              </button>
            </div>
          ) : (
            <div className="feedback-grid">
              <AnimatePresence mode="popLayout">
                {filteredReviews.map((r) => (
                  <motion.article
                    key={r.id}
                    className="polaroid-card-v2"
                    style={{ transform: `rotate(${r.rotate || 0}deg)` }}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.04, rotate: 0, zIndex: 10 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Tape / Pin Sticker */}
                    <div className="polaroid-card-v2__tape" style={{ backgroundColor: r.pinColor || '#d99f46' }} />

                    {/* Photo Frame */}
                    <div className="polaroid-card-v2__photo">
                      <img src={r.photo} alt={r.flavour} />
                      <span className="polaroid-card-v2__flavour-badge">{r.flavour}</span>
                    </div>

                    {/* Body Content */}
                    <div className="polaroid-card-v2__body">
                      <div className="polaroid-card-v2__stars">
                        {'★'.repeat(r.rating || 5)}
                      </div>

                      <p className="polaroid-card-v2__quote">
                        “{r.quote}”
                      </p>

                      <div className="polaroid-card-v2__footer">
                        <strong>— {r.name}</strong>
                        <small>{r.city} · {r.date}</small>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* High-End Split Modal for Submitting New Review */}
        <AnimatePresence>
          {showModal && (
            <div className="modal-backdrop" onClick={() => setShowModal(false)}>
              <motion.div
                className="confirm-modal write-review-modal"
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="confirm-modal__header">
                  <span className="confirm-modal__badge">✨ LIVE POLAROID STUDIO</span>
                  <button className="confirm-modal__close" onClick={() => setShowModal(false)}>✕</button>
                </div>

                <div className="write-review-split">
                  {/* Left Column: Live Polaroid Card Preview */}
                  <div className="review-preview-side">
                    <div className="preview-header-tag">
                      <span>✦ LIVE REALTIME PREVIEW ✦</span>
                    </div>

                    <div className="polaroid-card-v2 preview-polaroid">
                      <div className="polaroid-card-v2__tape" style={{ backgroundColor: '#d99f46' }} />
                      <div className="polaroid-card-v2__photo">
                        <img src={form.photo} alt={form.flavour} />
                        <span className="polaroid-card-v2__flavour-badge">{form.flavour}</span>
                      </div>
                      <div className="polaroid-card-v2__body">
                        <div className="polaroid-card-v2__stars">
                          {'★'.repeat(form.rating)}
                        </div>
                        <p className="polaroid-card-v2__quote">
                          “{form.quote.trim() || 'Your brownie review or story will appear here in real-time as you type...' }”
                        </p>
                        <div className="polaroid-card-v2__footer">
                          <strong>— {form.name.trim() || 'Your Name'}</strong>
                          <small>{form.city.trim() || 'Your City'} · Just now</small>
                        </div>
                      </div>
                    </div>
                    <p className="preview-hint">This is how your polaroid will look when pinned to the Wall.</p>
                  </div>

                  {/* Right Column: Clean Submission Form */}
                  <form onSubmit={handleSubmit} className="review-form-side">
                    <div className="form-head">
                      <h3>Share Your Baketale Story</h3>
                      <p className="form-sub">Pin your review and unboxing moment onto our wall.</p>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Your Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Aarav Sharma"
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

                    {/* Flavour Selector Chips */}
                    <div className="form-group">
                      <label>Select Flavour Cravings *</label>
                      <div className="flavour-chip-grid">
                        {FLAVOUR_OPTIONS.map((f) => (
                          <button
                            type="button"
                            key={f.name}
                            className={`flavour-chip ${form.flavour === f.name ? 'is-selected' : ''}`}
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
