import * as React from "react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { AppIcon } from "@/components/app-icon"

export function App() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "d" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setIsDark((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 bg-background text-foreground transition-colors duration-200">
      <div className="flex max-w-lg min-w-0 flex-col items-center gap-8 text-center text-sm leading-loose">
        {/* Branding Showcase Card */}
        <div className="flex items-center gap-6 p-6 rounded-3xl bg-card border shadow-sm">
          <AppIcon className="size-16 shrink-0" />
          <div className="h-12 w-px bg-border" />
          <Logo className="h-11 w-auto" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">EyKorBan Ready</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Anything is possible. Your creative & freelance project platform is initialized.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <Button>Explore Projects</Button>
            <Button
              variant="outline"
              onClick={() => setIsDark((prev) => !prev)}
            >
              Toggle {isDark ? "Light" : "Dark"} Mode
            </Button>
          </div>
        </div>

        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd className="px-1.5 py-0.5 rounded bg-muted border font-semibold">d</kbd> or click button above to toggle theme)
        </div>
      </div>
    </div>
  )
}

export default App
