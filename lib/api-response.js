/* ==========================================================================
   BAKETALE — STANDARDIZED API RESPONSE & ERROR HANDLER
   Consistent JSON envelope, HTTP status mapping & error codes
   ========================================================================== */

import { NextResponse } from 'next/server';
import { logger } from './logger';

export const ErrorCodes = {
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
};

/**
 * Returns a standardized success response
 */
export function successResponse(data, status = 200, headers = {}) {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString()
    },
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
        ...headers
      }
    }
  );
}

/**
 * Returns a standardized error response
 */
export function errorResponse(message, code = ErrorCodes.BAD_REQUEST, status = 400, details = null, headers = {}) {
  logger.warn(`API Error response [${code} ${status}]: ${message}`, { details });

  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details
      },
      timestamp: new Date().toISOString()
    },
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
        ...headers
      }
    }
  );
}

/**
 * Higher-order wrapper to handle uncaught exceptions in Next.js route handlers
 */
export function handleApiErrors(handler) {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (err) {
      logger.error('Unhandled API exception', err, {
        url: req.url,
        method: req.method
      });

      return errorResponse(
        process.env.NODE_ENV === 'production'
          ? 'An internal server error occurred. Please try again or reach out on Instagram @baketalee.'
          : err.message || 'Internal Server Error',
        ErrorCodes.INTERNAL_ERROR,
        500,
        process.env.NODE_ENV !== 'production' ? { stack: err.stack } : null
      );
    }
  };
}
