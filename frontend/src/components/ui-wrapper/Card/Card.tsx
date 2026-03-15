import * as React from 'react'
import {
  Card as ShadcnCard,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle,
  CardDescription as ShadcnCardDescription,
  CardContent as ShadcnCardContent,
  CardFooter as ShadcnCardFooter,
  CardAction as ShadcnCardAction,
} from '@/components/ui/card'
import { withHissusDefaults } from '@/lib/utils'

export const Card = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ShadcnCard>
>(({ className, ...props }, ref) => (
  <ShadcnCard ref={ref} className={withHissusDefaults('card', className)} {...props} />
))
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ShadcnCardHeader>
>(({ className, ...props }, ref) => (
  <ShadcnCardHeader ref={ref} className={className} {...props} />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ShadcnCardTitle>
>(({ className, ...props }, ref) => (
  <ShadcnCardTitle ref={ref} className={className} {...props} />
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ShadcnCardDescription>
>(({ className, ...props }, ref) => (
  <ShadcnCardDescription ref={ref} className={className} {...props} />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ShadcnCardContent>
>(({ className, ...props }, ref) => (
  <ShadcnCardContent ref={ref} className={className} {...props} />
))
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ShadcnCardFooter>
>(({ className, ...props }, ref) => (
  <ShadcnCardFooter ref={ref} className={className} {...props} />
))
CardFooter.displayName = 'CardFooter'

export const CardAction = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ShadcnCardAction>
>(({ className, ...props }, ref) => (
  <ShadcnCardAction ref={ref} className={className} {...props} />
))
CardAction.displayName = 'CardAction'
