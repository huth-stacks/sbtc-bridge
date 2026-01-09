"use client";

import { MOCK_DATA } from "../mockup-data";

export default function ZeroStatePage() {
  return (
    <div className="flex flex-col items-center min-h-[70vh] py-12">
      {/* Hero Card */}
      <div className="w-full max-w-[560px] bg-surface-fourth border border-explorer-border-secondary rounded-2xl shadow-sm p-8 space-y-8">

        {/* Visual: BTC → sBTC transformation */}
        <div className="flex items-center justify-center gap-4">
          {/* BTC Icon */}
          <div className="w-16 h-16 rounded-full bg-bitcoin-100 dark:bg-bitcoin-700/30 flex items-center justify-center border-2 border-bitcoin-200 dark:border-bitcoin-600">
            <span className="text-bitcoin-600 dark:text-bitcoin-400 text-2xl font-bold">₿</span>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-1">
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
            <span className="text-[10px] text-text-tertiary font-medium">1:1</span>
          </div>

          {/* sBTC Icon */}
          <div className="w-16 h-16 rounded-full bg-stacks-100 dark:bg-stacks-700/30 flex items-center justify-center border-2 border-stacks-200 dark:border-stacks-600">
            <span className="text-stacks-600 dark:text-stacks-400 text-lg font-bold">sBTC</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
            Bridge Bitcoin to Stacks
          </h1>
          <p className="text-text-secondary text-sm">
            Securely convert your BTC to sBTC and unlock DeFi on Stacks
          </p>
        </div>

        {/* Value Propositions */}
        <div className="space-y-3">
          <ValueProp
            icon="check"
            title="1:1 BTC-backed"
            description="Every sBTC is fully backed by Bitcoin held in a decentralized threshold wallet"
          />
          <ValueProp
            icon="shield"
            title="Trustless & transparent"
            description="Verify holdings on-chain anytime. No custodians, no middlemen."
          />
          <ValueProp
            icon="zap"
            title="DeFi-ready on Stacks"
            description="Use your sBTC in lending, borrowing, and liquidity pools"
          />
        </div>

        {/* Connect Wallet CTA */}
        <button
          className="
            w-full h-14 rounded-xl font-semibold text-base
            bg-sand-800 dark:bg-sand-100
            text-sand-50 dark:text-sand-900
            hover:bg-sand-900 dark:hover:bg-sand-200
            transition-colors shadow-sm
            flex items-center justify-center gap-2
          "
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Connect Wallet
        </button>
      </div>

      {/* What happens when you deposit */}
      <div className="w-full max-w-[560px] mt-8 space-y-4">
        <h2 className="text-sm font-medium text-text-secondary text-center">
          What happens when you deposit?
        </h2>

        <div className="flex items-center justify-between gap-2 px-4">
          {/* Step 1 */}
          <Step
            number={1}
            label="Send BTC"
            description="From your wallet"
          />

          {/* Connector */}
          <div className="flex-1 h-px bg-explorer-border-secondary" />

          {/* Step 2 */}
          <Step
            number={2}
            label="Wait ~60 min"
            description="6 confirmations"
          />

          {/* Connector */}
          <div className="flex-1 h-px bg-explorer-border-secondary" />

          {/* Step 3 */}
          <Step
            number={3}
            label="Receive sBTC"
            description="On Stacks"
          />
        </div>
      </div>

      {/* Secondary info */}
      <div className="mt-10 text-center space-y-4 max-w-[560px]">
        {/* Sponsored callout */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stacks-100/50 dark:bg-stacks-700/20 border border-stacks-200/50 dark:border-stacks-600/50">
          <svg className="w-4 h-4 text-stacks-600 dark:text-stacks-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-stacks-700 dark:text-stacks-300">
            <span className="font-medium">Sponsored by Stacks Labs</span>
            <span className="text-stacks-600/80 dark:text-stacks-400/80 ml-1">• No gas fees required</span>
          </span>
        </div>

        {/* Help links */}
        <div className="flex items-center justify-center gap-4 text-xs text-text-tertiary">
          <a href="#" className="hover:text-text-secondary transition-colors">
            What is sBTC?
          </a>
          <span>•</span>
          <a href="#" className="hover:text-text-secondary transition-colors">
            Supported wallets
          </a>
          <span>•</span>
          <a
            href="https://discord.gg/stacks"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-secondary transition-colors"
          >
            Get help
          </a>
        </div>
      </div>
    </div>
  );
}

function ValueProp({
  icon,
  title,
  description,
}: {
  icon: "check" | "shield" | "zap";
  title: string;
  description: string;
}) {
  const iconMap = {
    check: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
    shield: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    zap: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-secondary/30 hover:bg-surface-secondary/50 transition-colors">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-feedback-green-100 dark:bg-feedback-green-100/20 flex items-center justify-center text-feedback-green-600 dark:text-feedback-green-500">
        {iconMap[icon]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="text-xs text-text-tertiary mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function Step({
  number,
  label,
  description,
}: {
  number: number;
  label: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="w-10 h-10 rounded-full bg-sand-100 dark:bg-sand-800 flex items-center justify-center border border-sand-200 dark:border-sand-700">
        <span className="text-sm font-semibold text-sand-700 dark:text-sand-200">{number}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-[11px] text-text-tertiary">{description}</p>
      </div>
    </div>
  );
}
