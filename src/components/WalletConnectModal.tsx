import { useConnect } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletConnectModal({ open, onOpenChange }: WalletConnectModalProps) {
  const { connect, connectors, isPending } = useConnect();

  const injectedConnector = connectors.find((c) => c.id === "injected");
  const wcConnector = connectors.find((c) => c.id === "walletConnect");

  const handleConnect = (connector: typeof connectors[number]) => {
    connect({ connector }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground text-center">Connect Wallet</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Choose a wallet to connect to MYBUBU Admin
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          {injectedConnector && (
            <Button
              variant="outline"
              className="w-full h-14 justify-start gap-4 text-foreground border-border hover:bg-secondary"
              onClick={() => handleConnect(injectedConnector)}
              disabled={isPending}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                alt="MetaMask"
                className="h-8 w-8"
              />
              <div className="text-left">
                <div className="font-medium">MetaMask</div>
                <div className="text-xs text-muted-foreground">Connect using browser extension</div>
              </div>
            </Button>
          )}
          {wcConnector && (
            <Button
              variant="outline"
              className="w-full h-14 justify-start gap-4 text-foreground border-border hover:bg-secondary"
              onClick={() => handleConnect(wcConnector)}
              disabled={isPending}
            >
              <img
                src="https://avatars.githubusercontent.com/u/37784886?s=200&v=4"
                alt="WalletConnect"
                className="h-8 w-8 rounded-md"
              />
              <div className="text-left">
                <div className="font-medium">WalletConnect</div>
                <div className="text-xs text-muted-foreground">Scan QR code with mobile wallet</div>
              </div>
            </Button>
          )}
        </div>
        {isPending && (
          <p className="text-xs text-center text-muted-foreground animate-pulse">
            Connecting...
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
