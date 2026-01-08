"use client";

import { toast } from "sonner";

export type TransactionStatus = "pending" | "confirmed" | "failed";
export type TransactionType = "deposit" | "withdraw";

interface TransactionToastProps {
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  txHash: string;
  mempoolUrl?: string;
}

// Status configs with Explorer colors
const statusConfig = {
  pending: {
    icon: (
      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    ),
    iconBg: "bg-bitcoin-100 dark:bg-bitcoin-700/30",
    iconColor: "text-bitcoin-600 dark:text-bitcoin-400",
    title: "Transaction Pending",
  },
  confirmed: {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    iconBg: "bg-feedback-green-100 dark:bg-feedback-green-100/20",
    iconColor: "text-feedback-green-600 dark:text-feedback-green-500",
    title: "Transaction Confirmed",
  },
  failed: {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
    iconBg: "bg-feedback-red-100 dark:bg-feedback-red-100/20",
    iconColor: "text-feedback-red-500",
    title: "Transaction Failed",
  },
};

export function showTransactionToast({
  type,
  status,
  amount,
  txHash,
  mempoolUrl = `https://mempool.space/tx/${txHash}`,
}: TransactionToastProps) {
  const config = statusConfig[status];
  const action = type === "deposit" ? "Depositing" : "Withdrawing";
  const actionPast = type === "deposit" ? "Deposited" : "Withdrew";

  toast.custom(
    (t) => (
      <div className="bg-surface-fourth border border-explorer-border-secondary rounded-xl shadow-lg p-4 min-w-[320px]">
        <div className="flex gap-3">
          {/* Status Icon */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full ${config.iconBg} ${config.iconColor} flex items-center justify-center`}
          >
            {config.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary">
              {config.title}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              {status === "pending"
                ? `${action} ${amount} BTC...`
                : `${actionPast} ${amount} BTC`}
            </p>

            {/* Transaction Link */}
            <a
              href={mempoolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs text-stacks-500 hover:text-stacks-600 font-medium"
            >
              View on Mempool
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          {/* Close Button */}
          <button
            onClick={() => toast.dismiss(t)}
            className="flex-shrink-0 text-text-tertiary hover:text-text-secondary"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    ),
    {
      duration: status === "pending" ? Infinity : 5000,
      position: "bottom-right",
    }
  );
}

// Helper to update a pending toast to confirmed/failed
export function updateTransactionToast(
  txHash: string,
  newStatus: "confirmed" | "failed",
  amount: number,
  type: TransactionType
) {
  // Dismiss existing toast and show new one
  toast.dismiss(txHash);
  showTransactionToast({
    type,
    status: newStatus,
    amount,
    txHash,
  });
}
