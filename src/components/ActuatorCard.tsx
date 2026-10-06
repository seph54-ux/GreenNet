import React from 'react';
import { LucideIcon, Power, Clock, ShieldCheck, Zap } from 'lucide-react';
import { ActuatorMode } from '../types/greennet';

interface ActuatorCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  isOn: boolean;
  mode: ActuatorMode;
  onModeChange: (mode: ActuatorMode) => void;
  onTogglePower: () => void;
  activeReason: string;
  thresholdNote: string;
  remainingMinutes?: number;
  onQuickTimer?: (minutes: number) => void;
  children?: React.ReactNode;
}

export const ActuatorCard: React.FC<ActuatorCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  isOn,
  mode,
  onModeChange,
  onTogglePower,
  activeReason,
  thresholdNote,
  remainingMinutes,
  onQuickTimer,
  children,
}) => {
  return (
    <div
      className={`border rounded-xl p-4 sm:p-5 transition-all duration-200 ${
        isOn
          ? 'border-[var(--accent-color)] bg-[var(--accent-bg)] shadow-sm'
          : 'border-[var(--border-theme)] bg-[var(--bg-surface)]'
      }`}
    >
      {/* Top Header: Title + Mode Switcher */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isOn
                ? 'bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/50'
                : 'bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] border border-[var(--border-theme)]'
            }`}
          >
            <Icon className={`w-5 h-5 ${isOn ? 'animate-spin-slow' : ''}`} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">{title}</h3>
            <p className="text-xs text-[var(--text-secondary)]">{subtitle}</p>
          </div>
        </div>

        {/* Segmented Mode Control [ AUTO | MANUAL ] */}
        <div className="flex items-center p-1 bg-[var(--bg-surface-subtle)] rounded-lg border border-[var(--border-theme)] shrink-0">
          <button
            onClick={() => onModeChange('AUTO')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              mode === 'AUTO'
                ? 'bg-[var(--accent-color)] text-black font-semibold shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Auto
          </button>
          <button
            onClick={() => onModeChange('MANUAL')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              mode === 'MANUAL'
                ? 'bg-amber-600 text-white font-semibold shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Manual
          </button>
        </div>
      </div>

      {/* Primary Power Action & Status */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)] mb-4">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onTogglePower}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all min-h-[44px] min-w-[44px] ${
              isOn
                ? 'bg-[var(--accent-color)] hover:opacity-90 text-black font-bold shadow-lg'
                : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)] text-[var(--text-muted)]'
            }`}
          >
            <Power className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
              <span>{isOn ? 'ACTIVE · RUNNING' : 'STANDBY · OFF'}</span>
              {isOn && <span className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse" />}
            </div>
            <div className="text-[11px] font-mono text-[var(--text-muted)]">
              {mode === 'AUTO' ? 'Auto-Threshold Linked' : 'Manual Override Active'}
            </div>
          </div>
        </div>

        {/* Remaining Timer if any */}
        {remainingMinutes !== undefined && remainingMinutes > 0 && (
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-amber-400 flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3" />
              <span>Timer</span>
            </div>
            <div className="text-xs font-mono font-bold text-[var(--text-primary)]">
              {Math.ceil(remainingMinutes)}m left
            </div>
          </div>
        )}
      </div>

      {/* Actuator-Specific Interactive Controls */}
      {children && <div className="mb-4">{children}</div>}

      {/* Quick Timer Presets */}
      {onQuickTimer && (
        <div className="mb-4">
          <div className="text-[11px] font-mono text-[var(--text-muted)] mb-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[var(--accent-color)]" />
            <span>Quick Manual Run Duration:</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[5, 15, 30, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => onQuickTimer(mins)}
                className="py-1.5 text-xs font-mono font-medium rounded-md bg-[var(--bg-surface-subtle)] hover:bg-[var(--accent-bg)] hover:text-[var(--text-primary)] border border-[var(--border-theme)] text-[var(--text-secondary)] transition-colors min-h-[36px]"
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status Reason & Threshold Linkage Footer */}
      <div className="pt-3 border-t border-[var(--border-theme)] space-y-1">
        <div className="text-xs text-[var(--text-secondary)] flex items-start gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0 mt-0.5" />
          <span className="line-clamp-2">{activeReason}</span>
        </div>
        <div className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
          <span>{thresholdNote}</span>
        </div>
      </div>
    </div>
  );
};
