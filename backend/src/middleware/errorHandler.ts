import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for debugging
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    user: (req as any).user?.id,
  });

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error, res);
  }

  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid data provided',
      details: error.message,
    });
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      details: error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
  }

  // Handle custom AppError
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.constructor.name.replace('Error', ''),
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'Invalid authentication token',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired',
      message: 'Authentication token has expired',
    });
  }

  // Default error (500)
  const statusCode = 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : error.message;

  return res.status(statusCode).json({
    error: 'Internal Server Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError, res: Response) => {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const fields = (error.meta as any)?.target || ['field'];
      return res.status(409).json({
        error: 'Conflict',
        message: `A record with this ${fields.join(', ')} already exists`,
      });

    case 'P2003':
      // Foreign key constraint violation
      return res.status(400).json({
        error: 'Invalid Reference',
        message: 'The referenced record does not exist',
      });

    case 'P2025':
      // Record not found
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested record was not found',
      });

    case 'P2014':
      // Invalid ID
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided ID is invalid',
      });

    case 'P2000':
      // Value too long
      return res.status(400).json({
        error: 'Value Too Long',
        message: 'The provided value is too long for the field',
      });

    case 'P2001':
      // Record not found (where condition)
      return res.status(404).json({
        error: 'Not Found',
        message: 'No records found matching the criteria',
      });

    default:
      // Unknown Prisma error
      console.error('Unhandled Prisma error:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'An unexpected database error occurred',
        ...(process.env.NODE_ENV === 'development' && { code: error.code }),
      });
  }
};

// Utility function to handle async errors
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Validation helper
export const validateRequest = (schema: any) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      req.body = validatedData.body || req.body;
      req.query = validatedData.query || req.query;
      req.params = validatedData.params || req.params;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(new ValidationError('Validation failed'));
      }
    }
  });
};