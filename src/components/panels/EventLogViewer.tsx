import { useState } from "react";
import { RefreshCw, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CopyAddress } from "@/components/CopyAddress";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "wagmi";
import { useDepositMybubu, useSwapWithdrawToken } from "@/hooks/datasenders/useSwapWrite";

const isValidAddress = (a: string) => /^0x[a-fA-F0-9]{40}$/.test(a);

// Mock data for events
const MOCK_EVENTS = Array.from({ length: 10 }, (_, i) => ({
  blockNumber: 40_000_000 + i * 100,
  from: `0x${(1234 + i).toString(16).padStart(40, "0")}`,
  to: `0x${(5678 + i).toString(16).padStart(40, "0")}`,
  amount: `${(Math.random() * 10000).toFixed(2)}`,
  txHash: `0x${(9999 + i).toString(16).padStart(64, "a")}`,
}));

const EVENT_TABS = [
  { id: "transfers", label: "Transfers" },
  { id: "presale", label: "Presale Buys" },
  { id: "swaps", label: "Swaps" },
  { id: "joins", label: "Joins" },
  { id: "nft-mints", label: "NFT Mints" },
];

export function EventLogViewer() {
  const { isConnected } = useAccount();
  const [refreshKey, setRefreshKey] = useState(0);

  // Deposit MYBUBU
  const [depositAmount, setDepositAmount] = useState("");
  const depositHook = useDepositMybubu();

  // Withdraw Token
  const [wTokenAddr, setWTokenAddr] = useState("");
  const [wTo, setWTo] = useState("");
  const [wAmount, setWAmount] = useState("");
  const [wDecimals, setWDecimals] = useState("18");
  const [withdrawAll, setWithdrawAll] = useState(false);
  const withdrawHook = useSwapWithdrawToken();

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

      {/* Admin Functions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deposit MYBUBU */}
        <SectionCard title="Deposit MYBUBU" icon={<ArrowDownToLine className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Deposit MYBUBU tokens to fund the swap pool. Must approve this contract on MYBUBU token first.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Amount (tokens)"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <SubmitButton
              onClick={() => depositHook.depositMybubu(depositAmount)}
              isPending={depositHook.isPending}
              isConfirming={depositHook.isConfirming}
              disabled={!depositAmount}
              label="Deposit"
            />
          </div>
        </SectionCard>

        {/* Withdraw Token */}
        <SectionCard title="Withdraw Token" icon={<ArrowUpFromLine className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Withdraw any ERC20 token. Toggle "Withdraw All" to withdraw the full balance.
          </p>
          <Input
            placeholder="Token address (0x...)"
            value={wTokenAddr}
            onChange={(e) => setWTokenAddr(e.target.value)}
            className="bg-background border-border font-mono text-xs"
          />
          <Input
            placeholder="Recipient address (0x...)"
            value={wTo}
            onChange={(e) => setWTo(e.target.value)}
            className="bg-background border-border font-mono text-xs"
          />
          <div className="flex items-center gap-3">
            <Switch id="withdraw-all" checked={withdrawAll} onCheckedChange={setWithdrawAll} />
            <Label htmlFor="withdraw-all" className="text-sm text-foreground">
              {withdrawAll ? "Withdraw full balance" : "Specific amount"}
            </Label>
          </div>
          {!withdrawAll && (
            <div className="flex gap-2">
              <Input
                placeholder="Amount"
                type="number"
                value={wAmount}
                onChange={(e) => setWAmount(e.target.value)}
                className="bg-background border-border text-sm flex-1"
              />
              <Input
                placeholder="Decimals"
                type="number"
                value={wDecimals}
                onChange={(e) => setWDecimals(e.target.value)}
                className="bg-background border-border text-sm w-20"
              />
            </div>
          )}
          <SubmitButton
            onClick={() => withdrawHook.withdrawToken(wTokenAddr as `0x${string}`, wTo as `0x${string}`, wAmount, Number(wDecimals), withdrawAll)}
            isPending={withdrawHook.isPending}
            isConfirming={withdrawHook.isConfirming}
            disabled={!isValidAddress(wTokenAddr) || !isValidAddress(wTo) || (!withdrawAll && !wAmount)}
            label="Withdraw"
          />
        </SectionCard>
      </div>

      {/* Event Logs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing last 50 events per tab (mock data)</p>
          <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="transfers" className="w-full">
          <TabsList className="bg-secondary border border-border">
            {EVENT_TABS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {EVENT_TABS.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <Card className="bg-card border-border">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Block #</TableHead>
                        <TableHead className="text-muted-foreground">From</TableHead>
                        <TableHead className="text-muted-foreground">To</TableHead>
                        <TableHead className="text-muted-foreground">Amount</TableHead>
                        <TableHead className="text-muted-foreground">Tx Hash</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_EVENTS.map((event, i) => (
                        <TableRow key={i} className="border-border">
                          <TableCell className="font-mono text-xs text-gold">
                            {event.blockNumber.toLocaleString()}
                          </TableCell>
                          <TableCell><CopyAddress address={event.from} /></TableCell>
                          <TableCell><CopyAddress address={event.to} /></TableCell>
                          <TableCell className="font-mono text-sm text-foreground">{event.amount}</TableCell>
                          <TableCell>
                            <a
                              href={`https://bscscan.com/tx/${event.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs text-primary hover:underline"
                            >
                              {event.txHash.slice(0, 10)}...
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
