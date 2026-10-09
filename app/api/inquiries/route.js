/* ==========================================================================
   POST /api/inquiries  — Submit custom cake or bulk inquiry
   GET  /api/inquiries  — (Admin) List inquiries
   ========================================================================== */

import { handleApiErrors, successResponse, errorResponse, ErrorCodes } from '../../../lib/api-response';
import { db } from '../../../lib/db';
import {
  sanitizeText,
  sanitizeInstagramHandle,
  checkRateLimit,
  getClientIp,
  verifyAdminAuth
} from '../../../lib/security';

export const dynamic = 'force-dynamic';

export const POST = handleApiErrors(async (req) => {
  const ip = getClientIp(req);

  // Rate Limiting: 5 inquiries / 10 min
  const rateLimit = checkRateLimit(`inq_${ip}`, 5, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return errorResponse('Too many inquiries submitted. Please reach out directly on Instagram @baketalee.', ErrorCodes.RATE_LIMITED, 429);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return errorResponse('Invalid JSON body', ErrorCodes.BAD_REQUEST, 400);
  }

  const name = sanitizeText(body?.name, 80);
  const email = sanitizeText(body?.email, 120);
  const phone = sanitizeText(body?.phone, 30);
  const instagramHandle = sanitizeInstagramHandle(body?.instagramHandle);
  const occasion = sanitizeText(body?.occasion, 100);
  const message = sanitizeText(body?.message, 1000);

  if (!name || name.length < 2) {
    return errorResponse('Please provide your name', ErrorCodes.VALIDATION_ERROR, 400);
  }

  if (!message || message.length < 5) {
    return errorResponse('Please provide details regarding your inquiry or customisation', ErrorCodes.VALIDATION_ERROR, 400);
  }

  const inquiry = db.createInquiry({
    name,
    email: email || null,
    phone: phone || null,
    instagramHandle: instagramHandle || null,
    occasion: occasion || 'Custom Order Inquiry',
    message
  });

  return successResponse(
    {
      inquiryId: inquiry.id,
      message: 'Inquiry received! We will respond promptly via Instagram @baketalee.'
    },
    201
  );
});

export const GET = handleApiErrors(async (req) => {
  if (!verifyAdminAuth(req)) {
    return errorResponse('Unauthorized. Admin authentication required.', ErrorCodes.UNAUTHORIZED, 401);
  }

  const inquiries = db.listInquiries();
  return successResponse(inquiries);
});
