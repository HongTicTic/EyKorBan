const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
})

const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
})

export function formatCompact(value: number) {
  return compactNumber.format(value)
}

export function formatDate(value: string) {
  return shortDate.format(new Date(value))
}

export function formatMonthYear(value: string) {
  return monthYear.format(new Date(value))
}

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

/** Currency, using the viewer's locale for separators and symbol placement. */
export function money(value: number, currency = "USD"): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}
