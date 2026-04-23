import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'nucleo-tatico-api' },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
          }`;
        })
      ),
    }),
    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Daily rotate transport for production
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d', // Keep logs for 14 days
    }),
  ],
});

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log request details
  const requestLog = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: (req as any).user?.id,
    body: sanitizeBody(req.body),
    query: req.query,
    params: req.params,
  };

  logger.debug('Incoming request', requestLog);

  // Capture response
  res.on('finish', () => {
    const duration = Date.now() - start;
    const responseLog = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('content-length'),
      userId: (req as any).user?.id,
    };

    // Log based on status code
    if (res.statusCode >= 500) {
      logger.error('Server error response', responseLog);
    } else if (res.statusCode >= 400) {
      logger.warn('Client error response', responseLog);
    } else {
      logger.info('Request completed', responseLog);
    }
  });

  next();
};

// Sanitize sensitive data from request body
const sanitizeBody = (body: any): any => {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body };
  const sensitiveFields = [
    'password',
    'passwordHash',
    'token',
    'accessToken',
    'refreshToken',
    'authorization',
    'creditCard',
    'cvv',
    'cpf',
    'ssn',
    'secret',
    'apiKey',
  ];

  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });

  return sanitized;
};

// Audit logging for security events
export const auditLogger = {
  login: (userId: string, success: boolean, ip: string, userAgent: string) => {
    logger.info('Login attempt', {
      event: 'login',
      userId,
      success,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  },

  logout: (userId: string, ip: string) => {
    logger.info('User logout', {
      event: 'logout',
      userId,
      ip,
      timestamp: new Date().toISOString(),
    });
  },

  passwordChange: (userId: string, ip: string) => {
    logger.info('Password changed', {
      event: 'password_change',
      userId,
      ip,
      timestamp: new Date().toISOString(),
    });
  },

  roleChange: (targetUserId: string, newRole: string, changedBy: string) => {
    logger.info('User role changed', {
      event: 'role_change',
      targetUserId,
      newRole,
      changedBy,
      timestamp: new Date().toISOString(),
    });
  },

  courseEnrollment: (userId: string, courseId: string, action: 'enroll' | 'unenroll') => {
    logger.info('Course enrollment', {
      event: 'course_enrollment',
      userId,
      courseId,
      action,
      timestamp: new Date().toISOString(),
    });
  },

  payment: (userId: string, amount: number, currency: string, status: string) => {
    logger.info('Payment processed', {
      event: 'payment',
      userId,
      amount,
      currency,
      status,
      timestamp: new Date().toISOString(),
    });
  },

  contentAccess: (userId: string, resourceType: string, resourceId: string, action: string) => {
    logger.info('Content access', {
      event: 'content_access',
      userId,
      resourceType,
      resourceId,
      action,
      timestamp: new Date().toISOString(),
    });
  },
};

// Performance logging
export const performanceLogger = {
  start: (operation: string): () => void => {
    const startTime = process.hrtime();
    
    return () => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const duration = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds
      
      logger.debug('Operation performance', {
        operation,
        duration: `${duration.toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
      });
    };
  },

  measure: async <T>(operation: string, fn: () => Promise<T>): Promise<T> => {
    const end = performanceLogger.start(operation);
    try {
      const result = await fn();
      end();
      return result;
    } catch (error) {
      end();
      throw error;
    }
  },
};

// Error logging helper
export const logError = (error: Error, context?: Record<string, any>) => {
  logger.error('Application error', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
    timestamp: new Date().toISOString(),
  });
};

// Database query logging (for Prisma)
export const prismaLogger = {
  query: (event: any) => {
    logger.debug('Database query', {
      event: 'prisma_query',
      query: event.query,
      params: event.params,
      duration: `${event.duration}ms`,
      timestamp: new Date().toISOString(),
    });
  },

  info: (message: string) => {
    logger.info('Database info', {
      event: 'prisma_info',
      message,
      timestamp: new Date().toISOString(),
    });
  },

  warn: (message: string) => {
    logger.warn('Database warning', {
      event: 'prisma_warn',
      message,
      timestamp: new Date().toISOString(),
    });
  },

  error: (message: string) => {
    logger.error('Database error', {
      event: 'prisma_error',
      message,
      timestamp: new Date().toISOString(),
    });
  },
};

// Health check logging
export const healthLogger = {
  system: (status: 'healthy' | 'unhealthy', details?: any) => {
    logger.info('System health check', {
      event: 'health_check',
      status,
      details,
      timestamp: new Date().toISOString(),
    });
  },

  database: (status: 'connected' | 'disconnected', latency?: number) => {
    logger.info('Database health check', {
      event: 'database_health',
      status,
      latency,
      timestamp: new Date().toISOString(),
    });
  },

  cache: (status: 'connected' | 'disconnected') => {
    logger.info('Cache health check', {
      event: 'cache_health',
      status,
      timestamp: new Date().toISOString(),
    });
  },
};

// Export logger instance for direct use
export default logger;