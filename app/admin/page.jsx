'use client';

import { useState, useEffect } from 'react';
import { rupee } from '../../lib/data';

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('orders'); // 'orders' | 'inquiries' | 'stats'
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('bt-admin-key');
    if (saved) {
      setAdminKey(saved);
      loadAdminData(saved);
    }
  }, []);

  const loadAdminData = async (key) => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch Orders
      const resOrders = await fetch('/api/orders?limit=100', {
        headers: { 'x-admin-key': key }
      });
      const dataOrders = await resOrders.json();

      if (!resOrders.ok || !dataOrders.success) {
        throw new Error(dataOrders.error?.message || 'Authentication failed');
      }

      // 2. Fetch Stats
      const resStats = await fetch('/api/admin/stats', {
        headers: { 'x-admin-key': key }
      });
      const dataStats = await resStats.json();

      // 3. Fetch Inquiries
      const resInq = await fetch('/api/inquiries', {
        headers: { 'x-admin-key': key }
      });
      const dataInq = await resInq.json();

      setOrders(dataOrders.data?.orders || []);
      setStats(dataStats.data || null);
      setInquiries(dataInq.data || []);
      setIsAuthenticated(true);
      localStorage.setItem('bt-admin-key', key);
    } catch (err) {
      setError(err.message || 'Invalid Admin Key');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    loadAdminData(adminKey.trim());
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        alert(data.error?.message || 'Failed to update status');
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('bt-admin-key');
    setIsAuthenticated(false);
    setAdminKey('');
    setOrders([]);
    setStats(null);
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'radial-gradient(circle at center, #2e140a 0%, #140804 100%)',
        color: '#fbf5ed',
        padding: '20px',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{
          width: 'min(420px, 94vw)',
          background: 'rgba(251, 245, 237, 0.08)',
          border: '1.5px solid rgba(217, 159, 70, 0.4)',
          borderRadius: '24px',
          padding: '36px 28px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(20px)',
          textAlign: 'center'
        }}>
          <img
            src="/assets/logo-cream.png"
            alt="Baketale Atelier"
            style={{ height: '48px', margin: '0 auto 16px', display: 'block' }}
          />
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.8rem', color: '#ffffff', marginBottom: '8px' }}>
            Bakery Control Portal
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'rgba(251, 245, 237, 0.75)', marginBottom: '24px' }}>
            Protected atelier dashboard for live orders & Instagram fulfillment.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="password"
              placeholder="Enter Admin Secret Key"
              value={adminKey}
              onChange={e => setAdminKey(e.target.value)}
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1.5px solid rgba(251, 245, 237, 0.3)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fbf5ed',
                fontSize: '1rem',
                outline: 'none'
              }}
              required
            />
            {error && (
              <p style={{ color: '#ebb1a9', fontSize: '0.85rem', fontWeight: 600 }}>
                ⚠️ {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px',
                borderRadius: '999px',
                background: '#d99f46',
                color: '#140804',
                fontWeight: 800,
                fontSize: '1rem',
                border: 0,
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(217, 159, 70, 0.35)'
              }}
            >
              {loading ? 'Verifying Key...' : 'Unlock Portal →'}
            </button>
            <small style={{ color: 'rgba(251,245,237,0.5)', fontSize: '0.78rem' }}>
              Default development key: baketale-secret-2026
            </small>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#180a04',
      color: '#fbf5ed',
      padding: '24px 4vw 60px',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Admin Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(251, 245, 237, 0.15)',
        paddingBottom: '20px',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/assets/logo-cream.png" alt="Baketale" style={{ height: '42px' }} />
          <div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.6rem', color: '#ffffff', margin: 0 }}>
              Baketale Atelier Portal
            </h1>
            <span style={{ fontSize: '0.82rem', color: '#d99f46', fontWeight: 700 }}>
              ● LIVE &amp; SECURED
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => loadAdminData(adminKey)}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              border: '1.5px solid rgba(251,245,237,0.3)',
              color: '#fbf5ed',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ↻ Refresh
          </button>
          <button
            onClick={logout}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              background: 'rgba(235, 177, 169, 0.2)',
              color: '#ebb1a9',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: 0,
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Metrics Banner */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'rgba(251, 245, 237, 0.05)',
            border: '1px solid rgba(251, 245, 237, 0.15)',
            borderRadius: '18px',
            padding: '20px'
          }}>
            <small style={{ color: 'rgba(251,245,237,0.6)', fontWeight: 600 }}>TOTAL ORDERS</small>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '2.4rem', color: '#ffffff', margin: '4px 0 0' }}>
              {stats.totalOrders}
            </h3>
          </div>
          <div style={{
            background: 'rgba(251, 245, 237, 0.05)',
            border: '1px solid rgba(217, 159, 70, 0.35)',
            borderRadius: '18px',
            padding: '20px'
          }}>
            <small style={{ color: '#d99f46', fontWeight: 600 }}>TOTAL REVENUE</small>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '2.4rem', color: '#d99f46', margin: '4px 0 0' }}>
              {rupee(stats.totalRevenue)}
            </h3>
          </div>
          <div style={{
            background: 'rgba(251, 245, 237, 0.05)',
            border: '1px solid rgba(251, 245, 237, 0.15)',
            borderRadius: '18px',
            padding: '20px'
          }}>
            <small style={{ color: 'rgba(251,245,237,0.6)', fontWeight: 600 }}>PENDING INSTAGRAM DMS</small>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '2.4rem', color: '#ebb1a9', margin: '4px 0 0' }}>
              {stats.statusCounts?.pending_instagram || 0}
            </h3>
          </div>
          <div style={{
            background: 'rgba(251, 245, 237, 0.05)',
            border: '1px solid rgba(251, 245, 237, 0.15)',
            borderRadius: '18px',
            padding: '20px'
          }}>
            <small style={{ color: 'rgba(251,245,237,0.6)', fontWeight: 600 }}>CONFIRMED &amp; BAKING</small>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '2.4rem', color: '#9fa8da', margin: '4px 0 0' }}>
              {(stats.statusCounts?.confirmed || 0) + (stats.statusCounts?.baking || 0)}
            </h3>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button
          onClick={() => setTab('orders')}
          style={{
            padding: '10px 22px',
            borderRadius: '999px',
            background: tab === 'orders' ? '#d99f46' : 'rgba(255,255,255,0.08)',
            color: tab === 'orders' ? '#140804' : '#fbf5ed',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer'
          }}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setTab('inquiries')}
          style={{
            padding: '10px 22px',
            borderRadius: '999px',
            background: tab === 'inquiries' ? '#d99f46' : 'rgba(255,255,255,0.08)',
            color: tab === 'inquiries' ? '#140804' : '#fbf5ed',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer'
          }}
        >
          Cake Inquiries ({inquiries.length})
        </button>
      </div>

      {/* Orders Table */}
      {tab === 'orders' && (
        <div style={{
          background: 'rgba(251, 245, 237, 0.04)',
          borderRadius: '20px',
          border: '1px solid rgba(251, 245, 237, 0.12)',
          overflowX: 'auto'
        }}>
          {orders.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '48px', color: 'rgba(251,245,237,0.6)' }}>
              No orders placed yet. Place an order on the storefront to test!
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(251,245,237,0.15)', background: 'rgba(0,0,0,0.2)' }}>
                  <th style={{ padding: '16px 20px' }}>Order ID</th>
                  <th style={{ padding: '16px 20px' }}>Customer</th>
                  <th style={{ padding: '16px 20px' }}>Instagram</th>
                  <th style={{ padding: '16px 20px' }}>Items</th>
                  <th style={{ padding: '16px 20px' }}>Subtotal</th>
                  <th style={{ padding: '16px 20px' }}>Status</th>
                  <th style={{ padding: '16px 20px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid rgba(251,245,237,0.08)' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 800, color: '#d99f46' }}>
                      {order.id}
                      <div style={{ fontSize: '0.75rem', color: 'rgba(251,245,237,0.5)', fontWeight: 400 }}>
                        {order.dateStr}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <b>{order.customer.name}</b>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(251,245,237,0.6)', maxWidth: '240px' }}>
                        {order.customer.address}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {order.customer.instagramHandle ? (
                        <a
                          href={`https://instagram.com/${order.customer.instagramHandle}`}
                          target="_blank"
                          rel="noopener"
                          style={{ color: '#ebb1a9', textDecoration: 'underline' }}
                        >
                          @{order.customer.instagramHandle}
                        </a>
                      ) : (
                        <span style={{ opacity: 0.5 }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {order.items?.map((it, i) => (
                        <div key={i} style={{ fontSize: '0.85rem' }}>
                          • {it.qty} × {it.name} <span style={{ opacity: 0.6 }}>({it.detail})</span>
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 800 }}>
                      {rupee(order.subtotal)}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: '#241108',
                          color: '#fbf5ed',
                          border: '1px solid rgba(217, 159, 70, 0.4)',
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="pending_instagram">Pending IG DM</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="baking">In The Oven (Baking)</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <button
                        onClick={() => setSelectedReceipt(order)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '999px',
                          background: 'rgba(255,255,255,0.1)',
                          color: '#fbf5ed',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Inquiries Table */}
      {tab === 'inquiries' && (
        <div style={{
          background: 'rgba(251, 245, 237, 0.04)',
          borderRadius: '20px',
          border: '1px solid rgba(251, 245, 237, 0.12)',
          padding: '24px'
        }}>
          {inquiries.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '36px', color: 'rgba(251,245,237,0.6)' }}>
              No custom cake inquiries received yet.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {inquiries.map(inq => (
                <div key={inq.id} style={{
                  background: 'rgba(0,0,0,0.25)',
                  padding: '18px',
                  borderRadius: '14px',
                  border: '1px solid rgba(251,245,237,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <b>{inq.name}</b>
                    <span style={{ fontSize: '0.8rem', color: '#d99f46' }}>{inq.occasion}</span>
                  </div>
                  <p style={{ margin: '6px 0', fontSize: '0.92rem', opacity: 0.9 }}>{inq.message}</p>
                  <small style={{ color: 'rgba(251,245,237,0.6)' }}>
                    Contact: {inq.email || inq.phone || (inq.instagramHandle ? `@${inq.instagramHandle}` : 'None provided')}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'grid',
          placeItems: 'center',
          padding: '20px',
          zIndex: 100
        }}>
          <div style={{
            background: '#ffffff',
            color: '#140804',
            borderRadius: '20px',
            maxWidth: '560px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: "'Fraunces', serif" }}>
                Receipt: {selectedReceipt.id}
              </h3>
              <button
                onClick={() => setSelectedReceipt(null)}
                style={{ fontSize: '1.4rem', cursor: 'pointer', border: 0, background: 'none' }}
              >
                ✕
              </button>
            </div>
            <pre style={{
              background: '#f9f6f0',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '0.84rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              border: '1px dashed #c8833e'
            }}>
              {selectedReceipt.receiptText}
            </pre>
            <button
              onClick={() => setSelectedReceipt(null)}
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '12px',
                borderRadius: '999px',
                background: '#261107',
                color: '#ffffff',
                fontWeight: 700,
                border: 0,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
