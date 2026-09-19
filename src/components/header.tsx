import * as React from "react"
import { Search, Bookmark, Bell, Upload, Menu, X } from "lucide-react"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navLinks = [
  { label: "Explore", href: "#" },
  { label: "Hire Creatives", href: "#" },
  { label: "Find Work", href: "#" },
]

export function Header() {
  const [activeNav, setActiveNav] = React.useState("Explore")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md shadow-xs transition-colors">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex flex-1 items-center gap-6 md:gap-8 max-w-xl">
          <a
            href="#"
            className="group flex shrink-0 items-center no-underline outline-none"
          >
            <Logo className="h-7 transition-transform group-hover:scale-105" />
          </a>

          <div className="relative hidden w-full max-w-md sm:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
              <Search className="size-4" />
            </div>
            <Input
              type="text"
              placeholder="Search inspiration, design styles, creators..."
              className="h-9 w-full rounded-lg border-border/70 bg-muted/40 pl-9 pr-12 text-sm placeholder:text-muted-foreground/70 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary transition-all"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
              <kbd className="rounded border border-border/60 bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 lg:gap-7">
          {navLinks.map((link) => {
            const isActive = activeNav === link.label
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveNav(link.label)
                }}
                className={`pb-1 text-sm transition-colors ${
                  isActive
                    ? "border-b-2 border-primary font-medium text-foreground"
                    : "font-normal text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Saved collections"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <Bookmark className="size-4" />
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <Bell className="size-4" />
            <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary" />
          </button>

          <Button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Upload className="size-4" />
            <span className="hidden sm:inline">Upload</span>
          </Button>

          <button
            type="button"
            aria-label="User profile"
            className="ml-0.5 rounded-full p-0.5 ring-1 ring-border hover:ring-primary transition-all cursor-pointer"
          >
            <Avatar className="size-8">
              <AvatarImage
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="User profile avatar"
              />
              <AvatarFallback className="text-xs font-medium">SC</AvatarFallback>
            </Avatar>
          </button>

          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors md:hidden cursor-pointer ml-1"
          >
            {isMobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
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
              className="h-9 w-full rounded-lg border-border/70 bg-muted/40 pl-9 pr-3 text-sm placeholder:text-muted-foreground/70"
            />
          </div>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveNav(link.label)
                  setIsMobileMenuOpen(false)
                }}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeNav === link.label
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

