"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  MOCK_DATA,
  formatBtc,
  formatUsd,
  elideAddress,
} from "./mockup-data";

// Simulated UTXO balance issue (common user problem)
const MOCK_UTXO_DATA = {
  totalBalance: 0.5,
  spendableBalance: 0.35,
  hasProtectedUtxos: true,
};

export default function DepositPreviewPage() {
  const [amount, setAmount] = useState("");
  const [stxAddress, setStxAddress] = useState(MOCK_DATA.addresses.stacks);
  const [touched, setTouched] = useState({ amount: false, address: false });
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  const [showAddressEdit, setShowAddressEdit] = useState(false);
  const [showUtxoHelp, setShowUtxoHelp] = useState(false);

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

      {/* ===== MAIN CARD (Single Column Focus) ===== */}
      <div className="w-full max-w-[480px] bg-surface-fourth border border-explorer-border-secondary rounded-2xl shadow-sm p-6 space-y-5">

        {/* ===== 2. WARNING LAYER (Conditional - Only if urgent) ===== */}
        {MOCK_UTXO_DATA.hasProtectedUtxos && (
          <div className="bg-bitcoin-100/50 dark:bg-bitcoin-700/20 border border-bitcoin-300/50 dark:border-bitcoin-600/50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-bitcoin-600 dark:text-bitcoin-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-bitcoin-700 dark:text-bitcoin-300">
                  Only <span className="font-semibold">{MOCK_UTXO_DATA.spendableBalance} BTC</span> of {MOCK_UTXO_DATA.totalBalance} BTC is spendable
                </p>
                <button
                  onClick={() => setShowUtxoHelp(!showUtxoHelp)}
                  className="text-xs text-bitcoin-600 dark:text-bitcoin-400 underline mt-1"
                >
                  {showUtxoHelp ? "Hide details" : "Why?"}
                </button>
                {showUtxoHelp && (
                  <p className="text-xs text-text-secondary mt-2">
                    Some UTXOs are protected (Ordinals/Runes). Unprotect in wallet settings.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

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
          onClick={handleShowToast}
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
  );
}
