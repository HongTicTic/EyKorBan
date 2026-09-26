import { useState } from "react"
import { Link, useNavigate } from "react-router"

import { useAuth } from "@/components/auth-provider"
import { SignupForm, type SignupFormValues } from "@/components/signup-form"

const Signup = () => {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(
    null
  )

  async function handleSubmit(values: SignupFormValues) {
    setIsSubmitting(true)
    setError(null)

    try {
      const { needsEmailConfirmation } = await signUp({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      })

      if (needsEmailConfirmation) {
        setConfirmationEmail(values.email)
        setIsSubmitting(false)
        return
      }

      navigate("/", { replace: true })
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not create your account. Please try again."
      )
      setIsSubmitting(false)
    }
  }

  if (confirmationEmail) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-muted/50 px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xs">
          <h1 className="text-xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a confirmation link to{" "}
            <span className="font-medium text-foreground">
              {confirmationEmail}
            </span>
            . Open it to finish setting up your account, then sign in.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline dark:text-rose-400"
          >
            Go to sign in
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/50 px-4 py-12">
      <SignupForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />
    </main>
  )
}

export default Signup
