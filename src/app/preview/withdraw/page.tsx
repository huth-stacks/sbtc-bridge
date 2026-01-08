"use client";

import { useState } from "react";
import { showTransactionToast } from "@/components/transaction-toast";
import {
  MOCK_DATA,
  formatBtc,
  formatUsd,
  elideAddress,
} from "../mockup-data";

export default function WithdrawPreviewPage() {
  const [amount, setAmount] = useState("");
  const [btcAddress, setBtcAddress] = useState("");
  const [touched, setTouched] = useState({ amount: false, address: false });

  // sBTC balance in BTC (converted from sats)
  const sbtcAvailable = MOCK_DATA.sbtcBalance / 1e8;
  const usdEquivalent = parseFloat(amount || "0") * MOCK_DATA.btcPrice;

  const amountError =
    touched.amount && amount
      ? parseFloat(amount) > sbtcAvailable
        ? "Insufficient sBTC balance"
        : parseFloat(amount) < MOCK_DATA.mintCap.perDeposit.min
        ? `Minimum withdrawal is ${MOCK_DATA.mintCap.perDeposit.min} sBTC`
        : null
      : null;

  const addressError =
    touched.address && btcAddress
      ? !btcAddress.match(/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/)
        ? "Invalid Bitcoin address"
        : null
      : null;

  const handleSubmit = () => {
    showTransactionToast({
      type: "withdraw",
      status: "pending",
      amount: parseFloat(amount),
      txHash: "def456xyz789012...",
    });
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Card Container */}
      <div className="bg-surface-fourth dark:bg-surface-fourth rounded-2xl border border-explorer-border-secondary shadow-sm">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-explorer-border-secondary">
          <h1 className="text-lg font-semibold text-text-primary">
            Withdraw sBTC
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Convert sBTC back to BTC on Bitcoin
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
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-stacks-100 dark:bg-stacks-700/30 text-stacks-600 dark:text-stacks-400 text-xs font-medium">
                  sBTC
                </span>
              </div>

              {/* Input Field */}
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
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
                  {sbtcAvailable.toFixed(8)} sBTC available
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

          {/* BTC Address Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Receive BTC at
            </label>
            <div
              className={`
                rounded-xl border bg-surface-tertiary dark:bg-surface-tertiary
                ${addressError
                  ? "border-feedback-red-500"
                  : "border-explorer-border-primary focus-within:border-stacks-400"
                }
                transition-colors
              `}
            >
              <div className="flex items-center gap-3 p-4">
                <div className="w-8 h-8 rounded-full bg-bitcoin-100 dark:bg-bitcoin-700/30 flex items-center justify-center">
                  <span className="text-bitcoin-600 dark:text-bitcoin-400 text-xs font-bold">
                    BTC
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Enter Bitcoin address (bc1...)"
                  value={btcAddress}
                  onChange={(e) => setBtcAddress(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, address: true }))}
                  className="
                    flex-1
                    text-sm text-text-primary
                    bg-transparent
                    focus:outline-none
                    placeholder:text-text-tertiary
                  "
                />
              </div>
            </div>

            {/* Error Message */}
            {addressError && (
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
                {addressError}
              </p>
            )}
          </div>

          {/* Gas Fee Notice */}
          <div className="rounded-xl bg-feedback-yellow-100 dark:bg-feedback-yellow-100/10 border border-feedback-yellow-500/30 p-4">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-feedback-yellow-700 dark:text-feedback-yellow-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-feedback-yellow-700 dark:text-feedback-yellow-500">
                  STX required for gas
                </p>
                <p className="text-xs text-feedback-yellow-700/80 dark:text-feedback-yellow-500/80 mt-1">
                  You need at least 1 STX in your wallet to pay for the
                  withdrawal transaction on Stacks.
                </p>
                <p className="text-xs text-text-secondary mt-2">
                  Current balance:{" "}
                  <span className="font-medium text-text-primary">
                    {MOCK_DATA.stxBalance} STX
                  </span>
                </p>
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
                ~{MOCK_DATA.estimatedConfirmationTime + 10} minutes
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!amount || !btcAddress || !!amountError || !!addressError}
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
            {!amount
              ? "Enter amount"
              : !btcAddress
              ? "Enter BTC address"
              : amountError || addressError
              ? "Fix errors"
              : "Review Withdrawal"}
          </button>
        </div>
      </div>
    </div>
  );
}
