/* ==========================================================================
   POST /api/orders  — Place & secure new order
   GET  /api/orders  — (Admin) List orders with pagination & status filter
   ========================================================================== */

import { handleApiErrors, successResponse, errorResponse, ErrorCodes } from '../../../lib/api-response';
import { db } from '../../../lib/db';
import {
  sanitizeText,
  sanitizeInstagramHandle,
  verifyAndPriceItems,
  checkRateLimit,
  getClientIp,
  verifyAdminAuth
} from '../../../lib/security';
import { logger } from '../../../lib/logger';

export const dynamic = 'force-dynamic';

export const POST = handleApiErrors(async (req) => {
  const ip = getClientIp(req);

  // Rate Limiting: Max 10 order attempts per 10 minutes per IP
  const rateLimit = checkRateLimit(`order_${ip}`, 10, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return errorResponse(
      'Too many order requests. Please wait a few moments before trying again, or reach out directly on Instagram @baketalee.',
      ErrorCodes.RATE_LIMITED,
      429,
      { retryAfterMs: rateLimit.resetTime - Date.now() },
      { 'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)) }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return errorResponse('Invalid JSON payload in request body', ErrorCodes.BAD_REQUEST, 400);
  }

  // Validate Customer Inputs
  const rawName = body?.customer?.name || body?.name;
  const rawAddress = body?.customer?.address || body?.address;
  const rawInsta = body?.customer?.instagramHandle || body?.instaHandle || body?.instagramHandle;
  const rawNote = body?.customer?.note || body?.note;
  const rawItems = body?.items;

  const name = sanitizeText(rawName, 100);
  const address = sanitizeText(rawAddress, 300);
  const instagramHandle = sanitizeInstagramHandle(rawInsta);
  const note = sanitizeText(rawNote, 400);

  if (!name || name.length < 2) {
    return errorResponse('Please provide a valid full name (minimum 2 characters)', ErrorCodes.VALIDATION_ERROR, 400);
  }

  if (!address || address.length < 5) {
    return errorResponse('Please provide a complete delivery address with city and pincode', ErrorCodes.VALIDATION_ERROR, 400);
  }

  if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
    return errorResponse('Your order must include at least one item from the menu', ErrorCodes.VALIDATION_ERROR, 400);
  }

  // Verify Items & Compute Tamper-Proof Server-Side Prices
  let verifiedItems, calculatedSubtotal;
  try {
    const priced = verifyAndPriceItems(rawItems);
    verifiedItems = priced.verifiedItems;
    calculatedSubtotal = priced.calculatedSubtotal;
  } catch (err) {
    logger.warn('Price or item validation failed', { error: err.message, ip });
    return errorResponse(err.message, ErrorCodes.VALIDATION_ERROR, 400);
  }

  if (calculatedSubtotal <= 0) {
    return errorResponse('Order subtotal must be greater than zero', ErrorCodes.VALIDATION_ERROR, 400);
  }

  // Persist Order into Database
  const order = db.createOrder({
    customer: {
      name,
      address,
      instagramHandle: instagramHandle || null,
      note: note || null,
      ip
    },
    items: verifiedItems,
    subtotal: calculatedSubtotal
  });

  return successResponse(
    {
      orderId: order.id,
      dateStr: order.dateStr,
      customerName: order.customer.name,
      subtotal: order.subtotal,
      currency: order.currency,
      itemCount: order.items.reduce((s, c) => s + c.qty, 0),
      items: order.items,
      receiptText: order.receiptText,
      instagramDmUrl: order.instagramDmUrl,
      status: order.status
    },
    201
  );
});

export const GET = handleApiErrors(async (req) => {
  // Admin Protected
  if (!verifyAdminAuth(req)) {
    return errorResponse('Unauthorized. Admin authentication required.', ErrorCodes.UNAUTHORIZED, 401);
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
  const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10));
  const status = searchParams.get('status') || null;

  const result = db.listOrders({ limit, offset, status });
  return successResponse(result);
});
