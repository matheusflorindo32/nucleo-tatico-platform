import { z } from 'zod';
import validator from 'validator';

// Common validation schemas
export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .transform(val => val.toLowerCase().trim());

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .refine(
    (password) => /[A-Z]/.test(password),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (password) => /[a-z]/.test(password),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (password) => /[0-9]/.test(password),
    'Password must contain at least one number'
  )
  .refine(
    (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    'Password must contain at least one special character'
  );

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Name can only contain letters and spaces');

export const phoneSchema = z.string()
  .refine(
    (phone) => validator.isMobilePhone(phone, 'pt-BR'),
    'Invalid Brazilian phone number'
  )
  .transform(val => val.replace(/\D/g, ''));

export const cpfSchema = z.string()
  .refine(
    (cpf) => validator.isTaxID(cpf, 'pt-BR'),
    'Invalid Brazilian CPF'
  )
  .transform(val => val.replace(/\D/g, ''));

export const urlSchema = z.string()
  .refine(
    (url) => validator.isURL(url, { require_protocol: true }),
    'Invalid URL format'
  )
  .optional()
  .or(z.literal(''));

export const dateSchema = z.string()
  .refine(
    (date) => validator.isDate(date, { format: 'YYYY-MM-DD' }),
    'Invalid date format (YYYY-MM-DD required)'
  )
  .transform(val => new Date(val));

// User validation schemas
export const registerSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema,
    phone: phoneSchema.optional(),
    cpf: cpfSchema.optional(),
    birthDate: dateSchema.optional(),
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
    educationalLevel: z.string().max(100).optional(),
    occupation: z.string().max(100).optional(),
    studyGoals: z.string().max(500).optional(),
    studyTimePerWeek: z.number().int().min(0).max(168).optional(), // hours per week
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: nameSchema.optional(),
    phone: phoneSchema.optional(),
    bio: z.string().max(500).optional(),
    avatarUrl: urlSchema,
    educationalLevel: z.string().max(100).optional(),
    occupation: z.string().max(100).optional(),
    studyGoals: z.string().max(500).optional(),
    studyTimePerWeek: z.number().int().min(0).max(168).optional(),
    preferences: z.record(z.any()).optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  }).refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  ),
});

// Course validation schemas
export const createCourseSchema = z.object({
  body: z.object({
    title: z.string()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title must be less than 200 characters'),
    description: z.string()
      .min(10, 'Description must be at least 10 characters')
      .max(5000, 'Description must be less than 5000 characters')
      .optional(),
    shortDescription: z.string()
      .max(300, 'Short description must be less than 300 characters')
      .optional(),
    category: z.string()
      .min(1, 'Category is required')
      .max(100, 'Category must be less than 100 characters'),
    subcategory: z.string().max(100).optional(),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
    durationHours: z.number().int().min(1).max(1000).optional(),
    price: z.number().min(0).max(100000).optional(),
    currency: z.string().default('BRL'),
    thumbnailUrl: urlSchema,
    bannerUrl: urlSchema,
    videoPreviewUrl: urlSchema,
    prerequisites: z.array(z.string()).optional(),
  }),
});

export const updateCourseSchema = z.object({
  body: createCourseSchema.shape.body.partial(),
  params: z.object({
    id: z.string().cuid('Invalid course ID'),
  }),
});

export const courseQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
    minPrice: z.string().transform(val => parseFloat(val)).optional(),
    maxPrice: z.string().transform(val => parseFloat(val)).optional(),
    isPublished: z.string().transform(val => val === 'true').optional(),
    isFeatured: z.string().transform(val => val === 'true').optional(),
    search: z.string().optional(),
    page: z.string().transform(val => parseInt(val, 10)).default('1'),
    limit: z.string().transform(val => parseInt(val, 10)).default('20'),
    sortBy: z.enum(['title', 'price', 'createdAt', 'averageRating']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});

// Module validation schemas
export const createModuleSchema = z.object({
  body: z.object({
    title: z.string()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title must be less than 200 characters'),
    description: z.string().max(1000).optional(),
    order: z.number().int().min(0),
    estimatedDuration: z.number().int().min(1).max(1440).optional(), // minutes
    isLocked: z.boolean().default(false),
  }),
  params: z.object({
    courseId: z.string().cuid('Invalid course ID'),
  }),
});

// Lesson validation schemas
export const createLessonSchema = z.object({
  body: z.object({
    title: z.string()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title must be less than 200 characters'),
    content: z.record(z.any()), // Rich text content
    contentType: z.enum(['TEXT', 'VIDEO', 'AUDIO', 'INTERACTIVE', 'QUIZ', 'ASSIGNMENT']),
    order: z.number().int().min(0),
    duration: z.number().int().min(1).max(480).optional(), // minutes
    points: z.number().int().min(1).max(1000).default(10),
    videoUrl: urlSchema,
    audioUrl: urlSchema,
    attachments: z.array(z.record(z.any())).optional(),
    hasQuiz: z.boolean().default(false),
  }),
  params: z.object({
    moduleId: z.string().cuid('Invalid module ID'),
  }),
});

// Quiz validation schemas
export const createQuizSchema = z.object({
  body: z.object({
    title: z.string()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title must be less than 200 characters'),
    description: z.string().max(1000).optional(),
    timeLimit: z.number().int().min(30).max(3600).optional(), // seconds
    maxAttempts: z.number().int().min(1).max(10).default(3),
    passingScore: z.number().int().min(0).max(100).default(70),
  }),
});

export const createQuestionSchema = z.object({
  body: z.object({
    text: z.string()
      .min(5, 'Question text must be at least 5 characters')
      .max(1000, 'Question text must be less than 1000 characters'),
    type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY', 'MATCHING', 'FILL_IN_BLANK']),
    explanation: z.string().max(2000).optional(),
    options: z.array(
      z.object({
        id: z.string(),
        text: z.string().min(1, 'Option text is required'),
        isCorrect: z.boolean(),
      })
    ).min(2, 'At least 2 options are required')
    .refine(
      (options) => options.some(opt => opt.isCorrect),
      'At least one option must be correct'
    )
    .optional(),
    points: z.number().int().min(1).max(100).default(1),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']).default('MEDIUM'),
    tags: z.array(z.string()).optional(),
  }),
  params: z.object({
    quizId: z.string().cuid('Invalid quiz ID'),
  }),
});

// Progress validation schemas
export const updateProgressSchema = z.object({
  body: z.object({
    completed: z.boolean().optional(),
    progress: z.number().min(0).max(100).optional(),
    timeSpent: z.number().int().min(0).optional(), // seconds
    score: z.number().min(0).max(100).optional(),
  }),
  params: z.object({
    lessonId: z.string().cuid('Invalid lesson ID'),
  }),
});

// Enrollment validation schemas
export const enrollSchema = z.object({
  body: z.object({
    courseId: z.string().cuid('Invalid course ID'),
    role: z.enum(['STUDENT', 'INSTRUCTOR', 'ASSISTANT']).default('STUDENT'),
    pricePaid: z.number().min(0).optional(),
    currency: z.string().default('BRL'),
    paymentMethod: z.string().max(50).optional(),
    transactionId: z.string().max(100).optional(),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().optional(),
    expiresAt: z.string().datetime().optional(),
  }),
});

// Review validation schemas
export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5),
    title: z.string().max(200).optional(),
    content: z.string().max(2000).optional(),
  }),
  params: z.object({
    courseId: z.string().cuid('Invalid course ID'),
  }),
});

// Search validation schemas
export const searchSchema = z.object({
  query: z.object({
    q: z.string().min(1, 'Search query is required').max(200),
    type: z.enum(['courses', 'lessons', 'questions', 'users']).default('courses'),
    filters: z.string().optional(), // JSON string of filters
    page: z.string().transform(val => parseInt(val, 10)).default('1'),
    limit: z.string().transform(val => parseInt(val, 10)).default('20'),
  }),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.object({
    originalname: z.string(),
    mimetype: z.string(),
    size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  }),
});

// Export all schemas
export const validators = {
  // User
  register: registerSchema,
  login: loginSchema,
  updateProfile: updateProfileSchema,
  changePassword: changePasswordSchema,
  
  // Course
  createCourse: createCourseSchema,
  updateCourse: updateCourseSchema,
  courseQuery: courseQuerySchema,
  
  // Module
  createModule: createModuleSchema,
  
  // Lesson
  createLesson: createLessonSchema,
  
  // Quiz
  createQuiz: createQuizSchema,
  createQuestion: createQuestionSchema,
  
  // Progress
  updateProgress: updateProgressSchema,
  
  // Enrollment
  enroll: enrollSchema,
  
  // Review
  createReview: createReviewSchema,
  
  // Search
  search: searchSchema,
  
  // File upload
  fileUpload: fileUploadSchema,
  
  // Common schemas
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  phone: phoneSchema,
  cpf: cpfSchema,
  url: urlSchema,
  date: dateSchema,
};

// Helper function to validate Brazilian phone number
export const isValidBrazilianPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 11 || cleaned.length === 10;
};

// Helper function to validate CPF
export const isValidCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  
  // Check for known invalid CPFs
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  // Validate check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(10))) return false;
  
  return true;
};

// Export type inference helpers
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type CreateCourseInput = z.infer<typeof createCourseSchema>['body'];
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>['body'];
export type CourseQueryInput = z.infer<typeof courseQuerySchema>['query'];

export default validators;