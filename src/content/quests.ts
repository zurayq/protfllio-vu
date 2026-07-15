import type { Quest } from "@/types/content";

export const quests: Quest[] = [
  {
    label: "Main quest",
    title: "Becoming a game developer",
    description: "Learning by building small systems and one serious game at a time.",
    state: "ongoing",
    marker: "01",
  },
  {
    label: "Building",
    title: "A multilingual social-deduction game",
    description: "A local, phone-passing party game designed around language choice.",
    state: "building",
    marker: "02",
  },
  {
    label: "Exploring",
    title: "C#, game systems, interaction design",
    description: "Turning mechanics and interface decisions into repeatable practice.",
    state: "researching",
    marker: "03",
  },
  {
    label: "Also doing",
    title: "Computer Engineering",
    description: "Studying at Kocaeli University while keeping the build queue alive.",
    state: "ongoing",
    marker: "04",
  },
];
