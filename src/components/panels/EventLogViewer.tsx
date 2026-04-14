import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/numeric-input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "wagmi";
import { useDepositMybubu, useSwapWithdrawToken } from "@/hooks/datasenders/useSwapWrite";

const isValidAddress = (a: string) => /^0x[a-fA-F0-9]{40}$/.test(a);

export function EventLogViewer() {
  const { isConnected } = useAccount();

  const [depositAmount, setDepositAmount] = useState("");
  const depositHook = useDepositMybubu();

  const [wTokenAddr, setWTokenAddr] = useState("");
  const [wTo, setWTo] = useState("");
  const [wAmount, setWAmount] = useState("");
  const [wDecimals, setWDecimals] = useState("18");
  const [withdrawAll, setWithdrawAll] = useState(false);
  const withdrawHook = useSwapWithdrawToken();

  const SectionCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground flex items-center gap-2 text-base">{icon}{title}</CardTitle>
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
        <SectionCard title="Deposit MYBUBU" icon={<ArrowDownToLine className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Deposit MYBUBU tokens to fund the swap pool. Must approve this contract on MYBUBU token first.
          </p>
          <div className="flex gap-2">
            <NumericInput placeholder="Amount (tokens)"  value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="bg-background border-border text-sm" />
            <SubmitButton onClick={() => depositHook.depositMybubu(depositAmount)} isPending={depositHook.isPending} isConfirming={depositHook.isConfirming} disabled={!depositAmount} label="Deposit" />
          </div>
        </SectionCard>

        <SectionCard title="Withdraw Token" icon={<ArrowUpFromLine className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Withdraw any ERC20 token. Toggle "Withdraw All" to withdraw the full balance.
          </p>
          <Inputplaceholder="Token address (0x...)" value={wTokenAddr} onChange={(e) => setWTokenAddr(e.target.value)} className="bg-background border-border font-mono text-xs" />
          <Inputplaceholder="Recipient address (0x...)" value={wTo} onChange={(e) => setWTo(e.target.value)} className="bg-background border-border font-mono text-xs" />
          <div className="flex items-center gap-3">
            <Switch id="withdraw-all" checked={withdrawAll} onCheckedChange={setWithdrawAll} />
            <Label htmlFor="withdraw-all" className="text-sm text-foreground">{withdrawAll ? "Withdraw full balance" : "Specific amount"}</Label>
          </div>
          {!withdrawAll && (
            <div className="flex gap-2">
              <NumericInput placeholder="Amount"  value={wAmount} onChange={(e) => setWAmount(e.target.value)} className="bg-background border-border text-sm flex-1" />
              <NumericInput placeholder="Decimals"  value={wDecimals} onChange={(e) => setWDecimals(e.target.value)} className="bg-background border-border text-sm w-20" />
            </div>
          )}
          <SubmitButton onClick={() => withdrawHook.withdrawToken(wTokenAddr as `0x${string}`, wTo as `0x${string}`, wAmount, Number(wDecimals), withdrawAll)} isPending={withdrawHook.isPending} isConfirming={withdrawHook.isConfirming} disabled={!isValidAddress(wTokenAddr) || !isValidAddress(wTo) || (!withdrawAll && !wAmount)} label="Withdraw" />
        </SectionCard>
      </div>
    </div>
  );
}
