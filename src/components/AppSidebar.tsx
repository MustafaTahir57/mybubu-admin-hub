import { Wallet, ChevronRight } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS, type PanelId } from "@/pages/Index";

interface AppSidebarProps {
  activePanel: PanelId;
  onNavigate: (panel: PanelId) => void;
}

export function AppSidebar({ activePanel, onNavigate }: AppSidebarProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-sidebar border-r border-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">
          <span className="text-primary">MYBUBU</span> Admin
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Crypto Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activePanel === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
            </button>
          );
        })}
      </nav>

      {/* Wallet Connection */}
      <div className="p-4 border-t border-border">
        {isConnected ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-md">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-xs text-foreground font-mono">{truncatedAddress}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => disconnect()}
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            size="sm"
            onClick={() => {
              const connector = connectors[0];
              if (connector) connect({ connector });
            }}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        )}
      </div>
    </aside>
  );
}
