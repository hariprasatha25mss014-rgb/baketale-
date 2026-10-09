/* ==========================================================================
   GET   /api/orders/[id] — Retrieve public order status
   PATCH /api/orders/[id] — (Admin) Update order fulfillment status
   ========================================================================== */

import { handleApiErrors, successResponse, errorResponse, ErrorCodes } from '../../../../lib/api-response';
import { db } from '../../../../lib/db';
import { verifyAdminAuth, checkRateLimit, getClientIp } from '../../../../lib/security';

export const dynamic = 'force-dynamic';

export const GET = handleApiErrors(async (req, { params }) => {
  const ip = getClientIp(req);
  const id = params?.id;

  // Rate Limiting: 30 lookups / min
  const rateLimit = checkRateLimit(`lookup_${ip}`, 30, 60 * 1000);
  if (!rateLimit.allowed) {
    return errorResponse('Too many lookup requests', ErrorCodes.RATE_LIMITED, 429);
  }

  if (!id) {
    return errorResponse('Order ID is required', ErrorCodes.BAD_REQUEST, 400);
  }

  const order = db.getOrderById(id);
  if (!order) {
    return errorResponse(`Order ${id} not found`, ErrorCodes.NOT_FOUND, 404);
  }

  // Return public order details (without sensitive IP)
  return successResponse({
    id: order.id,
    dateStr: order.dateStr,
    status: order.status,
    customerName: order.customer.name,
    itemCount: order.items.reduce((s, c) => s + c.qty, 0),
    subtotal: order.subtotal,
    currency: order.currency,
    receiptText: order.receiptText,
    instagramDmUrl: order.instagramDmUrl,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  });
});

export const PATCH = handleApiErrors(async (req, { params }) => {
  // Admin Protected
  if (!verifyAdminAuth(req)) {
    return errorResponse('Unauthorized. Admin authentication required.', ErrorCodes.UNAUTHORIZED, 401);
  }

  const id = params?.id;
  if (!id) {
    return errorResponse('Order ID is required', ErrorCodes.BAD_REQUEST, 400);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return errorResponse('Invalid JSON body', ErrorCodes.BAD_REQUEST, 400);
  }

  const newStatus = body?.status;
  if (!newStatus) {
    return errorResponse('New status is required', ErrorCodes.BAD_REQUEST, 400);
  }

  try {
    const updated = db.updateOrderStatus(id, newStatus);
    if (!updated) {
      return errorResponse(`Order ${id} not found`, ErrorCodes.NOT_FOUND, 404);
    }
    return successResponse({
      message: `Order ${id} status updated to ${newStatus}`,
      order: updated
    });
  } catch (err) {
    return errorResponse(err.message, ErrorCodes.BAD_REQUEST, 400);
  }
});
