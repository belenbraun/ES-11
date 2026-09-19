"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import Header from "./Header";
import InstallCard from "./InstallCard";
import TabBar from "./TabBar";
import { LandingSignIn, LandingNameStep } from "./LandingOnboarding";
import FeedTab from "./tabs/FeedTab";
import ProfileTab from "./tabs/ProfileTab";
import ProfilesTab from "./tabs/ProfilesTab";
import SumarTab from "./tabs/SumarTab";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { claimOrCreateFriend, getMyFriend, getSession, onAuthStateChange } from "@/lib/supabase/auth";
import { findFriendByEmail } from "@/lib/supabase/friends";
import type { FriendProfile, PilarId, TabKey } from "@/lib/types";

type AuthPhase = "loading" | "not-configured" | "signed-out" | "needs-name" | "ready";

export default function AppShell() {
  const [phase, setPhase] = useState<AuthPhase>("loading");
  const [friend, setFriend] = useState<FriendProfile | null>(null);
  const { value: lastTab, set: setLastTab } = useLocalStorage("gota_lastTab", "feed");
  const [prefillPilar, setPrefillPilar] = useState<PilarId | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setPhase("not-configured");
      return;
    }

    let cancelled = false;

    async function resolve(session: Session | null) {
      if (!session) {
        if (!cancelled) {
          setFriend(null);
          setPhase("signed-out");
        }
        return;
      }
      try {
        let f = await getMyFriend();
        if (!f) {
          const preloaded = session.user.email
            ? await findFriendByEmail(session.user.email)
            : null;
          const hasRealName = preloaded?.name && !/^\(cargar/.test(preloaded.name);
          if (preloaded && hasRealName) {
            f = await claimOrCreateFriend(preloaded.name as string);
          } else {
            if (!cancelled) setPhase("needs-name");
            return;
          }
        }
        if (!cancelled) {
          setFriend(f);
          setPhase("ready");
        }
      } catch (err) {
        console.error("No se pudo resolver la sesión de LA GOTA", err);
        if (!cancelled) setPhase("signed-out");
      }
    }

    getSession().then(resolve);
    const unsubscribe = onAuthStateChange(resolve);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  async function handleNameSubmit(name: string) {
    const f = await claimOrCreateFriend(name);
    setFriend(f);
    setPhase("ready");
  }

  function respondTo(pilar: PilarId) {
    setPrefillPilar(pilar);
    setLastTab("sumar");
  }

  if (phase === "loading") return null;

  if (phase === "not-configured") {
    return (
      <main style={{ paddingTop: 40 }}>
        <div className="card">
          <span className="badge chisme">Supabase no configurado</span>
          <p className="body" style={{ marginTop: 8 }}>
            Faltan <code>NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en <code>.env.local</code>. Sin
            eso la app no puede identificar a nadie (el login es por magic link).
          </p>
          <p className="body" style={{ marginTop: 8 }}>
            Ver <code>README.md</code> → &quot;Conectar tu propio proyecto de
            Supabase&quot; para los pasos.
          </p>
        </div>
      </main>
    );
  }

  if (phase === "signed-out") return <LandingSignIn />;
  if (phase === "needs-name") return <LandingNameStep onSubmit={handleNameSubmit} />;

  const activeTab = ((lastTab as TabKey) || "feed") as TabKey;
  const me = friend as FriendProfile;

  function switchTab(tab: TabKey) {
    setLastTab(tab);
  }

  return (
    <>
      <Header />
      <main>
        <InstallCard />
        <FeedTab active={activeTab === "feed"} onRespond={respondTo} />
        <ProfileTab active={activeTab === "profile"} friend={me} onUpdated={setFriend} />
        <ProfilesTab active={activeTab === "pussies"} />
        <SumarTab
          active={activeTab === "sumar"}
          authorId={me.id}
          authorName={me.name || "Pussie"}
          prefillPilar={prefillPilar}
          onConsumedPrefill={() => setPrefillPilar(null)}
        />
      </main>

      <TabBar active={activeTab} onTab={switchTab} />
    </>
  );
}
