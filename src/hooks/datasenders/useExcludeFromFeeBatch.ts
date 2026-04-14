import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MYBUBU_ABI, getContracts } from "@/config/contracts";
import { useChainId } from "wagmi";
import { toast } from "sonner";
import { useEffect } from "react";

export function useExcludeFromFeeBatch() {
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Fee exclusion updated successfully!");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      toast.error(error.message?.slice(0, 100) || "Transaction failed");
    }
  }, [error]);

  const excludeFromFeeBatch = (addresses: `0x${string}`[], excluded: boolean) => {
    writeContract({
      address: contracts.MYBUBU_TOKEN,
      abi: MYBUBU_ABI,
      functionName: "excludeFromFeeBatch",
      args: [addresses, excluded],
    });
  };

  return {
    excludeFromFeeBatch,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  };
}
