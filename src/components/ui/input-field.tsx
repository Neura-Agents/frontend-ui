"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupInput, InputGroupButton } from "@/components/ui/input-group"
import { HugeiconsIcon } from "@hugeicons/react"
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons"

export interface InputFieldProps extends Omit<React.ComponentProps<typeof Input>, 'required'> {
  label?: string
  description?: string
  error?: string
  required?: boolean
  containerClassName?: string
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, description, error, required, type, id, containerClassName, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const generatedId = React.useId()
    const inputId = id || generatedId

    const isPassword = type === "password"
    const currentType = isPassword ? (showPassword ? "text" : "password") : type

    const renderInput = () => {
      if (isPassword) {
        return (
          <InputGroup>
            <InputGroupInput
              id={inputId}
              ref={ref}
              type={currentType}
              aria-invalid={!!error}
              required={required}
              className={className}
              {...props}
            />
            <InputGroupButton
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              type="button"
            >
              <HugeiconsIcon
                icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                size={16}
              />
            </InputGroupButton>
          </InputGroup>
        )
      }

      return (
        <Input
          id={inputId}
          ref={ref}
          type={type}
          className={className}
          aria-invalid={!!error}
          required={required}
          {...props}
        />
      )
    }

    return (
      <div className={cn("grid gap-1.5", containerClassName)}>
        {label && (
          <Label htmlFor={inputId} className={cn(error && "text-destructive", "text-xs font-semibold text-foreground")}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        {renderInput()}
        {description && !error && (
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.05em] font-medium">
            {description}
          </p>
        )}
        {error && (
          <p className="text-[11px] text-destructive font-medium animate-in fade-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
      </div>
    )
  }
)

InputField.displayName = "InputField"

export { InputField }
