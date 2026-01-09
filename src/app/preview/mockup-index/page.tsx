"use client";

import Link from "next/link";

const MOCKUPS = [
  {
    href: "/preview",
    title: "Deposit Page",
    description: "Single-column focused layout for depositing BTC to get sBTC",
    highlights: [
      "Visual hierarchy with progressive disclosure",
      "Hero input (large amount field)",
      "UTXO balance warning",
      "Collapsible fee breakdown",
      "Escape layer with help links",
    ],
    status: "ready",
  },
  {
    href: "/preview/withdraw",
    title: "Withdraw Page",
    description: "Convert sBTC back to BTC on Bitcoin",
    highlights: [
      "Same visual hierarchy as deposit",
      "STX gas notice",
      "BTC address input",
      "Collapsible fee breakdown",
    ],
    status: "ready",
  },
  {
    href: "/preview/transaction",
    title: "Transaction Status",
    description: "Track deposit progress through all states",
    highlights: [
      "5-step stepper: Sign → Broadcast → Confirm → Mint → Complete",
      "Progress ring showing Bitcoin confirmations (0-6)",
      "Educational tooltip explaining why confirmations take time",
      "Dynamic time estimate",
      "Safe to close tab messaging",
      "Explorer links at completion (Mempool + Stacks)",
      "Demo controls to test all states",
    ],
    status: "ready",
  },
  {
    href: "/preview/history",
    title: "Transaction History",
    description: "View past deposits and withdrawals",
    highlights: [
      "Summary cards (total deposited/withdrawn)",
      "Transaction list with status badges",
      "Explorer links for each transaction",
    ],
    status: "ready",
  },
];

export default function MockupIndexPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stacks-100 dark:bg-stacks-700/30 text-stacks-600 dark:text-stacks-300 text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-stacks-500 animate-pulse" />
          Design Review
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          sBTC Bridge Redesign Mockups
        </h1>
        <p className="text-text-secondary max-w-xl mx-auto">
          Explorer-style visual redesign with improved UX patterns. Click each mockup to review the interactive prototype.
        </p>
      </div>

      {/* Design Principles */}
      <div className="mb-8 p-4 bg-surface-secondary/50 rounded-xl border border-explorer-border-secondary">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Design Principles Applied</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-start gap-2">
            <span className="text-stacks-500">1.</span>
            <span className="text-text-secondary">Single-column focus (480px max)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-stacks-500">2.</span>
            <span className="text-text-secondary">Progressive disclosure</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-stacks-500">3.</span>
            <span className="text-text-secondary">Visual hierarchy layers</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-stacks-500">4.</span>
            <span className="text-text-secondary">Explorer sand palette</span>
          </div>
        </div>
      </div>

      {/* Mockup Cards */}
      <div className="grid gap-4">
        {MOCKUPS.map((mockup) => (
          <Link
            key={mockup.href}
            href={mockup.href}
            className="group block p-5 bg-surface-fourth rounded-xl border border-explorer-border-secondary hover:border-stacks-400 transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-text-primary group-hover:text-stacks-500 transition-colors">
                    {mockup.title}
                  </h3>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-feedback-green-100 dark:bg-feedback-green-700/30 text-feedback-green-600 dark:text-feedback-green-400 font-medium">
                    {mockup.status}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mb-3">
                  {mockup.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {mockup.highlights.map((highlight, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-surface-secondary rounded-md text-text-tertiary"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center group-hover:bg-stacks-100 dark:group-hover:bg-stacks-700/30 transition-colors">
                <svg
                  className="w-4 h-4 text-text-tertiary group-hover:text-stacks-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Feedback Section */}
      <div className="mt-8 p-5 bg-bitcoin-100/50 dark:bg-bitcoin-700/20 rounded-xl border border-bitcoin-300/50 dark:border-bitcoin-600/50">
        <h2 className="text-sm font-semibold text-bitcoin-700 dark:text-bitcoin-300 mb-2">
          Feedback Welcome
        </h2>
        <p className="text-sm text-bitcoin-600/80 dark:text-bitcoin-400/80">
          These are interactive mockups for design review. All data is mock/placeholder.
          Please note any UX issues, visual feedback, or suggestions for the implementation team.
        </p>
      </div>

      {/* Quick Links */}
      <div className="mt-6 flex items-center justify-center gap-4 text-sm">
        <a
          href="https://github.com/stacks-sbtc/sbtc-bridge"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-tertiary hover:text-text-secondary transition-colors"
        >
          GitHub Repo
        </a>
        <span className="text-text-tertiary">·</span>
        <a
          href="https://explorer.stacks.co"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-tertiary hover:text-text-secondary transition-colors"
        >
          Stacks Explorer (reference)
        </a>
      </div>
    </div>
  );
}
