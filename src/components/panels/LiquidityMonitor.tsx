import { StatCard } from "@/components/StatCard";
import { DollarSign, Droplets, TrendingUp, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LiquidityMonitor() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Token Price (USD)"
          value="$0.001"
          icon={<TrendingUp className="h-5 w-5" />}
          subtitle="PancakeSwap integration pending"
        />
        <StatCard
          title="Total Liquidity (USD)"
          value="—"
          icon={<DollarSign className="h-5 w-5" />}
          subtitle="Coming Soon"
        />
        <StatCard
          title="MYBUBU in LP Pool"
          value="—"
          icon={<Coins className="h-5 w-5" />}
          subtitle="Coming Soon"
        />
        <StatCard
          title="BNB in LP Pool"
          value="—"
          icon={<Droplets className="h-5 w-5" />}
          subtitle="Coming Soon"
        />
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">PancakeSwap MYBUBU/BNB Pair</CardTitle>
          <Badge variant="secondary">Coming Soon</Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Liquidity pool monitoring will be available once the PancakeSwap pair is deployed. 
            This panel will show real-time reserves, price impact, and LP token data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
