import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { useUserLookup } from "@/hooks/useContractData";
import { Coins, Layers, DollarSign, Users, Image, Gift } from "lucide-react";

function formatNumber(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "0";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toFixed(4);
}

export function UserLookup() {
  const [input, setInput] = useState("");
  const [lookupAddress, setLookupAddress] = useState<`0x${string}` | undefined>();

  const data = useUserLookup(lookupAddress);

  const handleSearch = () => {
    if (input.match(/^0x[a-fA-F0-9]{40}$/)) {
      setLookupAddress(input as `0x${string}`);
    }
  };

  return (
    <div className="space-y-6">
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
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p className="text-sm">Enter a wallet address to view on-chain data</p>
        </div>
      )}
    </div>
  );
}
