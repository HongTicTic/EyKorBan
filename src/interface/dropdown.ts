import type * as React from "react"

export interface DropdownOption {
  label: string
  value: string
  icon?: React.ReactNode
}

export interface DropdownProps {
  /** The selected value (controlled) */
  value?: string
  /** Default value (uncontrolled) */
  defaultValue?: string
  /** Placeholder or default button label (e.g. "All categories") */
  placeholder?: string
  /** Alias for placeholder */
  label?: string
  /** List of selectable options */
  options?: (string | DropdownOption)[]
  /** Callback when an option is selected */
  onSelect?: (value: string) => void
  /** Callback alias for onSelect */
  onValueChange?: (value: string) => void
  /** Callback alias for onSelect */
  onChange?: (value: string) => void
  /** Additional classes for trigger */
  className?: string
  /** Popover alignment */
  align?: "start" | "end" | "center"
  /** Whether the dropdown is disabled */
  disabled?: boolean
}

export interface DropdownFilterBarProps {
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  categoryOptions?: (string | DropdownOption)[]

  selectedIndustry?: string
  onIndustryChange?: (industry: string) => void
  industryOptions?: (string | DropdownOption)[]

  selectedSort?: string
  onSortChange?: (sort: string) => void
  sortOptions?: (string | DropdownOption)[]

  className?: string
}
