"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { profile } from "@/content/profile";
import { ui } from "@/content/ui";
import { RecruiterModeToggle } from "@/components/interactive/recruiter-mode-toggle";
import { ThemeToggle } from "@/components/interactive/theme-toggle";

const navItems = [
  { href: "/", label: ui.nav.home },
  { href: "/projects", label: ui.nav.projects },
  { href: "/game-lab", label: ui.nav.gameLab },
  { href: "/lore", label: ui.nav.lore },
  { href: "/toolbox", label: ui.nav.toolbox },
  { href: "/contact", label: ui.nav.contact },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="site-wordmark" onClick={() => setOpen(false)}>
          <span className="wordmark-glyph" aria-hidden="true">AZ</span>
          <span className="wordmark-full">{profile.name}</span>
          <span className="wordmark-short">Abdulwahid Z.</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-controls">
          <RecruiterModeToggle compact />
          <ThemeToggle />
          <button
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <span>{ui.common.menu}</span>
            <span aria-hidden="true">{open ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      <div id="mobile-navigation" className={open ? "mobile-nav is-open" : "mobile-nav"}>
        <nav aria-label="Mobile navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-socials">
          <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </div>
      </div>
    </header>
  );
}
