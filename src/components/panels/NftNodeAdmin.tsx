import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/numeric-input";
import { CopyAddress } from "@/components/CopyAddress";
import { useChainContracts } from "@/hooks/useContractData";
import { DollarSign, Hash, Banknote, Wallet, Send, AlertTriangle, Link2, UserCog } from "lucide-react";
import { useAccount } from "wagmi";
import {
  useSetMintPriceUSDT,
  useSetMaxSupply,
  useDistributeDividends,
  useWithdrawUSDTFunds,
  useWithdrawUSDTTo,
  useEmergencyWithdraw,
  useSetBaseURI,
  useTransferOwnershipNftNode,
} from "@/hooks/datasenders/useNftNodeWrite";

const isValidAddress = (a: string) => /^0x[a-fA-F0-9]{40}$/.test(a);

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
  variant = "default" as "default" | "destructive",
  isConnected = true,
}: {
  onClick: () => void;
  isPending: boolean;
  isConfirming: boolean;
  label?: string;
  disabled?: boolean;
  variant?: "default" | "destructive";
  isConnected?: boolean;
}) => (
  <Button
    size="sm"
    variant={variant}
    onClick={onClick}
    disabled={!isConnected || isPending || isConfirming || disabled}
  >
    {isPending ? "Confirming…" : isConfirming ? "Waiting…" : label}
  </Button>
);

export function NftNodeAdmin() {
  const contracts = useChainContracts();
  const { isConnected } = useAccount();

  const [mintPrice, setMintPrice] = useState("");
  const mintPriceHook = useSetMintPriceUSDT();

  const [maxSupply, setMaxSupply] = useState("");
  const maxSupplyHook = useSetMaxSupply();

  const [dividendAmount, setDividendAmount] = useState("");
  const dividendHook = useDistributeDividends();

  const withdrawFundsHook = useWithdrawUSDTFunds();

  const [usdtRecipient, setUsdtRecipient] = useState("");
  const [usdtAmount, setUsdtAmount] = useState("");
  const withdrawToHook = useWithdrawUSDTTo();

  const emergencyHook = useEmergencyWithdraw();

  const [baseURI, setBaseURIInput] = useState("");
  const baseURIHook = useSetBaseURI();

  const [newOwner, setNewOwner] = useState("");
  const transferOwnershipHook = useTransferOwnershipNftNode();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
          {isConnected ? "✓ Wallet Connected" : "⚠ Wallet Not Connected"}
        </Badge>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Contract:</span>
          <CopyAddress address={contracts.NFT_NODE} truncate />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Set Mint Price */}
        <SectionCard title="Set Mint Price (USDT)" icon={<DollarSign className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Change NFT mint price in USDT (18 decimals). Default: 500 USDT. Must be &gt; 0.
          </p>
          <div className="flex gap-2">
            <NumericInput
                  placeholder="Price in USDT (e.g. 500)"
              step="1"
              value={mintPrice}
              onChange={(e) => setMintPrice(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <SubmitButton isConnected={isConnected}
              onClick={() => mintPriceHook.setMintPriceUSDT(mintPrice)}
              isPending={mintPriceHook.isPending}
              isConfirming={mintPriceHook.isConfirming}
              disabled={!mintPrice || Number(mintPrice) <= 0}
              label="Set Price"
            />
          </div>
        </SectionCard>

        {/* Set Max Supply */}
        <SectionCard title="Set Max Supply" icon={<Hash className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Change maximum NFT supply. Cannot set below totalMinted. Default: 1000.
          </p>
          <div className="flex gap-2">
            <NumericInput
                  placeholder="Max supply (e.g. 1000)"
              step="1"
              value={maxSupply}
              onChange={(e) => setMaxSupply(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <SubmitButton isConnected={isConnected}
              onClick={() => maxSupplyHook.setMaxSupply(maxSupply)}
              isPending={maxSupplyHook.isPending}
              isConfirming={maxSupplyHook.isConfirming}
              disabled={!maxSupply || Number(maxSupply) <= 0}
              label="Set Supply"
            />
          </div>
        </SectionCard>

        {/* Distribute Dividends */}
        <SectionCard title="Distribute Dividends" icon={<Banknote className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Send BNB with this call. BNB is split equally per minted NFT. Each NFT can later claim its share.
          </p>
          <div className="flex gap-2">
            <NumericInput
                  placeholder="BNB amount to distribute"
              step="0.01"
              value={dividendAmount}
              onChange={(e) => setDividendAmount(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <SubmitButton isConnected={isConnected}
              onClick={() => dividendHook.distributeDividends(dividendAmount)}
              isPending={dividendHook.isPending}
              isConfirming={dividendHook.isConfirming}
              disabled={!dividendAmount || Number(dividendAmount) <= 0}
              label="Distribute"
            />
          </div>
        </SectionCard>

        {/* Withdraw USDT Funds (All) */}
        <SectionCard title="Withdraw All USDT to Treasury" icon={<Wallet className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Withdraws ALL USDT balance to treasuryWallet. This is the accumulated USDT from mint payments.
          </p>
          <SubmitButton isConnected={isConnected}
            onClick={() => withdrawFundsHook.withdrawUSDTFunds()}
            isPending={withdrawFundsHook.isPending}
            isConfirming={withdrawFundsHook.isConfirming}
            label="Withdraw All USDT"
          />
        </SectionCard>

        {/* Withdraw USDT To */}
        <SectionCard title="Withdraw USDT To Address" icon={<Send className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Withdraw specific amount of USDT to any address.
          </p>
          <Input
                  placeholder="Recipient address (0x...)"
            value={usdtRecipient}
            onChange={(e) => setUsdtRecipient(e.target.value)}
            className="bg-background border-border font-mono text-xs"
          />
          <div className="flex gap-2">
            <NumericInput
                  placeholder="Amount in USDT"
              step="1"
              value={usdtAmount}
              onChange={(e) => setUsdtAmount(e.target.value)}
              className="bg-background border-border text-sm"
            />
            <SubmitButton isConnected={isConnected}
              onClick={() => withdrawToHook.withdrawUSDTTo(usdtRecipient as `0x${string}`, usdtAmount)}
              isPending={withdrawToHook.isPending}
              isConfirming={withdrawToHook.isConfirming}
              disabled={!isValidAddress(usdtRecipient) || !usdtAmount}
              label="Withdraw"
            />
          </div>
        </SectionCard>

        {/* Emergency Withdraw */}
        <SectionCard title="Emergency Withdraw BNB" icon={<AlertTriangle className="h-4 w-4 text-destructive" />}>
          <p className="text-xs text-muted-foreground">
            Withdraws BNB ABOVE unclaimed dividends only. Protects user claims — won't drain below what users are owed. Sends to owner.
          </p>
          <SubmitButton isConnected={isConnected}
            onClick={() => emergencyHook.emergencyWithdraw()}
            isPending={emergencyHook.isPending}
            isConfirming={emergencyHook.isConfirming}
            label="Emergency Withdraw"
            variant="destructive"
          />
        </SectionCard>

        {/* Set Base URI */}
        <SectionCard title="Set Base URI" icon={<Link2 className="h-4 w-4 text-primary" />}>
          <p className="text-xs text-muted-foreground">
            Update the metadata base URI for all NFTs. Typically an IPFS or HTTPS folder ending with "/". E.g. ipfs://CID/ or https://api.example.com/metadata/
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="https://... or ipfs://CID/"
              value={baseURI}
              onChange={(e) => setBaseURIInput(e.target.value)}
              className="bg-background border-border text-xs"
            />
            <SubmitButton
              isConnected={isConnected}
              onClick={() => baseURIHook.setBaseURI(baseURI)}
              isPending={baseURIHook.isPending}
              isConfirming={baseURIHook.isConfirming}
              disabled={!baseURI.trim()}
              label="Set URI"
            />
          </div>
        </SectionCard>

        {/* Transfer Ownership */}
        <SectionCard title="Transfer Ownership" icon={<UserCog className="h-4 w-4 text-destructive" />}>
          <p className="text-xs text-muted-foreground">
            Transfer contract ownership to a new address. This action is irreversible — the new owner gains full admin control.
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
