import { LoginForm } from "@/components/login-form"

const Login = () => {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/50 px-4 py-12">
      <LoginForm onSubmit={() => window.location.assign("/")} />
    </main>
  )
}

export default Login
