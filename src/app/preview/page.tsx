"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MOCK_DATA,
  formatUsd,
  elideAddress,
} from "./mockup-data";
import { HowItWorksSidebar } from "./components/how-it-works-sidebar";

// Simulated UTXO balance issue (common user problem)
const MOCK_UTXO_DATA = {
  totalBalance: 0.5,
  spendableBalance: 0.35,
  hasProtectedUtxos: true,
};

export default function DepositPreviewPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [stxAddress, setStxAddress] = useState(MOCK_DATA.addresses.stacks);
  const [touched, setTouched] = useState({ amount: false, address: false });
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  const [showAddressEdit, setShowAddressEdit] = useState(false);
  const [showUtxoHelp, setShowUtxoHelp] = useState(false);
  const [utxoDismissed, setUtxoDismissed] = useState(false);

  const btcAvailable = MOCK_UTXO_DATA.spendableBalance;
  const usdEquivalent = parseFloat(amount || "0") * MOCK_DATA.btcPrice;
  const networkFee = 0.00008;
  const receiveAmount = amount ? Math.max(0, parseFloat(amount) - networkFee) : 0;

  const amountError =
    touched.amount && amount
      ? parseFloat(amount) > btcAvailable
        ? "Insufficient spendable balance"
        : parseFloat(amount) < MOCK_DATA.mintCap.perDeposit.min
        ? `Minimum deposit is ${MOCK_DATA.mintCap.perDeposit.min} BTC`
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
          Deposit Bitcoin
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Bridge BTC to sBTC on Stacks
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex justify-center gap-8 items-start">
        {/* Main Content */}
        <div className="flex flex-col items-center">
          {/* ===== MAIN CARD (Single Column Focus) ===== */}
      <div className="w-full max-w-[480px] bg-surface-fourth border border-explorer-border-secondary rounded-2xl shadow-sm p-6 space-y-5">

        {/* ===== 2. INPUT LAYER (Hero - Focal Point) ===== */}
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
              <div className="flex-shrink-0 flex items-center gap-2 bg-bitcoin-100 dark:bg-bitcoin-700/30 py-2 px-4 rounded-full border border-bitcoin-200 dark:border-bitcoin-600">
                <span className="font-semibold text-bitcoin-700 dark:text-bitcoin-300">BTC</span>
              </div>
            </div>
          </div>

          {/* Balance Helper */}
          <div className="flex justify-between items-center text-xs px-1">
            <span className="text-text-tertiary">
              Balance: {btcAvailable} BTC
              {amount && <span className="text-text-secondary ml-2">~{formatUsd(usdEquivalent)}</span>}
            </span>
            <button
              onClick={() => setAmount(btcAvailable.toString())}
              className="text-stacks-500 hover:text-stacks-600 font-medium hover:underline"
            >
              Max
            </button>
          </div>

          {/* UTXO Warning (subtle, dismissible) */}
          {MOCK_UTXO_DATA.hasProtectedUtxos && !utxoDismissed && (
            <div className="flex items-center justify-between text-xs px-1 text-text-tertiary">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-bitcoin-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>
                  {(MOCK_UTXO_DATA.totalBalance - MOCK_UTXO_DATA.spendableBalance).toFixed(2)} BTC unavailable (protected)
                </span>
                <button
                  onClick={() => setShowUtxoHelp(!showUtxoHelp)}
                  className="text-stacks-500 hover:text-stacks-600 underline"
                >
                  Why?
                </button>
              </div>
              <button
                onClick={() => setUtxoDismissed(true)}
                className="text-text-tertiary hover:text-text-secondary p-0.5"
                aria-label="Dismiss"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* UTXO Help Explanation */}
          {showUtxoHelp && !utxoDismissed && (
            <p className="text-xs text-text-tertiary px-1 bg-surface-secondary/50 rounded p-2">
              Some UTXOs contain Ordinals or Runes and are protected. Unprotect them in your wallet settings to use this balance.
            </p>
          )}

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

        {/* ===== 4. RECEIVE ADDRESS (Progressive Disclosure) ===== */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-text-tertiary ml-1">Receive at</label>
            {!showAddressEdit && (
              <button
                onClick={() => setShowAddressEdit(true)}
                className="text-xs text-stacks-500 hover:text-stacks-600"
              >
                Edit
              </button>
            )}
          </div>

          {showAddressEdit ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={stxAddress}
                onChange={(e) => setStxAddress(e.target.value)}
                className="flex-1 px-3 py-2 text-sm bg-surface-tertiary border border-explorer-border-primary rounded-lg text-text-primary focus:outline-none focus:border-stacks-400"
              />
              <button
                onClick={() => setShowAddressEdit(false)}
                className="px-3 py-2 text-sm bg-stacks-100 dark:bg-stacks-700/30 text-stacks-600 dark:text-stacks-400 rounded-lg hover:bg-stacks-200 dark:hover:bg-stacks-700/50"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-secondary/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-stacks-100 dark:bg-stacks-700/30 flex items-center justify-center">
                <span className="text-stacks-600 dark:text-stacks-400 text-[10px] font-bold">STX</span>
              </div>
              <span className="text-sm text-text-primary font-medium">{elideAddress(stxAddress, 10)}</span>
              <span className="text-xs text-text-tertiary">(Connected wallet)</span>
            </div>
          )}
        </div>

        {/* ===== 5. LOGIC LAYER (Fees - Progressive Disclosure) ===== */}
        <div className="bg-surface-secondary/30 rounded-xl p-4 space-y-3">
          {/* Summary (Always Visible) */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-text-secondary">You receive</span>
            <span className="text-lg font-semibold text-text-primary">
              {amount ? `${receiveAmount.toFixed(8)} sBTC` : "—"}
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
                <span>Network fee</span>
                <span className="text-text-secondary">~{networkFee} BTC (~$7.68)</span>
              </div>
              <div className="flex justify-between">
                <span>Bridge fee</span>
                <span className="text-text-secondary">0% (free)</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated time</span>
                <span className="text-text-secondary">~{MOCK_DATA.estimatedConfirmationTime} mins</span>
              </div>
            </div>
          )}
        </div>

        {/* ===== 6. ACTION LAYER (Primary CTA) ===== */}
        <button
          onClick={handleSubmit}
          disabled={!amount || !!amountError}
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
          {!amount ? "Enter amount" : amountError ? "Fix errors" : "Deposit BTC"}
        </button>
      </div>

      {/* ===== 7. ESCAPE LAYER (Outside the focus area) ===== */}
      <div className="mt-8 text-center space-y-3 max-w-[480px]">
        {/* Primary help link */}
        <p className="text-sm text-text-secondary">
          First time bridging?{" "}
          <a href="#" className="text-stacks-500 hover:text-stacks-600 underline underline-offset-2">
            Read the guide
          </a>
        </p>

        {/* Secondary options - more subtle */}
        <div className="flex items-center justify-center gap-4 text-xs text-text-tertiary">
          <a href="#" className="hover:text-text-secondary transition-colors">
            Hardware wallet setup
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

        {/* Alternative path - most subtle */}
        <p className="text-xs text-text-tertiary/70 pt-2">
          Want to swap instead?{" "}
          <a href="https://alexgo.io" target="_blank" rel="noopener noreferrer" className="hover:text-text-tertiary transition-colors">
            ALEX
          </a>
          {" · "}
          <a href="https://velar.co" target="_blank" rel="noopener noreferrer" className="hover:text-text-tertiary transition-colors">
            Velar
          </a>
          {" · "}
          <a href="https://bitflow.finance" target="_blank" rel="noopener noreferrer" className="hover:text-text-tertiary transition-colors">
            Bitflow
          </a>
        </p>
      </div>
      </div>

        {/* Right Sidebar - How It Works */}
        <div className="hidden lg:block">
          <HowItWorksSidebar />
        </div>
      </div>
    </div>
  );
}
