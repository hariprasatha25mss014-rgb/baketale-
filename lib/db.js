/* ==========================================================================
   BAKETALE — ATOMIC FILE-BASED PERSISTENT DATABASE
   Safe persistent storage for orders, inquiries, and bakery metrics
   ========================================================================== */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { rupee, INSTAGRAM_ID, INSTAGRAM_DM_URL } from './data';
import { logger } from './logger';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// Ensure database files exist
function ensureDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf8');
    }
    if (!fs.existsSync(INQUIRIES_FILE)) {
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), 'utf8');
    }
  } catch (err) {
    logger.error('Failed to initialize database files', err);
  }
}

// Atomic file write using temporary file and rename to avoid corruption
function writeJsonAtomic(filePath, data) {
  const tempPath = `${filePath}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch {}
    }
    throw err;
  }
}

function readJsonSafe(filePath, fallback = []) {
  ensureDb();
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    logger.error(`Error reading database file: ${filePath}`, err);
    return fallback;
  }
}

/**
 * Generates unique readable Order ID: e.g. #BT-5824
 */
export function generateOrderId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `#BT-${randomNum}`;
}

/**
 * Generates itemized receipt text for Instagram DM
 */
export function buildReceiptText({ orderId, dateStr, customer, items, subtotal }) {
  const lines = [
    `✨ NEW BAKETALE ORDER • ${orderId}`,
    `Date: ${dateStr}`,
    '------------------------------------',
    `👤 Customer: ${customer.name}`,
    customer.instagramHandle ? `📱 Instagram: @${customer.instagramHandle}` : null,
    `📍 Delivery Address: ${customer.address}`,
    customer.note ? `📝 Special Note: ${customer.note}` : null,
    '------------------------------------',
    '📦 Order Items:',
    ...items.map(
      item => `  • ${item.qty} × ${item.name}${item.detail ? ' (' + item.detail + ')' : ''} — ${rupee(item.itemTotal || item.price * item.qty)}`
    ),
    '------------------------------------',
    `💰 Subtotal: ${rupee(subtotal)}`,
    '🚚 Shipping: Calculated on Instagram based on delivery address',
    '------------------------------------',
    `💬 Direct Confirmation to @${INSTAGRAM_ID} on Instagram. We look forward to baking for you! ♡`
  ].filter(Boolean);

  return lines.join('\n');
}

export const db = {
  // Orders
  createOrder(orderData) {
    ensureDb();
    const orders = readJsonSafe(ORDERS_FILE, []);

    const orderId = orderData.orderId || generateOrderId();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const receiptText = buildReceiptText({
      orderId,
      dateStr,
      customer: orderData.customer,
      items: orderData.items,
      subtotal: orderData.subtotal
    });

    const newOrder = {
      id: orderId,
      customer: orderData.customer,
      items: orderData.items,
      subtotal: orderData.subtotal,
      currency: 'INR',
      status: 'pending_instagram', // pending_instagram | confirmed | baking | out_for_delivery | delivered | cancelled
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      dateStr,
      receiptText,
      instagramDmUrl: INSTAGRAM_DM_URL
    };

    orders.unshift(newOrder); // newest first
    writeJsonAtomic(ORDERS_FILE, orders);

    logger.info(`Order created successfully: ${orderId}`, {
      orderId,
      customerName: orderData.customer.name,
      subtotal: orderData.subtotal,
      itemCount: orderData.items.length
    });

    return newOrder;
  },

  getOrderById(id) {
    const orders = readJsonSafe(ORDERS_FILE, []);
    const cleanId = id.startsWith('#') ? id : `#${id}`;
    return orders.find(o => o.id.toLowerCase() === cleanId.toLowerCase() || o.id.toLowerCase() === id.toLowerCase()) || null;
  },

  listOrders({ limit = 50, offset = 0, status = null } = {}) {
    let orders = readJsonSafe(ORDERS_FILE, []);
    if (status) {
      orders = orders.filter(o => o.status === status);
    }
    const total = orders.length;
    const paginated = orders.slice(offset, offset + limit);
    return { orders: paginated, total, limit, offset };
  },

  updateOrderStatus(id, newStatus) {
    const allowedStatuses = ['pending_instagram', 'confirmed', 'baking', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(newStatus)) {
      throw new Error(`Invalid order status: ${newStatus}`);
    }

    const orders = readJsonSafe(ORDERS_FILE, []);
    const cleanId = id.startsWith('#') ? id : `#${id}`;
    const index = orders.findIndex(o => o.id.toLowerCase() === cleanId.toLowerCase() || o.id.toLowerCase() === id.toLowerCase());

    if (index === -1) {
      return null;
    }

    orders[index].status = newStatus;
    orders[index].updatedAt = new Date().toISOString();
    writeJsonAtomic(ORDERS_FILE, orders);

    logger.info(`Order ${id} status updated to: ${newStatus}`);
    return orders[index];
  },

  // Inquiries
  createInquiry(inquiryData) {
    ensureDb();
    const inquiries = readJsonSafe(INQUIRIES_FILE, []);
    const newInquiry = {
      id: `INQ-${Date.now().toString(36).toUpperCase()}`,
      name: inquiryData.name,
      email: inquiryData.email || null,
      phone: inquiryData.phone || null,
      instagramHandle: inquiryData.instagramHandle || null,
      occasion: inquiryData.occasion || 'General Inquiry',
      message: inquiryData.message,
      createdAt: new Date().toISOString()
    };
    inquiries.unshift(newInquiry);
    writeJsonAtomic(INQUIRIES_FILE, inquiries);
    return newInquiry;
  },

  listInquiries() {
    return readJsonSafe(INQUIRIES_FILE, []);
  },

  // Analytics & Stats
  getStats() {
    const orders = readJsonSafe(ORDERS_FILE, []);
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.subtotal || 0), 0);

    const statusCounts = {
      pending_instagram: 0,
      confirmed: 0,
      baking: 0,
      out_for_delivery: 0,
      delivered: 0,
      cancelled: 0
    };

    orders.forEach(o => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      }
    });

    return {
      totalOrders,
      totalRevenue,
      statusCounts,
      recentOrders: orders.slice(0, 10)
    };
  }
};
