import { useState, type FormEvent } from "react"
import { ArrowLeft, ArrowRight, Briefcase, Palette } from "lucide-react"

import { AuthCard } from "@/components/auth-card"
import { PasswordInput } from "@/components/password-input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { RoleName } from "@/interface/user"

type SignupRole = RoleName.CLIENT | RoleName.FREELANCER

export interface SignupFormValues {
  role: SignupRole
  name: string
  email: string
  password: string
}

interface SignupFormProps {
  onSubmit?: (values: SignupFormValues) => void
  /** Disables the form and shows a spinner while the request is in flight. */
  isSubmitting?: boolean
  /** Message shown above the submit button when signup fails. */
  error?: string | null
  defaultRole?: SignupRole
  loginHref?: string
  termsHref?: string
  privacyHref?: string
  browseHref?: string
}

const roleOptions = [
  {
    value: RoleName.CLIENT,
    title: "Client",
    description: "Hire creatives",
    icon: Briefcase,
  },
  {
    value: RoleName.FREELANCER,
    title: "Freelancer",
    description: "Showcase & find work",
    icon: Palette,
  },
] as const

export function SignupForm({
  onSubmit,
  isSubmitting = false,
  error = null,
  defaultRole = RoleName.CLIENT,
  loginHref = "/login",
  termsHref = "/terms",
  privacyHref = "/privacy",
  browseHref = "/",
}: SignupFormProps) {
  const [role, setRole] = useState<SignupRole>(defaultRole)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const data = new FormData(event.currentTarget)
    onSubmit?.({
      role,
      name: String(data.get("name")),
      email: String(data.get("email")),
      password: String(data.get("password")),
    })
  }

  return (
    <AuthCard
      title="Create your account"
      description="Start projects and keep every step on the platform"
      footer={
        <>
          Already have an account?{" "}
          <a
            href={loginHref}
            className="font-medium text-primary hover:underline dark:text-rose-400"
          >
            Sign in
          </a>
        </>
      }
    >
      <form noValidate onSubmit={handleSubmit}>
        <FieldGroup className="gap-6">
          <FieldSet className="gap-0">
            <FieldLegend variant="label">I want to join as</FieldLegend>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer flex-col gap-1 rounded-xl border border-input bg-input/30 p-3.5 transition-colors hover:bg-input/50 has-checked:border-primary has-checked:bg-primary/5 has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={role === option.value}
                    onChange={() => setRole(option.value)}
                    className="sr-only"
                  />
                  <option.icon className="mb-1 size-5 text-primary dark:text-rose-400" />
                  <span className="text-sm font-medium">{option.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </label>
              ))}
            </div>
          </FieldSet>

          <Field>
            <FieldLabel htmlFor="signup-name">Full name</FieldLabel>
            <Input
              id="signup-name"
              name="name"
              autoComplete="name"
              placeholder="Mira Renko"
              className="h-12 rounded-xl px-4"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="signup-email">Email address</FieldLabel>
            <Input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              className="h-12 rounded-xl px-4"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="signup-password">Password</FieldLabel>
            <PasswordInput
              id="signup-password"
              name="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="h-12 rounded-xl px-4"
            />
          </Field>

          <Field orientation="horizontal" className="items-start">
            <Checkbox id="signup-terms" className="mt-0.5" />
            <FieldLabel
              htmlFor="signup-terms"
              className="block leading-relaxed font-normal text-muted-foreground"
            >
              I agree to the{" "}
              <a
                href={termsHref}
                className="text-primary hover:underline dark:text-rose-400"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href={privacyHref}
                className="text-primary hover:underline dark:text-rose-400"
              >
                Privacy Policy
              </a>
            </FieldLabel>
          </Field>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl text-base font-semibold"
          >
            {isSubmitting ? (
              <>
                <Spinner data-icon="inline-start" />
                Creating account…
              </>
            ) : (
              <>
                Create account
                <ArrowRight data-icon="inline-end" />
              </>
            )}
          </Button>

          <a
            href={browseHref}
            className="mx-auto flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Browse without an account
          </a>
        </FieldGroup>
      </form>
    </AuthCard>
  )
}
