import Avatar from "@/components/Avatar";
import { FRIENDS } from "@/lib/data";

export default function ProfilesTab({ active }: { active: boolean }) {
  return (
    <section id="tab-profiles" className={active ? "active" : undefined}>
      <p className="note" style={{ marginTop: 14 }}>
        Las 22 pussies del grupito. (Belén está cargando los datos y fotos de todas —
        esta es la primera tanda)
      </p>
      <div className="grid-profiles">
        {FRIENDS.map((f, i) => {
          const pending = /^\(cargar/.test(f.name);
          return (
            <div className={`profile-card${pending ? " pending" : ""}`} key={f.name + i}>
              <Avatar name={f.name} index={i} />
              <h3>{pending ? "¿Vos?" : f.name}</h3>
              <p>{f.fact || (pending ? "Falta cargar" : "")}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
