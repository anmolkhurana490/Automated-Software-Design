export type ProcessingStage =
  | "Elicitation"
  | "Planning"
  | "Design"
  | "Validation"
  | "Output";

export interface StageMeta {
  title: ProcessingStage;
  description: string;
}