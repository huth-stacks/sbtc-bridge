"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MOCK_DATA,
  formatBtc,
  formatUsd,
  elideAddress,
} from "../mockup-data";

export default function WithdrawPreviewPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [btcAddress, setBtcAddress] = useState("");
  const [touched, setTouched] = useState({ amount: false, address: false });
  const [showFeeDetails, setShowFeeDetails] = useState(false);

  // sBTC balance in BTC (converted from sats)
  const sbtcAvailable = MOCK_DATA.sbtcBalance / 1e8;
  const usdEquivalent = parseFloat(amount || "0") * MOCK_DATA.btcPrice;
  const networkFee = 0.00012;
  const receiveAmount = amount ? Math.max(0, parseFloat(amount) - networkFee) : 0;

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
    // Navigate to transaction status page
    router.push("/preview/transaction");
  };

  return (
    <div className="flex flex-col items-center min-h-[80vh] py-8">
      {/* ===== 1. CONTEXT LAYER (Header) ===== */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
          Withdraw sBTC
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Convert sBTC back to BTC on Bitcoin
        </p>
      </div>

      {/* ===== MAIN CARD (Single Column Focus) ===== */}
      <div className="w-full max-w-[480px] bg-surface-fourth border border-explorer-border-secondary rounded-2xl shadow-sm p-6 space-y-5">

        {/* ===== 2. WARNING LAYER (STX Gas Notice) ===== */}
        <div className="bg-stacks-100/50 dark:bg-stacks-700/20 border border-stacks-300/50 dark:border-stacks-600/50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-stacks-600 dark:text-stacks-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-stacks-700 dark:text-stacks-300">
                <span className="font-semibold">{MOCK_DATA.stxBalance} STX</span> available for gas
              </p>
              <p className="text-xs text-stacks-600/80 dark:text-stacks-400/80 mt-0.5">
                ~0.01 STX needed for withdrawal
              </p>
            </div>
          </div>
        </div>

        {/* ===== 3. INPUT LAYER (Hero - Focal Point) ===== */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-text-tertiary ml-1">You send</label>
          <div
            className={`
              relative rounded-xl border-2 bg-surface-tertiary/50 dark:bg-surface-tertiary/30 p-4
              transition-all overflow-hidden
              ${amountError
                ? "border-feedback-red-500"
                : "border-explorer-border-primary focus-within:border-stacks-400 focus-within:ring-2 focus-within:ring-stacks-400/20"
              }
            `}
          >
            <div className="flex items-center justify-between gap-3">
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
                  flex-1 min-w-0 bg-transparent text-5xl font-bold text-text-primary
                  outline-none placeholder:text-text-tertiary/40
                "
              />
              <div className="flex-shrink-0 flex items-center gap-2 bg-stacks-100 dark:bg-stacks-700/30 py-2 px-4 rounded-full border border-stacks-200 dark:border-stacks-600">
                <span className="font-semibold text-stacks-700 dark:text-stacks-300">sBTC</span>
              </div>
            </div>
          </div>

          {/* Balance Helper */}
          <div className="flex justify-between items-center text-xs px-1">
            <span className="text-text-tertiary">
              Balance: {sbtcAvailable.toFixed(8)} sBTC
              {amount && <span className="text-text-secondary ml-2">~{formatUsd(usdEquivalent)}</span>}
            </span>
            <button
              onClick={() => setAmount(sbtcAvailable.toString())}
              className="text-stacks-500 hover:text-stacks-600 font-medium hover:underline"
            >
              Max
            </button>
          </div>

          {/* Error Message */}
          {amountError && (
            <p className="text-xs text-feedback-red-500 px-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {amountError}
            </p>
          )}
        </div>

        {/* ===== 4. RECEIVE ADDRESS INPUT ===== */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-text-tertiary ml-1">Receive BTC at</label>
          <div
            className={`
              rounded-xl border-2 bg-surface-tertiary/50 dark:bg-surface-tertiary/30 p-3
              transition-all
              ${addressError
                ? "border-feedback-red-500"
                : "border-explorer-border-primary focus-within:border-stacks-400 focus-within:ring-2 focus-within:ring-stacks-400/20"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bitcoin-100 dark:bg-bitcoin-700/30 flex items-center justify-center border border-bitcoin-200 dark:border-bitcoin-600">
                <span className="text-bitcoin-600 dark:text-bitcoin-400 text-[10px] font-bold">BTC</span>
              </div>
              <input
                type="text"
                placeholder="bc1q... or 3..."
                value={btcAddress}
                onChange={(e) => setBtcAddress(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, address: true }))}
                className="
                  flex-1 min-w-0 bg-transparent text-sm text-text-primary font-medium
                  outline-none placeholder:text-text-tertiary/60
                "
              />
            </div>
          </div>

          {/* Error Message */}
          {addressError && (
            <p className="text-xs text-feedback-red-500 px-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {addressError}
            </p>
          )}
        </div>

        {/* ===== 5. LOGIC LAYER (Fees - Progressive Disclosure) ===== */}
        <div className="bg-surface-secondary/30 rounded-xl p-4 space-y-3">
          {/* Summary (Always Visible) */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-text-secondary">You receive</span>
            <span className="text-lg font-semibold text-text-primary">
              {amount ? `${receiveAmount.toFixed(8)} BTC` : "—"}
            </span>
          </div>

          {/* Expandable Details */}
          <button
            onClick={() => setShowFeeDetails(!showFeeDetails)}
            className="w-full flex justify-between items-center text-xs text-text-tertiary hover:text-text-secondary pt-2 border-t border-explorer-border-secondary/50"
          >
            <span>Fee breakdown & timing</span>
            <svg
              className={`w-4 h-4 transition-transform ${showFeeDetails ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showFeeDetails && (
            <div className="space-y-2 text-xs text-text-tertiary animate-in fade-in duration-200">
              <div className="flex justify-between">
                <span>Stacks gas</span>
                <span className="text-text-secondary">~0.01 STX (~$0.02)</span>
              </div>
              <div className="flex justify-between">
                <span>Bitcoin network fee</span>
                <span className="text-text-secondary">~{networkFee} BTC (~$11.52)</span>
              </div>
              <div className="flex justify-between">
                <span>Bridge fee</span>
                <span className="text-text-secondary">0% (free)</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated time</span>
                <span className="text-text-secondary">~{MOCK_DATA.estimatedConfirmationTime + 10} mins</span>
              </div>
            </div>
          )}
        </div>

        {/* ===== 6. ACTION LAYER (Primary CTA) ===== */}
        <button
          onClick={handleSubmit}
          disabled={!amount || !btcAddress || !!amountError || !!addressError}
          className="
            w-full h-14 rounded-xl font-semibold text-base
            bg-sand-800 dark:bg-sand-100
            text-sand-50 dark:text-sand-900
            hover:bg-sand-900 dark:hover:bg-sand-200
            disabled:bg-sand-300 disabled:dark:bg-sand-600
            disabled:text-sand-400 disabled:dark:text-sand-400
            disabled:cursor-not-allowed
            transition-colors shadow-sm
          "
        >
          {!amount
            ? "Enter amount"
            : !btcAddress
            ? "Enter BTC address"
            : amountError || addressError
            ? "Fix errors"
            : "Withdraw sBTC"}
        </button>
      </div>

      {/* ===== 7. ESCAPE LAYER (Outside the focus area) ===== */}
      <div className="mt-8 text-center space-y-3 max-w-[480px]">
        {/* Primary help link */}
        <p className="text-sm text-text-secondary">
          First time withdrawing?{" "}
          <a href="#" className="text-stacks-500 hover:text-stacks-600 underline underline-offset-2">
            Learn how it works
          </a>
        </p>

        {/* Secondary options */}
        <div className="flex items-center justify-center gap-4 text-xs text-text-tertiary">
          <a href="#" className="hover:text-text-secondary transition-colors">
            Withdrawal limits
          </a>
          <span>·</span>
          <a href="#" className="hover:text-text-secondary transition-colors">
            Common issues
          </a>
          <span>·</span>
          <a href="https://discord.gg/stacks" target="_blank" rel="noopener noreferrer" className="hover:text-text-secondary transition-colors">
            Get help
          </a>
        </div>
      </div>
    </div>
  );
}
