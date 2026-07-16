import Link from "next/link";

import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <span className="footer-prompt" aria-hidden="true">zurayq@home:~$</span>
        <span> built to be edited, not worshipped.</span>
      </div>
      <div className="footer-links">
        <Link href="/contact">Contact</Link>
        <a href={profile.links.github} target="_blank" rel="noreferrer">Source profile ↗</a>
        <span>© {new Date().getFullYear()} {profile.shortName}</span>
      </div>
    </footer>
  );
}
