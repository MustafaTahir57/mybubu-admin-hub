import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CopyAddress } from "@/components/CopyAddress";
import { useChainContracts, useTokenSupply } from "@/hooks/useContractData";
import { StatCard } from "@/components/StatCard";
import { Coins, Flame, Layers, Plus, X } from "lucide-react";
import { useAccount } from "wagmi";
import { useExcludeFromFeeBatch } from "@/hooks/datasenders/useExcludeFromFeeBatch";

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

  // Exclude from fee batch state
  const [feeAddresses, setFeeAddresses] = useState<string[]>([""]);
  const [excluded, setExcluded] = useState(true);
  const { excludeFromFeeBatch, isPending, isConfirming } = useExcludeFromFeeBatch();

  const addAddressField = () => setFeeAddresses((prev) => [...prev, ""]);
  const removeAddressField = (index: number) =>
    setFeeAddresses((prev) => prev.filter((_, i) => i !== index));
  const updateAddress = (index: number, value: string) =>
    setFeeAddresses((prev) => prev.map((a, i) => (i === index ? value : a)));

  const handleExcludeFromFee = () => {
    const valid = feeAddresses
      .map((a) => a.trim())
      .filter((a) => /^0x[a-fA-F0-9]{40}$/.test(a)) as `0x${string}`[];
    if (valid.length === 0) return;
    excludeFromFeeBatch(valid, excluded);
  };

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

      {/* Exclude From Fee Batch */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Exclude From Fee (Batch)</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {isConnected ? "Connected" : "Not authorized"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Batch set/unset tax exemption for multiple addresses. Tax exempt addresses skip all sell fees and transfer limits.
          </p>

          <div className="flex items-center gap-3">
            <Switch
              id="excluded-toggle"
              checked={excluded}
              onCheckedChange={setExcluded}
            />
            <Label htmlFor="excluded-toggle" className="text-sm text-foreground">
              {excluded ? "Exclude from fees (exempt)" : "Include in fees (not exempt)"}
            </Label>
          </div>

          <div className="space-y-2">
            {feeAddresses.map((addr, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="0x... wallet address"
                  value={addr}
                  onChange={(e) => updateAddress(i, e.target.value)}
                  className="bg-background border-border font-mono text-sm"
                />
                {feeAddresses.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAddressField(i)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={addAddressField}>
              <Plus className="h-4 w-4 mr-1" /> Add Address
            </Button>
            <Button
              size="sm"
              onClick={handleExcludeFromFee}
              disabled={!isConnected || isPending || isConfirming}
            >
              {isPending ? "Confirming…" : isConfirming ? "Waiting…" : "Submit Transaction"}
            </Button>
          </div>
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