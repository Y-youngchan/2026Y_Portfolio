"use client";

import { useEffect, useState } from "react";

import { navigationItems } from "../data/portfolio-data";

const email = "sunhama2000@naver.com";

function Brand() {
  return (
    <a className="sidebar-brand" href="#top" aria-label="페이지 맨 위로 이동">
      <span>Y</span>
      <strong>YOUNGCHAN</strong>
    </a>
  );
}

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="주요 내비게이션">
      {navigationItems.map((item) => (
        <a key={item.href} href={item.href} onClick={onNavigate}>
          <span aria-hidden="true" />
          {item.label}
        </a>
      ))}
    </nav>
  );
}

function ContactLink({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <a
      className="sidebar-contact"
      href={`mailto:${email}`}
      onClick={onNavigate}
    >
      <span>LET&apos;S TALK</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export function SiteNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  return (
    <>
      <aside className="site-sidebar" aria-label="데스크톱 내비게이션">
        <Brand />
        <NavigationLinks />
        <ContactLink />
      </aside>

      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        aria-controls="mobile-navigation"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <button
        className={`mobile-menu-overlay${isMenuOpen ? " is-open" : ""}`}
        type="button"
        aria-label="메뉴 닫기"
        aria-hidden={!isMenuOpen}
        tabIndex={isMenuOpen ? 0 : -1}
        onClick={closeMenu}
      />

      <aside
        className={`mobile-navigation${isMenuOpen ? " is-open" : ""}`}
        id="mobile-navigation"
        aria-label="모바일 내비게이션"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        <Brand />
        <NavigationLinks onNavigate={closeMenu} />
        <ContactLink onNavigate={closeMenu} />
      </aside>
    </>
  );
}
