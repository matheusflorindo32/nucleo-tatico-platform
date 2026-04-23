import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "education-button",
  {
    variants: {
      variant: {
        default: "education-button-primary",
        destructive: "bg-nucleo-danger text-white hover:bg-red-600",
        outline: "education-button-outline",
        secondary: "education-button-secondary",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-nucleo-success text-white hover:bg-emerald-600",
        warning: "bg-nucleo-warning text-white hover:bg-amber-600",
        gradient: "education-gradient text-white hover:opacity-90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-lg",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }