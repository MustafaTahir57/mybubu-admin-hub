import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyAddress } from "@/components/CopyAddress";
import { useChainContracts, useTokenSupply } from "@/hooks/useContractData";
import { StatCard } from "@/components/StatCard";
import { Coins, Flame, Layers } from "lucide-react";
import { useAccount } from "wagmi";

function formatNumber(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "0";
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  return num.toFixed(2);
}

export function TokenAdmin() {
  const contracts = useChainContracts();
  const { isConnected } = useAccount();
  const mybooSupply = useTokenSupply(contracts.MYBOO_TOKEN);
  const mybubuSupply = useTokenSupply(contracts.MYBUBU_TOKEN);

  const contractList = [
    { name: "MyBoo Token", address: contracts.MYBOO_TOKEN },
    { name: "MYBUBU Token", address: contracts.MYBUBU_TOKEN },
    { name: "Presale", address: contracts.MYBOO_PRESALE },
    { name: "Swap", address: contracts.SWAP },
    { name: "MyMomo", address: contracts.MYMOMO_TOKEN },
    { name: "NFT Node", address: contracts.NFT_NODE },
    { name: "USDT", address: contracts.USDT },
  ];

  return (
    <div className="space-y-6">
      {/* Supply Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="MyBoo Total Supply"
          value={formatNumber(mybooSupply.formatted)}
          icon={<Layers className="h-5 w-5" />}
          isLoading={mybooSupply.isLoading}
          isError={mybooSupply.isError}
        />
        <StatCard
          title="MYBUBU Total Supply"
          value={formatNumber(mybubuSupply.formatted)}
          icon={<Coins className="h-5 w-5" />}
          isLoading={mybubuSupply.isLoading}
          isError={mybubuSupply.isError}
        />
        <StatCard
          title="Burned Tokens"
          value="—"
          icon={<Flame className="h-5 w-5" />}
          subtitle="Coming soon"
        />
      </div>

      {/* Admin Actions */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Admin Actions</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {isConnected ? "Connected" : "Not authorized"}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {isConnected
              ? "Admin actions (mint, burn, pause) will be available when connected as contract owner. Currently read-only."
              : "Connect your wallet to access admin functions. Only the contract owner can perform admin actions."}
          </p>
        </CardContent>
      </Card>

      {/* Contract Addresses */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Contract Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contractList.map((c) => (
              <div key={c.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm font-medium text-foreground">{c.name}</span>
                <CopyAddress address={c.address} truncate={false} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
