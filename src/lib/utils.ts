import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateQRCode(qrCode: string): boolean {
  if (!qrCode || typeof qrCode !== 'string') {
    return false
  }
  
  const trimmedQR = qrCode.trim()
  return trimmedQR.length > 0 && trimmedQR.length <= 1000
}

export function validateStringLength(value: string, maxLength: number = 200): boolean {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength
}

// Error handling utilities
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
}

// Date utilities for Firestore timestamps
export function convertFirestoreTimestamp(timestamp: unknown): Date {
  if (
    timestamp &&
    typeof timestamp === 'object' &&
    'seconds' in (timestamp as Record<string, unknown>) &&
    typeof (timestamp as Record<string, unknown>).seconds === 'number'
  ) {
    return new Date((timestamp as { seconds: number }).seconds * 1000)
  }
  return timestamp instanceof Date ? timestamp : new Date(timestamp as string)
}

// Rate limiting utilities
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
} 