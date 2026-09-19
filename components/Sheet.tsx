"use client";

export default function Sheet({
  id,
  hidden,
  onDismiss,
  children,
  wide,
}: {
  id: string;
  hidden: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  if (hidden) return null;
  return (
    <div
      className="veil"
      id={id}
      onClick={(e) => {
        if (e.target === e.currentTarget) onDismiss();
      }}
    >
      <div className="sheet" style={wide ? { maxHeight: "85vh", overflowY: "auto" } : undefined}>
        {children}
      </div>
    </div>
  );
}
