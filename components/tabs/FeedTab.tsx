import Avatar from "@/components/Avatar";
import WeekActivities from "@/components/WeekActivities";
import { FEED } from "@/lib/data";
import type { FeedItemType, PilarId } from "@/lib/types";

const BADGE: Record<FeedItemType, { label: string; className: string }> = {
  onthisday: { label: "Un día como hoy", className: "onthisday" },
  challenge: { label: "Challenge activo", className: "challenge" },
  chisme: { label: "Chisme / recuerdo", className: "chisme" },
};

export default function FeedTab({
  active,
  onRespond,
}: {
  active: boolean;
  onRespond: (pilar: PilarId) => void;
}) {
  return (
    <section id="tab-feed" className={active ? "active" : undefined}>
      <WeekActivities onRespond={onRespond} />
      {FEED.map((item, i) => {
        const badge = BADGE[item.type];
        return (
          <div className="card" key={`${item.author}-${i}`}>
            <span className={`badge ${badge.className}`}>{badge.label}</span>
            <div className="author">
              <Avatar name={item.author} index={i} />
              <div>
                <div className="who">{item.author}</div>
                <div className="when">{item.when}</div>
              </div>
            </div>
            <p className="body">{item.text}</p>
            {item.cta && (
              <button type="button" className="cta" onClick={() => onRespond("cringe")}>
                {item.cta} →
              </button>
            )}
            {item.reactions && (
              <div className="reactions">
                <span>{item.reactions}</span>
              </div>
            )}
          </div>
        );
      })}
      <p className="note">
        ¿Tenés algo para sumar al feed? Tocá &quot;Sumar&quot; abajo — se agrega en la
        próxima actualización 💧
      </p>
    </section>
  );
}
