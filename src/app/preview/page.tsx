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
  spendableBalance: 0.35, // Some UTXOs are protected
  hasProtectedUtxos: true,
};

export default function DepositPreviewPage() {
  const [amount, setAmount] = useState("");
  const [stxAddress, setStxAddress] = useState(MOCK_DATA.addresses.stacks);
  const [step, setStep] = useState<"amount" | "address" | "confirm">("amount");
  const [touched, setTouched] = useState({ amount: false, address: false });
  const [showUtxoHelp, setShowUtxoHelp] = useState(false);
  const [showFirstTimeGuide, setShowFirstTimeGuide] = useState(true);

  const btcAvailable = MOCK_UTXO_DATA.spendableBalance;
  const usdEquivalent = parseFloat(amount || "0") * MOCK_DATA.btcPrice;

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
    <div className="max-w-5xl mx-auto">
      {/* Two-column layout on desktop, single column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Form Column - Takes 7 columns on desktop */}
        <div className="lg:col-span-7 space-y-4">
          {/* UTXO Balance Warning - Show above form on desktop too */}
          {MOCK_UTXO_DATA.hasProtectedUtxos && (
            <div className="bg-bitcoin-100 dark:bg-bitcoin-700/20 border border-bitcoin-300 dark:border-bitcoin-600 rounded-xl p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-bitcoin-600 dark:text-bitcoin-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-bitcoin-700 dark:text-bitcoin-300">
                      Some BTC may be in protected UTXOs
                    </p>
                    <button
                      onClick={() => setShowUtxoHelp(!showUtxoHelp)}
                      className="text-xs text-bitcoin-600 dark:text-bitcoin-400 underline"
                    >
                      {showUtxoHelp ? "Hide" : "What's this?"}
                    </button>
                  </div>
                  <p className="text-xs text-bitcoin-600/80 dark:text-bitcoin-400/80 mt-1">
                    Total: <span className="font-medium">{MOCK_UTXO_DATA.totalBalance} BTC</span> ·
                    Spendable: <span className="font-medium">{MOCK_UTXO_DATA.spendableBalance} BTC</span>
                  </p>
                  {showUtxoHelp && (
                    <div className="mt-3 p-3 bg-surface-fourth dark:bg-surface-fourth rounded-lg">
                      <p className="text-xs text-text-secondary">
                        <strong>Protected UTXOs</strong> are Bitcoin outputs that your wallet has marked as "do not spend."
                        This often happens with Ordinals, Runes, or when using certain wallet features.
                      </p>
                      <p className="text-xs text-text-secondary mt-2">
                        <strong>To unprotect your UTXOs:</strong>
                      </p>
                      <ul className="text-xs text-text-secondary mt-1 list-disc list-inside space-y-1">
                        <li><strong>Leather:</strong> Settings → Advanced → Unprotect All UTXOs</li>
                        <li><strong>Xverse:</strong> Settings → Bitcoin Settings → Manage UTXOs</li>
                      </ul>
                      <a href="#" className="inline-flex items-center gap-1 text-xs text-stacks-500 hover:text-stacks-600 font-medium mt-2">
                        Read the full UTXO guide
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Card Container - Main Deposit Form */}
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

                  {/* Balance & USD Display with Max Button */}
                  <div className="px-4 pb-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-secondary">
                        {btcAvailable.toFixed(8)} BTC available
                      </span>
                      <button
                        onClick={() => setAmount(btcAvailable.toString())}
                        className="px-2 py-0.5 text-xs font-medium text-stacks-500 hover:text-stacks-600 bg-stacks-100 dark:bg-stacks-700/30 rounded hover:bg-stacks-200 dark:hover:bg-stacks-700/50 transition-colors"
                      >
                        Max
                      </button>
                    </div>
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

              {/* Fee Breakdown */}
              <div className="rounded-xl bg-surface-secondary dark:bg-surface-secondary p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Network fee</span>
                  <span className="text-sm text-text-primary">~0.00008 BTC (~$7.68)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Bridge fee</span>
                  <span className="text-sm text-text-primary">0% (free)</span>
                </div>
                <div className="border-t border-explorer-border-secondary pt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-text-secondary">You receive</span>
                  <span className="text-sm font-medium text-text-primary">
                    {amount ? `~${(parseFloat(amount) - 0.00008).toFixed(8)} sBTC` : "—"}
                  </span>
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
                {!amount ? "Enter amount" : amountError ? "Fix errors" : "Deposit BTC"}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Column - Takes 5 columns on desktop */}
        <div className="lg:col-span-5 space-y-4">
          {/* First-Time User Guide */}
          {showFirstTimeGuide && (
            <div className="bg-sand-200 dark:bg-sand-800 border border-sand-400 dark:border-sand-600 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-text-primary">First time using sBTC Bridge?</h3>
                <button
                  onClick={() => setShowFirstTimeGuide(false)}
                  className="text-text-tertiary hover:text-text-secondary"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-text-secondary mb-4">
                Before depositing, make sure your BTC is in an unprotected UTXO and you have the correct derivation path set up.
              </p>
              <div className="space-y-2">
                <a href="#" className="flex items-center gap-2 p-3 rounded-lg bg-surface-fourth hover:bg-surface-secondary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-stacks-100 dark:bg-stacks-700/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-stacks-600 dark:text-stacks-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Getting Started Guide</p>
                    <p className="text-xs text-text-secondary">Step-by-step deposit instructions</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-2 p-3 rounded-lg bg-surface-fourth hover:bg-surface-secondary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-bitcoin-100 dark:bg-bitcoin-700/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-bitcoin-600 dark:text-bitcoin-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Hardware Wallet Setup</p>
                    <p className="text-xs text-text-secondary">Configure Ledger or Trezor</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-2 p-3 rounded-lg bg-surface-fourth hover:bg-surface-secondary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-sand-300 dark:bg-sand-700 flex items-center justify-center">
                    <svg className="w-4 h-4 text-sand-700 dark:text-sand-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Common Issues FAQ</p>
                    <p className="text-xs text-text-secondary">Troubleshooting help</p>
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* DEX Links Card */}
          <div className="rounded-xl bg-surface-fourth dark:bg-surface-fourth border border-explorer-border-secondary p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-stacks-100 dark:bg-stacks-700/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-stacks-600 dark:text-stacks-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-primary">
                  Other ways to get sBTC
                </h3>
                <p className="text-xs text-text-secondary">
                  Swap on decentralized exchanges
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <a href="https://alexgo.io" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 p-3 rounded-lg bg-surface-secondary hover:bg-surface-tertiary transition-colors">
                <span className="text-lg font-bold text-stacks-500">A</span>
                <span className="text-xs text-text-secondary">ALEX</span>
              </a>
              <a href="https://velar.co" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 p-3 rounded-lg bg-surface-secondary hover:bg-surface-tertiary transition-colors">
                <span className="text-lg font-bold text-stacks-500">V</span>
                <span className="text-xs text-text-secondary">Velar</span>
              </a>
              <a href="https://bitflow.finance" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 p-3 rounded-lg bg-surface-secondary hover:bg-surface-tertiary transition-colors">
                <span className="text-lg font-bold text-stacks-500">B</span>
                <span className="text-xs text-text-secondary">Bitflow</span>
              </a>
            </div>
          </div>

          {/* Support Card */}
          <div className="rounded-xl bg-surface-fourth dark:bg-surface-fourth border border-explorer-border-secondary p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-feedback-green-100 dark:bg-feedback-green-100/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-feedback-green-600 dark:text-feedback-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-primary">
                  Need help?
                </h3>
                <p className="text-xs text-text-secondary">
                  Get support from the Stacks community
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <a href="mailto:support@stacks.org" className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-surface-secondary hover:bg-surface-tertiary text-sm font-medium text-text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
              <a href="https://discord.gg/stacks" target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-surface-secondary hover:bg-surface-tertiary text-sm font-medium text-text-primary transition-colors">
                Discord
              </a>
            </div>
          </div>

          {/* Learn More Section */}
          <div className="rounded-xl bg-gradient-to-br from-stacks-100 to-bitcoin-100 dark:from-stacks-700/20 dark:to-bitcoin-700/20 border border-explorer-border-secondary p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-surface-fourth flex items-center justify-center">
                <svg className="w-5 h-5 text-stacks-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-primary">
                  Learn more about sBTC
                </h3>
                <p className="text-xs text-text-secondary">
                  Understand how it works
                </p>
              </div>
            </div>
            <a
              href="https://stacks.co/sbtc"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-sand-700 dark:bg-sand-100 text-sand-50 dark:text-sand-1000 text-sm font-medium hover:bg-sand-1000 dark:hover:bg-sand-200 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
