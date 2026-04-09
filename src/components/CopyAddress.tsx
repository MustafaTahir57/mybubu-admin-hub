import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CopyAddressProps {
  address: string;
  truncate?: boolean;
}

export function CopyAddress({ address, truncate = true }: CopyAddressProps) {
  const [copied, setCopied] = useState(false);

  const display = truncate ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      <span>{display}</span>
      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}
