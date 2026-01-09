"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MOCK_DATA, formatUsd, elideAddress } from "../mockup-data";

type TransactionState =
  | "signing"
  | "broadcasting"
  | "confirming"
  | "processing"
  | "complete"
  | "failed";

interface TransactionStep {
  id: TransactionState;
  label: string;
  description: string;
  tooltip?: string;
}

const STEPS: TransactionStep[] = [
  { id: "signing", label: "Sign Transaction", description: "Approve in your wallet" },
  { id: "broadcasting", label: "Broadcasting", description: "Sending to Bitcoin network" },
  {
    id: "confirming",
    label: "Confirming",
    description: "Waiting for confirmations",
    tooltip: "Bitcoin requires multiple block confirmations to ensure transaction security. Each block takes ~10 minutes on average."
  },
  { id: "processing", label: "Minting sBTC", description: "Processing on Stacks" },
  { id: "complete", label: "Complete", description: "Transaction successful" },
];

const MOCK_TX = {
  amount: 0.1,
  networkFee: 0.00008,
  receiveAmount: 0.09992, // amount - networkFee
  btcTxHash: "abc123def456789abc123def456789abc123def456789abc123def456789abcd",
  stxTxHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  senderAddress: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
  receiveAddress: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
};

export default function TransactionPreviewPage() {
  const [currentState, setCurrentState] = useState<TransactionState>("signing");
  const [confirmations, setConfirmations] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [showTxDetails, setShowTxDetails] = useState(false);

  // Calculate estimated time remaining based on confirmations
  const getEstimatedTimeRemaining = () => {
    if (currentState === "signing") return null;
    if (currentState === "broadcasting") return "~60 mins";
    if (currentState === "confirming") {
      const remainingBlocks = 6 - confirmations;
      if (remainingBlocks <= 0) return "< 1 min";
      return `~${remainingBlocks * 10} mins`;
    }
    if (currentState === "processing") return "< 2 mins";
    return null;
  };

  // Auto-advance simulation
  useEffect(() => {
    if (!autoAdvance) return;

    const timers: NodeJS.Timeout[] = [];

    // signing -> broadcasting (2s)
    timers.push(setTimeout(() => setCurrentState("broadcasting"), 2000));
    // broadcasting -> confirming (3s)
    timers.push(setTimeout(() => setCurrentState("confirming"), 3000));
    // Increment confirmations
    for (let i = 1; i <= 6; i++) {
      timers.push(setTimeout(() => setConfirmations(i), 3000 + i * 1500));
    }
    // confirming -> processing (after 6 confirmations)
    timers.push(setTimeout(() => setCurrentState("processing"), 12000));
    // processing -> complete
    timers.push(setTimeout(() => setCurrentState("complete"), 15000));

    return () => timers.forEach(clearTimeout);
  }, [autoAdvance]);

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentState);

  const getStepStatus = (step: TransactionStep, index: number) => {
    if (currentState === "failed") return index === currentStepIndex ? "failed" : "pending";
    if (index < currentStepIndex) return "complete";
    if (index === currentStepIndex) return "active";
    return "pending";
  };

  return (
    <div className="flex flex-col items-center min-h-[80vh] py-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
          Transaction Status
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Track your sBTC deposit progress
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[480px] bg-surface-fourth border border-explorer-border-secondary rounded-2xl shadow-sm p-6 space-y-6">
        {/* Transaction Ticket */}
        <div className="bg-surface-secondary/30 rounded-xl p-4 border border-explorer-border-secondary/50">
          {/* Sent → Receive */}
          <div className="flex items-stretch gap-4">
            {/* You Sent */}
            <div className="flex-1 text-center">
              <p className="text-xs text-text-tertiary mb-1">You sent</p>
              <p className="text-xl font-bold text-text-primary">
                {MOCK_TX.amount} BTC
              </p>
              <p className="text-xs text-text-tertiary mt-1 font-mono">
                {elideAddress(MOCK_TX.senderAddress, 6)}
              </p>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center px-2">
              <svg
                className="w-6 h-6 text-text-tertiary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>

            {/* You Receive */}
            <div className="flex-1 text-center">
              <p className="text-xs text-text-tertiary mb-1">You receive</p>
              <p className="text-xl font-bold text-stacks-600 dark:text-stacks-400">
                {MOCK_TX.receiveAmount} sBTC
              </p>
              <p className="text-xs text-text-tertiary mt-1 font-mono">
                {elideAddress(MOCK_TX.receiveAddress, 6)}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-explorer-border-secondary/50 my-4" />

          {/* Fee Breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-tertiary">Network fee</span>
              <span className="text-text-secondary">
                ~{MOCK_TX.networkFee} BTC (~{formatUsd(MOCK_TX.networkFee * MOCK_DATA.btcPrice)})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-tertiary">Bridge fee</span>
              <span className="text-text-secondary">0% (free)</span>
            </div>
            {getEstimatedTimeRemaining() && (
              <div className="flex justify-between">
                <span className="text-text-tertiary">Est. time remaining</span>
                <span className="text-text-secondary font-medium">{getEstimatedTimeRemaining()}</span>
              </div>
            )}
          </div>

          {/* Sponsored Callout */}
          <div className="mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-stacks-100/50 dark:bg-stacks-700/20 border border-stacks-200/50 dark:border-stacks-600/50">
            <svg className="w-4 h-4 text-stacks-600 dark:text-stacks-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-stacks-700 dark:text-stacks-300">
              <span className="font-medium">Sponsored by Stacks Labs</span>
              <span className="text-stacks-600/80 dark:text-stacks-400/80 ml-1">• No gas fees</span>
            </span>
          </div>

          {/* Collapsible Transaction Details */}
          <button
            onClick={() => setShowTxDetails(!showTxDetails)}
            className="w-full flex justify-between items-center text-xs text-text-tertiary hover:text-text-secondary mt-4 pt-3 border-t border-explorer-border-secondary/50"
          >
            <span>Transaction details</span>
            <svg
              className={`w-4 h-4 transition-transform ${showTxDetails ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showTxDetails && (
            <div className="mt-3 space-y-2 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary">BTC Transaction</span>
                <a
                  href={`https://mempool.space/tx/${MOCK_TX.btcTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stacks-500 hover:text-stacks-600 font-mono flex items-center gap-1"
                >
                  {elideAddress(MOCK_TX.btcTxHash, 8)}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary">STX Transaction</span>
                {currentState === "complete" || currentState === "processing" ? (
                  <a
                    href={`https://explorer.stacks.co/txid/${MOCK_TX.stxTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stacks-500 hover:text-stacks-600 font-mono flex items-center gap-1"
                  >
                    {elideAddress(MOCK_TX.stxTxHash, 8)}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <span className="text-text-tertiary italic">Pending...</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="space-y-0">
          {STEPS.map((step, index) => {
            const status = getStepStatus(step, index);
            return (
              <div key={step.id} className="flex items-start gap-4">
                {/* Step Indicator */}
                <div className="flex flex-col items-center">
                  <StepIndicator
                    status={status}
                    showConfirmations={step.id === "confirming" && currentState === "confirming"}
                    confirmations={confirmations}
                  />
                  {index < STEPS.length - 1 && (
                    <div
                      className={`
                        w-0.5 h-8
                        ${status === "complete" ? "bg-feedback-green-500" : "bg-explorer-border-secondary"}
                      `}
                    />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2">
                    <p className={`
                      font-medium text-sm
                      ${status === "active" ? "text-text-primary" : ""}
                      ${status === "complete" ? "text-feedback-green-600 dark:text-feedback-green-400" : ""}
                      ${status === "pending" ? "text-text-tertiary" : ""}
                      ${status === "failed" ? "text-feedback-red-500" : ""}
                    `}>
                      {step.label}
                    </p>
                    {status === "active" && step.id !== "complete" && (
                      <span className="inline-flex">
                        <span className="animate-pulse text-stacks-500">●</span>
                      </span>
                    )}
                    {/* Educational tooltip icon */}
                    {step.tooltip && (
                      <div className="relative">
                        <button
                          onClick={() => setShowTooltip(showTooltip === step.id ? null : step.id)}
                          className="text-text-tertiary hover:text-text-secondary transition-colors"
                          aria-label="Learn more"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {/* Tooltip popup */}
                        {showTooltip === step.id && (
                          <div className="absolute left-0 top-6 z-10 w-64 p-3 bg-surface-fourth border border-explorer-border-secondary rounded-lg shadow-lg">
                            <p className="text-xs text-text-secondary leading-relaxed">
                              {step.tooltip}
                            </p>
                            <button
                              onClick={() => setShowTooltip(null)}
                              className="absolute top-2 right-2 text-text-tertiary hover:text-text-secondary"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className={`
                    text-xs mt-0.5
                    ${status === "active" ? "text-text-secondary" : "text-text-tertiary"}
                  `}>
                    {step.id === "confirming" && currentState === "confirming"
                      ? `${confirmations}/6 Bitcoin confirmations`
                      : step.description
                    }
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion State */}
        {currentState === "complete" && (
          <div className="space-y-4 pt-2">
            {/* Success Message */}
            <div className="bg-feedback-green-100/50 dark:bg-feedback-green-700/20 border border-feedback-green-300/50 dark:border-feedback-green-600/50 rounded-lg p-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-feedback-green-100 dark:bg-feedback-green-700/30 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-feedback-green-600 dark:text-feedback-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-feedback-green-700 dark:text-feedback-green-300">
                Deposit Complete!
              </p>
              <p className="text-sm text-feedback-green-600/80 dark:text-feedback-green-400/80 mt-1">
                You received {MOCK_TX.receiveAmount} sBTC
              </p>
            </div>

            {/* Explorer Links */}
            <div className="space-y-2">
              <a
                href={`https://mempool.space/tx/${MOCK_TX.btcTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-surface-secondary hover:bg-surface-tertiary transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-bitcoin-100 dark:bg-bitcoin-700/30 flex items-center justify-center">
                    <span className="text-bitcoin-600 dark:text-bitcoin-400 text-xs font-bold">BTC</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Bitcoin Transaction</p>
                    <p className="text-xs text-text-tertiary font-mono">
                      {MOCK_TX.btcTxHash.slice(0, 8)}...{MOCK_TX.btcTxHash.slice(-8)}
                    </p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-text-tertiary group-hover:text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <a
                href={`https://explorer.stacks.co/txid/${MOCK_TX.stxTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-surface-secondary hover:bg-surface-tertiary transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stacks-100 dark:bg-stacks-700/30 flex items-center justify-center">
                    <span className="text-stacks-600 dark:text-stacks-400 text-xs font-bold">STX</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Stacks Transaction</p>
                    <p className="text-xs text-text-tertiary font-mono">
                      {MOCK_TX.stxTxHash.slice(0, 10)}...{MOCK_TX.stxTxHash.slice(-8)}
                    </p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-text-tertiary group-hover:text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Done Button */}
            <Link
              href="/preview"
              className="block w-full py-3 text-center rounded-xl font-semibold bg-sand-800 dark:bg-sand-100 text-sand-50 dark:text-sand-900 hover:bg-sand-900 dark:hover:bg-sand-200 transition-colors"
            >
              Done
            </Link>
          </div>
        )}

        {/* Pending/Processing States - Action Area */}
        {currentState !== "complete" && currentState !== "failed" && (
          <div className="pt-2 space-y-4">
            {currentState === "signing" && (
              <div className="text-center text-sm text-text-secondary">
                <p>Please approve the transaction in your wallet</p>
              </div>
            )}
            {(currentState === "broadcasting" || currentState === "confirming" || currentState === "processing") && (
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing your transaction...</span>
                </div>
                {/* Dynamic time estimate */}
                {getEstimatedTimeRemaining() && (
                  <p className="text-sm text-text-secondary">
                    Estimated time remaining: <span className="font-medium">{getEstimatedTimeRemaining()}</span>
                  </p>
                )}
              </div>
            )}

            {/* Safe to close message */}
            {(currentState === "broadcasting" || currentState === "confirming" || currentState === "processing") && (
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-secondary/50 rounded-lg">
                <svg className="w-4 h-4 text-feedback-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-text-secondary">
                  You can safely close this tab. We&apos;ll continue processing your transaction.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Demo Controls (Outside Main Card) */}
      <div className="mt-8 w-full max-w-[480px]">
        <div className="bg-surface-secondary/50 rounded-xl p-4 border border-explorer-border-secondary">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-3">
            Demo Controls
          </p>

          {/* Auto-advance toggle */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-text-secondary">Auto-advance simulation</span>
            <button
              onClick={() => {
                setAutoAdvance(!autoAdvance);
                if (!autoAdvance) {
                  setCurrentState("signing");
                  setConfirmations(0);
                }
              }}
              className={`
                relative w-11 h-6 rounded-full transition-colors
                ${autoAdvance ? "bg-stacks-500" : "bg-sand-300 dark:bg-sand-600"}
              `}
            >
              <span
                className={`
                  absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                  ${autoAdvance ? "left-6" : "left-1"}
                `}
              />
            </button>
          </div>

          {/* Manual state buttons */}
          <div className="flex flex-wrap gap-2">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => {
                  setAutoAdvance(false);
                  setCurrentState(step.id);
                  if (step.id === "confirming") setConfirmations(3);
                  if (step.id === "processing" || step.id === "complete") setConfirmations(6);
                }}
                className={`
                  px-3 py-1.5 text-xs rounded-lg font-medium transition-colors
                  ${currentState === step.id
                    ? "bg-stacks-500 text-white"
                    : "bg-surface-tertiary text-text-secondary hover:text-text-primary"
                  }
                `}
              >
                {step.label}
              </button>
            ))}
            <button
              onClick={() => {
                setAutoAdvance(false);
                setCurrentState("failed");
              }}
              className={`
                px-3 py-1.5 text-xs rounded-lg font-medium transition-colors
                ${currentState === "failed"
                  ? "bg-feedback-red-500 text-white"
                  : "bg-surface-tertiary text-text-secondary hover:text-text-primary"
                }
              `}
            >
              Failed
            </button>
          </div>

          {/* Confirmation slider (only when confirming) */}
          {currentState === "confirming" && (
            <div className="mt-4 pt-4 border-t border-explorer-border-secondary">
              <div className="flex justify-between text-xs text-text-tertiary mb-2">
                <span>Confirmations</span>
                <span>{confirmations}/6</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                value={confirmations}
                onChange={(e) => setConfirmations(parseInt(e.target.value))}
                className="w-full accent-stacks-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Back to Deposit */}
      <div className="mt-6">
        <Link
          href="/preview"
          className="text-sm text-stacks-500 hover:text-stacks-600 underline underline-offset-2"
        >
          ← Back to Deposit
        </Link>
      </div>
    </div>
  );
}

function StepIndicator({
  status,
  showConfirmations,
  confirmations
}: {
  status: "pending" | "active" | "complete" | "failed";
  showConfirmations?: boolean;
  confirmations?: number;
}) {
  if (status === "complete") {
    return (
      <div className="w-8 h-8 rounded-full bg-feedback-green-500 flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="w-8 h-8 rounded-full bg-feedback-red-500 flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }

  if (status === "active") {
    if (showConfirmations && confirmations !== undefined) {
      // Show confirmation progress ring
      const progress = (confirmations / 6) * 100;
      return (
        <div className="relative w-8 h-8">
          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-explorer-border-secondary"
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${progress * 0.88} 100`}
              className="text-stacks-500 transition-all duration-500"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-stacks-500">
            {confirmations}
          </span>
        </div>
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-stacks-500 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
      </div>
    );
  }

  // Pending
  return (
    <div className="w-8 h-8 rounded-full border-2 border-explorer-border-secondary bg-surface-secondary" />
  );
}
