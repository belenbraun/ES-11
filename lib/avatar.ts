import { AVATAR_COLORS } from "./data";

export function initials(name: string): string {
  return (
    name
      .replace(/\(.*/, "")
      .trim()
      .split(" ")
      .map((w) => w[0] || "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

export function avatarColor(idx: number): string {
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
}
