export type LoreEntry = {
  id: string;
  chapter: string;
  title: string;
  summary: string;
  body: string;
  status: "known" | "needs-story" | "current";
};

export const loreEntries: LoreEntry[] = [
  {
    id: "libya",
    chapter: "SAVE 01",
    title: "Libya",
    summary: "The starting map.",
    body: "TODO: Add a real short story about growing up in Libya. Keep the detail personal and specific; do not turn this into a formal biography.",
    status: "needs-story",
  },
  {
    id: "turkiye",
    chapter: "SAVE 02",
    title: "Moving to Türkiye",
    summary: "A new place, language, and set of systems to learn.",
    body: "TODO: Add the confirmed timeline and one memory that explains what the move felt like.",
    status: "needs-story",
  },
  {
    id: "turkish",
    chapter: "SAVE 03",
    title: "Learning Turkish",
    summary: "Language as a long-running side quest.",
    body: "TODO: Add a true moment from learning Turkish—an early misunderstanding, a breakthrough, or the phrase that finally stuck.",
    status: "needs-story",
  },
  {
    id: "computer-engineering",
    chapter: "SAVE 04",
    title: "Starting Computer Engineering",
    summary: "Kocaeli University enters the quest log.",
    body: "Confirmed: Abdulwahid studies Computer Engineering at Kocaeli University. TODO: Add the start date and a real story about choosing the program.",
    status: "known",
  },
  {
    id: "serious-projects",
    chapter: "SAVE 05",
    title: "Building the first serious projects",
    summary: "Small ideas started acquiring databases and roadmaps.",
    body: "TODO: Name the project that felt like the turning point and explain why. Avoid invented metrics; the interesting part is what changed in the way you built.",
    status: "needs-story",
  },
  {
    id: "internship-search",
    chapter: "SAVE 06",
    title: "Internship-search arc",
    summary: "Repetition became an automation problem.",
    body: "CV Bro grew from the need to research companies, avoid duplicate outreach, and keep a human review step. TODO: Add the personal context behind the first version.",
    status: "known",
  },
  {
    id: "games",
    chapter: "SAVE 07",
    title: "Deciding to build games",
    summary: "Interactive systems became the main quest.",
    body: "Confirmed: Abdulwahid is actively moving deeper into game development. TODO: Add the game, mechanic, or moment that made this direction feel real.",
    status: "known",
  },
  {
    id: "current",
    chapter: "AUTOSAVE",
    title: "Current chapter",
    summary: "Studying, building, and trying to make the next thing playable.",
    body: "The current focus is a multilingual phone-passing social-deduction game, alongside software projects and Computer Engineering. This chapter is still writing itself.",
    status: "current",
  },
];

export const languages = [
  { name: "Arabic", level: null },
  { name: "English", level: null },
  { name: "Turkish", level: null },
  { name: "Italian", level: null },
  { name: "Amazigh", level: null },
] as const;
