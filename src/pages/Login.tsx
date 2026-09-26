import { useState } from "react"
import { useLocation, useNavigate } from "react-router"

import { useAuth } from "@/components/auth-provider"
import { LoginForm, type LoginFormValues } from "@/components/login-form"

interface LocationState {
  from?: string
}

const Login = () => {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // RequireAuth stores the page they were trying to reach.
  const from = (location.state as LocationState | null)?.from ?? "/"
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(values: LoginFormValues) {
    setIsSubmitting(true)
    setError(null)

    try {
      await signIn(values.email, values.password)
      navigate(from, { replace: true })
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not sign in. Please try again."
      )
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/50 px-4 py-12">
      <LoginForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />
    </main>
  )
}

export default Login
