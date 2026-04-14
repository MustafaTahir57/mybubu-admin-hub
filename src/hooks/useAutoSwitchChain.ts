import { useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { ACTIVE_CHAIN_ID } from "@/config/contracts";

export function useAutoSwitchChain() {
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (isConnected && chainId !== ACTIVE_CHAIN_ID) {
      switchChain({ chainId: ACTIVE_CHAIN_ID });
    }
  }, [isConnected, chainId, switchChain]);
}
