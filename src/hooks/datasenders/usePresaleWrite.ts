import { useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from "wagmi";
import { MYBOO_PRESALE_ABI, getContracts } from "@/config/contracts";
import { toast } from "sonner";
import { useEffect } from "react";
import { parseUnits } from "viem";

function usePresaleBaseWrite(successMessage: string) {
  const chainId = useChainId();
  const contracts = getContracts(chainId);
  const { address: account } = useAccount();

  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) toast.success(successMessage);
  }, [isSuccess]);

  useEffect(() => {
    if (error) toast.error(error.message?.slice(0, 100) || "Transaction failed");
  }, [error]);

  return { writeContract, contracts, account, hash, isPending, isConfirming, isSuccess, error, reset };
}

export function useWithdrawUSDTPresale() {
  const { writeContract, contracts, account, ...rest } = usePresaleBaseWrite("USDT withdrawn from presale!");

  const withdrawUSDT = () => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.MYBOO_PRESALE,
      abi: MYBOO_PRESALE_ABI,
      functionName: "withdrawUSDT",
    } as any);
  };

  return { withdrawUSDT, ...rest };
}

export function useWithdrawBNBPresale() {
  const { writeContract, contracts, account, ...rest } = usePresaleBaseWrite("BNB withdrawn from presale!");

  const withdrawBNB = () => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.MYBOO_PRESALE,
      abi: MYBOO_PRESALE_ABI,
      functionName: "withdrawBNB",
    } as any);
  };

  return { withdrawBNB, ...rest };
}

export function useWithdrawAllPresale() {
  const { writeContract, contracts, account, ...rest } = usePresaleBaseWrite("All funds withdrawn from presale!");

  const withdrawAll = () => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.MYBOO_PRESALE,
      abi: MYBOO_PRESALE_ABI,
      functionName: "withdrawAll",
    } as any);
  };

  return { withdrawAll, ...rest };
}

export function useSetTokenPrice() {
  const { writeContract, contracts, account, ...rest } = usePresaleBaseWrite("Token price updated!");

  // newPriceUSD is expected in USD (human readable). The contract stores it as
  // an 18-decimal fixed point value (matching USDT/MYBOO scaling on BSC).
  const setTokenPrice = (newPriceUSD: string) => {
    if (!account) { toast.error("Connect wallet first"); return; }
    if (!newPriceUSD || isNaN(Number(newPriceUSD)) || Number(newPriceUSD) <= 0) {
      toast.error("Enter a valid price");
      return;
    }
    try {
      const priceWei = parseUnits(newPriceUSD, 18);
      writeContract({
        address: contracts.MYBOO_PRESALE,
        abi: MYBOO_PRESALE_ABI,
        functionName: "setTokenPrice",
        args: [priceWei],
      } as any);
    } catch (e: any) {
      toast.error(e?.message?.slice(0, 100) || "Invalid price");
    }
  };

  return { setTokenPrice, ...rest };
}
