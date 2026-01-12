import React from 'react'
import { Link } from 'react-router-dom'
import type {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  ReactNode,
} from 'react'

type ButtonProps =
  | ({
      to: string
      children: ReactNode
    } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>)
  | ({
      to?: never
      children: ReactNode
    } & ButtonHTMLAttributes<HTMLButtonElement>)

const Button: React.FC<ButtonProps> = ({ children, to, ...props }) => {
  if (to) {
    return (
      <Link
        to={to}
        className="btn-hero"
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      className="btn-hero"
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}

export default Button
