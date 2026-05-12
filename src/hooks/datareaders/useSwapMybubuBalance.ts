import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { MYBUBU_ABI } from "@/config/contracts";
import { useChainContracts } from "@/hooks/useContractData";

/**
 * Reads the MYBUBU token balance held by the Swap contract.
 * Separate hook so it can be reused across panels.
 */
export function useSwapMybubuBalance() {
  const contracts = useChainContracts();

  const result = useReadContract({
    address: contracts.MYBUBU_TOKEN,
    abi: MYBUBU_ABI,
    functionName: "balanceOf",
    args: [contracts.SWAP],
  });

  const raw = (result.data as bigint | undefined) ?? 0n;
  const formatted = formatUnits(raw, 18);

  return {
    ...result,
    raw,
    formatted,
  };
}