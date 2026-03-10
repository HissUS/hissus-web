// Shared regex patterns — must be kept in sync with Jakarta Bean Validation on backend
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
export const PHONE_REGEX = /^\+?[\d\s\-()]{8,20}$/
