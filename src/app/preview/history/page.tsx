"use client";

import { MOCK_DATA, elideAddress, formatUsd, statusColors } from "../mockup-data";

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function HistoryPreviewPage() {
  const transactions = MOCK_DATA.recentTransactions;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">
          Transaction History
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          View your recent sBTC deposits and withdrawals
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface-fourth dark:bg-surface-fourth rounded-xl border border-explorer-border-secondary p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-bitcoin-100 dark:bg-bitcoin-700/30 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-bitcoin-600 dark:text-bitcoin-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Total Deposited</p>
              <p className="text-lg font-semibold text-text-primary">
                {MOCK_DATA.btcBalance} BTC
              </p>
              <p className="text-xs text-text-tertiary">
                ~{formatUsd(MOCK_DATA.btcBalance * MOCK_DATA.btcPrice)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface-fourth dark:bg-surface-fourth rounded-xl border border-explorer-border-secondary p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stacks-100 dark:bg-stacks-700/30 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-stacks-600 dark:text-stacks-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Total Withdrawn</p>
              <p className="text-lg font-semibold text-text-primary">
                0.02 BTC
              </p>
              <p className="text-xs text-text-tertiary">
                ~{formatUsd(0.02 * MOCK_DATA.btcPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-surface-fourth dark:bg-surface-fourth rounded-xl border border-explorer-border-secondary overflow-hidden">
        {/* Table Header */}
        <div className="px-4 py-3 border-b border-explorer-border-secondary bg-surface-secondary dark:bg-surface-secondary">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-text-secondary uppercase tracking-wider">
            <div className="col-span-3">Type</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-2">Time</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
        </div>

        {/* Transaction Rows */}
        <div className="divide-y divide-explorer-border-secondary">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="px-4 py-4 hover:bg-surface-secondary dark:hover:bg-surface-secondary transition-colors"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Type */}
                <div className="col-span-3 flex items-center gap-2">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${tx.type === "deposit"
                        ? "bg-bitcoin-100 dark:bg-bitcoin-700/30"
                        : "bg-stacks-100 dark:bg-stacks-700/30"
                      }
                    `}
                  >
                    {tx.type === "deposit" ? (
                      <svg
                        className="w-4 h-4 text-bitcoin-600 dark:text-bitcoin-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-stacks-600 dark:text-stacks-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium text-text-primary capitalize">
                    {tx.type}
                  </span>
                </div>

                {/* Amount */}
                <div className="col-span-2">
                  <p className="text-sm font-medium text-text-primary">
                    {tx.amount} BTC
                  </p>
                  <p className="text-xs text-text-tertiary">
                    ~{formatUsd(tx.amount * MOCK_DATA.btcPrice)}
                  </p>
                </div>

                {/* Status */}
                <div className="col-span-3">
                  <span
                    className={`
                      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                      ${statusColors[tx.status].bg}
                      ${statusColors[tx.status].text}
                    `}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${statusColors[tx.status].dot}`}
                    />
                    {tx.status === "confirmed"
                      ? `Confirmed (${tx.confirmations} blocks)`
                      : tx.status === "pending"
                      ? `Pending (${tx.confirmations}/6)`
                      : "Failed"}
                  </span>
                </div>

                {/* Time */}
                <div className="col-span-2">
                  <p className="text-sm text-text-secondary">
                    {formatTimeAgo(tx.timestamp)}
                  </p>
                </div>

                {/* Actions */}
                <div className="col-span-2 text-right">
                  <a
                    href={`https://mempool.space/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-stacks-500 hover:text-stacks-600 font-medium"
                  >
                    View
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
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (hidden when there are transactions) */}
        {transactions.length === 0 && (
          <div className="px-4 py-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-surface-secondary dark:bg-surface-secondary flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-text-tertiary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-text-primary">
              No transactions yet
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Your deposit and withdrawal history will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
