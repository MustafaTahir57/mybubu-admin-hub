import { useState } from "react";
import { BarChart3, Search, Coins, ScrollText, TrendingUp, Diamond, Cat } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { AnalyticsDashboard } from "@/components/panels/AnalyticsDashboard";
import { UserLookup } from "@/components/panels/UserLookup";
import { TokenAdmin } from "@/components/panels/TokenAdmin";
import { EventLogViewer } from "@/components/panels/EventLogViewer";
import { LiquidityMonitor } from "@/components/panels/LiquidityMonitor";
import { NftNodeAdmin } from "@/components/panels/NftNodeAdmin";
import { MymomoAdmin } from "@/components/panels/MymomoAdmin";

export type PanelId = "analytics" | "user-lookup" | "token-admin" | "event-log" | "liquidity" | "nft-node" | "mymomo";

export const NAV_ITEMS = [
  { id: "analytics" as PanelId, label: "Analytics", icon: BarChart3 },
  { id: "user-lookup" as PanelId, label: "MyBoo Contract", icon: Search },
  { id: "token-admin" as PanelId, label: "MYBUBU Contract", icon: Coins },
  { id: "event-log" as PanelId, label: "Swap Contract", icon: ScrollText },
  { id: "liquidity" as PanelId, label: "Liquidity", icon: TrendingUp },
  { id: "nft-node" as PanelId, label: "NFT Node", icon: Diamond },
  { id: "mymomo" as PanelId, label: "MyMOMO Token", icon: Cat },
];

const PANEL_TITLES: Record<PanelId, string> = {
  analytics: "📊 Analytics Dashboard",
  "user-lookup": "🔍 MyBoo Contract",
  "token-admin": "🪙 MYBUBU Contract",
  "event-log": "📜 Swap Contract",
  liquidity: "📈 Liquidity Monitor",
  "nft-node": "💎 NFT Node",
  mymomo: "🐱 MyMOMO Token",
};

const DashboardLayout = () => {
  const [activePanel, setActivePanel] = useState<PanelId>("analytics");

  const renderPanel = () => {
    switch (activePanel) {
      case "analytics": return <AnalyticsDashboard />;
      case "user-lookup": return <UserLookup />;
      case "token-admin": return <TokenAdmin />;
      case "event-log": return <EventLogViewer />;
      case "liquidity": return <LiquidityMonitor />;
      case "nft-node": return <NftNodeAdmin />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activePanel={activePanel} onNavigate={setActivePanel} />
      <div className="flex-1 flex flex-col ml-[240px]">
        <TopBar title={PANEL_TITLES[activePanel]} />
        <main className="flex-1 p-6 overflow-auto">
          {renderPanel()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
