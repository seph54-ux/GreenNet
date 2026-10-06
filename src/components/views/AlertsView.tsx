import React, { useState } from 'react';
import { useGreenNet } from '../../context/GreenNetContext';
import {
  Bell,
  Sliders,
  ShieldAlert,
  Volume2,
  VolumeX,
  AlertTriangle,
  Info,
  RotateCcw,
  Zap,
  ThermometerSnowflake,
  Waves,
  FlaskConical,
  Gauge,
  Sun,
  BatteryCharging,
  Droplets,
  Filter,
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const {
    alerts,
    unreadAlertCount,
    markAlertAsRead,
    markAllAlertsRead,
    clearResolvedAlerts,
    soundEnabled,
    setSoundEnabled,
    browserPushStatus,
    enableBrowserPush,
    thresholds,
    updateThresholds,
    resetThresholdsToDefault,
  } = useGreenNet();

  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
          Push Notifications & Safety Thresholds
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Real-time alert dispatch rules and autonomous safety triggers for vertical hydroponics, solar ESS & filtration
        </p>
      </div>

      {/* Push Notification Engine Card */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-bg)] border border-[var(--border-theme-strong)] text-[var(--accent-color)] flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                Real-Time Urgent Push Notification System
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Instant browser & audio alarms for battery depletion, filter clogging, water tank depletion, pythium hazard & hypoxia
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs font-mono">
                <span className="text-[var(--text-muted)]">Push Status:</span>
                <span
                  className={`font-semibold ${
                    browserPushStatus === 'granted'
                      ? 'text-emerald-400'
                      : browserPushStatus === 'denied'
                      ? 'text-red-400'
                      : 'text-amber-400'
                  }`}
                >
                  {browserPushStatus.toUpperCase()}
                </span>
                <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
                <span className="text-[var(--text-muted)]">Audio Chime:</span>
                <span className="text-[var(--accent-color)] font-semibold">
                  {soundEnabled ? 'ACTIVE' : 'MUTED'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {browserPushStatus !== 'granted' && (
              <button
                onClick={enableBrowserPush}
                className="px-4 py-2.5 rounded-lg bg-[var(--accent-color)] text-black text-xs font-semibold flex items-center gap-2 transition-transform active:scale-95 shadow-sm min-h-[44px] cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>Enable Browser Push</span>
              </button>
            )}

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="px-3.5 py-2.5 rounded-lg bg-[var(--bg-surface-subtle)] hover:bg-[var(--accent-bg)] border border-[var(--border-theme)] text-[var(--text-primary)] text-xs font-medium flex items-center gap-2 transition-colors min-h-[44px] cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[var(--accent-color)]" /> : <VolumeX className="w-4 h-4 text-[var(--text-muted)]" />}
              <span>{soundEnabled ? 'Chime Active' : 'Chime Muted'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hydroponic & Climate Critical Threshold Sliders */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--accent-color)]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Hydroponic & Climate Safety Thresholds
            </h3>
          </div>
          <button
            onClick={resetThresholdsToDefault}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-color)] flex items-center gap-1 font-mono transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Water Temp Max Threshold (Pythium limit) */}
          <div className="p-3.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="flex justify-between text-xs mb-1.5 font-mono">
              <span className="text-[var(--text-secondary)]">Max Solution Temp (Chiller):</span>
              <span className="text-cyan-400 font-bold">{thresholds.waterTempMax}°C</span>
            </div>
            <input
              type="range"
              min="19"
              max="25"
              step="0.5"
              value={thresholds.waterTempMax}
              onChange={(e) => updateThresholds({ waterTempMax: Number(e.target.value) })}
              aria-label="Max Water Temp Threshold"
              className="w-full h-2 bg-[var(--bg-canvas)] rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Auto-chills to prevent root rot</span>
            </div>
          </div>

          {/* Min Dissolved Oxygen */}
          <div className="p-3.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="flex justify-between text-xs mb-1.5 font-mono">
              <span className="text-[var(--text-secondary)]">Min Dissolved Oxygen (Aerator):</span>
              <span className="text-teal-400 font-bold">{thresholds.dissolvedOxygenMin} mg/L</span>
            </div>
            <input
              type="range"
              min="4.5"
              max="8.0"
              step="0.1"
              value={thresholds.dissolvedOxygenMin}
              onChange={(e) => updateThresholds({ dissolvedOxygenMin: Number(e.target.value) })}
              aria-label="Min Dissolved Oxygen Threshold"
              className="w-full h-2 bg-[var(--bg-canvas)] rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-teal-400" />
              <span>Boosts micro-bubble aerator to 100%</span>
            </div>
          </div>

          {/* Min Sump Water Level */}
          <div className="p-3.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="flex justify-between text-xs mb-1.5 font-mono">
              <span className="text-[var(--text-secondary)]">Min Sump Reservoir Level:</span>
              <span className="text-amber-400 font-bold">{thresholds.waterLevelMin}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="40"
              step="1"
              value={thresholds.waterLevelMin}
              onChange={(e) => updateThresholds({ waterLevelMin: Number(e.target.value) })}
              aria-label="Min Water Level Threshold"
              className="w-full h-2 bg-[var(--bg-canvas)] rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Protects pump from cavitation</span>
            </div>
          </div>

          {/* Solution pH Max */}
          <div className="p-3.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="flex justify-between text-xs mb-1.5 font-mono">
              <span className="text-[var(--text-secondary)]">Max pH Limit (pH Down Doser):</span>
              <span className="text-purple-400 font-bold">{thresholds.reservoirPhMax} pH</span>
            </div>
            <input
              type="range"
              min="6.0"
              max="7.0"
              step="0.05"
              value={thresholds.reservoirPhMax}
              onChange={(e) => updateThresholds({ reservoirPhMax: Number(e.target.value) })}
              aria-label="Max pH Threshold"
              className="w-full h-2 bg-[var(--bg-canvas)] rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-purple-400" />
              <span>Auto-injects phosphoric acid</span>
            </div>
          </div>

          {/* Ambient Air Temp Max */}
          <div className="p-3.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="flex justify-between text-xs mb-1.5 font-mono">
              <span className="text-[var(--text-secondary)]">Max Canopy Temp (Exhaust Fan):</span>
              <span className="text-red-400 font-bold">{thresholds.temperatureMax}°C</span>
            </div>
            <input
              type="range"
              min="24"
              max="36"
              step="0.5"
              value={thresholds.temperatureMax}
              onChange={(e) => updateThresholds({ temperatureMax: Number(e.target.value) })}
              aria-label="Max Ambient Temp Threshold"
              className="w-full h-2 bg-[var(--bg-canvas)] rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-red-400" />
              <span>Auto-starts high-volume cooling exhaust</span>
            </div>
          </div>

          {/* Canopy Air Humidity Min */}
          <div className="p-3.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="flex justify-between text-xs mb-1.5 font-mono">
              <span className="text-[var(--text-secondary)]">Min Canopy Humidity (Foggers):</span>
              <span className="text-sky-400 font-bold">{thresholds.humidityMin}%</span>
            </div>
            <input
              type="range"
              min="35"
              max="60"
              step="1"
              value={thresholds.humidityMin}
              onChange={(e) => updateThresholds({ humidityMin: Number(e.target.value) })}
              aria-label="Min Air Humidity Threshold"
              className="w-full h-2 bg-[var(--bg-canvas)] rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-sky-400" />
              <span>Starts high-pressure mist foggers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Solar ESS & Water Filtration Critical Safety Thresholds */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <Sun className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
            Solar Power ESS & Water Filtration Thresholds
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Min Battery SoC % (Eco-shedding trigger) */}
          <div className="p-3.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="flex justify-between text-xs mb-1.5 font-mono">
              <span className="text-[var(--text-secondary)] flex items-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
                <span>Min Battery SoC (Eco Shed):</span>
              </span>
              <span className="text-amber-400 font-bold">{thresholds.batterySocMin}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="50"
              step="1"
              value={thresholds.batterySocMin}
              onChange={(e) => updateThresholds({ batterySocMin: Number(e.target.value) })}
              aria-label="Min Battery SoC Threshold"
              className="w-full h-2 bg-[var(--bg-canvas)] rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Sheds non-vital lights to preserve pump</span>
            </div>
          </div>

          {/* 2. Freshwater Supply Tank Low */}
          <div className="p-3.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="flex justify-between text-xs mb-1.5 font-mono">
              <span className="text-[var(--text-secondary)] flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>Supply Water Tank Alarm:</span>
              </span>
              <span className="text-sky-400 font-bold">{thresholds.freshwaterTankMin}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              step="1"
              value={thresholds.freshwaterTankMin}
              onChange={(e) => updateThresholds({ freshwaterTankMin: Number(e.target.value) })}
              aria-label="Min Freshwater Supply Tank Threshold"
              className="w-full h-2 bg-[var(--bg-canvas)] rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-sky-400" />
              <span>Urgent replenishment alert for supply tank</span>
            </div>
          </div>

          {/* 3. Filter Differential Pressure (ΔP Limit) */}
          <div className="p-3.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="flex justify-between text-xs mb-1.5 font-mono">
              <span className="text-[var(--text-secondary)] flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-rose-400" />
                <span>Max Filter ΔP (Auto-Backwash):</span>
              </span>
              <span className="text-rose-400 font-bold">{thresholds.filterDeltaPsiMax} PSI</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="14.0"
              step="0.5"
              value={thresholds.filterDeltaPsiMax}
              onChange={(e) => updateThresholds({ filterDeltaPsiMax: Number(e.target.value) })}
              aria-label="Max Filter Differential Pressure Threshold"
              className="w-full h-2 bg-[var(--bg-canvas)] rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-rose-400" />
              <span>Auto-initiates backwash flush cycle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Push Alert Log */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Event & Alarm Dispatch Audit Log
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Audit trail of threshold triggers, solar load-shedding, filter flushes, chiller cooling & dosing actions
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[var(--bg-surface-subtle)] rounded-lg border border-[var(--border-theme)]">
            {(['all', 'critical', 'warning', 'info'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors cursor-pointer ${
                  filterSeverity === sev
                    ? 'bg-[var(--accent-color)] text-black font-semibold shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pb-3 border-b border-[var(--border-theme)] text-[var(--text-muted)] font-mono">
          <span>{filteredAlerts.length} Events Recorded</span>
          <div className="flex items-center gap-3">
            <button onClick={markAllAlertsRead} className="hover:text-[var(--accent-color)] transition-colors cursor-pointer">
              Mark All Read
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={clearResolvedAlerts} className="hover:text-red-400 transition-colors cursor-pointer">
              Clear Resolved
            </button>
          </div>
        </div>

        <div className="divide-y divide-[var(--border-theme)] mt-2">
          {filteredAlerts.length === 0 ? (
            <div className="py-8 text-center text-[var(--text-muted)] text-xs">No alerts matching current filter.</div>
          ) : (
            filteredAlerts.map((alert) => {
              const isCrit = alert.severity === 'critical';
              const isWarn = alert.severity === 'warning';

              return (
                <div
                  key={alert.id}
                  onClick={() => markAlertAsRead(alert.id)}
                  className={`py-3.5 flex items-start justify-between gap-3 transition-colors cursor-pointer rounded-lg px-2 ${
                    !alert.read ? 'bg-[var(--accent-bg)]' : 'hover:bg-[var(--bg-surface-subtle)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {isCrit ? (
                        <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                      ) : isWarn ? (
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <Info className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">{alert.title}</h4>
                        {!alert.read && <span className="w-2 h-2 rounded-full bg-[var(--accent-color)]" />}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{alert.message}</p>
                      {alert.actuatorTriggered && (
                        <div className="mt-1 text-[11px] font-mono font-medium text-cyan-400 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span>Triggered Response: {alert.actuatorTriggered}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-[var(--text-muted)] shrink-0 text-right">{alert.timestamp}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
