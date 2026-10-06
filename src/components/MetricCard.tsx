import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  status: 'nominal' | 'warning' | 'critical';
  statusText: string;
  kicker?: string;
  icon: LucideIcon;
  sparklineData?: number[];
  optimalRange?: string;
  onClick?: () => void;
  subValue?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  status,
  statusText,
  kicker,
  icon: Icon,
  sparklineData = [],
  optimalRange,
  onClick,
  subValue,
}) => {
  const isCritical = status === 'critical';
  const isWarning = status === 'warning';

  // Calculate sparkline SVG path
  const sparklinePath = React.useMemo(() => {
    if (!sparklineData || sparklineData.length < 2) return '';
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;
    const width = 80;
    const height = 28;

    return sparklineData
      .map((val, idx) => {
        const x = (idx / (sparklineData.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [sparklineData]);

  return (
    <div
      onClick={onClick}
      className={`group relative bg-[var(--bg-surface)] border rounded-xl p-4 transition-all duration-200 ${
        isCritical
          ? 'border-red-600/70 bg-red-950/20 shadow-sm shadow-red-950/30 ring-1 ring-red-500/30'
          : isWarning
          ? 'border-amber-600/60 bg-amber-950/15'
          : 'border-[var(--border-theme)] hover:border-[var(--border-theme-strong)]'
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      {/* Top row: Kicker / Title + Icon */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          {kicker && (
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
              {kicker}
            </div>
          )}
          <h4 className="text-sm font-semibold text-[var(--text-primary)] transition-colors">
            {title}
          </h4>
        </div>
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
            isCritical
              ? 'bg-red-500/20 text-red-400'
              : isWarning
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-[var(--accent-bg)] text-[var(--accent-color)]'
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Primary Value + Sparkline */}
      <div className="flex items-baseline justify-between gap-3 mt-1">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight tabular-nums text-[var(--text-primary)]">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-mono font-medium text-[var(--text-muted)]">
              {unit}
            </span>
          )}
        </div>

        {/* Embedded Mini Sparkline */}
        {sparklinePath && (
          <div className="w-20 h-7 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity overflow-hidden">
            <svg viewBox="0 0 80 28" className="w-full h-full overflow-hidden">
              <path
                d={sparklinePath}
                fill="none"
                stroke={isCritical ? '#f87171' : isWarning ? '#fbbf24' : 'var(--accent-color)'}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Sub-value if present */}
      {subValue && (
        <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-1">
          {subValue}
        </div>
      )}

      {/* Bottom Metadata: Zero-pill discipline */}
      <div className="mt-3 pt-2.5 border-t border-[var(--border-theme)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isCritical
                ? 'bg-red-500 animate-ping'
                : isWarning
                ? 'bg-amber-500'
                : 'bg-[var(--accent-color)]'
            }`}
          />
          <span
            className={`font-medium ${
              isCritical
                ? 'text-red-400 font-semibold'
                : isWarning
                ? 'text-amber-400 font-semibold'
                : 'text-[var(--accent-color)]'
            }`}
          >
            {statusText}
          </span>
        </div>

        {optimalRange && (
          <div className="text-[var(--text-muted)] font-mono text-[10px] hidden xs:block">
            Target: {optimalRange}
          </div>
        )}
      </div>
    </div>
  );
};
