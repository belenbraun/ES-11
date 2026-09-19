import type { TabKey } from "@/lib/types";

const TABS: { key: TabKey; icon: string; label: string }[] = [
  { key: "feed", icon: "💧", label: "Feed" },
  { key: "profile", icon: "🙋‍♀️", label: "Mi perfil" },
  { key: "pussies", icon: "💅", label: "Pussies" },
  { key: "sumar", icon: "✍️", label: "Sumar" },
];

export default function TabBar({
  active,
  onTab,
}: {
  active: TabKey;
  onTab: (tab: TabKey) => void;
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
    </nav>
  );
}
