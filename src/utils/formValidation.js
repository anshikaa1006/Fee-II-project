const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const upiPattern = /^[\w.-]+@[\w.-]+$/

export function validateRequired(value, label) {
  return value.trim() ? '' : `Please enter ${label}.`
}

export function validateEmail(value) {
  const requiredError = validateRequired(value, 'your email address')
  if (requiredError) return requiredError

  return emailPattern.test(value.trim()) ? '' : 'Please enter a valid email address.'
}

export function validateUpiId(value) {
  const requiredError = validateRequired(value, 'your UPI ID')
  if (requiredError) return requiredError

  return upiPattern.test(value.trim()) ? '' : 'Enter a valid demo UPI ID, such as demo@upi.'
}

export function validateDemoCode(value) {
  const requiredError = validateRequired(value, 'the demo approval code')
  if (requiredError) return requiredError

  return value.trim().toUpperCase() === 'VIBE-DEMO'
    ? ''
    : 'Enter the demo approval code VIBE-DEMO.'
}
