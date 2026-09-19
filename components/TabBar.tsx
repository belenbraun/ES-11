import type { TabKey } from "@/lib/types";

const TABS: { key: TabKey; icon: string; label: string }[] = [
  { key: "feed", icon: "💧", label: "Feed" },
  { key: "challenges", icon: "🎯", label: "Challenges" },
  { key: "profiles", icon: "💅", label: "Pussies" },
];

export default function TabBar({
  active,
  onTab,
  onAdd,
}: {
  active: TabKey;
  onTab: (tab: TabKey) => void;
  onAdd: () => void;
}) {
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          className={active === t.key ? "on" : undefined}
          onClick={() => onTab(t.key)}
        >
          <span className="ic">{t.icon}</span>
          {t.label}
        </button>
      ))}
      <button type="button" onClick={onAdd}>
        <span className="ic">✍️</span>
        Sumar
      </button>
    </nav>
  );
}
