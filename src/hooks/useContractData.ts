import { useReadContract, useReadContracts, useAccount, useChainId } from "wagmi";
import { formatUnits } from "viem";
import { getContracts, ERC20_ABI, PRESALE_ABI, MYBUBU_ABI, NFT_NODE_ABI } from "@/config/contracts";

export function useChainContracts() {
  const chainId = useChainId();
  return getContracts(chainId);
}

export function useTokenSupply(tokenAddress: `0x${string}`, abi: readonly any[] = ERC20_ABI) {
  const result = useReadContract({
    address: tokenAddress,
    abi,
    functionName: "totalSupply",
  });

  return {
    ...result,
    formatted: result.data ? formatUnits(result.data as bigint, 18) : "0",
  };
}

export function useTokenBalance(tokenAddress: `0x${string}`, account?: `0x${string}`) {
  const result = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: account ? [account] : undefined,
    query: { enabled: !!account },
  });

  return {
    ...result,
    formatted: result.data ? formatUnits(result.data as bigint, 18) : "0",
  };
}

export function useUserLookup(address?: `0x${string}`) {
  const contracts = useChainContracts();
  const enabled = !!address;

  const mybooBalance = useTokenBalance(contracts.MYBOO_TOKEN, address);
  const mybubuBalance = useTokenBalance(contracts.MYBUBU_TOKEN, address);

  const presaleInfo = useReadContract({
    address: contracts.MYBOO_PRESALE,
    abi: PRESALE_ABI,
    functionName: "getUserInfo",
    args: address ? [address] : undefined,
    query: { enabled },
  });

  const referrals = useReadContract({
    address: contracts.MYBUBU_TOKEN,
    abi: MYBUBU_ABI,
    functionName: "getInviterChildList",
    args: address ? [address] : undefined,
    query: { enabled },
  });

  const nftBalance = useReadContract({
    address: contracts.NFT_NODE,
    abi: NFT_NODE_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled },
  });

  return {
    mybooBalance,
    mybubuBalance,
    presaleInfo: {
      ...presaleInfo,
      usdSpent: presaleInfo.data
        ? formatUnits((presaleInfo.data as [bigint, bigint])[1], 18)
        : "0",
    },
    referralCount: referrals.data ? (referrals.data as `0x${string}`[]).length : 0,
    nftBalance,
    isLoading: mybooBalance.isLoading || mybubuBalance.isLoading || presaleInfo.isLoading,
    isError: mybooBalance.isError || mybubuBalance.isError,
  };
}

export function useDashboardStats() {
  const contracts = useChainContracts();

  const mybooSupply = useTokenSupply(contracts.MYBOO_TOKEN);
  const mybubuSupply = useTokenSupply(contracts.MYBUBU_TOKEN);
  const nftSupply = useTokenSupply(contracts.NFT_NODE, NFT_NODE_ABI);

  return {
    mybooSupply,
    mybubuSupply,
    nftSupply,
    isLoading: mybooSupply.isLoading || mybubuSupply.isLoading || nftSupply.isLoading,
  };
}
