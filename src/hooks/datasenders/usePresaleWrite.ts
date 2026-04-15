import { useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from "wagmi";
import { MYBOO_PRESALE_ABI, getContracts } from "@/config/contracts";
import { toast } from "sonner";
import { useEffect } from "react";

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
