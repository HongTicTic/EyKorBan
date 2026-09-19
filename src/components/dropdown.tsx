import * as React from "react"
import { ChevronDownIcon, CheckIcon } from "lucide-react"
import { cn } from "cn"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CATEGORIES } from "@/interface/category"
import type {
  DropdownOption,
  DropdownProps,
  DropdownFilterBarProps,
} from "@/interface/dropdown"

export type { DropdownOption, DropdownProps, DropdownFilterBarProps }

export const DEFAULT_CATEGORY_OPTIONS: DropdownOption[] = [
  { label: "All categories", value: "all" },
  ...CATEGORIES.filter((c) => c.id !== "all").map((c) => ({
    label: c.name,
    value: c.id,
  })),
]

export const DEFAULT_INDUSTRY_OPTIONS: DropdownOption[] = [
  { label: "All industries", value: "all" },
  { label: "Technology & Software", value: "tech" },
  { label: "Fintech & Finance", value: "fintech" },
  { label: "E-Commerce & Retail", value: "ecommerce" },
  { label: "Healthcare & Life Sciences", value: "healthcare" },
  { label: "Education & EdTech", value: "education" },
  { label: "Real Estate & Architecture", value: "real-estate" },
  { label: "Media & Entertainment", value: "entertainment" },
]

export const DEFAULT_SORT_OPTIONS: DropdownOption[] = [
  { label: "Most recent", value: "recent" },
  { label: "Most popular", value: "popular" },
  { label: "Most viewed", value: "views" },
  { label: "Most liked", value: "likes" },
  { label: "Oldest first", value: "oldest" },
]

function normalizeOption(option: string | DropdownOption): DropdownOption {
  if (typeof option === "string") {
    return { label: option, value: option }
  }
  return option
}

/**
 * Single dropdown button component that displays a selectable list of options.
 */
export function SingleDropdown({
  value,
  defaultValue,
  placeholder,
  label,
  options = [],
  onSelect,
  onValueChange,
  onChange,
  className,
  align = "start",
  disabled = false,
}: DropdownProps) {
  const [internalValue, setInternalValue] = React.useState<string>(
    defaultValue ?? ""
  )
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const normalizedOptions = React.useMemo(
    () => options.map(normalizeOption),
    [options]
  )

  const selectedOption = normalizedOptions.find(
    (opt) => opt.value === currentValue
  )
  const defaultLabel =
    placeholder || label || (normalizedOptions[0]?.label ?? "Select")
  const displayLabel = selectedOption?.label || defaultLabel

  const handleSelect = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue)
    }
    onSelect?.(nextValue)
    onValueChange?.(nextValue)
    onChange?.(nextValue)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        render={
          <button
            type="button"
            className={cn(
              "group/dropdown inline-flex h-9 min-w-0 items-center justify-between gap-2 rounded-xl border border-input/60 bg-background px-3.5 py-1.5 text-sm font-normal text-muted-foreground shadow-2xs transition-colors hover:border-input hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
              className
            )}
          />
        }
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-aria-expanded/dropdown:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="min-w-44 rounded-xl p-1 shadow-lg"
      >
        {normalizedOptions.map((opt) => {
          const isSelected = currentValue === opt.value
          return (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                isSelected && "bg-accent/60 font-medium text-accent-foreground"
              )}
            >
              <span className="flex items-center gap-2 truncate">
                {opt.icon}
                {opt.label}
              </span>
              {isSelected && (
                <CheckIcon className="size-3.5 shrink-0 text-primary" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Filter bar container holding Category, Industry, and Sorting dropdowns.
 */
export function DropdownFilterBar({
  selectedCategory,
  onCategoryChange,
  categoryOptions = DEFAULT_CATEGORY_OPTIONS,
  selectedIndustry,
  onIndustryChange,
  industryOptions = DEFAULT_INDUSTRY_OPTIONS,
  selectedSort,
  onSortChange,
  sortOptions = DEFAULT_SORT_OPTIONS,
  className,
}: DropdownFilterBarProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center justify-between gap-3",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <SingleDropdown
          placeholder="All categories"
          options={categoryOptions}
          value={selectedCategory}
          onSelect={onCategoryChange}
        />
        <SingleDropdown
          placeholder="All industries"
          options={industryOptions}
          value={selectedIndustry}
          onSelect={onIndustryChange}
        />
      </div>

      <div className="flex items-center gap-2.5">
        <SingleDropdown
          placeholder="Most recent"
          align="end"
          options={sortOptions}
          value={selectedSort}
          onSelect={onSortChange}
        />
      </div>
    </div>
  )
}

/**
 * Dropdown component.
 * - If options/placeholder/label are provided, renders an individual dropdown.
 * - If called without props, renders the full dropdown filter bar as shown in the UI.
 */
export function Dropdown(props: DropdownProps & DropdownFilterBarProps) {
  const isSingle =
    props.options !== undefined ||
    props.placeholder !== undefined ||
    props.label !== undefined

  if (isSingle) {
    return <SingleDropdown {...props} />
  }

  return <DropdownFilterBar {...props} />
}

Dropdown.Bar = DropdownFilterBar
Dropdown.Single = SingleDropdown

export default Dropdown
