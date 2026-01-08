"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  MOCK_DATA,
  formatBtc,
  formatUsd,
  elideAddress,
} from "./mockup-data";

export default function DepositPreviewPage() {
  const [amount, setAmount] = useState("");
  const [stxAddress, setStxAddress] = useState(MOCK_DATA.addresses.stacks);
  const [step, setStep] = useState<"amount" | "address" | "confirm">("amount");
  const [touched, setTouched] = useState({ amount: false, address: false });

  const btcAvailable = MOCK_DATA.btcBalance;
  const usdEquivalent = parseFloat(amount || "0") * MOCK_DATA.btcPrice;

  const amountError =
    touched.amount && amount
      ? parseFloat(amount) > btcAvailable
        ? "Insufficient balance"
        : parseFloat(amount) < MOCK_DATA.mintCap.perDeposit.min
        ? `Minimum deposit is ${MOCK_DATA.mintCap.perDeposit.min} BTC`
        : null
      : null;

  const handleShowToast = () => {
    toast.success("Transaction submitted!", {
      description: (
        <div className="flex flex-col gap-1">
          <span>Depositing {amount} BTC</span>
          <a
            href="https://mempool.space/tx/abc123"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stacks-500 hover:text-stacks-600 underline text-xs"
          >
            View on Mempool
          </a>
        </div>
      ),
      duration: 5000,
    });
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Card Container */}
      <div className="bg-surface-fourth dark:bg-surface-fourth rounded-2xl border border-explorer-border-secondary shadow-sm">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-explorer-border-secondary">
          <h1 className="text-lg font-semibold text-text-primary">
            Deposit BTC
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Convert BTC to sBTC on Stacks
          </p>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Amount
            </label>
            <div
              className={`
                relative rounded-xl border bg-surface-tertiary dark:bg-surface-tertiary
                ${amountError
                  ? "border-feedback-red-500"
                  : "border-explorer-border-primary focus-within:border-stacks-400"
                }
                transition-colors
              `}
            >
              {/* Currency Badge */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-bitcoin-100 dark:bg-bitcoin-700/30 text-bitcoin-600 dark:text-bitcoin-400 text-xs font-medium">
                  BTC
                </span>
              </div>

              {/* Input Field - Fixed! Using input instead of textarea */}
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  // Only allow valid decimal input
                  const val = e.target.value.replace(/[^0-9.]/g, "");
                  if (val === "" || /^\d*\.?\d*$/.test(val)) {
                    setAmount(val);
                  }
                }}
                onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
                className="
                  w-full pt-14 pb-4 px-4
                  text-4xl font-semibold text-text-primary
                  bg-transparent
                  focus:outline-none
                  placeholder:text-text-tertiary
                  text-center
                "
              />

              {/* Balance & USD Display */}
              <div className="px-4 pb-4 flex justify-between items-center">
                <span className="text-sm text-text-secondary">
                  {btcAvailable.toFixed(8)} BTC available
                </span>
                {amount && (
                  <span className="text-sm text-text-tertiary">
                    ~{formatUsd(usdEquivalent)}
                  </span>
                )}
              </div>
            </div>

            {/* Error Message */}
            {amountError && (
              <p className="text-sm text-feedback-red-500 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {amountError}
              </p>
            )}
          </div>

          {/* Receive Address */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Receive sBTC at
            </label>
            <div className="rounded-xl border border-explorer-border-primary bg-surface-tertiary dark:bg-surface-tertiary p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-stacks-100 dark:bg-stacks-700/30 flex items-center justify-center">
                  <span className="text-stacks-600 dark:text-stacks-400 text-xs font-bold">
                    STX
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {elideAddress(stxAddress, 12)}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    Connected wallet address
                  </p>
                </div>
                <button className="text-stacks-500 hover:text-stacks-600 text-sm font-medium">
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="rounded-xl bg-surface-secondary dark:bg-surface-secondary p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-text-tertiary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-text-secondary">
                  Estimated confirmation
                </span>
              </div>
              <span className="text-sm font-medium text-text-primary">
                ~{MOCK_DATA.estimatedConfirmationTime} minutes
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleShowToast}
            disabled={!amount || !!amountError}
            className="
              w-full py-4 rounded-xl font-medium text-base
              bg-sand-700 dark:bg-sand-100
              text-sand-50 dark:text-sand-1000
              hover:bg-sand-1000 dark:hover:bg-sand-200
              disabled:bg-sand-400 disabled:dark:bg-sand-500
              disabled:text-sand-200 disabled:dark:text-sand-300
              disabled:cursor-not-allowed
              transition-colors
            "
          >
            {!amount ? "Enter amount" : amountError ? "Fix errors" : "Review Deposit"}
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-6 rounded-xl bg-surface-secondary dark:bg-surface-secondary border border-explorer-border-secondary p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-feedback-blue-500/10 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-feedback-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-primary">
              Other ways to get sBTC
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              You can also swap for sBTC on decentralized exchanges.
            </p>
            <div className="flex gap-3 mt-2">
              <a
                href="https://alexgo.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-stacks-500 hover:text-stacks-600 font-medium"
              >
                ALEX
              </a>
              <a
                href="https://velar.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-stacks-500 hover:text-stacks-600 font-medium"
              >
                Velar
              </a>
              <a
                href="https://bitflow.finance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-stacks-500 hover:text-stacks-600 font-medium"
              >
                Bitflow
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
