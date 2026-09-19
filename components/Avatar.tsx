import { avatarColor, initials } from "@/lib/avatar";

export default function Avatar({
  name,
  index,
  className,
}: {
  name: string;
  index: number;
  className?: string;
}) {
  return (
    <div
      className={`avatar${className ? ` ${className}` : ""}`}
      style={{ background: avatarColor(index) }}
    >
      {initials(name)}
    </div>
  );
}
