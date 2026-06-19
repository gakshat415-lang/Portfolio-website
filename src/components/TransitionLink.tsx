"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function TransitionLink({
  href,
  children,
  className,
  onClick,
}: TransitionLinkProps) {
  const router = useRouter();

  const handleTransition = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (onClick) onClick(e);

    const body = document.body;
    body.style.transition = "opacity 0.25s ease-out";
    body.style.opacity = "0";

    setTimeout(() => {
      router.push(href);
      
      // Cleanup inline styles shortly after push so it's ready for the next page render
      setTimeout(() => {
        body.style.transition = "";
        body.style.opacity = "";
      }, 100);
    }, 250);
  };

  return (
    <a href={href} onClick={handleTransition} className={className}>
      {children}
    </a>
  );
}
