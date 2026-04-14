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
    <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <h2 className="text-sm sm:text-lg font-semibold text-foreground truncate pl-10 md:pl-0">{title}</h2>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-success animate-pulse-glow" : "bg-destructive"}`} />
          <span className="text-xs text-muted-foreground hidden sm:inline">{networkName}</span>
        </div>
        {isConnected && address && (
          <Badge variant="secondary" className="font-mono text-xs hidden sm:inline-flex">
            {address.slice(0, 6)}...{address.slice(-4)}
          </Badge>
        )}
      </div>
    </header>
  );
}
