import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/numeric-input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CopyAddress } from "@/components/CopyAddress";
import { useChainContracts } from "@/hooks/useContractData";
import { Plus, X, Percent, ArrowDownToLine, ArrowUpFromLine, Coins, Send, Timer } from "lucide-react";
import { useAccount } from "wagmi";
import { useExcludeFromFeeBatch } from "@/hooks/datasenders/useExcludeFromFeeBatch";
import {
  useSetSellRate,
  useWithdrawEth,
  useWithdrawalToken,
  useSetMaxAmount,
  useSetMinAmount,
  useSetTransferLimit,
} from "@/hooks/datasenders/useMybubuWrite";
import { parseUnits } from "viem";

const isValidAddress = (a: string) => /^0x[a-fA-F0-9]{40}$/.test(a);

export function TokenAdmin() {
  const contracts = useChainContracts();
  const { isConnected } = useAccount();

  // Exclude from fee batch
  const [feeAddresses, setFeeAddresses] = useState<string[]>([""]);
  const [excluded, setExcluded] = useState(true);
  const excludeFee = useExcludeFromFeeBatch();

  // Sell rate
  const [sellRate, setSellRateInput] = useState("");
  const sellRateHook = useSetSellRate();

  // Withdraw BNB
  const [withdrawRecipient, setWithdrawRecipient] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const withdrawEthHook = useWithdrawEth();

  // Withdraw Token
  const [tokenAddr, setTokenAddr] = useState("");
  const [tokenReceiver, setTokenReceiver] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState("18");
  const withdrawTokenHook = useWithdrawalToken();

  // Max/Min amounts
  const [maxAmount, setMaxAmountInput] = useState("");
  const maxAmountHook = useSetMaxAmount();
  const [minAmount, setMinAmountInput] = useState("");
  const minAmountHook = useSetMinAmount();

  // Transfer Limit
  const [transferLimitAmount, setTransferLimitAmount] = useState("");
  const [transferLimitPeriod, setTransferLimitPeriod] = useState("");
  const transferLimitHook = useSetTransferLimit();

  const addAddressField = () => setFeeAddresses((prev) => [...prev, ""]);
  const removeAddressField = (i: number) => setFeeAddresses((prev) => prev.filter((_, idx) => idx !== i));
  const updateAddress = (i: number, v: string) => setFeeAddresses((prev) => prev.map((a, idx) => (idx === i ? v : a)));

  const handleExcludeFromFee = () => {
    const valid = feeAddresses.map((a) => a.trim()).filter(isValidAddress) as `0x${string}`[];
    if (valid.length === 0) return;
    excludeFee.excludeFromFeeBatch(valid, excluded);
  };

  const contractList = [
    { name: "MYBUBU Token", address: contracts.MYBUBU_TOKEN },
    { name: "MyBoo Token", address: contracts.MYBOO_TOKEN },
    { name: "Presale", address: contracts.MYBOO_PRESALE },
    { name: "Swap", address: contracts.SWAP },
    { name: "MyMomo", address: contracts.MYMOMO_TOKEN },
    { name: "NFT Node", address: contracts.NFT_NODE },
    { name: "USDT", address: contracts.USDT },
  ];

  const SectionCard = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
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

  const SubmitButton = ({
    onClick,
    isPending,
    isConfirming,
    label = "Submit",
    disabled = false,
  }: {
    onClick: () => void;
    isPending: boolean;
    isConfirming: boolean;
    label?: string;
    disabled?: boolean;
  }) => (
    <Button
      size="sm"
      onClick={onClick}
      disabled={!isConnected || isPending || isConfirming || disabled}
    >
      {isPending ? "Confirming…" : isConfirming ? "Waiting…" : label}
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
          {isConnected ? "✓ Wallet Connected" : "⚠ Wallet Not Connected"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exclude From Fee Batch */}
        <SectionCard title="Exclude From Fee (Batch)" icon={<Coins className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Batch set/unset tax exemption. Exempt addresses skip sell fees and transfer limits.
          </p>
          <div className="flex items-center gap-3">
            <Switch id="excluded-toggle" checked={excluded} onCheckedChange={setExcluded} />
            <Label htmlFor="excluded-toggle" className="text-sm text-foreground">
              {excluded ? "Exclude (exempt)" : "Include (not exempt)"}
            </Label>
          </div>
          <div className="space-y-2">
            {feeAddresses.map((addr, i) => (
              <div key={i} className="flex gap-2">
                <Input                  placeholder="0x... wallet address"
                  value={addr}
                  onChange={(e) => updateAddress(i, e.target.value)}
                  className="bg-background border-border font-mono text-xs"
                />
                {feeAddresses.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeAddressField(i)} className="shrink-0 text-muted-foreground hover:text-destructive">
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
            <SubmitButton onClick={handleExcludeFromFee} isPending={excludeFee.isPending} isConfirming={excludeFee.isConfirming} />
          </div>
        </SectionCard>

        {/* Set Sell Rate */}
        <SectionCard title="Set Sell Rate" icon={<Percent className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Change sell tax rate in basis points (/10000). Default: 500 (5%). E.g. 1000 = 10%.
          </p>
          <div className="flex gap-2">
            <NumericInput              placeholder="Basis points (e.g. 500 = 5%)"
              value={sellRate}
              onChange={(e) => setSellRateInput(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <SubmitButton
              onClick={() => sellRateHook.setSellRate(BigInt(sellRate || "0"))}
              isPending={sellRateHook.isPending}
              isConfirming={sellRateHook.isConfirming}
              disabled={!sellRate}
            />
          </div>
          {sellRate && (
            <p className="text-xs text-accent-foreground">
              = {(Number(sellRate) / 100).toFixed(2)}% sell tax
            </p>
          )}
        </SectionCard>

        {/* Withdraw BNB */}
        <SectionCard title="Withdraw BNB" icon={<Send className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Withdraw BNB from contract to any address. Requires sufficient balance.
          </p>
          <Input            placeholder="Recipient address (0x...)"
            value={withdrawRecipient}
            onChange={(e) => setWithdrawRecipient(e.target.value)}
            className="bg-background border-border font-mono text-xs"
          />
          <div className="flex gap-2">
            <NumericInput              placeholder="Amount in BNB"
              step="0.01"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <SubmitButton
              onClick={() => withdrawEthHook.withdrawEth(withdrawRecipient as `0x${string}`, withdrawAmount)}
              isPending={withdrawEthHook.isPending}
              isConfirming={withdrawEthHook.isConfirming}
              disabled={!isValidAddress(withdrawRecipient) || !withdrawAmount}
            />
          </div>
        </SectionCard>

        {/* Withdraw Token */}
        <SectionCard title="Withdraw ERC20 Token" icon={<ArrowUpFromLine className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Withdraw any ERC20 token from contract to any address.
          </p>
          <Input            placeholder="Token contract address (0x...)"
            value={tokenAddr}
            onChange={(e) => setTokenAddr(e.target.value)}
            className="bg-background border-border font-mono text-xs"
          />
          <Input            placeholder="Receiver address (0x...)"
            value={tokenReceiver}
            onChange={(e) => setTokenReceiver(e.target.value)}
            className="bg-background border-border font-mono text-xs"
          />
          <div className="flex gap-2">
            <NumericInput              placeholder="Amount"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              className="bg-background border-border text-sm flex-1"
            />
            <NumericInput              placeholder="Decimals"
              value={tokenDecimals}
              onChange={(e) => setTokenDecimals(e.target.value)}
              className="bg-background border-border text-sm w-20"
            />
            <SubmitButton
              onClick={() =>
                withdrawTokenHook.withdrawalToken(
                  tokenAddr as `0x${string}`,
                  tokenReceiver as `0x${string}`,
                  parseUnits(tokenAmount || "0", Number(tokenDecimals))
                )
              }
              isPending={withdrawTokenHook.isPending}
              isConfirming={withdrawTokenHook.isConfirming}
              disabled={!isValidAddress(tokenAddr) || !isValidAddress(tokenReceiver) || !tokenAmount}
            />
          </div>
        </SectionCard>

        {/* Set Max Deposit Amount */}
        <SectionCard title="Set Max Deposit (BNB)" icon={<ArrowDownToLine className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Set maximum BNB deposit per user. Default: 2 BNB.
          </p>
          <div className="flex gap-2">
            <NumericInput              placeholder="Max amount in BNB"
              step="0.1"
              value={maxAmount}
              onChange={(e) => setMaxAmountInput(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <SubmitButton
              onClick={() => maxAmountHook.setMaxAmount(maxAmount)}
              isPending={maxAmountHook.isPending}
              isConfirming={maxAmountHook.isConfirming}
              disabled={!maxAmount}
              label="Set Max"
            />
          </div>
        </SectionCard>

        {/* Set Min Deposit Amount */}
        <SectionCard title="Set Min Deposit (BNB)" icon={<ArrowDownToLine className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Set minimum BNB deposit amount. Default: 0.1 BNB.
          </p>
          <div className="flex gap-2">
            <NumericInput              placeholder="Min amount in BNB"
              step="0.01"
              value={minAmount}
              onChange={(e) => setMinAmountInput(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <SubmitButton
              onClick={() => minAmountHook.setMinAmount(minAmount)}
              isPending={minAmountHook.isPending}
              isConfirming={minAmountHook.isConfirming}
              disabled={!minAmount}
              label="Set Min"
            />
           </div>
        </SectionCard>

        {/* Set Transfer Limit */}
        <SectionCard title="Set Transfer Limit" icon={<Timer className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Set max token transfer amount per time period. Amount in tokens (18 decimals), period in seconds. E.g., 1000 tokens per 86400s (24h).
          </p>
          <div className="flex gap-2">
            <NumericInput              placeholder="Amount (tokens)"
              value={transferLimitAmount}
              onChange={(e) => setTransferLimitAmount(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <NumericInput              placeholder="Period (seconds)"
              value={transferLimitPeriod}
              onChange={(e) => setTransferLimitPeriod(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <SubmitButton
              onClick={() =>
                transferLimitHook.setTransferLimit(
                  parseUnits(transferLimitAmount || "0", 18),
                  BigInt(transferLimitPeriod || "0")
                )
              }
              isPending={transferLimitHook.isPending}
              isConfirming={transferLimitHook.isConfirming}
              disabled={!transferLimitAmount || !transferLimitPeriod}
              label="Set Limit"
            />
          </div>
          {transferLimitPeriod && (
            <p className="text-xs text-accent-foreground">
              = {(Number(transferLimitPeriod) / 3600).toFixed(1)} hours
            </p>
          )}
        </SectionCard>
      </div>

      {/* Contract Addresses */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-base">Contract Addresses</CardTitle>
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
