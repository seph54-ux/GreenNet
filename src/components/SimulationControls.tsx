import React from 'react';
import { useGreenNet } from '../context/GreenNetContext';
import {
  ThermometerSnowflake,
  Waves,
  Droplets,
  FlaskConical,
  Sun,
  BatteryCharging,
  Filter,
  Flame,
  RotateCcw,
  Play,
  Pause,
  Sparkles,
} from 'lucide-react';

export const SimulationControls: React.FC = () => {
  const {
    triggerSimulation,
    activeSimulation,
    isLiveStreaming,
    setIsLiveStreaming,
  } = useGreenNet();

  return (
    <div className="w-full bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-3 sm:p-4 mb-6 shadow-sm overflow-hidden transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--accent-color)]" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-color)]">
            Solar, Water & Hydroponics Simulation Bench
          </h3>
          <span className="text-[11px] text-[var(--text-muted)] hidden sm:inline">
            · Stress-test solar battery, filter pressure, chiller & alarms
          </span>
        </div>

        <button
          onClick={() => setIsLiveStreaming(!isLiveStreaming)}
          className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 py-1 rounded bg-[var(--bg-surface-subtle)] hover:bg-[var(--accent-bg)] border border-[var(--border-theme)] transition-colors min-h-[32px]"
        >
          {isLiveStreaming ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-[var(--accent-color)]" />}
          <span>{isLiveStreaming ? 'Pause Stream' : 'Resume Stream'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {/* 1. Solar Battery Depletion */}
        <button
          onClick={() => triggerSimulation('solar_depletion')}
          className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium border transition-all min-h-[40px] ${
            activeSimulation === 'solar_depletion'
              ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-sm'
              : 'bg-[var(--bg-surface-subtle)] hover:bg-amber-950/40 border-[var(--border-theme)] text-[var(--text-primary)] hover:text-amber-200'
          }`}
        >
          <BatteryCharging className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">Low Battery (18%)</span>
        </button>

        {/* 2. Filter Clogging (High Delta PSI) */}
        <button
          onClick={() => triggerSimulation('filter_clog')}
          className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium border transition-all min-h-[40px] ${
            activeSimulation === 'filter_clog'
              ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-sm'
              : 'bg-[var(--bg-surface-subtle)] hover:bg-rose-950/40 border-[var(--border-theme)] text-[var(--text-primary)] hover:text-rose-200'
          }`}
        >
          <Filter className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="truncate">Filter Clog (9.4 PSI)</span>
        </button>

        {/* 3. Freshwater Tank Low */}
        <button
          onClick={() => triggerSimulation('freshwater_low')}
          className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium border transition-all min-h-[40px] ${
            activeSimulation === 'freshwater_low'
              ? 'bg-sky-950/80 border-sky-500 text-sky-200 shadow-sm'
              : 'bg-[var(--bg-surface-subtle)] hover:bg-sky-950/40 border-[var(--border-theme)] text-[var(--text-primary)] hover:text-sky-200'
          }`}
        >
          <Droplets className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="truncate">Freshwater (14%)</span>
        </button>

        {/* 4. Warm Water Chiller Spike */}
        <button
          onClick={() => triggerSimulation('water_heat_spike')}
          className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium border transition-all min-h-[40px] ${
            activeSimulation === 'water_heat_spike'
              ? 'bg-blue-950/80 border-blue-500 text-blue-200 shadow-sm'
              : 'bg-[var(--bg-surface-subtle)] hover:bg-blue-950/40 border-[var(--border-theme)] text-[var(--text-primary)] hover:text-blue-200'
          }`}
        >
          <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="truncate">Warm Water (24.6°)</span>
        </button>

        {/* 5. Low Dissolved Oxygen */}
        <button
          onClick={() => triggerSimulation('oxygen_drop')}
          className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium border transition-all min-h-[40px] ${
            activeSimulation === 'oxygen_drop'
              ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-sm'
              : 'bg-[var(--bg-surface-subtle)] hover:bg-cyan-950/40 border-[var(--border-theme)] text-[var(--text-primary)] hover:text-cyan-200'
          }`}
        >
          <Waves className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">Low DO (4.8 mg/L)</span>
        </button>

        {/* 6. pH Drift */}
        <button
          onClick={() => triggerSimulation('ph_drift')}
          className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium border transition-all min-h-[40px] ${
            activeSimulation === 'ph_drift'
              ? 'bg-purple-950/80 border-purple-500 text-purple-200 shadow-sm'
              : 'bg-[var(--bg-surface-subtle)] hover:bg-purple-950/40 border-[var(--border-theme)] text-[var(--text-primary)] hover:text-purple-200'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="truncate">pH Drift (6.85)</span>
        </button>

        {/* 7. Air Heat Spike */}
        <button
          onClick={() => triggerSimulation('ambient_heat_spike')}
          className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium border transition-all min-h-[40px] ${
            activeSimulation === 'ambient_heat_spike'
              ? 'bg-red-950/80 border-red-500 text-red-200 shadow-sm'
              : 'bg-[var(--bg-surface-subtle)] hover:bg-red-950/40 border-[var(--border-theme)] text-[var(--text-primary)] hover:text-red-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span className="truncate">Air Heat (33.6°)</span>
        </button>

        {/* 8. Reset Nominal */}
        <button
          onClick={() => triggerSimulation('reset')}
          className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium bg-[var(--accent-bg)] hover:opacity-90 border border-[var(--border-theme-strong)] text-[var(--text-primary)] transition-all min-h-[40px]"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
          <span>Reset All</span>
        </button>
      </div>
    </div>
  );
};
