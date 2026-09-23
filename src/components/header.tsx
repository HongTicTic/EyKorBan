import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { Search, LogOut, Menu, X, Sun, Moon } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { useTheme } from "@/components/theme-provider"
import { Logo } from "@/components/logo"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/format"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Explore", href: "/" },
  { label: "Hire Creatives", href: "/hire-creatives" },
  { label: "Find Work", href: "/find-work" },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  // Reading the router's location keeps the active-link underline correct after
  // a client-side navigation; window.location.pathname never re-rendered.
  const currentPath = useLocation().pathname
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 shadow-xs backdrop-blur-md transition-colors">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex max-w-xl flex-1 items-center gap-6 md:gap-8">
          <Link
            to="/"
            className="group flex shrink-0 items-center no-underline outline-none"
          >
            <Logo className="h-7 transition-transform group-hover:scale-105" />
          </Link>

          <div className="relative hidden w-full max-w-md sm:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
              <Search className="size-4" />
            </div>
            <Input
              type="text"
              placeholder="Search inspiration, design styles, creators..."
              className="h-9 w-full rounded-lg border-border/70 bg-muted/40 pr-12 pl-9 text-sm transition-all placeholder:text-muted-foreground/70 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
              <kbd className="rounded border border-border/60 bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex lg:gap-7">
          {navLinks.map((link) => {
            const isActive = currentPath === link.href
            return (
              <Link
                key={link.label}
                to={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`pb-1 text-sm transition-colors ${
                  isActive
                    ? "border-b-2 border-primary font-medium text-foreground"
                    : "font-normal text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {isDark ? (
              <Sun className="size-4 text-amber-500 transition-transform" />
            ) : (
              <Moon className="size-4 transition-transform" />
            )}
          </button>
          {/* The notifications bell was removed: it showed a permanent unread
              dot and was wired to nothing. */}

          {user ? (
            <>
              <Link
                to="/profile"
                aria-label="Your profile"
                aria-current={currentPath === "/profile" ? "page" : undefined}
                className={`ml-0.5 cursor-pointer rounded-full p-0.5 ring-1 transition-all hover:ring-primary ${
                  currentPath === "/profile" ? "ring-primary" : "ring-border"
                }`}
              >
                <Avatar className="size-8">
                  {user.avatarUrl && (
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                  )}
                  <AvatarFallback className="text-xs font-medium">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <button
                type="button"
                aria-label="Sign out"
                title="Sign out"
                onClick={async () => {
                  await signOut()
                  navigate("/")
                }}
                className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Sign in
              </Link>
              <Link to="/signup" className={cn(buttonVariants({ size: "sm" }))}>
                Sign up
              </Link>
            </div>
          )}

          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="ml-1 flex size-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-border/80 bg-background px-4 py-3 md:hidden">
          <div className="relative mb-3 w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
              <Search className="size-4" />
            </div>
            <Input
              type="text"
              placeholder="Search inspiration, creators..."
              className="h-9 w-full rounded-lg border-border/70 bg-muted/40 pr-3 pl-9 text-sm placeholder:text-muted-foreground/70"
            />
          </div>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                aria-current={currentPath === link.href ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  currentPath === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
