"use client";

import { useState } from "react";
import Header from "./Header";
import InstallCard from "./InstallCard";
import TabBar from "./TabBar";
import FeedTab from "./tabs/FeedTab";
import ChallengesTab from "./tabs/ChallengesTab";
import ProfilesTab from "./tabs/ProfilesTab";
import OnboardingSheet from "./OnboardingSheet";
import SumSheet from "./SumSheet";
import FichaSheet from "./FichaSheet";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { TabKey } from "@/lib/types";

export default function AppShell() {
  const { value: name, set: setName, hydrated: nameHydrated } = useLocalStorage(
    "gota_name",
    null,
  );
  const { value: lastTab, set: setLastTab } = useLocalStorage("gota_lastTab", "feed");

  const [sumOpen, setSumOpen] = useState(false);
  const [fichaOpen, setFichaOpen] = useState(false);

  const activeTab = ((lastTab as TabKey) || "feed") as TabKey;

  function switchTab(tab: TabKey) {
    setLastTab(tab);
  }

  return (
    <>
      <Header />
      <main>
        <InstallCard />
        <FeedTab active={activeTab === "feed"} />
        <ChallengesTab active={activeTab === "challenges"} />
        <ProfilesTab active={activeTab === "profiles"} />
      </main>

      <TabBar
        active={activeTab}
        onTab={switchTab}
        onAdd={() => setSumOpen(true)}
      />

      <OnboardingSheet
        hidden={!nameHydrated || !!name}
        onDone={(n) => setName(n)}
      />

      <SumSheet
        hidden={!sumOpen}
        onClose={() => setSumOpen(false)}
        onOpenFicha={() => {
          setSumOpen(false);
          setFichaOpen(true);
        }}
      />

      <FichaSheet hidden={!fichaOpen} onClose={() => setFichaOpen(false)} />
    </>
  );
}
