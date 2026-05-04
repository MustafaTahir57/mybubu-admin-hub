import { useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from "wagmi";
import { SWAP_ABI, getContracts } from "@/config/contracts";
import { toast } from "sonner";
import { useEffect } from "react";
import { parseUnits } from "viem";

function useSwapBaseWrite(successMessage: string) {
  const chainId = useChainId();
  const contracts = getContracts(chainId);
  const { address: account } = useAccount();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => { if (isSuccess) toast.success(successMessage); }, [isSuccess]);
  useEffect(() => { if (error) toast.error(error.message?.slice(0, 100) || "Transaction failed"); }, [error]);

  return { writeContract, contracts, account, hash, isPending, isConfirming, isSuccess, error, reset };
}

export function useDepositMybubu() {
  const { writeContract, contracts, account, ...rest } = useSwapBaseWrite("MYBUBU deposited!");
  return {
    ...rest,
    depositMybubu: (amount: string) => {
      if (!account) { toast.error("Connect wallet first"); return; }
      writeContract({ address: contracts.SWAP, abi: SWAP_ABI, functionName: "depositMybubu", args: [parseUnits(amount, 18)] } as any);
    },
  };
}

export function useSwapWithdrawToken() {
  const { writeContract, contracts, account, ...rest } = useSwapBaseWrite("Token withdrawn!");
  return {
    ...rest,
    withdrawToken: (token: `0x${string}`, to: `0x${string}`, amount: string, decimals: number, withdrawAll: boolean) => {
      if (!account) { toast.error("Connect wallet first"); return; }
      const parsedAmount = withdrawAll
        ? BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
        : parseUnits(amount, decimals);
      writeContract({ address: contracts.SWAP, abi: SWAP_ABI, functionName: "withdrawToken", args: [token, to, parsedAmount] } as any);
    },
  };
}

export function useTransferOwnershipSwap() {
  const { writeContract, contracts, account, ...rest } = useSwapBaseWrite("Ownership transferred!");
  return {
    ...rest,
    transferOwnership: (newOwner: `0x${string}`) => {
      if (!account) { toast.error("Connect wallet first"); return; }
      writeContract({ address: contracts.SWAP, abi: SWAP_ABI, functionName: "transferOwnership", args: [newOwner] } as any);
    },
  };
}
