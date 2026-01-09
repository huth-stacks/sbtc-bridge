"use client";

import { Toaster } from "sonner";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-tertiary dark:bg-surface-tertiary">
      {/* Preview Header */}
      <header className="border-b border-explorer-border-secondary bg-surface-fourth dark:bg-surface-fourth">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sand-700 dark:bg-sand-100 flex items-center justify-center">
              <span className="text-sand-50 dark:text-sand-1000 font-bold text-sm">
                S
              </span>
            </div>
            <span className="font-semibold text-text-primary">
              sBTC Bridge
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-stacks-100 dark:bg-stacks-700/30 text-stacks-600 dark:text-stacks-300 font-medium">
              Preview
            </span>
          </div>

          {/* Mock Wallet Connection */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-text-secondary">
              0.5 BTC
            </div>
            <button className="px-4 py-2 rounded-lg bg-sand-700 dark:bg-sand-100 text-sand-50 dark:text-sand-1000 font-medium text-sm hover:bg-sand-1000 dark:hover:bg-sand-200 transition-colors">
              SP2J6Z...9EJ7
            </button>
          </div>
        </div>
      </header>

      {/* Preview Navigation */}
      <nav className="border-b border-explorer-border-secondary bg-surface-fourth dark:bg-surface-fourth">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            <PreviewNavLink href="/preview/mockup-index" label="Overview" />
            <PreviewNavLink href="/preview" label="Deposit" exact />
            <PreviewNavLink href="/preview/withdraw" label="Withdraw" />
            <PreviewNavLink href="/preview/transaction" label="Tx Status" />
            <PreviewNavLink href="/preview/history" label="History" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Toast Container (bottom-right) */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "bg-surface-fourth border border-explorer-border-secondary shadow-lg",
          style: {
            background: "var(--surface-fourth)",
            border: "1px solid var(--border-secondary)",
            color: "var(--text-primary)",
          },
        }}
      />
    </div>
  );
}

function PreviewNavLink({
  href,
  label,
  exact = false,
}: {
  href: string;
  label: string;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`
        px-4 py-3 text-sm font-medium border-b-2 transition-colors
        ${isActive
          ? "border-stacks-500 text-text-primary"
          : "border-transparent text-text-secondary hover:text-text-primary hover:border-sand-300"
        }
      `}
    >
      {label}
    </Link>
  );
}
