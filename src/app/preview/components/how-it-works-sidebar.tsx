"use client";

import { useState } from "react";

export function HowItWorksSidebar() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="w-64 flex-shrink-0 space-y-6">
      {/* How it works */}
      <div className="bg-surface-fourth border border-explorer-border-secondary rounded-xl p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          How it works
        </h3>

        <div className="space-y-4">
          <Step
            number={1}
            title="Enter amount"
            description="Choose how much BTC to deposit"
          />
          <Step
            number={2}
            title="Confirm transaction"
            description="Approve in your Bitcoin wallet"
          />
          <Step
            number={3}
            title="Wait ~60 minutes"
            description="6 Bitcoin confirmations needed"
          />
          <Step
            number={4}
            title="Receive sBTC"
            description="Automatically sent to your Stacks address"
          />
        </div>
      </div>

      {/* Sponsored callout */}
      <div className="bg-surface-fourth border border-explorer-border-secondary rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-stacks-100 dark:bg-stacks-700/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-stacks-600 dark:text-stacks-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-stacks-700 dark:text-stacks-300">
              No gas fees
            </p>
            <p className="text-xs text-stacks-600/80 dark:text-stacks-400/80 mt-1">
              Sponsored by Stacks Labs
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-surface-fourth border border-explorer-border-secondary rounded-xl p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Common questions
        </h3>

        <div className="space-y-0 divide-y divide-explorer-border-secondary/50">
          <FaqItem
            question="What if my deposit fails?"
            answer="If your deposit doesn't complete, you can reclaim your BTC. This option appears after 24 hours of no progress."
            isExpanded={expandedFaq === 0}
            onToggle={() => setExpandedFaq(expandedFaq === 0 ? null : 0)}
          />
          <FaqItem
            question="Why 60 minutes?"
            answer="We wait for 6 Bitcoin block confirmations (~60 min) to ensure your transaction is secure and irreversible."
            isExpanded={expandedFaq === 1}
            onToggle={() => setExpandedFaq(expandedFaq === 1 ? null : 1)}
          />
          <FaqItem
            question="Can I cancel?"
            answer="Once broadcast, Bitcoin transactions cannot be cancelled. If something goes wrong, use the reclaim process."
            isExpanded={expandedFaq === 2}
            onToggle={() => setExpandedFaq(expandedFaq === 2 ? null : 2)}
          />
        </div>
      </div>

      {/* Help link */}
      <div className="text-center">
        <a
          href="https://discord.gg/stacks"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-text-tertiary hover:text-text-secondary transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          Need help? Join Discord
        </a>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-sand-100 dark:bg-sand-800 flex items-center justify-center flex-shrink-0 border border-sand-200 dark:border-sand-700">
        <span className="text-xs font-semibold text-sand-700 dark:text-sand-200">
          {number}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="text-xs text-text-tertiary mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function FaqItem({
  question,
  answer,
  isExpanded,
  onToggle,
}: {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="py-2">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-2 text-left"
      >
        <span className="text-xs font-medium text-text-secondary">{question}</span>
        <svg
          className={`w-4 h-4 text-text-tertiary flex-shrink-0 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <p className="text-xs text-text-tertiary mt-2 leading-relaxed animate-in fade-in duration-200">
          {answer}
        </p>
      )}
    </div>
  );
}
