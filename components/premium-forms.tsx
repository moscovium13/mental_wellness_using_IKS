'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { LucideIcon, CheckCircle2 } from 'lucide-react'

interface PremiumFormProps {
  title: string
  description?: string
  icon?: LucideIcon
  onSubmit: (data: any) => void
  submitText?: string
  children: ReactNode
  isLoading?: boolean
}

export function PremiumForm({
  title,
  description,
  icon: Icon,
  onSubmit,
  submitText = 'Submit',
  children,
  isLoading = false,
}: PremiumFormProps) {
  return (
    <Card className="card-premium border-border/40 overflow-hidden shadow-xl">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          )}
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            {description && <p className="text-sm text-foreground/60 mt-2">{description}</p>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          {children}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary h-12 rounded-lg font-semibold text-base"
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin mr-2"></span>
                Processing...
              </>
            ) : (
              submitText
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

interface PremiumFormFieldProps {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
}

export function PremiumFormField({
  label,
  required = false,
  error,
  hint,
  children,
}: PremiumFormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-foreground font-semibold flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {hint && !error && <p className="text-sm text-foreground/60">{hint}</p>}
    </div>
  )
}

interface PremiumInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
  error?: boolean
}

export function PremiumInput({
  icon: Icon,
  error,
  ...props
}: PremiumInputProps) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
      )}
      <Input
        {...props}
        className={`${Icon ? 'pl-12' : 'pl-4'} h-12 rounded-lg border-border/50 bg-background/50 text-base focus:ring-2 focus:ring-primary/50 ${
          error ? 'border-red-500' : ''
        }`}
      />
    </div>
  )
}

interface PremiumTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function PremiumTextarea({
  error,
  ...props
}: PremiumTextareaProps) {
  return (
    <Textarea
      {...props}
      className={`h-32 rounded-lg border-border/50 bg-background/50 text-base focus:ring-2 focus:ring-primary/50 resize-none ${
        error ? 'border-red-500' : ''
      }`}
    />
  )
}

interface SuccessMessageProps {
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function SuccessMessage({
  title,
  message,
  action,
}: SuccessMessageProps) {
  return (
    <div className="text-center py-12 space-y-6 animate-fadeInUp">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10 text-white fill-white" />
      </div>
      <div className="space-y-2">
        <h3 className="text-3xl font-bold text-foreground">{title}</h3>
        <p className="text-lg text-foreground/70">{message}</p>
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          className="btn-primary h-12 px-8 rounded-lg font-semibold"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

interface FormStepperProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export function FormStepper({
  currentStep,
  totalSteps,
  steps,
}: FormStepperProps) {
  return (
    <div className="space-y-6 mb-8">
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div key={idx} className="flex-1">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                idx < currentStep
                  ? 'bg-gradient-to-r from-primary to-accent'
                  : idx === currentStep
                    ? 'bg-primary'
                    : 'bg-border'
              }`}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-foreground">{steps[currentStep]}</h3>
        <span className="text-sm text-foreground/60">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>
    </div>
  )
}
