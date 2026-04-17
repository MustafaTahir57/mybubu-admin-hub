import { useState } from "react";
import { Search, Wallet, Banknote, DollarSign, Users, Image, Gift, Coins, Layers, AlertTriangle, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/numeric-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { CopyAddress } from "@/components/CopyAddress";
import { useUserLookup, useChainContracts } from "@/hooks/useContractData";
import { useAccount } from "wagmi";
import {
  useWithdrawUSDTPresale,
  useWithdrawBNBPresale,
  useWithdrawAllPresale,
  useSetTokenPrice,
} from "@/hooks/datasenders/usePresaleWrite";

function formatNumber(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "0";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toFixed(4);
}

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
  isConnected,
}: {
  onClick: () => void;
  isPending: boolean;
  isConfirming: boolean;
  label?: string;
  disabled?: boolean;
  variant?: "default" | "destructive";
  isConnected: boolean;
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

export function UserLookup() {
  const [input, setInput] = useState("");
  const [lookupAddress, setLookupAddress] = useState<`0x${string}` | undefined>();
  const { isConnected } = useAccount();
  const contracts = useChainContracts();

  const data = useUserLookup(lookupAddress);

  const withdrawUSDTHook = useWithdrawUSDTPresale();
  const withdrawBNBHook = useWithdrawBNBPresale();
  const withdrawAllHook = useWithdrawAllPresale();
  const setTokenPriceHook = useSetTokenPrice();
  const [newPrice, setNewPrice] = useState("");

  const handleSearch = () => {
    if (input.match(/^0x[a-fA-F0-9]{40}$/)) {
      setLookupAddress(input as `0x${string}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection & Contract Info */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
          {isConnected ? "✓ Wallet Connected" : "⚠ Wallet Not Connected"}
        </Badge>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Presale:</span>
          <CopyAddress address={contracts.MYBOO_PRESALE} truncate />
        </div>
      </div>

      {/* User Lookup Section */}
      <div className="flex gap-3 max-w-xl">
        <Input
          placeholder="Enter wallet address (0x...)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="bg-card border-border font-mono text-sm"
        />
        <Button onClick={handleSearch} className="shrink-0">
          <Search className="h-4 w-4 mr-2" />
          Lookup
        </Button>
      </div>

      {lookupAddress && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="MyBoo Balance"
            value={formatNumber(data.mybooBalance.formatted)}
            icon={<Layers className="h-5 w-5" />}
            isLoading={data.mybooBalance.isLoading}
            isError={data.mybooBalance.isError}
          />
          <StatCard
            title="MYBUBU Balance"
            value={formatNumber(data.mybubuBalance.formatted)}
            icon={<Coins className="h-5 w-5" />}
            isLoading={data.mybubuBalance.isLoading}
            isError={data.mybubuBalance.isError}
          />
          <StatCard
            title="USD Spent in Presale"
            value={`$${formatNumber(data.presaleInfo.usdSpent)}`}
            icon={<DollarSign className="h-5 w-5" />}
            isLoading={data.presaleInfo.isLoading}
            isError={data.presaleInfo.isError}
          />
          <StatCard
            title="Referral Count"
            value={String(data.referralCount)}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="NFT Nodes Owned"
            value={data.nftBalance.data ? String(data.nftBalance.data) : "0"}
            icon={<Image className="h-5 w-5" />}
            isLoading={data.nftBalance.isLoading}
            isError={data.nftBalance.isError}
          />
          <StatCard
            title="Pending Rewards"
            value="—"
            icon={<Gift className="h-5 w-5" />}
            subtitle="Connect wallet to view"
          />
        </div>
      )}

      {!lookupAddress && (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          <p className="text-sm">Enter a wallet address to view on-chain data</p>
        </div>
      )}

      {/* Presale Admin: Withdraw Functions */}
      <h3 className="text-lg font-semibold text-foreground pt-4 border-t border-border">
        Presale Withdraw Functions
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard title="Withdraw USDT" icon={<DollarSign className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Withdraw all accumulated USDT from the presale contract to the owner.
          </p>
          <SubmitButton
            onClick={() => withdrawUSDTHook.withdrawUSDT()}
            isPending={withdrawUSDTHook.isPending}
            isConfirming={withdrawUSDTHook.isConfirming}
            label="Withdraw USDT"
            isConnected={isConnected}
          />
        </SectionCard>

        <SectionCard title="Withdraw BNB" icon={<Banknote className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Withdraw all accumulated BNB from the presale contract to the owner.
          </p>
          <SubmitButton
            onClick={() => withdrawBNBHook.withdrawBNB()}
            isPending={withdrawBNBHook.isPending}
            isConfirming={withdrawBNBHook.isConfirming}
            label="Withdraw BNB"
            isConnected={isConnected}
          />
        </SectionCard>

        <SectionCard title="Withdraw All" icon={<AlertTriangle className="h-4 w-4 text-destructive" />}>
          <p className="text-xs text-muted-foreground">
            Withdraw both USDT and BNB from the presale contract to the owner in one transaction.
          </p>
          <SubmitButton
            onClick={() => withdrawAllHook.withdrawAll()}
            isPending={withdrawAllHook.isPending}
            isConfirming={withdrawAllHook.isConfirming}
            label="Withdraw All"
            variant="destructive"
            isConnected={isConnected}
          />
        </SectionCard>

        <SectionCard title="Set Token Price" icon={<Tag className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Update the MyBoo presale price (in USD). Example: 0.0001
          </p>
          <NumericInput
            placeholder="New price in USD"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="bg-card border-border"
          />
          <SubmitButton
            onClick={() => setTokenPriceHook.setTokenPrice(newPrice)}
            isPending={setTokenPriceHook.isPending}
            isConfirming={setTokenPriceHook.isConfirming}
            label="Update Price"
            disabled={!newPrice}
            isConnected={isConnected}
          />
        </SectionCard>
      </div>
    </div>
  );
}
