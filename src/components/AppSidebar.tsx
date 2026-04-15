import {useState} from "react";
import {Wallet, ChevronRight, Menu, X} from "lucide-react";
import {useAccount, useDisconnect} from "wagmi";
import {Button} from "@/components/ui/button";
import {NAV_ITEMS, type PanelId} from "@/pages/Index";
import {WalletConnectModal} from "@/components/WalletConnectModal";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";

interface AppSidebarProps {
  activePanel: PanelId;
  onNavigate: (panel: PanelId) => void;
}

function SidebarContent({activePanel, onNavigate, onItemClick}: AppSidebarProps & {onItemClick?: () => void}) {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const {address, isConnected, chainId} = useAccount();
  const {disconnect} = useDisconnect();

  console.log("chainId", chainId)

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <>
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
              onClick={() => {
                onNavigate(item.id);
                onItemClick?.();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
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
            onClick={() => setWalletModalOpen(true)}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        )}
      </div>
      <WalletConnectModal open={walletModalOpen} onOpenChange={setWalletModalOpen} />
    </>
  );
}

export function AppSidebar({activePanel, onNavigate}: AppSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[240px] bg-sidebar border-r border-border flex-col z-50 hidden md:flex">
        <SidebarContent activePanel={activePanel} onNavigate={onNavigate} />
      </aside>

      {/* Mobile hamburger button */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-3 left-3 z-50 md:hidden h-9 w-9"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] p-0 bg-sidebar border-border">
          <div className="flex flex-col h-full">
            <SidebarContent
              activePanel={activePanel}
              onNavigate={onNavigate}
              onItemClick={() => setMobileOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
