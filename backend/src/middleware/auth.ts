import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { AuthenticationError, AuthorizationError } from './errorHandler';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No authentication token provided');
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new AuthenticationError('Invalid token format');
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'nucleo_jwt_secret_2026_change_in_production'
    ) as JwtPayload;

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        emailVerified: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new AuthenticationError('User no longer exists');
    }

    // Check if email is verified (optional, based on requirements)
    if (process.env.REQUIRE_EMAIL_VERIFICATION === 'true' && !user.emailVerified) {
      throw new AuthenticationError('Email not verified');
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Update last login time (non-blocking)
    prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    }).catch(console.error);

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AuthenticationError('Token expired'));
    } else {
      next(error);
    }
  }
};

// Role-based authorization middleware
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AuthorizationError(
        `Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      ));
    }

    next();
  };
};

// Permission check for resource ownership
export const requireOwnership = (resourceType: string, idParam: string = 'id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }

    // Admins can access everything
    if (req.user.role === 'ADMIN') {
      return next();
    }

    const resourceId = req.params[idParam];
    
    if (!resourceId) {
      return next(new Error('Resource ID not found in request'));
    }

    try {
      let isOwner = false;

      switch (resourceType) {
        case 'user':
          // Users can only access their own profile
          isOwner = req.user.id === resourceId;
          break;

        case 'enrollment':
          // Check if user owns this enrollment
          const enrollment = await prisma.enrollment.findUnique({
            where: { id: resourceId },
            select: { userId: true },
          });
          isOwner = enrollment?.userId === req.user.id;
          break;

        case 'progress':
          // Check if user owns this progress record
          const progress = await prisma.userProgress.findUnique({
            where: { id: resourceId },
            select: { userId: true },
          });
          isOwner = progress?.userId === req.user.id;
          break;

        case 'submission':
          // Check if user owns this submission
          const submission = await prisma.submission.findUnique({
            where: { id: resourceId },
            select: { userId: true },
          });
          isOwner = submission?.userId === req.user.id;
          break;

        case 'review':
          // Check if user owns this review
          const review = await prisma.review.findUnique({
            where: { id: resourceId },
            select: { userId: true },
          });
          isOwner = review?.userId === req.user.id;
          break;

        default:
          return next(new Error(`Unknown resource type: ${resourceType}`));
      }

      if (!isOwner && req.user.role !== 'INSTRUCTOR') {
        return next(new AuthorizationError(
          `You don't have permission to access this ${resourceType}`
        ));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Instructor-specific middleware
export const instructorOrAdmin = requireRole('INSTRUCTOR', 'ADMIN');

// Admin-only middleware
export const adminOnly = requireRole('ADMIN');

// Student-only middleware
export const studentOnly = requireRole('STUDENT');

// Generate JWT token
export const generateToken = (user: { id: string; email: string; role: string }) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'nucleo_jwt_secret_2026_change_in_production',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// Generate refresh token
export const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'nucleo_refresh_secret_2026_change_in_production',
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    }
  );
};

// Verify refresh token
export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || 'nucleo_refresh_secret_2026_change_in_production'
  ) as { userId: string };
};

// Rate limiting for authentication endpoints
import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Password strength validation
export const validatePasswordStrength = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return errors;
};