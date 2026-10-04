export const CLASSES = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"] as const;

export const SUBJECTS = [
  { name: "Mathematics", emoji: "📐", tone: "bg-subject-math text-subject-math-foreground" },
  { name: "Science", emoji: "🧪", tone: "bg-subject-science text-subject-science-foreground" },
  { name: "English", emoji: "📖", tone: "bg-subject-english text-subject-english-foreground" },
  { name: "Computer Science", emoji: "💻", tone: "bg-subject-cs text-subject-cs-foreground" },
  { name: "Social Studies", emoji: "🌍", tone: "bg-subject-social text-subject-social-foreground" },
] as const;

export const RESOURCE_TYPES = [
  "PDF Notes",
  "PPT Presentation",
  "Assignment",
  "Question Paper",
  "Image",
  "Study Material",
] as const;

export const TYPE_EMOJI: Record<string, string> = {
  "PDF Notes": "📄",
  "PPT Presentation": "📊",
  Assignment: "📝",
  "Question Paper": "❓",
  Image: "🖼️",
  "Study Material": "📚",
};

export const ACCEPTED_FILES =
  ".pdf,.ppt,.pptx,.doc,.docx,image/*,application/pdf";

export function subjectMeta(name: string) {
  return SUBJECTS.find((s) => s.name === name) ?? SUBJECTS[0];
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}
