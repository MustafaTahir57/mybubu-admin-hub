import {useState} from "react";
import {ArrowDownToLine, ArrowUpFromLine, UserCog, Wallet, RefreshCw, Coins} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {NumericInput} from "@/components/ui/numeric-input";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import {useAccount} from "wagmi";
import {useDepositMybubu, useSwapWithdrawToken, useTransferOwnershipSwap} from "@/hooks/datasenders/useSwapWrite";
import {useSwapMybubuBalance} from "@/hooks/datareaders/useSwapMybubuBalance";

const isValidAddress = (a: string) => /^0x[a-fA-F0-9]{40}$/.test(a);

const SectionCard = ({title, icon, children}: {title: string; icon: React.ReactNode; children: React.ReactNode}) => (
  <Card className="bg-card border-border">
    <CardHeader className="pb-4">
      <CardTitle className="text-foreground flex items-center gap-2 text-base">{icon}{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">{children}</CardContent>
  </Card>
);

const SubmitButton = ({onClick, isPending, isConfirming, label = "Submit", disabled = false, isConnected = true}: {
  onClick: () => void; isPending: boolean; isConfirming: boolean; label?: string; disabled?: boolean; isConnected?: boolean;
}) => (
  <Button size="sm" onClick={onClick} disabled={!isConnected || isPending || isConfirming || disabled}>
    {isPending ? "Confirming…" : isConfirming ? "Waiting…" : label}
  </Button>
);

export function EventLogViewer() {
  const {isConnected} = useAccount();

  const [depositAmount, setDepositAmount] = useState("");
  const depositHook = useDepositMybubu();

  const [wTokenAddr, setWTokenAddr] = useState("");
  const [wTo, setWTo] = useState("");
  const [wAmount, setWAmount] = useState("");
  const [wDecimals, setWDecimals] = useState("18");
  const [withdrawAll, setWithdrawAll] = useState(false);
  const withdrawHook = useSwapWithdrawToken();

  const [newOwner, setNewOwner] = useState("");
  const transferOwnershipHook = useTransferOwnershipSwap();

  const swapMybubu = useSwapMybubuBalance();

  const formattedBalance = (() => {
    const n = parseFloat(swapMybubu.formatted);
    if (isNaN(n)) return "0";
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
    return n.toLocaleString(undefined, {maximumFractionDigits: 4});
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
          {isConnected ? "✓ Wallet Connected" : "⚠ Wallet Not Connected"}
        </Badge>
      </div>

      {/* MYBUBU Balance Hero */}
      <Card className="relative overflow-hidden border-border bg-gradient-to-br from-primary/20 via-card to-card">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
        <CardContent className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/30">
              <Coins className="h-7 w-7 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Wallet className="h-3.5 w-3.5" />
                Swap Contract Balance
              </div>
              {swapMybubu.isLoading ? (
                <Skeleton className="mt-2 h-9 w-48 bg-secondary" />
              ) : swapMybubu.isError ? (
                <p className="mt-1 text-sm text-destructive">Failed to load balance</p>
              ) : (
                <p className="mt-1 text-3xl font-bold text-gold sm:text-4xl">
                  {formattedBalance}
                  <span className="ml-2 text-base font-medium text-muted-foreground">MYBUBU</span>
                </p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => swapMybubu.refetch()}
            disabled={swapMybubu.isFetching}
            className="self-start sm:self-center"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${swapMybubu.isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Deposit MYBUBU" icon={<ArrowDownToLine className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Deposit MYBUBU tokens to fund the swap pool. Must approve this contract on MYBUBU token first.
          </p>
          <div className="flex gap-2">
            <NumericInput placeholder="Amount (tokens)" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="bg-background border-border text-sm" />
            <SubmitButton isConnected={isConnected} onClick={() => depositHook.depositMybubu(depositAmount)} isPending={depositHook.isPending} isConfirming={depositHook.isConfirming} disabled={!depositAmount} label="Deposit" />
          </div>
        </SectionCard>

        <SectionCard title="Withdraw Token" icon={<ArrowUpFromLine className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Withdraw any ERC20 token. Toggle "Withdraw All" to withdraw the full balance.
          </p>
          <Input placeholder="Token address (0x...)" value={wTokenAddr} onChange={(e) => setWTokenAddr(e.target.value)} className="bg-background border-border font-mono text-xs" />
          <Input placeholder="Recipient address (0x...)" value={wTo} onChange={(e) => setWTo(e.target.value)} className="bg-background border-border font-mono text-xs" />
          <div className="flex items-center gap-3">
            <Switch id="withdraw-all" checked={withdrawAll} onCheckedChange={setWithdrawAll} />
            <Label htmlFor="withdraw-all" className="text-sm text-foreground">{withdrawAll ? "Withdraw full balance" : "Specific amount"}</Label>
          </div>
          {!withdrawAll && (
            <div className="flex gap-2">
              <NumericInput placeholder="Amount" value={wAmount} onChange={(e) => setWAmount(e.target.value)} className="bg-background border-border text-sm flex-1" />
              <NumericInput placeholder="Decimals" value={wDecimals} onChange={(e) => setWDecimals(e.target.value)} className="bg-background border-border text-sm w-20" />
            </div>
          )}
          <SubmitButton isConnected={isConnected} onClick={() => withdrawHook.withdrawToken(wTokenAddr as `0x${string}`, wTo as `0x${string}`, wAmount, Number(wDecimals), withdrawAll)} isPending={withdrawHook.isPending} isConfirming={withdrawHook.isConfirming} disabled={!isValidAddress(wTokenAddr) || !isValidAddress(wTo) || (!withdrawAll && !wAmount)} label="Withdraw" />
        </SectionCard>

        <SectionCard title="Transfer Ownership" icon={<UserCog className="h-4 w-4 text-destructive" />}>
          <p className="text-xs text-muted-foreground">
            Transfer Swap contract ownership to a new address. This action is irreversible — the new owner gains full admin control of the Swap contract.
          </p>
          <Input
            placeholder="New owner address (0x...)"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            className="bg-background border-border font-mono text-xs"
          />
          <SubmitButton
            isConnected={isConnected}
            onClick={() => transferOwnershipHook.transferOwnership(newOwner as `0x${string}`)}
            isPending={transferOwnershipHook.isPending}
            isConfirming={transferOwnershipHook.isConfirming}
            disabled={!isValidAddress(newOwner)}
            label="Transfer Ownership"
          />
        </SectionCard>
      </div>
    </div>
  );
}
