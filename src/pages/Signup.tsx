import { SignupForm } from "@/components/signup-form"

const Signup = () => {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/50 px-4 py-12">
      <SignupForm onSubmit={() => window.location.assign("/")} />
    </main>
  )
}

export default Signup
