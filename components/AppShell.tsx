"use client";

import { useState } from "react";
import Header from "./Header";
import InstallCard from "./InstallCard";
import TabBar from "./TabBar";
import LandingOnboarding from "./LandingOnboarding";
import FeedTab from "./tabs/FeedTab";
import ProfileTab from "./tabs/ProfileTab";
import ProfilesTab from "./tabs/ProfilesTab";
import SumarTab from "./tabs/SumarTab";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { PilarId, TabKey } from "@/lib/types";

export default function AppShell() {
  const { value: name, set: setName, hydrated: nameHydrated } = useLocalStorage(
    "gota_name",
    null,
  );
  const { value: lastTab, set: setLastTab } = useLocalStorage("gota_lastTab", "feed");
  const [prefillPilar, setPrefillPilar] = useState<PilarId | null>(null);

  const activeTab = ((lastTab as TabKey) || "feed") as TabKey;

  function switchTab(tab: TabKey) {
    setLastTab(tab);
  }

  function respondTo(pilar: PilarId) {
    setPrefillPilar(pilar);
    switchTab("sumar");
  }

  // Todavía no hidratamos localStorage — evitamos el flash del onboarding.
  if (!nameHydrated) return null;

  if (!name) {
    return <LandingOnboarding hidden={false} onDone={(n) => setName(n)} />;
  }

  return (
    <>
      <Header />
      <main>
        <InstallCard />
        <FeedTab active={activeTab === "feed"} onRespond={respondTo} />
        <ProfileTab active={activeTab === "profile"} name={name} />
        <ProfilesTab active={activeTab === "pussies"} />
        <SumarTab
          active={activeTab === "sumar"}
          authorName={name}
          prefillPilar={prefillPilar}
          onConsumedPrefill={() => setPrefillPilar(null)}
        />
      </main>

      <TabBar active={activeTab} onTab={switchTab} />
    </>
  );
}
