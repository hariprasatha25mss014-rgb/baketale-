'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { rupee, INSTAGRAM_ID, INSTAGRAM_URL, INSTAGRAM_DM_URL, getWhatsAppUrl, getSmsUrl } from '../lib/data';

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [toast, setToast] = useState('');
  
  // Saved Customer Profile
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [instaHandle, setInstaHandle] = useState('');
  const [note, setNote] = useState('');
  
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Load Cart, Profile, & Order History from LocalStorage
  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem('baketale-cart') || '[]'));
    } catch {}

    try {
      const savedProfile = JSON.parse(localStorage.getItem('baketale-customer-profile') || '{}');
      if (savedProfile.name) setName(savedProfile.name);
      if (savedProfile.address) setAddress(savedProfile.address);
      if (savedProfile.instaHandle) setInstaHandle(savedProfile.instaHandle);
    } catch {}

    try {
      setOrderHistory(JSON.parse(localStorage.getItem('baketale-order-history') || '[]'));
    } catch {}
  }, []);

  // 2. Persist Cart Updates
  useEffect(() => {
    try {
      localStorage.setItem('baketale-cart', JSON.stringify(items));
    } catch {}
  }, [items]);

  // 3. Persist Profile Updates
  useEffect(() => {
    try {
      if (name || address || instaHandle) {
        localStorage.setItem(
          'baketale-customer-profile',
          JSON.stringify({ name, address, instaHandle })
        );
      }
    } catch {}
  }, [name, address, instaHandle]);

  // 4. Auto-dismiss Toasts
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  // 5. Lenis Scroll lock & Escape Key Listener
  useEffect(() => {
    const l = window.lenis;
    if (l) {
      open || confirmedOrder || historyOpen ? l.stop() : l.start();
    }
    const k = e => {
      if (e.key === 'Escape') {
        setOpen(false);
        setConfirmedOrder(null);
        setHistoryOpen(false);
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, confirmedOrder, historyOpen]);

  const add = useCallback(item => {
    setItems(p => {
      const exists = p.find(c => c.id === item.id);
      if (exists) {
        return p.map(c => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...p, { ...item, qty: 1 }];
    });
    setToast(`✨ Added ${item.name} to cart`);
  }, []);

  const change = (id, d) =>
    setItems(p =>
      p
        .map(c => (c.id === id ? { ...c, qty: c.qty + d } : c))
        .filter(c => c.qty > 0)
    );

  const remove = id => setItems(p => p.filter(c => c.id !== id));
  const count = items.reduce((s, c) => s + c.qty, 0);
  const total = items.reduce((s, c) => s + c.qty * c.price, 0);

  // Re-order items from past order receipt history
  const reorderPastItems = pastItems => {
    if (!pastItems || !pastItems.length) return;
    pastItems.forEach(item => {
      setItems(prev => {
        const exists = prev.find(c => c.id === item.id);
        if (exists) {
          return prev.map(c => (c.id === item.id ? { ...c, qty: c.qty + item.qty } : c));
        }
        return [...prev, { ...item }];
      });
    });
    setHistoryOpen(false);
    setOpen(true);
    setToast('✨ Added items from past order to your bag!');
  };

  // Main Instagram DM Checkout Handler with Popup Blocker Prevention & Clipboard Auto-Copy
  const handleInstagramCheckout = async () => {
    if (!name.trim()) {
      setToast('⚠️ Please enter your name to proceed');
      return;
    }
    if (!address.trim()) {
      setToast('⚠️ Please enter your delivery address');
      return;
    }

    setIsSubmitting(true);
    setToast('🔒 Securing order with Baketale Atelier...');

    // 1. Generate client order text immediately for instant clipboard sync
    const tempOrderId = `#BT-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const clientOrderText = [
      `✨ NEW BAKETALE ORDER • ${tempOrderId}`,
      `Date: ${dateStr}`,
      '------------------------------------',
      `👤 Customer: ${name.trim()}`,
      instaHandle.trim() ? `📱 Instagram: @${instaHandle.replace('@', '').trim()}` : null,
      `📍 Delivery Address: ${address.trim()}`,
      note.trim() ? `📝 Special Note: ${note.trim()}` : null,
      '------------------------------------',
      '📦 Order Items:',
      ...items.map(
        c => `  • ${c.qty} × ${c.name}${c.detail ? ' (' + c.detail + ')' : ''} — ${rupee(c.price * c.qty)}`
      ),
      '------------------------------------',
      `💰 Subtotal: ${rupee(total)}`,
      '🚚 Shipping: Calculated on Instagram based on location',
      '------------------------------------',
      `💬 Confirming with @${INSTAGRAM_ID} on Instagram. Thank you! ♡`
    ].filter(Boolean).join('\n');

    // 2. Synchronously write to clipboard within user click gesture context
    try {
      await navigator.clipboard.writeText(clientOrderText);
      setCopied(true);
    } catch (err) {
      console.warn('Clipboard auto-copy alert:', err);
    }

    // 3. Pre-open blank tab synchronously so modern browsers don't block the popup!
    let dmWindow = null;
    try {
      dmWindow = window.open('about:blank', '_blank');
    } catch (e) {
      console.warn('Popup blocked:', e);
    }

    let serverOrder = null;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: name.trim(),
            address: address.trim(),
            instagramHandle: instaHandle.trim() || null,
            note: note.trim() || null
          },
          items: items.map(c => ({
            id: c.id,
            name: c.name,
            detail: c.detail,
            price: c.price,
            qty: c.qty,
            img: c.img
          }))
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        serverOrder = json.data;
      } else {
        const errorMsg = json.error?.message || 'Server validation failed';
        setToast(`⚠️ ${errorMsg}`);
        if (json.error?.code === 'VALIDATION_ERROR') {
          if (dmWindow) dmWindow.close();
          setIsSubmitting(false);
          return;
        }
      }
    } catch (networkErr) {
      console.warn('Network issue during order persistence; using client fallback', networkErr);
    }

    const finalOrderId = serverOrder?.orderId || tempOrderId;
    const finalDateStr = serverOrder?.dateStr || dateStr;
    const finalOrderText = serverOrder?.receiptText || clientOrderText;
    const targetDmUrl = serverOrder?.instagramDmUrl || INSTAGRAM_DM_URL;

    // 4. Update clipboard with final server receipt
    try {
      await navigator.clipboard.writeText(finalOrderText);
    } catch {}

    // 5. Navigate pre-opened window or direct location to Instagram DM (@baketalee)
    if (dmWindow && !dmWindow.closed) {
      dmWindow.location.href = targetDmUrl;
    } else {
      window.open(targetDmUrl, '_blank', 'noopener');
    }

    // 6. Save order object to local history
    const newOrderObj = {
      orderId: finalOrderId,
      dateStr: finalDateStr,
      orderText: finalOrderText,
      total: serverOrder?.subtotal || total,
      itemCount: count,
      customerName: name.trim(),
      items: serverOrder?.items || [...items],
      status: 'READY FOR INSTAGRAM CONFIRMATION'
    };

    setConfirmedOrder(newOrderObj);

    setOrderHistory(prev => {
      const updated = [newOrderObj, ...prev];
      try {
        localStorage.setItem('baketale-order-history', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setToast('📋 Order Copied to Clipboard! Opening @baketalee DM... Just PASTE (Ctrl+V / Long-Press) to send!');

    setIsSubmitting(false);
    setOpen(false);
    setItems([]);
  };

  const openInstagramDmWithCopy = (textToCopy = confirmedOrder?.orderText) => {
    if (textToCopy) {
      try {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
      } catch {}
    }
    setToast('📋 Order Copied! Opening @baketalee DM... Just PASTE (Ctrl+V / Long-Press) to send!');
    window.open(INSTAGRAM_DM_URL, '_blank', 'noopener');
    setTimeout(() => setCopied(false), 2500);
  };

  const copyAgain = (textToCopy = confirmedOrder?.orderText) => {
    if (textToCopy) {
      try {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setToast('📋 Order summary copied to clipboard!');
        setTimeout(() => setCopied(false), 2200);
      } catch (err) {
        setToast('⚠️ Select text manually to copy');
      }
    }
  };

  return (
    <Ctx.Provider value={{ add, count, setOpen, historyOpen, setHistoryOpen, orderHistory }}>
      {children}

      {/* Cart Drawer Scrim */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="scrim on"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Slide-in Luxury Cart Drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            className={`drawer on ${items.length ? '' : 'is-empty'}`}
            aria-label="Shopping Cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
          >
            <div className="drawer__head">
              <div>
                <h3>Your Bag</h3>
                <span className="drawer__count">{count} {count === 1 ? 'item' : 'items'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {orderHistory.length > 0 && (
                  <button
                    className="drawer__history-btn"
                    onClick={() => {
                      setOpen(false);
                      setHistoryOpen(true);
                    }}
                    title="View Past Orders"
                  >
                    📜 Past Orders ({orderHistory.length})
                  </button>
                )}
                <button className="x" onClick={() => setOpen(false)} aria-label="Close cart">
                  ✕
                </button>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="drawer__empty">
                <div className="empty-box-icon">✦</div>
                <h4>Your bag is empty</h4>
                <p>Handcrafted fudgy brownies are waiting for you.</p>
                {orderHistory.length > 0 && (
                  <button
                    className="btn btn--ghost"
                    onClick={() => {
                      setOpen(false);
                      setHistoryOpen(true);
                    }}
                    style={{ marginBottom: 12 }}
                  >
                    📜 View Past Order Receipts ({orderHistory.length})
                  </button>
                )}
                <button
                  className="btn btn--solid btn--light"
                  onClick={() => {
                    setOpen(false);
                    const el = document.getElementById('menu');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explore Flavours ↓
                </button>
              </div>
            ) : (
              <>
                <ul className="lines">
                  <AnimatePresence initial={false}>
                    {items.map(c => (
                      <motion.li
                        key={c.id}
                        className="line-item"
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                      >
                        {c.img && (
                          <img src={c.img} alt={c.name} className="line-item__thumb" />
                        )}
                        <div className="line-item__info">
                          <h4>{c.name}</h4>
                          <small>{c.detail} · {rupee(c.price)} each</small>
                          <div className="step">
                            <button onClick={() => change(c.id, -1)} aria-label="Decrease quantity">
                              −
                            </button>
                            <output>{c.qty}</output>
                            <button onClick={() => change(c.id, 1)} aria-label="Increase quantity">
                              +
                            </button>
                          </div>
                        </div>
                        <div className="line-item__right">
                          <span className="lp">{rupee(c.price * c.qty)}</span>
                          <button className="rm" onClick={() => remove(c.id)} aria-label={`Remove ${c.name}`}>
                            Remove
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="drawer__foot">
                  <div className="sub">
                    <span>Subtotal</span>
                    <b>{rupee(total)}</b>
                  </div>

                  <div className="drawer__fields">
                    <input
                      type="text"
                      placeholder="Your Full Name (required)"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="drawer__input"
                      required
                    />
                    <textarea
                      rows={2}
                      placeholder="Delivery address, city & pincode (required)"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="drawer__input"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Your Instagram Handle e.g. @yourname (optional)"
                      value={instaHandle}
                      onChange={e => setInstaHandle(e.target.value)}
                      className="drawer__input"
                    />
                    <input
                      type="text"
                      placeholder="Gifting note / cake decoration text (optional)"
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      className="drawer__input"
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ scale: 1.02 }}
                    className="btn btn--solid btn--light btn--wide btn--insta"
                    onClick={handleInstagramCheckout}
                    disabled={items.length === 0 || isSubmitting}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, display: 'inline-block', verticalAlign: 'middle' }}>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                    {isSubmitting ? 'Securing Order with Bakery...' : 'Confirm on Instagram (@baketalee) ↗'}
                  </motion.button>
                  <p className="fine">
                    📸 Your order summary will be copied automatically so you can paste it directly into our Instagram DM (<b>@baketalee</b>).
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Instagram Order Confirmation Modal */}
      <AnimatePresence>
        {confirmedOrder && (
          <div className="modal-backdrop" onClick={() => setConfirmedOrder(null)}>
            <motion.div
              className="confirm-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="confirm-modal__header">
                <span className="confirm-modal__badge">✨ ORDER READY FOR INSTAGRAM</span>
                <button
                  className="confirm-modal__close"
                  onClick={() => setConfirmedOrder(null)}
                >
                  ✕
                </button>
              </div>

              <div className="confirm-modal__body">
                <div className="confirm-modal__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
                <h3 className="confirm-modal__title">Confirm Order with @baketalee</h3>
                <p className="confirm-modal__desc">
                  Thank you, <b>{confirmedOrder.customerName}</b>! Order <b>{confirmedOrder.orderId}</b> is ready. Follow these 3 simple steps to confirm your freshly baked brownies:
                </p>

                <div className="confirm-modal__steps">
                  <div className="confirm-step">
                    <span className="confirm-step__num">1</span>
                    <div className="confirm-step__text">
                      <b>Receipt Copied!</b>
                      <p>Your itemized order details are already copied to your clipboard.</p>
                    </div>
                  </div>
                  <div className="confirm-step">
                    <span className="confirm-step__num">2</span>
                    <div className="confirm-step__text">
                      <b>Open Instagram DM</b>
                      <p>Tap below to go directly to <b>@baketalee</b> on Instagram.</p>
                    </div>
                  </div>
                  <div className="confirm-step">
                    <span className="confirm-step__num">3</span>
                    <div className="confirm-step__text">
                      <b>Paste &amp; Confirm</b>
                      <p>Paste the receipt into the chat and send. We will confirm your delivery slot!</p>
                    </div>
                  </div>
                </div>

                <div className="confirm-modal__receipt">
                  <div className="confirm-modal__receipt-header">
                    <span>ITEMIZED RECEIPT · {confirmedOrder.orderId}</span>
                    <button type="button" onClick={() => copyAgain()} className="confirm-modal__receipt-copy-btn">
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre>{confirmedOrder.orderText}</pre>
                </div>

                <div className="confirm-modal__actions">
                  <button
                    type="button"
                    className="btn btn--solid btn--wide btn--insta"
                    onClick={() => openInstagramDmWithCopy(confirmedOrder.orderText)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                    <span>Open Instagram DM (@baketalee) &amp; Auto-Paste ↗</span>
                  </button>

                  {/* WhatsApp Direct Auto-Populate Option */}
                  <a
                    href={getWhatsAppUrl(confirmedOrder.orderText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--solid btn--wide"
                    style={{ background: '#25D366', color: '#ffffff', border: 'none' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    <span>Instant Auto-Send via WhatsApp ⚡</span>
                  </a>

                  {/* SMS Direct Auto-Populate Option */}
                  <a
                    href={getSmsUrl(confirmedOrder.orderText)}
                    className="btn btn--ghost btn--wide"
                  >
                    💬 Auto-Send Order via Text SMS ↗
                  </a>

                  <button
                    type="button"
                    className="btn btn--ghost btn--wide"
                    onClick={() => copyAgain(confirmedOrder.orderText)}
                  >
                    {copied ? '✓ Order Copied to Clipboard!' : '📋 Copy Order Receipt Again'}
                  </button>
                  <button
                    type="button"
                    className="btn btn--plain"
                    onClick={() => setConfirmedOrder(null)}
                  >
                    Done · Continue Exploring Baketale
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order History Modal */}
      <AnimatePresence>
        {historyOpen && (
          <div className="modal-backdrop" onClick={() => setHistoryOpen(false)}>
            <motion.div
              className="confirm-modal order-history-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="confirm-modal__header">
                <span className="confirm-modal__badge">📜 YOUR BAKETALE ORDER HISTORY</span>
                <button
                  className="confirm-modal__close"
                  onClick={() => setHistoryOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="confirm-modal__body" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
                <h3 className="confirm-modal__title">Past Receipts &amp; Vouchers</h3>
                <p className="confirm-modal__desc">
                  View your recent order receipts, copy details, or re-order your favorite brownie batches with one click.
                </p>

                {orderHistory.length === 0 ? (
                  <div className="history-empty">
                    <p>No past orders saved in this browser yet.</p>
                  </div>
                ) : (
                  <div className="history-list">
                    {orderHistory.map((ord, idx) => (
                      <div key={ord.orderId || idx} className="history-card">
                        <div className="history-card__head">
                          <div>
                            <span className="history-card__id">{ord.orderId}</span>
                            <span className="history-card__date">{ord.dateStr}</span>
                          </div>
                          <span className="history-card__total">{rupee(ord.total)}</span>
                        </div>
                        <div className="history-card__items">
                          <small>Customer: {ord.customerName}</small>
                          <ul>
                            {ord.items?.map((it, i) => (
                              <li key={i}>{it.qty} × {it.name} ({it.detail || 'Standard'})</li>
                            ))}
                          </ul>
                        </div>
                        <div className="history-card__actions">
                          <button
                            className="btn btn--solid btn--light btn--sm"
                            onClick={() => copyAgain(ord.orderText)}
                          >
                            📋 Copy Receipt
                          </button>
                          <button
                            className="btn btn--ghost btn--sm"
                            onClick={() => reorderPastItems(ord.items)}
                          >
                            🛍️ Re-Order Items
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
    </Ctx.Provider>
  );
}

export function Nav() {
  const { count, setOpen, orderHistory, setHistoryOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="nav">
        <a href="#top" className="nav__logo" aria-label="Baketale home">
          <img src="/assets/logo-brown.png" alt="Baketale" />
        </a>

        <nav className="nav__links" aria-label="Main Navigation">
          <a href="/menu">Menu &amp; Prices</a>
          <a href="/#story">Our Story</a>
          <a href="/#box">Build a Box</a>
          <a href="/reviews">Polaroid Reviews</a>
        </nav>

        <div className="nav__actions">
          {/* Past Orders Pill if History Exists */}
          {orderHistory && orderHistory.length > 0 && (
            <button
              onClick={() => setHistoryOpen(true)}
              className="nav__history-pill"
              title="View Past Order Receipts"
            >
              📜 Orders ({orderHistory.length})
            </button>
          )}

          {/* Official Instagram Handle Pill */}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav__insta-chip"
            aria-label="Visit Baketale on Instagram"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            <span>@{INSTAGRAM_ID}</span>
          </a>

          <motion.button
            key={count}
            className="cartbtn"
            onClick={() => setOpen(true)}
            aria-label={`Open shopping bag with ${count} items`}
            animate={count > 0 ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.35 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 7h12l-1 13H7L6 7z" />
              <path d="M9 7a3 3 0 016 0" />
            </svg>
            <span className="cartbtn__count">{count}</span>
          </motion.button>

          <button
            className="nav__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu & Scrim */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="mobile-nav__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              className="mobile-nav"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mobile-nav__header">
                <span className="mobile-nav__badge">✦ NAVIGATION ✦</span>
                <button
                  className="mobile-nav__close"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>
              <nav className="mobile-nav__links">
                {[
                  ['menu', 'Flavours Menu', 'Rich, fudgy artisan batches'],
                  ['anatomy', 'Anatomy', 'Deconstructed 3D layers'],
                  ['specials', 'Specials & Cakes', 'Bento & celebration cakes'],
                  ['box', 'Build a Box · ₹150', '3 pieces custom curation'],
                  ['gallery', 'Gallery', 'Handcrafted crinkle moments']
                ].map(([h, l, sub]) => (
                  <a
                    key={h}
                    href={`#${h}`}
                    className="mobile-nav__link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="mobile-nav__link-text">
                      <span className="mobile-nav__link-title">{l}</span>
                      <small className="mobile-nav__link-sub">{sub}</small>
                    </div>
                    <span className="mobile-nav__arrow" aria-hidden="true">→</span>
                  </a>
                ))}
                {orderHistory && orderHistory.length > 0 && (
                  <button
                    className="mobile-nav__link"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setHistoryOpen(true);
                    }}
                    style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                  >
                    <div className="mobile-nav__link-text">
                      <span className="mobile-nav__link-title">📜 Order History</span>
                      <small className="mobile-nav__link-sub">View past order receipts</small>
                    </div>
                    <span className="mobile-nav__arrow" aria-hidden="true">→</span>
                  </button>
                )}
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-nav__insta"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                  <span>Order on Instagram @{INSTAGRAM_ID} ↗</span>
                </a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
