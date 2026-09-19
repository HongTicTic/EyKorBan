import type * as React from "react"

export interface Contact {
  contactId: string
  userId: string
}

export interface ContactFormData {
  name: string
  email: string
  message: string
}

export interface ContactDialogProps {
  recipientName?: string
  subject?: string
  trigger?: React.ReactNode | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit?: (data: ContactFormData) => void | Promise<void>
}
