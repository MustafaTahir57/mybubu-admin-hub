import { useAccount, useChainId } from "wagmi";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const networkName = chainId === 56 ? "BSC Mainnet" : chainId === 97 ? "BSC Testnet" : `Chain ${chainId}`;

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-success animate-pulse-glow" : "bg-destructive"}`} />
          <span className="text-xs text-muted-foreground">{networkName}</span>
        </div>
        {isConnected && address && (
          <Badge variant="secondary" className="font-mono text-xs">
            {address.slice(0, 6)}...{address.slice(-4)}
          </Badge>
        )}
      </div>
    </header>
  );
}
