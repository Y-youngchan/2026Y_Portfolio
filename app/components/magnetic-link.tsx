"use client";

import type { PointerEvent, ReactNode } from "react";
import { useRef } from "react";

export function MagneticLink({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className: string;
  href: string;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left - bounds.width / 2) * 0.1;
    const offsetY = (event.clientY - bounds.top - bounds.height / 2) * 0.1;
    event.currentTarget.style.setProperty("--magnetic-x", `${offsetX}px`);
    event.currentTarget.style.setProperty("--magnetic-y", `${offsetY}px`);
  };

  const resetPosition = () => {
    linkRef.current?.style.setProperty("--magnetic-x", "0px");
    linkRef.current?.style.setProperty("--magnetic-y", "0px");
  };

  return (
    <a
      className={`${className} magnetic-link`}
      data-magnetic-link="true"
      href={href}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPosition}
      onBlur={resetPosition}
      ref={linkRef}
    >
      {children}
    </a>
  );
}
