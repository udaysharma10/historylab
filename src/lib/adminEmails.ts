// Emails that automatically get teacher role and land on the dashboard.
// Add or remove emails here as needed.
export const ADMIN_TEACHER_EMAILS = [
  'nehaudaysharma@gmail.com',
  'uday@teknomatics.com',
]

export function isAdminTeacher(email: string | undefined | null): boolean {
  if (!email) return false
  return ADMIN_TEACHER_EMAILS.includes(email.toLowerCase())
}
