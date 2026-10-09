/* ==========================================================================
   GET /api/health — System health check & diagnostics
   ========================================================================== */

import { successResponse } from '../../../lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  const memory = process.memoryUsage();

  return successResponse({
    status: 'healthy',
    service: 'Baketale Artisanal Atelier Engine',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    system: {
      nodeVersion: process.version,
      memory: {
        heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
        rssMb: Math.round(memory.rss / 1024 / 1024)
      }
    }
  });
}
