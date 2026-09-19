import { Menu, Search, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const filterItems = ["Discover", "Categories", "Industries"]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full rounded-[28px] border border-black/15 bg-[#f6f4f3] px-3 py-3 shadow-[0_4px_0_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="flex items-center justify-between gap-3 md:justify-start">
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/15 bg-white text-[10px] font-semibold tracking-[0.2em] text-black uppercase shadow-sm">
              Logo
            </div>
            <span className="text-xl font-normal tracking-tight text-black italic md:text-3xl">
              Logo (draft)
            </span>
          </div>

          {/* ✅ FIXED: icon now lives INSIDE the button */}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 bg-white text-black shadow-sm md:hidden"
          >
            {isMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>

        <div className="hidden flex-1 items-center justify-center gap-3 overflow-hidden md:flex">
          {filterItems.map((item) => (
            <button
              key={item}
              type="button"
              className={`rounded-full px-3 py-2 text-lg font-medium transition ${
                item === "Categories"
                  ? "border border-black/15 bg-white/80 text-black shadow-sm"
                  : "border border-transparent bg-transparent text-black/80 hover:border-black/10 hover:bg-white/60"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 md:ml-auto md:flex-row md:items-center md:gap-3">
          <div className="relative w-full md:w-[360px]">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-black/50" />
            <Input
              type="text"
              placeholder="Search work or freelancers"
              className="h-12 border border-black/10 bg-white/70 pl-11 text-sm placeholder:text-black/50"
            />
          </div>

          <Button className="h-12 rounded-full bg-[#d95a51] px-5 text-sm font-medium text-white shadow-sm hover:bg-[#c4534a]">
            Freelancer portal
          </Button>
        </div>
      </div>

      {/* ✅ Mobile dropdown menu now sits OUTSIDE the flex row (sibling) */}
      {isMenuOpen && (
        <div className="mt-3 rounded-2xl border border-black/10 bg-white/80 p-2 shadow-sm md:hidden">
          <div className="flex flex-col gap-2">
            {filterItems.map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-xl px-3 py-2 text-left text-base font-medium text-black/80 hover:bg-[#f6f4f3]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
