import React from 'react';
import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';

type HomeButtonProps = 
  | ({ to: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { children: ReactNode })
  | ({ to?: never } & ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode });

const HomeButton: React.FC<HomeButtonProps> = ({ children, to, ...props }) => {
  if (to) {
    return (
      <Link to={to} className="btn-hero" {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }
};

export default HomeButton;
