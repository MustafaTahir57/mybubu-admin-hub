import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MYMOMO_ABI } from "@/config/contracts";
import { useChainContracts } from "@/hooks/useContractData";
import { toast } from "sonner";
import { useEffect } from "react";

function useMymomoBaseWrite() {
  const contracts = useChainContracts();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) toast.success("Transaction confirmed!");
    if (error) toast.error(error.message?.slice(0, 100) || "Transaction failed");
  }, [isSuccess, error]);

  return { writeContract, hash, isPending, isConfirming, isSuccess, contractAddress: contracts.MYMOMO_TOKEN };
}

export function useSetSellTaxPercent() {
  const { writeContract, contractAddress, ...rest } = useMymomoBaseWrite();
  return {
    ...rest,
    setSellTaxPercent: (percent: bigint) =>
      writeContract({ address: contractAddress, abi: MYMOMO_ABI, functionName: "setSellTaxPercent", args: [percent] }),
  };
}

export function useSetBuyTaxPercent() {
  const { writeContract, contractAddress, ...rest } = useMymomoBaseWrite();
  return {
    ...rest,
    setBuyTaxPercent: (percent: bigint) =>
      writeContract({ address: contractAddress, abi: MYMOMO_ABI, functionName: "setBuyTaxPercent", args: [percent] }),
  };
}

export function useSetSwapPair() {
  const { writeContract, contractAddress, ...rest } = useMymomoBaseWrite();
  return {
    ...rest,
    setSwapPair: (pair: `0x${string}`) =>
      writeContract({ address: contractAddress, abi: MYMOMO_ABI, functionName: "setSwapPair", args: [pair] }),
  };
}
