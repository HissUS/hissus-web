import * as React from 'react'
import { Button as ShadcnButton } from '@/components/ui/button'
import { withHissusDefaults } from '@/lib/utils'

type ButtonProps = React.ComponentProps<typeof ShadcnButton>

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <ShadcnButton
      ref={ref as never}
      className={
        typeof className === 'function'
          ? className
          : withHissusDefaults('button', className)
      }
      {...props}
    />
  )
)
Button.displayName = 'Button'
