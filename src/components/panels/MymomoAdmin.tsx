import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/numeric-input";
import { useAccount } from "wagmi";
import { useSetSellTaxPercent, useSetBuyTaxPercent, useSetSwapPair } from "@/hooks/datasenders/useMymomoWrite";
import { Percent, ShoppingCart, ArrowLeftRight } from "lucide-react";

const isValidAddress = (a: string) => /^0x[a-fA-F0-9]{40}$/.test(a);

export function MymomoAdmin() {
  const { isConnected } = useAccount();

  const [sellTax, setSellTax] = useState("");
  const sellTaxHook = useSetSellTaxPercent();

  const [buyTax, setBuyTax] = useState("");
  const buyTaxHook = useSetBuyTaxPercent();

  const [swapPair, setSwapPair] = useState("");
  const swapPairHook = useSetSwapPair();

  const SectionCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
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

  const SubmitButton = ({ onClick, isPending, isConfirming, label = "Submit", disabled = false }: {
    onClick: () => void; isPending: boolean; isConfirming: boolean; label?: string; disabled?: boolean;
  }) => (
    <Button size="sm" onClick={onClick} disabled={!isConnected || isPending || isConfirming || disabled}>
      {isPending ? "Confirming…" : isConfirming ? "Waiting…" : label}
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
          {isConnected ? "✓ Wallet Connected" : "⚠ Wallet Not Connected"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Set Sell Tax */}
        <SectionCard title="Set Sell Tax Percent" icon={<Percent className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Sell tax in basis points (/10000). Default: 1000 (10%). Half burned, half to foundation.
          </p>
          <div className="flex gap-2">
            <NumericInput
                  placeholder="Basis points (e.g. 1000 = 10%)"
              value={sellTax}
              onChange={(e) => setSellTax(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <SubmitButton
              onClick={() => sellTaxHook.setSellTaxPercent(BigInt(sellTax || "0"))}
              isPending={sellTaxHook.isPending}
              isConfirming={sellTaxHook.isConfirming}
              disabled={!sellTax}
            />
          </div>
          {sellTax && (
            <p className="text-xs text-accent-foreground">
              = {(Number(sellTax) / 100).toFixed(2)}% sell tax
            </p>
          )}
        </SectionCard>

        {/* Set Buy Tax */}
        <SectionCard title="Set Buy Tax Percent" icon={<ShoppingCart className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Buy tax in basis points (/10000). Default: 10000 (100%) — blocks buying. Entire amount burned.
          </p>
          <div className="flex gap-2">
            <NumericInput
                  placeholder="Basis points (e.g. 10000 = 100%)"
              value={buyTax}
              onChange={(e) => setBuyTax(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <SubmitButton
              onClick={() => buyTaxHook.setBuyTaxPercent(BigInt(buyTax || "0"))}
              isPending={buyTaxHook.isPending}
              isConfirming={buyTaxHook.isConfirming}
              disabled={!buyTax}
            />
          </div>
          {buyTax && (
            <p className="text-xs text-accent-foreground">
              = {(Number(buyTax) / 100).toFixed(2)}% buy tax
            </p>
          )}
        </SectionCard>

        {/* Set Swap Pair */}
        <SectionCard title="Set Swap Pair" icon={<ArrowLeftRight className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Set DEX pair address for tax logic. Also approves max uint256 to PancakeSwap router.
          </p>
          <div className="flex gap-2">
            <Input
                  placeholder="Pair address (0x...)"
              value={swapPair}
              onChange={(e) => setSwapPair(e.target.value)}
              className="bg-background border-border font-mono text-xs"
            />
            <SubmitButton
              onClick={() => swapPairHook.setSwapPair(swapPair as `0x${string}`)}
              isPending={swapPairHook.isPending}
              isConfirming={swapPairHook.isConfirming}
              disabled={!isValidAddress(swapPair)}
              label="Set Pair"
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
