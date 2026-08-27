export interface DocFile {
  slug: string;
  section: string;
  title: string;
  order: number;
  date?: string;
  author?: string;
  content: string;
  path: string;
  type?: "Feature" | "Fix" | "Chore";
  role?: string;
  photo?: string;
  name?: string;
  avatar?: string;
  summary?: string;
}