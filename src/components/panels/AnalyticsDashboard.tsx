import { Coins, Users, Image, DollarSign, Layers, TrendingUp, Wallet, BarChart3 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useDashboardStats, useChainContracts } from "@/hooks/useContractData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useReadContract, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { MYBOO_PRESALE_ABI, NFT_NODE_ABI, MYBUBU_ABI, MYMOMO_ABI } from "@/config/contracts";

function formatNumber(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "0";
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toFixed(2);
}

function formatUsd(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "$0";
  return `$${formatNumber(value)}`;
}

export function AnalyticsDashboard() {
  const contracts = useChainContracts();
  const { mybooSupply, mybubuSupply, nftSupply, isLoading } = useDashboardStats();

  // Presale info
  const presaleInfo = useReadContract({
    address: contracts.MYBOO_PRESALE,
    abi: MYBOO_PRESALE_ABI,
    functionName: "getPresaleInfo",
  });

  const presaleData = presaleInfo.data as
    | [bigint, bigint, bigint, bigint, bigint, bigint, boolean, bigint, bigint]
    | undefined;

  const totalRaisedUSD = presaleData ? formatUnits(presaleData[2], 18) : "0";
  const totalRaisedUSDT = presaleData ? formatUnits(presaleData[3], 18) : "0";
  const totalRaisedBNB = presaleData ? formatUnits(presaleData[4], 18) : "0";
  const totalTokensSold = presaleData ? formatUnits(presaleData[5], 18) : "0";
  const presaleActive = presaleData ? presaleData[6] : false;
  const bnbPriceUSD = presaleData ? formatUnits(presaleData[7], 18) : "0";
  const remainingTokens = presaleData ? formatUnits(presaleData[8], 18) : "0";

  // NFT Node stats
  const nftStats = useReadContract({
    address: contracts.NFT_NODE,
    abi: NFT_NODE_ABI,
    functionName: "getFullStats",
  });

  const nftData = nftStats.data as readonly bigint[] | undefined;
  const totalMinted = nftData ? nftData[0].toString() : "0";
  const nftMaxSupply = nftData ? nftData[1].toString() : "0";
  const mintPriceUSDT = nftData ? formatUnits(nftData[2], 18) : "0";
  const totalUSDTCollected = nftData ? formatUnits(nftData[3], 18) : "0";

  // MYBUBU sell rate
  const sellRate = useReadContract({
    address: contracts.MYBUBU_TOKEN,
    abi: MYBUBU_ABI,
    functionName: "sellRate",
  });
  const sellRateValue = sellRate.data ? Number(sellRate.data) : 0;

  // MYMOMO reward pool
  const rewardPool = useReadContract({
    address: contracts.MYMOMO_TOKEN,
    abi: MYMOMO_ABI,
    functionName: "mymomoRewardPool",
  });
  const rewardPoolFormatted = rewardPool.data ? formatUnits(rewardPool.data as bigint, 18) : "0";

  // Total MYBUBU staked (from MYMOMO contract)
  const stakingStats = useReadContract({
    address: contracts.MYMOMO_TOKEN,
    abi: MYMOMO_ABI,
    functionName: "getStakingStats",
  });
  const stakingData = stakingStats.data as [bigint, bigint, bigint, `0x${string}`] | undefined;
  const totalMybubuStaked = stakingData ? formatUnits(stakingData[0], 18) : "0";

  // Contract BNB balances
  const mybubuBal = useBalance({ address: contracts.MYBUBU_TOKEN });
  const swapBal = useBalance({ address: contracts.SWAP });

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
      title: "NFT Nodes Minted",
      value: `${totalMinted} / ${nftMaxSupply}`,
      icon: <Image className="h-5 w-5" />,
      isLoading: nftStats.isLoading,
      isError: nftStats.isError,
      subtitle: `Mint price: ${formatNumber(mintPriceUSDT)} USDT`,
    },
    {
      title: "Presale USD Raised",
      value: formatUsd(totalRaisedUSD),
      icon: <DollarSign className="h-5 w-5" />,
      isLoading: presaleInfo.isLoading,
      isError: presaleInfo.isError,
      subtitle: presaleActive ? "🟢 Presale Active" : "🔴 Presale Inactive",
    },
    {
      title: "Presale Tokens Sold",
      value: formatNumber(totalTokensSold),
      icon: <TrendingUp className="h-5 w-5" />,
      isLoading: presaleInfo.isLoading,
      isError: presaleInfo.isError,
      subtitle: `${formatNumber(remainingTokens)} remaining`,
    },
    {
      title: "MyMomo Reward Pool",
      value: formatNumber(rewardPoolFormatted),
      icon: <Users className="h-5 w-5" />,
      isLoading: rewardPool.isLoading,
      isError: rewardPool.isError,
      subtitle: "MYBUBU tokens in pool",
    },
    {
      title: "MYBUBU Sell Tax",
      value: `${(sellRateValue / 100).toFixed(2)}%`,
      icon: <BarChart3 className="h-5 w-5" />,
      isLoading: sellRate.isLoading,
      isError: sellRate.isError,
      subtitle: `${sellRateValue} basis points`,
    },
    {
      title: "BNB Price (Oracle)",
      value: formatUsd(bnbPriceUSD),
      icon: <Wallet className="h-5 w-5" />,
      isLoading: presaleInfo.isLoading,
      isError: presaleInfo.isError,
    },
    {
      title: "NFT USDT Collected",
      value: formatUsd(totalUSDTCollected),
      icon: <DollarSign className="h-5 w-5" />,
      isLoading: nftStats.isLoading,
      isError: nftStats.isError,
    },
  ];

  // Chart: presale breakdown
  const chartData = [
    { name: "USDT Raised", value: parseFloat(totalRaisedUSDT), color: "hsl(45, 100%, 55%)" },
    { name: "BNB Raised (USD)", value: parseFloat(totalRaisedBNB) * parseFloat(bnbPriceUSD), color: "hsl(270, 80%, 60%)" },
    { name: "NFT USDT", value: parseFloat(totalUSDTCollected), color: "hsl(160, 70%, 50%)" },
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
          <CardTitle className="text-foreground">Revenue Breakdown (USD)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${formatNumber(String(v))}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number) => [`$${formatNumber(String(value))}`, "Amount"]}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
