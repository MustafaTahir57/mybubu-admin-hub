import { useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from "wagmi";
import { NFT_NODE_ABI, getContracts } from "@/config/contracts";
import { toast } from "sonner";
import { useEffect } from "react";
import { parseUnits, parseEther } from "viem";

function useNftNodeBaseWrite(successMessage: string) {
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

export function useSetMintPriceUSDT() {
  const { writeContract, contracts, account, ...rest } = useNftNodeBaseWrite("Mint price updated!");

  const setMintPriceUSDT = (priceInUsdt: string) => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.NFT_NODE,
      abi: NFT_NODE_ABI,
      functionName: "setMintPriceUSDT",
      args: [parseUnits(priceInUsdt, 18)],
    } as any);
  };

  return { setMintPriceUSDT, ...rest };
}

export function useSetMaxSupply() {
  const { writeContract, contracts, account, ...rest } = useNftNodeBaseWrite("Max supply updated!");

  const setMaxSupply = (maxSupply: string) => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.NFT_NODE,
      abi: NFT_NODE_ABI,
      functionName: "setMaxSupply",
      args: [BigInt(maxSupply)],
    } as any);
  };

  return { setMaxSupply, ...rest };
}

export function useDistributeDividends() {
  const { writeContract, contracts, account, ...rest } = useNftNodeBaseWrite("Dividends distributed!");

  const distributeDividends = (bnbAmount: string) => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.NFT_NODE,
      abi: NFT_NODE_ABI,
      functionName: "distributeDividends",
      value: parseEther(bnbAmount),
    } as any);
  };

  return { distributeDividends, ...rest };
}

export function useWithdrawUSDTFunds() {
  const { writeContract, contracts, account, ...rest } = useNftNodeBaseWrite("USDT funds withdrawn to treasury!");

  const withdrawUSDTFunds = () => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.NFT_NODE,
      abi: NFT_NODE_ABI,
      functionName: "withdrawUSDTFunds",
    } as any);
  };

  return { withdrawUSDTFunds, ...rest };
}

export function useWithdrawUSDTTo() {
  const { writeContract, contracts, account, ...rest } = useNftNodeBaseWrite("USDT withdrawn!");

  const withdrawUSDTTo = (recipient: `0x${string}`, amountInUsdt: string) => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.NFT_NODE,
      abi: NFT_NODE_ABI,
      functionName: "withdrawUSDTTo",
      args: [recipient, parseUnits(amountInUsdt, 18)],
    } as any);
  };

  return { withdrawUSDTTo, ...rest };
}

export function useEmergencyWithdraw() {
  const { writeContract, contracts, account, ...rest } = useNftNodeBaseWrite("Emergency BNB withdrawn!");

  const emergencyWithdraw = () => {
    if (!account) { toast.error("Connect wallet first"); return; }
    writeContract({
      address: contracts.NFT_NODE,
      abi: NFT_NODE_ABI,
      functionName: "emergencyWithdraw",
    } as any);
  };

  return { emergencyWithdraw, ...rest };
}
