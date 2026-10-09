/* ==========================================================================
   BAKETALE — SERVER LOGGING UTILITY
   Structured logging with security redaction and log levels
   ========================================================================== */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  SECURITY: 4
};

const CURRENT_LEVEL = process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;

function formatTimestamp() {
  return new Date().toISOString();
}

function sanitizeLogData(data) {
  if (!data) return data;
  if (typeof data !== 'object') return data;

  const clone = Array.isArray(data) ? [...data] : { ...data };

  // Redact potentially sensitive fields
  const sensitiveKeys = ['password', 'secret', 'token', 'adminKey', 'creditCard'];
  for (const key of Object.keys(clone)) {
    if (sensitiveKeys.some(s => key.toLowerCase().includes(s.toLowerCase()))) {
      clone[key] = '***REDACTED***';
    } else if (typeof clone[key] === 'object') {
      clone[key] = sanitizeLogData(clone[key]);
    }
  }

  return clone;
}

export const logger = {
  debug(message, meta = {}) {
    if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
      console.debug(`[${formatTimestamp()}] [DEBUG] ${message}`, sanitizeLogData(meta));
    }
  },

  info(message, meta = {}) {
    if (CURRENT_LEVEL <= LOG_LEVELS.INFO) {
      console.log(`[${formatTimestamp()}] [INFO] ${message}`, sanitizeLogData(meta));
    }
  },

  warn(message, meta = {}) {
    if (CURRENT_LEVEL <= LOG_LEVELS.WARN) {
      console.warn(`[${formatTimestamp()}] [WARN] ${message}`, sanitizeLogData(meta));
    }
  },

  error(message, error = null, meta = {}) {
    if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) {
      console.error(`[${formatTimestamp()}] [ERROR] ${message}`, {
        errorMessage: error?.message || error,
        stack: process.env.NODE_ENV !== 'production' ? error?.stack : undefined,
        ...sanitizeLogData(meta)
      });
    }
  },

  security(message, meta = {}) {
    console.warn(`[${formatTimestamp()}] [SECURITY ALERT] 🚨 ${message}`, sanitizeLogData(meta));
  }
};
