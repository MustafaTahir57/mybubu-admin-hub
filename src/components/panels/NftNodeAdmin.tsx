import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyAddress } from "@/components/CopyAddress";
import { useChainContracts } from "@/hooks/useContractData";
import { DollarSign, Hash, Banknote, Wallet, Send, AlertTriangle } from "lucide-react";
import { useAccount } from "wagmi";
import {
  useSetMintPriceUSDT,
  useSetMaxSupply,
  useDistributeDividends,
  useWithdrawUSDTFunds,
  useWithdrawUSDTTo,
  useEmergencyWithdraw,
} from "@/hooks/datasenders/useNftNodeWrite";

const isValidAddress = (a: string) => /^0x[a-fA-F0-9]{40}$/.test(a);

export function NftNodeAdmin() {
  const contracts = useChainContracts();
  const { isConnected } = useAccount();

  // Mint price
  const [mintPrice, setMintPrice] = useState("");
  const mintPriceHook = useSetMintPriceUSDT();

  // Max supply
  const [maxSupply, setMaxSupply] = useState("");
  const maxSupplyHook = useSetMaxSupply();

  // Distribute dividends
  const [dividendAmount, setDividendAmount] = useState("");
  const dividendHook = useDistributeDividends();

  // Withdraw USDT funds (all)
  const withdrawFundsHook = useWithdrawUSDTFunds();

  // Withdraw USDT to
  const [usdtRecipient, setUsdtRecipient] = useState("");
  const [usdtAmount, setUsdtAmount] = useState("");
  const withdrawToHook = useWithdrawUSDTTo();

  // Emergency withdraw
  const emergencyHook = useEmergencyWithdraw();

  const SectionCard = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );

  const SubmitButton = ({
    onClick,
    isPending,
    isConfirming,
    label = "Submit",
    disabled = false,
    variant = "default" as "default" | "destructive",
  }: {
    onClick: () => void;
    isPending: boolean;
    isConfirming: boolean;
    label?: string;
    disabled?: boolean;
    variant?: "default" | "destructive";
  }) => (
    <Button
      size="sm"
      variant={variant}
      onClick={onClick}
      disabled={!isConnected || isPending || isConfirming || disabled}
    >
      {isPending ? "Confirming…" : isConfirming ? "Waiting…" : label}
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
          {isConnected ? "✓ Wallet Connected" : "⚠ Wallet Not Connected"}
        </Badge>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Contract:</span>
          <CopyAddress address={contracts.NFT_NODE} truncate />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Set Mint Price */}
        <SectionCard title="Set Mint Price (USDT)" icon={<DollarSign className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Change NFT mint price in USDT (18 decimals). Default: 500 USDT. Must be &gt; 0.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Price in USDT (e.g. 500)"
              type="number"
              step="1"
              value={mintPrice}
              onChange={(e) => setMintPrice(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <SubmitButton
              onClick={() => mintPriceHook.setMintPriceUSDT(mintPrice)}
              isPending={mintPriceHook.isPending}
              isConfirming={mintPriceHook.isConfirming}
              disabled={!mintPrice || Number(mintPrice) <= 0}
              label="Set Price"
            />
          </div>
        </SectionCard>

        {/* Set Max Supply */}
        <SectionCard title="Set Max Supply" icon={<Hash className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Change maximum NFT supply. Cannot set below totalMinted. Default: 1000.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Max supply (e.g. 1000)"
              type="number"
              step="1"
              value={maxSupply}
              onChange={(e) => setMaxSupply(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <SubmitButton
              onClick={() => maxSupplyHook.setMaxSupply(maxSupply)}
              isPending={maxSupplyHook.isPending}
              isConfirming={maxSupplyHook.isConfirming}
              disabled={!maxSupply || Number(maxSupply) <= 0}
              label="Set Supply"
            />
          </div>
        </SectionCard>

        {/* Distribute Dividends */}
        <SectionCard title="Distribute Dividends" icon={<Banknote className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Send BNB with this call. BNB is split equally per minted NFT. Each NFT can later claim its share.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="BNB amount to distribute"
              type="number"
              step="0.01"
              value={dividendAmount}
              onChange={(e) => setDividendAmount(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <SubmitButton
              onClick={() => dividendHook.distributeDividends(dividendAmount)}
              isPending={dividendHook.isPending}
              isConfirming={dividendHook.isConfirming}
              disabled={!dividendAmount || Number(dividendAmount) <= 0}
              label="Distribute"
            />
          </div>
        </SectionCard>

        {/* Withdraw USDT Funds (All) */}
        <SectionCard title="Withdraw All USDT to Treasury" icon={<Wallet className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Withdraws ALL USDT balance to treasuryWallet. This is the accumulated USDT from mint payments.
          </p>
          <SubmitButton
            onClick={() => withdrawFundsHook.withdrawUSDTFunds()}
            isPending={withdrawFundsHook.isPending}
            isConfirming={withdrawFundsHook.isConfirming}
            label="Withdraw All USDT"
          />
        </SectionCard>

        {/* Withdraw USDT To */}
        <SectionCard title="Withdraw USDT To Address" icon={<Send className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Withdraw specific amount of USDT to any address.
          </p>
          <Input
            placeholder="Recipient address (0x...)"
            value={usdtRecipient}
            onChange={(e) => setUsdtRecipient(e.target.value)}
            className="bg-background border-border font-mono text-xs"
          />
          <div className="flex gap-2">
            <Input
              placeholder="Amount in USDT"
              type="number"
              step="1"
              value={usdtAmount}
              onChange={(e) => setUsdtAmount(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <SubmitButton
              onClick={() => withdrawToHook.withdrawUSDTTo(usdtRecipient as `0x${string}`, usdtAmount)}
              isPending={withdrawToHook.isPending}
              isConfirming={withdrawToHook.isConfirming}
              disabled={!isValidAddress(usdtRecipient) || !usdtAmount}
              label="Withdraw"
            />
          </div>
        </SectionCard>

        {/* Emergency Withdraw */}
        <SectionCard title="Emergency Withdraw BNB" icon={<AlertTriangle className="h-4 w-4 text-destructive" />}>
          <p className="text-xs text-muted-foreground">
            Withdraws BNB ABOVE unclaimed dividends only. Protects user claims — won't drain below what users are owed. Sends to owner.
          </p>
          <SubmitButton
            onClick={() => emergencyHook.emergencyWithdraw()}
            isPending={emergencyHook.isPending}
            isConfirming={emergencyHook.isConfirming}
            label="Emergency Withdraw"
            variant="destructive"
          />
        </SectionCard>
      </div>
    </div>
  );
}
