import { useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from "wagmi";
import { MYBUBU_ABI, getContracts } from "@/config/contracts";
import { toast } from "sonner";
import { useEffect } from "react";
import { parseEther } from "viem";

function useMybubuBaseWrite(successMessage: string) {
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

export function useSetSellRate() {
  const { writeContract, contracts, account, ...rest } = useMybubuBaseWrite("Sell rate updated!");

  const setSellRate = (basisPoints: bigint) => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.MYBUBU_TOKEN,
      abi: MYBUBU_ABI,
      functionName: "setSellRate",
      args: [basisPoints],
    } as any);
  };

  return { setSellRate, ...rest };
}

export function useWithdrawEth() {
  const { writeContract, contracts, account, ...rest } = useMybubuBaseWrite("BNB withdrawn!");

  const withdrawEth = (recipient: `0x${string}`, valueInEther: string) => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.MYBUBU_TOKEN,
      abi: MYBUBU_ABI,
      functionName: "withdrawEth",
      args: [recipient, parseEther(valueInEther)],
    } as any);
  };

  return { withdrawEth, ...rest };
}

export function useWithdrawalToken() {
  const { writeContract, contracts, account, ...rest } = useMybubuBaseWrite("Token withdrawn!");

  const withdrawalToken = (token: `0x${string}`, receiver: `0x${string}`, amount: bigint) => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.MYBUBU_TOKEN,
      abi: MYBUBU_ABI,
      functionName: "withdrawalToken",
      args: [token, receiver, amount],
    } as any);
  };

  return { withdrawalToken, ...rest };
}

export function useSetMaxAmount() {
  const { writeContract, contracts, account, ...rest } = useMybubuBaseWrite("Max deposit amount updated!");

  const setMaxAmount = (amountInEther: string) => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.MYBUBU_TOKEN,
      abi: MYBUBU_ABI,
      functionName: "setMaxAmount",
      args: [parseEther(amountInEther)],
    } as any);
  };

  return { setMaxAmount, ...rest };
}

export function useSetMinAmount() {
  const { writeContract, contracts, account, ...rest } = useMybubuBaseWrite("Min deposit amount updated!");

  const setMinAmount = (amountInEther: string) => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.MYBUBU_TOKEN,
      abi: MYBUBU_ABI,
      functionName: "setMinAmount",
      args: [parseEther(amountInEther)],
    } as any);
  };

  return { setMinAmount, ...rest };
}

export function useSetTransferLimit() {
  const { writeContract, contracts, account, ...rest } = useMybubuBaseWrite("Transfer limit updated!");

  const setTransferLimit = (amount: bigint, periodInSeconds: bigint) => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.MYBUBU_TOKEN,
      abi: MYBUBU_ABI,
      functionName: "setTransferLimit",
      args: [amount, periodInSeconds],
    } as any);
  };

  return { setTransferLimit, ...rest };
}

export function useTransferOwnershipMybubu() {
  const { writeContract, contracts, account, ...rest } = useMybubuBaseWrite("Ownership transferred!");

  const transferOwnership = (newOwner: `0x${string}`) => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.MYBUBU_TOKEN,
      abi: MYBUBU_ABI,
      functionName: "transferOwnership",
      args: [newOwner],
    } as any);
  };

  return { transferOwnership, ...rest };
}

export function useBlacklistBatch() {
  const { writeContract, contracts, account, ...rest } = useMybubuBaseWrite("Blacklist updated!");

  const blacklistBatch = (addresses: `0x${string}`[], blacklisted: boolean) => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.MYBUBU_TOKEN,
      abi: MYBUBU_ABI,
      functionName: "blacklistBatch",
      args: [addresses, blacklisted],
    } as any);
  };

  return { blacklistBatch, ...rest };
}
