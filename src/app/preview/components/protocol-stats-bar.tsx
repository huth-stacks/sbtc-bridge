"use client";

import { MOCK_DATA, formatUsd } from "../mockup-data";

export function ProtocolStatsBar() {
  const { protocolStats, btcPrice } = MOCK_DATA;

  return (
    <div className="border-b border-explorer-border-secondary bg-surface-fourth dark:bg-surface-fourth">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between py-2 gap-6 overflow-x-auto">
          {/* BTC Locked */}
          <StatItem
            label="BTC Locked"
            value={`${protocolStats.btcLocked.toFixed(2)} BTC`}
            tooltip="Total BTC locked in the sBTC protocol"
          />

          {/* sBTC Supply */}
          <StatItem
            label="sBTC Supply"
            value={`${protocolStats.sbtcSupply.toFixed(2)} sBTC`}
            tooltip="Current circulating sBTC supply"
          />

          {/* Market Cap */}
          <StatItem
            label="Market Cap"
            value={formatUsd(protocolStats.marketCap)}
            tooltip="sBTC market capitalization"
          />

          {/* Total Minted */}
          <StatItem
            label="Total Minted"
            value={`${protocolStats.totalMinted.toFixed(2)} sBTC`}
            tooltip="Total sBTC minted since launch"
          />

          {/* Uptime */}
          <StatItem
            label="30d Uptime"
            value={`${protocolStats.uptime}%`}
            tooltip="Protocol uptime over the last 30 days"
            highlight={protocolStats.uptime >= 99}
          />
        </div>
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  tooltip,
  highlight = false,
}: {
  label: string;
  value: string;
  tooltip: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0 group relative" title={tooltip}>
      <span className="text-xs text-text-tertiary whitespace-nowrap">{label}</span>
      <span
        className={`text-sm font-semibold whitespace-nowrap ${
          highlight
            ? "text-feedback-green-600 dark:text-feedback-green-500"
            : "text-text-primary"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
