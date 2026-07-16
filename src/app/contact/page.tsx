import type { Metadata } from "next";

import { CommandPanel } from "@/components/panels/command-panel";
import { LinkButton } from "@/components/ui/link-button";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Abdulwahid Zurayq about game-development and software opportunities or collaborations.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="page-stack contact-page">
      <header className="page-hero contact-hero">
        <span>CO-OP LOBBY · ASYNC FRIENDLY</span>
        <h1>Have a strange idea worth making real?</h1>
        <p>{profile.contactPrompt}</p>
      </header>
      <CommandPanel label={<span>open ~/contact.txt</span>} tone="orange">
        <div className="contact-page-grid">
          <div className="contact-page-copy">
            <span>CURRENT AVAILABILITY</span>
            <h2>{profile.availability}</h2>
            <p>LinkedIn is the best route for now. A copy-email button will appear only after a real public email is added.</p>
          </div>
          <div className="contact-link-list">
            <LinkButton href={profile.links.linkedin} variant="primary">LinkedIn</LinkButton>
            <LinkButton href={profile.links.github}>GitHub</LinkButton>
            <LinkButton href={profile.links.cv} download event="cv_clicked">Download CV placeholder</LinkButton>
            <LinkButton href={profile.links.email} disabledLabel="Email · TODO">Email</LinkButton>
          </div>
        </div>
      </CommandPanel>
    </div>
  );
}
