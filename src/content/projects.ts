import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    slug: "imposter",
    title: "Imposter",
    eyebrow: "Game Lab · Slot 01",
    category: "game",
    status: "in-development",
    featured: true,
    summary:
      "A multilingual phone-passing social-deduction game about secret words, suspicious questions, and accusing your friends.",
    description:
      "Everyone receives a secret word except one player. The group asks questions, defends suspicious answers, and votes for whoever seems to be improvising. The project is currently in development; the feature lists below separate current work from the planned game.",
    role: "Solo developer and product designer",
    teamSize: "1",
    stack: ["TypeScript", "React", "Mobile-first UI", "Game systems"],
    coverImage: "/images/games/imposter-cover.svg",
    coverAlt:
      "Placeholder cover for Imposter showing hidden player cards and language markers",
    problem:
      "Make one shared-phone party game readable, private at the right moments, and easy to follow for players who may choose different languages.",
    approach:
      "Treat the phone like a physical game object: one player at a time, deliberate hand-offs, guarded reveals, and short instructions that survive translation. The exact round rules and interface are still being tested.",
    technicalDecisions: [
      "Keep game state local first so a group can start without accounts or a lobby.",
      "Model interface language per player instead of assuming one language for the whole group.",
      "Separate game rules from presentation so prompts and word packs can be extended later.",
    ],
    features: {
      available: [],
      inProgress: [
        "Core round flow and local phone-passing interaction",
        "Multilingual content model for English, Arabic and Turkish",
        "Secret role and press-and-hold word reveal flow",
      ],
      planned: [
        "Individual language preference per player",
        "Configurable player count and rounds",
        "Question prompts and suspicion hints",
        "In-game voting and round results",
        "Polished mobile-first visual identity",
      ],
    },
    challenges: [
      "Preserving secrecy while the same phone moves between players.",
      "Keeping instructions short and natural across three languages.",
      "Making a social game feel fast without hiding necessary rules.",
    ],
    learnings: [
      "The interaction around handing over the phone is part of the game design, not setup friction.",
      "Localization affects layout, data modeling, and pacing long before translation files are added.",
    ],
    nextSteps: [
      "Complete and test one full local round loop.",
      "Validate the reveal interaction on small phones.",
      "Playtest the first word set in more than one language.",
    ],
  },
  {
    slug: "cv-bro",
    title: "CV Bro",
    eyebrow: "Automation and AI tooling",
    category: "software",
    status: "in-development",
    featured: true,
    summary:
      "A review-first internship research workflow that keeps repetitive outreach work organized without pretending decisions should be automatic.",
    description:
      "CV Bro researches companies, checks them against editable criteria, avoids previously contacted organizations, and prepares internship outreach for review. It is an internal tool in active development, not a mass-email product.",
    role: "Developer and product owner",
    teamSize: "1",
    stack: ["Python", "Supabase", "SQL", "Automation"],
    coverImage: "/images/projects/cv-bro-cover.svg",
    coverAlt:
      "Abstract placeholder diagram showing company research moving into a human review queue",
    problem:
      "Internship research becomes repetitive quickly, but automating it carelessly creates duplicate outreach, low-quality targets, and messages no human checked.",
    approach:
      "Build a small pipeline with explicit gates: research, filter, compare with prior records, prepare a draft, then stop for human review.",
    technicalDecisions: [
      "Use Supabase as the source of truth for contacted companies and skip reasons.",
      "Log rejected candidates so the same bad domain does not re-enter the queue.",
      "Generate Gmail drafts rather than sending messages automatically.",
    ],
    features: {
      available: [],
      inProgress: [
        "Company research and criteria checks",
        "Contacted-company registry and skip logging",
        "LinkedIn verification and broken-domain filtering",
        "Supabase-backed review records",
      ],
      planned: ["Gmail draft generation", "A clearer review workflow"],
    },
    challenges: [
      "Representing uncertain research results without treating them as facts.",
      "Making retries safe and preventing duplicate outreach.",
    ],
    learnings: [
      "The useful part of automation is often the review queue and audit trail, not the final action.",
    ],
    nextSteps: [
      "Document the verification rules.",
      "Add source and live links only if a public version is prepared.",
    ],
  },
  {
    slug: "portfolio-analytics",
    title: "Portfolio Analytics",
    eyebrow: "Analytics and backend",
    category: "software",
    status: "prototype",
    featured: true,
    summary:
      "A small visitor dashboard for grouping sessions and separating useful signals from noisy traffic.",
    description:
      "A custom analytics prototype for understanding portfolio visits without turning the site into a surveillance project. It explores session grouping, approximate mapping, and likely-human filtering.",
    role: "Developer and product designer",
    teamSize: "1",
    stack: ["TypeScript", "Supabase", "SQL", "Maps"],
    coverImage: "/images/projects/analytics-cover.svg",
    coverAlt:
      "Abstract placeholder dashboard with rounded map coordinates and grouped sessions",
    problem:
      "Raw page-view logs are noisy and not especially helpful when the real question is which visits formed a meaningful session.",
    approach:
      "Group events into sessions, round approximate coordinates before display, and keep likely-human filtering visible as a heuristic rather than a certainty.",
    technicalDecisions: [
      "Use coarse location display instead of presenting precise coordinates.",
      "Keep refresh manual while the data model is still changing.",
      "Label traffic filtering as an estimate.",
    ],
    features: {
      available: [],
      inProgress: [
        "Session grouping and Supabase queries",
        "Approximate geolocation with coordinate rounding",
        "Interactive map and likely-human filtering",
      ],
      planned: ["Document the privacy model", "Refine manual refresh states"],
    },
    challenges: [
      "Avoiding false precision when inferring location and human activity.",
    ],
    learnings: [
      "Analytics interfaces should show where their classifications are uncertain.",
    ],
    nextSteps: ["Validate the session rules against a small set of known visits."],
  },
  {
    slug: "zr-studio",
    title: "ZR Studio",
    eyebrow: "Creative development",
    category: "software",
    status: "concept",
    featured: false,
    summary:
      "A creative-studio website concept exploring motion, interaction, and a cleaner sense of depth.",
    description:
      "ZR Studio is a concept, not a finished client project. It is a space for testing how motion and dimensional cues can support a studio story without becoming the story.",
    role: "Designer and developer",
    teamSize: "1",
    stack: ["Next.js", "TypeScript", "Interaction design"],
    coverImage: "/images/projects/zr-studio-cover.svg",
    coverAlt: "Abstract placeholder composition for the ZR Studio concept",
    problem:
      "Explore a studio identity with depth and motion while keeping the page readable and fast.",
    approach:
      "Prototype the information hierarchy first, then add motion only where it clarifies spatial relationships.",
    technicalDecisions: [
      "Keep the concept CSS-first until a specific interaction justifies more JavaScript.",
    ],
    features: { available: [], inProgress: [], planned: ["TODO: define the first prototype scope"] },
    challenges: ["Finding a distinct visual language before adding production detail."],
    learnings: ["TODO: add learnings after the first prototype."],
    nextSteps: ["Define one small, testable page rather than a full fictional agency site."],
  },
];

export const gameProjects = projects.filter((project) => project.category === "game");
export const softwareProjects = projects.filter((project) => project.category === "software");
