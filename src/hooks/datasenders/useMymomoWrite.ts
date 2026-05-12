import { useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from "wagmi";
import { MYMOMO_ABI, getContracts } from "@/config/contracts";
import { toast } from "sonner";
import { useEffect } from "react";

function useMymomoBaseWrite(successMessage: string) {
  const chainId = useChainId();
  const contracts = getContracts(chainId);
  const { address: account } = useAccount();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => { if (isSuccess) toast.success(successMessage); }, [isSuccess]);
  useEffect(() => { if (error) toast.error(error.message?.slice(0, 100) || "Transaction failed"); }, [error]);

  return { writeContract, contracts, account, hash, isPending, isConfirming, isSuccess, error, reset };
}

export function useSetSellTaxPercent() {
  const { writeContract, contracts, account, ...rest } = useMymomoBaseWrite("Sell tax updated!");
  return {
    ...rest,
    setSellTaxPercent: (percent: bigint) => {
      if (!account) { toast.error("Connect wallet first"); return; }
      writeContract({ address: contracts.MYMOMO_TOKEN, abi: MYMOMO_ABI, functionName: "setSellTaxPercent", args: [percent] } as any);
    },
  };
}

export function useSetBuyTaxPercent() {
  const { writeContract, contracts, account, ...rest } = useMymomoBaseWrite("Buy tax updated!");
  return {
    ...rest,
    setBuyTaxPercent: (percent: bigint) => {
      if (!account) { toast.error("Connect wallet first"); return; }
      writeContract({ address: contracts.MYMOMO_TOKEN, abi: MYMOMO_ABI, functionName: "setBuyTaxPercent", args: [percent] } as any);
    },
  };
}

export function useSetSwapPair() {
  const { writeContract, contracts, account, ...rest } = useMymomoBaseWrite("Swap pair updated!");
  return {
    ...rest,
    setSwapPair: (pair: `0x${string}`) => {
      if (!account) { toast.error("Connect wallet first"); return; }
      writeContract({ address: contracts.MYMOMO_TOKEN, abi: MYMOMO_ABI, functionName: "setSwapPair", args: [pair] } as any);
    },
  };
}

export function useTransferOwnershipMymomo() {
  const { writeContract, contracts, account, ...rest } = useMymomoBaseWrite("Ownership transferred!");
  return {
    ...rest,
    transferOwnership: (newOwner: `0x${string}`) => {
      if (!account) { toast.error("Connect wallet first"); return; }
      writeContract({ address: contracts.MYMOMO_TOKEN, abi: MYMOMO_ABI, functionName: "transferOwnership", args: [newOwner] } as any);
    },
  };
}

export function useSetDailyRewardRate() {
  const { writeContract, contracts, account, ...rest } = useMymomoBaseWrite("Daily reward rate updated!");
  return {
    ...rest,
    setDailyRewardRate: (rate: number) => {
      if (!account) { toast.error("Connect wallet first"); return; }
      const scaled = BigInt(Math.round(rate * 1000));
      writeContract({ address: contracts.MYMOMO_TOKEN, abi: MYMOMO_ABI, functionName: "setDailyRewardRate", args: [scaled] } as any);
    },
  };
}
