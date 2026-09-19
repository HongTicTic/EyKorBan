import * as React from "react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ContactFormData, ContactDialogProps } from "@/interface/contact"

export type { ContactFormData, ContactDialogProps }

export function ContactDialog({
    recipientName = "Mira Renko",
    subject = "Roaster identity and pa",
    trigger,
    open,
    onOpenChange,
    onSubmit,
}: ContactDialogProps) {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const [formData, setFormData] = React.useState<ContactFormData>({
        name: "",
        email: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const isControlled = open !== undefined
    const currentOpen = isControlled ? open : internalOpen
    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled) {
            setInternalOpen(newOpen)
        }
        onOpenChange?.(newOpen)

        // Reset form state when closed
        if (!newOpen) {
            setFormData({ name: "", email: "", message: "" })
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await onSubmit?.(formData)
            handleOpenChange(false)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={currentOpen} onOpenChange={handleOpenChange}>
            {trigger && <DialogTrigger render={<>{trigger}</>} />}
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader className="gap-1.5 text-left">
                    <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
                        Contact {recipientName}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        About: {subject}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="contact-name"
                            className="text-sm font-medium text-foreground"
                        >
                            Your name
                        </Label>
                        <Input
                            id="contact-name"
                            name="name"
                            placeholder="Your name"
                            required
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, name: e.target.value }))
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="contact-email"
                            className="text-sm font-medium text-foreground"
                        >
                            Email address
                        </Label>
                        <Input
                            id="contact-email"
                            name="email"
                            type="email"
                            placeholder="you@company.com"
                            required
                            value={formData.email}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, email: e.target.value }))
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="contact-message"
                            className="text-sm font-medium text-foreground"
                        >
                            Message
                        </Label>
                        <Textarea
                            id="contact-message"
                            name="message"
                            placeholder="Describe the project"
                            rows={4}
                            required
                            value={formData.message}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, message: e.target.value }))
                            }
                        />
                    </div>

                    <p className="text-xs text-muted-foreground">
                        {recipientName}&apos;s email address is never shown publicly.
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <DialogClose render={<Button variant="outline" type="button" />}>
                            Cancel
                        </DialogClose>
                        <Button variant="default" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send enquiry"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ContactDialog
