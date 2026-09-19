const enum RoleName {
  CLIENT = "CLIENT",
  FREELANCER = "FREELANCER",
  ADMIN = "ADMIN",
}
interface User {
  userId: string
  name: string
  username?: string
  role: RoleName
  email: string
  avatarUrl?: string
  status: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION"
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}


// interface UserCredentials {
//   userId: string
//   passwordHash: string
// }

interface FreelancerProfile {
  userId: string
  username: string
  tagline?: string
  bio?: string
  skills: string[]
  hourlyRate?: number
  currency: string
  publicProfileEnabled: boolean
  socialLinks?: { website?: string; linkedin?: string; github?: string }
}

interface ClientProfile {
  userId: string
  companyName?: string
  billingAddress?: string
  linkedFreelancerId: string
  notes?: string
}