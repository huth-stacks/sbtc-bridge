// Hard-coded mockup data for visual preview
export const MOCK_DATA = {
  btcBalance: 0.5,
  sbtcBalance: 25000000, // sats (0.25 sBTC)
  btcPrice: 96000, // USD per BTC
  stxBalance: 1500, // STX
  connectedWallet: "Leather",
  addresses: {
    stacks: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    btcPayment: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
  },
  recentTransactions: [
    {
      id: "tx1",
      type: "deposit" as const,
      amount: 0.1,
      status: "confirmed" as const,
      hash: "abc123def456789...",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      confirmations: 6,
    },
    {
      id: "tx2",
      type: "deposit" as const,
      amount: 0.05,
      status: "pending" as const,
      hash: "xyz789abc123456...",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
      confirmations: 2,
    },
    {
      id: "tx3",
      type: "withdraw" as const,
      amount: 0.02,
      status: "pending" as const,
      hash: "def456xyz789012...",
      timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
      confirmations: 0,
    },
  ],
  estimatedConfirmationTime: 15, // minutes (dynamic would come from mempool API)
  mintCap: {
    current: 500, // BTC remaining
    total: 1000, // Total cap
    perDeposit: {
      min: 0.001,
      max: 10,
    },
  },
};

// Helper to format BTC amounts
export function formatBtc(sats: number): string {
  return (sats / 1e8).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
}

// Helper to format USD amounts
export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper to elide address
export function elideAddress(address: string, chars: number = 8): string {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

// Transaction status colors (using Explorer semantic tokens)
export const statusColors = {
  confirmed: {
    bg: "bg-feedback-green-100 dark:bg-feedback-green-100/20",
    text: "text-feedback-green-600 dark:text-feedback-green-500",
    dot: "bg-feedback-green-500",
  },
  pending: {
    bg: "bg-bitcoin-100 dark:bg-bitcoin-100/20",
    text: "text-bitcoin-600 dark:text-bitcoin-500",
    dot: "bg-bitcoin-500",
  },
  failed: {
    bg: "bg-feedback-red-100 dark:bg-feedback-red-100/20",
    text: "text-feedback-red-500",
    dot: "bg-feedback-red-500",
  },
};
