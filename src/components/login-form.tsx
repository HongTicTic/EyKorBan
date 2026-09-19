import { useState, type FormEvent } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { AuthCard } from "@/components/auth-card"
import { PasswordInput } from "@/components/password-input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export interface LoginFormValues {
  email: string
  password: string
  keepSignedIn: boolean
}

interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => void
  signupHref?: string
  forgotPasswordHref?: string
  browseHref?: string
}

export function LoginForm({
  onSubmit,
  signupHref = "/signup",
  forgotPasswordHref = "/forgot-password",
  browseHref = "/",
}: LoginFormProps) {
  const [keepSignedIn, setKeepSignedIn] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    onSubmit?.({
      email: String(data.get("email")),
      password: String(data.get("password")),
      keepSignedIn,
    })
  }

  return (
    <AuthCard
      title="Sign in to continue"
      description="Your project stays tracked on the platform"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <a
            href={signupHref}
            className="font-medium text-primary hover:underline dark:text-rose-400"
          >
            Sign up as a client or freelancer
          </a>
        </>
      }
    >
      <form noValidate onSubmit={handleSubmit}>
        <FieldGroup className="gap-6">
          <Field>
            <FieldLabel htmlFor="login-email">Email address</FieldLabel>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              className="h-12 rounded-xl px-4"
            />
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <a
                href={forgotPasswordHref}
                className="text-sm font-medium text-primary hover:underline dark:text-rose-400"
              >
                Forgot password?
              </a>
            </div>
            <PasswordInput
              id="login-password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-12 rounded-xl px-4"
            />
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="login-keep-signed-in"
              checked={keepSignedIn}
              onCheckedChange={setKeepSignedIn}
            />
            <FieldLabel
              htmlFor="login-keep-signed-in"
              className="font-normal text-muted-foreground"
            >
              Keep me signed in
            </FieldLabel>
          </Field>

          <Button
            type="submit"
            className="h-12 w-full rounded-xl text-base font-semibold"
          >
            Sign in
            <ArrowRight data-icon="inline-end" />
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
