"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

function NavigationLinks({
  activeHref,
  onNavigate,
}: {
  activeHref: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="주요 내비게이션">
      {navigationItems.map((item, index) => (
        <a
          key={item.href}
          href={item.href}
          aria-current={activeHref === item.href ? "location" : undefined}
          className={activeHref === item.href ? "is-active" : undefined}
          onClick={onNavigate}
        >
          <span aria-hidden="true" />
          <small className="navigation-index" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </small>
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#about");
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openSidebar = () => {
    clearCloseTimer();
    setIsSidebarOpen(true);
  };

  const closeSidebar = useCallback(() => {
    clearCloseTimer();
    setIsSidebarOpen(false);
  }, [clearCloseTimer]);

  const scheduleSidebarClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsSidebarOpen(false);
      closeTimerRef.current = null;
    }, 200);
  };

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
        closeMenu();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      clearCloseTimer();
    };
  }, [clearCloseTimer, closeSidebar]);

  useEffect(() => {
    const sections = navigationItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveHref(`#${visibleEntry.target.id}`);
        }
      },
      {
        rootMargin: "-32% 0px -55% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <button
        className="sidebar-edge-trigger"
        type="button"
        aria-label="사이드바 메뉴 열기"
        aria-controls="desktop-navigation"
        aria-expanded={isSidebarOpen}
        onMouseEnter={openSidebar}
        onFocus={openSidebar}
      >
        <span>MENU</span>
      </button>

      <aside
        className={`site-sidebar${isSidebarOpen ? " is-open" : ""}`}
        id="desktop-navigation"
        aria-label="데스크톱 내비게이션"
        aria-hidden={!isSidebarOpen}
        inert={!isSidebarOpen}
        onMouseEnter={openSidebar}
        onMouseLeave={scheduleSidebarClose}
        onFocus={openSidebar}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            scheduleSidebarClose();
          }
        }}
      >
        <Brand />
        <NavigationLinks activeHref={activeHref} onNavigate={closeSidebar} />
        <ContactLink onNavigate={closeSidebar} />
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
        <NavigationLinks activeHref={activeHref} onNavigate={closeMenu} />
        <ContactLink onNavigate={closeMenu} />
      </aside>
    </>
  );
}
