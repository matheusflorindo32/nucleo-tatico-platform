import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatting utilities
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

// Number formatting
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

export function formatCurrency(value: number, currency: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value)
}

// Progress and percentage
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0
  return Math.round((part / total) * 100)
}

export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return "bg-nucleo-success"
  if (percentage >= 50) return "bg-nucleo-warning"
  return "bg-nucleo-danger"
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-nucleo-success"
    case "medium":
      return "bg-nucleo-warning"
    case "hard":
      return "bg-nucleo-danger"
    case "expert":
      return "bg-nucleo-accent"
    default:
      return "bg-gray-500"
  }
}

// String utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidCPF(cpf: string): boolean {
  // Basic CPF validation (Brazilian ID)
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
  return cpfRegex.test(cpf)
}

export function isValidPhone(phone: string): boolean {
  // Brazilian phone format: (11) 99999-9999
  const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/
  return phoneRegex.test(phone)
}

// Array utilities
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// Local storage utilities
export function getLocalStorage(key: string, defaultValue: any = null): any {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error("Error removing from localStorage:", error)
  }
}

// API utilities
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = 10000
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

export function createApiUrl(path: string): string {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
}

// Education-specific utilities
export function calculateStudyPace(
  totalContent: number,
  availableTime: number
): number {
  // Returns estimated hours per week needed
  if (availableTime <= 0) return 0
  return Math.ceil(totalContent / availableTime)
}

export function estimateCompletionDate(
  startDate: Date,
  totalHours: number,
  weeklyHours: number
): Date {
  if (weeklyHours <= 0) return new Date(startDate)
  
  const weeksNeeded = Math.ceil(totalHours / weeklyHours)
  const completionDate = new Date(startDate)
  completionDate.setDate(completionDate.getDate() + weeksNeeded * 7)
  
  return completionDate
}

export function getMotivationalMessage(progress: number): string {
  if (progress >= 90) {
    return "🎉 Excelente! Você está quase lá!"
  }
  if (progress >= 70) {
    return "🚀 Continue assim! Ótimo progresso!"
  }
  if (progress >= 50) {
    return "💪 Metade do caminho percorrido!"
  }
  if (progress >= 30) {
    return "🔥 Bom começo! Mantenha o ritmo!"
  }
  if (progress > 0) {
    return "👏 Primeiros passos! Cada progresso conta!"
  }
  return "🎯 Hora de começar! Você consegue!"
}

// Performance utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Accessibility utilities
export function generateAriaLabel(
  elementType: string,
  description: string
): string {
  return `${elementType}: ${description}`
}

export function isKeyboardEvent(event: React.KeyboardEvent): boolean {
  return event.key === "Enter" || event.key === " "
}

// Export all utilities
export default {
  cn,
  formatDate,
  formatDateTime,
  formatTime,
  formatNumber,
  formatCurrency,
  calculatePercentage,
  getProgressColor,
  getDifficultyColor,
  truncateText,
  capitalizeFirstLetter,
  slugify,
  isValidEmail,
  isValidCPF,
  isValidPhone,
  shuffleArray,
  chunkArray,
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  fetchWithTimeout,
  createApiUrl,
  calculateStudyPace,
  estimateCompletionDate,
  getMotivationalMessage,
  debounce,
  throttle,
  generateAriaLabel,
  isKeyboardEvent,
}