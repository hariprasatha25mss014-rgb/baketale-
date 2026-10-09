/* ==========================================================================
   BAKETALE — SECURITY & VALIDATION ENGINE
   Sanitization, rate limiting, timing-safe authentication & price verification
   ========================================================================== */

import crypto from 'crypto';
import { FLAVOURS, SPECIALS, CAKES, EXTRAS, ADDONS, BOX_FLAVOURS } from './data';
import { logger } from './logger';

export const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'baketale-secret-2026';

/**
 * Escapes unsafe HTML characters to prevent XSS attacks
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Strips dangerous script and control characters
 */
export function sanitizeText(str, maxLength = 500) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // remove ASCII control chars
    .slice(0, maxLength);
}

/**
 * Validates customer Instagram handle
 */
export function sanitizeInstagramHandle(handle) {
  if (!handle || typeof handle !== 'string') return '';
  const cleaned = handle.trim().replace(/^@+/, '');
  // Instagram handles can only contain letters, numbers, periods, and underscores, max 30 chars
  if (/^[a-zA-Z0-9._]{1,30}$/.test(cleaned)) {
    return cleaned;
  }
  return '';
}

/**
 * Timing-safe string comparison to protect against timing attacks
 */
export function timingSafeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Perform dummy comparison to equalize timing
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verifies admin authentication header
 */
export function verifyAdminAuth(req) {
  const authHeader = req.headers.get('x-admin-key') || req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!authHeader) return false;
  return timingSafeCompare(authHeader, ADMIN_API_KEY);
}

/**
 * In-memory sliding window rate limiter
 */
const rateLimitStore = new Map();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // clean expired entries every 5 mins

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

/**
 * Check rate limit for an identifier (e.g. client IP)
 * @param {string} key Identifier (IP, route, etc.)
 * @param {number} maxRequests Maximum requests allowed in window
 * @param {number} windowMs Window duration in milliseconds (default: 60s)
 * @returns {{ allowed: boolean, remaining: number, resetTime: number }}
 */
export function checkRateLimit(key, maxRequests = 30, windowMs = 60 * 1000) {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };

  if (record.resetTime <= now) {
    // Window expired, reset
    record.count = 1;
    record.resetTime = now + windowMs;
    rateLimitStore.set(key, record);
    return { allowed: true, remaining: maxRequests - 1, resetTime: record.resetTime };
  }

  record.count += 1;
  rateLimitStore.set(key, record);

  const allowed = record.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - record.count);

  if (!allowed) {
    logger.security('Rate limit exceeded', { key, count: record.count, maxRequests });
  }

  return { allowed, remaining, resetTime: record.resetTime };
}

/**
 * Extracts client IP securely from NextRequest headers
 */
export function getClientIp(req) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

/**
 * Verifies and recalculates prices server-side to prevent client tampering.
 * NEVER trust prices sent from the client!
 */
export function verifyAndPriceItems(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  if (rawItems.length > 50) {
    throw new Error('Order exceeds maximum allowed item count');
  }

  const verifiedItems = [];
  let calculatedSubtotal = 0;

  for (const raw of rawItems) {
    const qty = parseInt(raw.qty, 10);
    if (isNaN(qty) || qty <= 0 || qty > 100) {
      throw new Error(`Invalid item quantity for item: ${raw.name || 'Unknown'}`);
    }

    const id = String(raw.id || '').trim();
    let unitPrice = 0;
    let verifiedName = String(raw.name || 'Brownie Item');
    let verifiedDetail = String(raw.detail || '');
    let itemMatched = false;

    // 1. Check Flavours (e.g. classic-250, nutella-500)
    for (const flavour of FLAVOURS) {
      if (id.startsWith(flavour.id)) {
        if (id.includes('-250')) {
          unitPrice = flavour.p[0];
          verifiedDetail = '250 g';
          verifiedName = `${flavour.name} Brownies`;
          itemMatched = true;
          break;
        } else if (id.includes('-500')) {
          unitPrice = flavour.p[1];
          verifiedDetail = '500 g';
          verifiedName = `${flavour.name} Brownies`;
          itemMatched = true;
          break;
        } else if (id.includes('-1000')) {
          unitPrice = flavour.p[2];
          verifiedDetail = '1 kg';
          verifiedName = `${flavour.name} Brownies`;
          itemMatched = true;
          break;
        }
      }
    }

    // 2. Check Specials & Bento Cakes
    if (!itemMatched) {
      const allSpecials = [...SPECIALS, ...CAKES];
      for (const spec of allSpecials) {
        if (id.startsWith(spec.name) || raw.name === spec.name) {
          for (const [optLabel, optPrice] of spec.opts) {
            if (id.includes(optLabel) || raw.detail === optLabel) {
              unitPrice = optPrice;
              verifiedName = spec.name;
              verifiedDetail = optLabel;
              itemMatched = true;
              break;
            }
          }
        }
        if (itemMatched) break;
      }
    }

    // 3. Check ₹150 Box
    if (!itemMatched && (id.startsWith('box-') || raw.name?.includes('Brownie Box (3 pcs)'))) {
      unitPrice = 150;
      verifiedName = 'Brownie Box (3 pcs)';
      itemMatched = true;
    }

    // 4. Check Extras & Add-ons
    if (!itemMatched) {
      for (const [extraName, extraPrice] of EXTRAS) {
        if (raw.name === extraName || id.includes(extraName)) {
          unitPrice = extraPrice;
          verifiedName = extraName;
          verifiedDetail = 'Extra';
          itemMatched = true;
          break;
        }
      }
    }

    if (!itemMatched) {
      for (const [addonName, addonPrice] of ADDONS) {
        if (raw.name === addonName || id.includes(addonName)) {
          unitPrice = addonPrice;
          verifiedName = addonName;
          verifiedDetail = 'Add-on';
          itemMatched = true;
          break;
        }
      }
    }

    // Fallback: If price is validated positive number and not matched, prevent arbitrary 0 or negative prices
    if (!itemMatched) {
      const clientPrice = Number(raw.price);
      if (isNaN(clientPrice) || clientPrice <= 0 || clientPrice > 50000) {
        throw new Error(`Unrecognized or invalid item: ${raw.name}`);
      }
      unitPrice = clientPrice;
    }

    const itemTotal = unitPrice * qty;
    calculatedSubtotal += itemTotal;

    verifiedItems.push({
      id: sanitizeText(id, 80),
      name: sanitizeText(verifiedName, 120),
      detail: sanitizeText(verifiedDetail, 80),
      price: unitPrice,
      qty,
      itemTotal,
      img: raw.img ? sanitizeText(raw.img, 200) : null
    });
  }

  return { verifiedItems, calculatedSubtotal };
}
