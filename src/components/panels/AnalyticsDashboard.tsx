import { Coins, Users, Image, DollarSign, Layers, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useDashboardStats, useChainContracts } from "@/hooks/useContractData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock chart data (would need an indexer for real historical data)
const mockVolumeData = [
  { day: "Mon", volume: 12400 },
  { day: "Tue", volume: 18200 },
  { day: "Wed", volume: 15600 },
  { day: "Thu", volume: 22100 },
  { day: "Fri", volume: 19800 },
  { day: "Sat", volume: 24500 },
  { day: "Sun", volume: 21300 },
];

function formatNumber(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "0";
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toFixed(2);
}

export function AnalyticsDashboard() {
  const { mybooSupply, mybubuSupply, nftSupply, isLoading } = useDashboardStats();

  const stats = [
    {
      title: "Total MYBUBU Supply",
      value: formatNumber(mybubuSupply.formatted),
      icon: <Coins className="h-5 w-5" />,
      isLoading: mybubuSupply.isLoading,
      isError: mybubuSupply.isError,
    },
    {
      title: "Total MyBoo Supply",
      value: formatNumber(mybooSupply.formatted),
      icon: <Layers className="h-5 w-5" />,
      isLoading: mybooSupply.isLoading,
      isError: mybooSupply.isError,
    },
    {
      title: "Total NFT Nodes Minted",
      value: formatNumber(nftSupply.formatted),
      icon: <Image className="h-5 w-5" />,
      isLoading: nftSupply.isLoading,
      isError: nftSupply.isError,
    },
    {
      title: "Presale USDT Raised",
      value: "—",
      icon: <DollarSign className="h-5 w-5" />,
      subtitle: "Connect to view",
    },
    {
      title: "Total Staked in MyMomo",
      value: "—",
      icon: <Users className="h-5 w-5" />,
      subtitle: "Coming soon",
    },
    {
      title: "Current Token Price",
      value: "$0.001",
      icon: <TrendingUp className="h-5 w-5" />,
      subtitle: "Hardcoded — PancakeSwap integration pending",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Daily Volume (Mock Data)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="day" stroke="hsl(220, 15%, 65%)" fontSize={12} />
                <YAxis stroke="hsl(220, 15%, 65%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220, 18%, 12%)",
                    border: "1px solid hsl(220, 15%, 18%)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="hsl(270, 80%, 60%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(270, 80%, 60%)", r: 4 }}
                  activeDot={{ r: 6, fill: "hsl(45, 100%, 55%)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
