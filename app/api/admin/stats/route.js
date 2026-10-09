/* ==========================================================================
   GET /api/admin/stats — Admin Bakery Dashboard Metrics
   ========================================================================== */

import { handleApiErrors, successResponse, errorResponse, ErrorCodes } from '../../../../lib/api-response';
import { db } from '../../../../lib/db';
import { verifyAdminAuth } from '../../../../lib/security';

export const dynamic = 'force-dynamic';

export const GET = handleApiErrors(async (req) => {
  if (!verifyAdminAuth(req)) {
    return errorResponse('Unauthorized. Admin authentication required.', ErrorCodes.UNAUTHORIZED, 401);
  }

  const stats = db.getStats();
  return successResponse(stats);
});
