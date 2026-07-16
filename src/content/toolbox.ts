export type ToolGroup = {
  title: string;
  description: string;
  marker: string;
  items: string[];
};

export const toolboxGroups: ToolGroup[] = [
  {
    title: "Using now",
    description: "Tools currently showing up in real builds.",
    marker: "RUN",
    items: ["TypeScript", "JavaScript", "React", "Next.js", "Python", "Supabase", "SQL", "Git"],
  },
  {
    title: "Learning",
    description: "Skills under active development, with no expert badge attached.",
    marker: "WIP",
    items: ["C#", "Game-development architecture", "Game systems", "Interaction design"],
  },
  {
    title: "Academic experience",
    description: "Topics used through Computer Engineering coursework.",
    marker: "UNI",
    items: ["Java", "C", "Databases", "Algorithms and data structures"],
  },
  {
    title: "Curious about",
    description: "A deliberately short queue for future experiments.",
    marker: "NEXT",
    items: ["TODO: add tools only after genuine exploration starts"],
  },
];
