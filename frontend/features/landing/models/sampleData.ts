export const STAGE_METADATA = [
  {
    title: "Elicitation",
    description:
      "Analyze user input, requirements, and constraints. Ask clarifications when confidence is low.",
  },
  {
    title: "Planning",
    description:
      "Propose architecture, checkpoint with user feedback, and shape tech stack strategy.",
  },
  {
    title: "Design",
    description:
      "Generate service map, DB schema, API contracts, and infrastructure design bundle.",
  },
  {
    title: "Validation",
    description: "Return quality feedback and score for architecture and design consistency.",
  },
  {
    title: "Output",
    description: "Compile all stage outputs into a final architecture decision document.",
  },
] as const;