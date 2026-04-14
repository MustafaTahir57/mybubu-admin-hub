import { http, createConfig } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = "299d3861cbb9c565794a7c343d2ed767"; // TODO: Replace with your WalletConnect project ID

export const wagmiConfig = createConfig({
  chains: [bsc, bscTestnet],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [bsc.id]: http("https://bsc-dataseed1.binance.org"),
    [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.binance.org:8545"),
  },
});
