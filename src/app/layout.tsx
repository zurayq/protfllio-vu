import type { Metadata } from "next";

import { GameModeEasterEgg } from "@/components/interactive/game-mode-easter-egg";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { profile } from "@/content/profile";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: "Abdulwahid Zurayq — Games, Software and Interactive Projects",
    template: "%s — Abdulwahid Zurayq",
  },
  description:
    "The personal website of Abdulwahid Zurayq, a Computer Engineering student from Libya building games, interactive products and software systems in Türkiye.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: profile.siteUrl,
    siteName: profile.name,
    title: "Abdulwahid Zurayq — Games, Software and Interactive Projects",
    description: profile.headline,
    images: [{ url: "/images/social-preview.svg", width: 1200, height: 630, alt: profile.headline }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdulwahid Zurayq — Games, Software and Interactive Projects",
    description: profile.headline,
    images: ["/images/social-preview.svg"],
  },
  robots: { index: true, follow: true },
};

const preferenceScript =
  "(function(){try{var t=localStorage.getItem('zurayq-theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;var r=localStorage.getItem('zurayq-recruiter-mode')==='true';document.documentElement.dataset.recruiter=String(r)}catch(e){}})();";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: profile.siteUrl,
    sameAs: [profile.links.github, profile.links.linkedin],
    homeLocation: { "@type": "Country", name: profile.location },
    alumniOf: { "@type": "CollegeOrUniversity", name: profile.university },
    description: profile.headline,
  };

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning data-theme="light" data-recruiter="false">
      <body>
        <script dangerouslySetInnerHTML={{ __html: preferenceScript }} />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content" className="site-main">{children}</main>
        <SiteFooter />
        <GameModeEasterEgg />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      </body>
    </html>
  );
}
