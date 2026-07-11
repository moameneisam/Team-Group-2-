const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (!email?.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(email.trim())) return 'Enter a valid email address';
  return '';
}

export function validatePassword(password, minLength = 6) {
  if (!password) return 'Password is required';
  if (password.length < minLength) return `Password must be at least ${minLength} characters`;
  return '';
}

export function validateName(name) {
  if (!name?.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
}

export function validateGoal(goal) {
  if (!goal?.trim()) return 'Please describe your project goal';
  if (goal.trim().length < 10) return 'Goal must be at least 10 characters';
  return '';
}

export function validateRequired(value, fieldName = 'This field') {
  if (!value?.trim()) return `${fieldName} is required`;
  return '';
}
