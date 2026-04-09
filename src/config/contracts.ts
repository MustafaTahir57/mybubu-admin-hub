export const CONTRACT_ADDRESSES = {
  // BSC Mainnet
  56: {
    MYBOO_TOKEN: "0x165ddbf120910074a3b748a7fc9c1ecdb513fc09" as `0x${string}`,
    MYBOO_PRESALE: "0x35e6d1184f38f5bb29cf69ef72be68ebbf02ba63" as `0x${string}`,
    USDT: "0x55d398326f99059fF775485246999027B3197955" as `0x${string}`,
    SWAP: "0xAA9a7c934BBA1Fc00930d93648147a1a6eff2b98" as `0x${string}`,
    NFT_NODE: "0x25A06113EBC51208c7CA4391DC5087c6f096248A" as `0x${string}`,
    MYMOMO_TOKEN: "0xCC33DCE45D3cb490172fB114ffa7Fe4616A64F3C" as `0x${string}`,
    MYBUBU_TOKEN: "0x90E4701982bdDf853309bA847b6E96B87E941638" as `0x${string}`,
  },
  // BSC Testnet (kept for development)
  97: {
    MYBOO_TOKEN: "0x2e6b906a36e75d610e49b729a550a1dfa9741d33" as `0x${string}`,
    MYBOO_PRESALE: "0x9a313297fccd1dd68c88310a1536896ee270f93f" as `0x${string}`,
    USDT: "0x3f34F38c202A73fEFeDef2C202F36D5a28dA271C" as `0x${string}`,
    SWAP: "0xB7BEdA46cbdf1A8486c02F2A06EE21c499011f8f" as `0x${string}`,
    NFT_NODE: "0xFB2357c5a9ea093d6CE29D20C8C75c1D0BE0be47" as `0x${string}`,
    MYMOMO_TOKEN: "0xe0B2072aB6fcA09B6b3eAFFca21A801e871088df" as `0x${string}`,
    MYBUBU_TOKEN: "0xbe094fA19516405D720B7BCDf798bDa223685825" as `0x${string}`,
  },
} as const;

export type ChainId = keyof typeof CONTRACT_ADDRESSES;

export function getContracts(chainId: number) {
  const id = chainId as ChainId;
  return CONTRACT_ADDRESSES[id] ?? CONTRACT_ADDRESSES[56];
}

// ── Minimal ABIs ──
// TODO: Replace these placeholder ABIs with actual contract ABIs

export const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "Transfer",
    type: "event",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
] as const;

export const PRESALE_ABI = [
  {
    name: "getUserInfo",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "totalBought", type: "uint256" },
      { name: "totalSpent", type: "uint256" },
    ],
  },
  // TODO: Add buyWithBNB, buyWithUSDT
] as const;

export const MYBUBU_ABI = [
  ...ERC20_ABI,
  {
    name: "getInviterChildList",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "address[]" }],
  },
  // TODO: Add mint, burn, pause/unpause if contract supports it
] as const;

export const SWAP_ABI = [
  {
    name: "Swap",
    type: "event",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "amountIn", type: "uint256", indexed: false },
      { name: "amountOut", type: "uint256", indexed: false },
    ],
  },
  // TODO: Add swap function
] as const;

export const MYMOMO_ABI = [
  {
    name: "depositMybubu",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "claim",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  // TODO: Add staking balance read functions
] as const;

export const NFT_NODE_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "mint",
    type: "function",
    stateMutability: "payable",
    inputs: [{ name: "quantity", type: "uint256" }],
    outputs: [],
  },
  {
    name: "claimTokenRewards",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    name: "claimDividends",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    name: "Transfer",
    type: "event",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
] as const;
