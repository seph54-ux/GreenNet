import React, { useState } from 'react';
import { useGreenNet } from '../../context/GreenNetContext';
import {
  ThermometerSnowflake,
  Waves,
  FlaskConical,
  Activity,
  Droplets,
  Thermometer,
  Wind,
  Flame,
  Gauge,
  Sun,
  BatteryCharging,
  Filter,
  Zap,
  ShieldCheck,
} from 'lucide-react';

export const SensorsView: React.FC = () => {
  const { readings, thresholds, formatTemp, history } = useGreenNet();
  const [selectedChartMetric, setSelectedChartMetric] = useState<
    'waterTemperature' | 'dissolvedOxygen' | 'solarWatts' | 'batterySoc' | 'reservoirEc' | 'temperature' | 'co2Ppm'
  >('waterTemperature');

  const chartData = history.map((pt) => ({
    time: pt.time,
    value: pt[selectedChartMetric] ?? 0,
  }));

  const values = chartData.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const chartMetricsConfig = {
    waterTemperature: {
      label: 'Nutrient Water Temp',
      unit: '°C',
      stroke: '#38bdf8',
      threshold: thresholds.waterTempMax,
      thresholdLabel: `Chiller Trigger (> ${thresholds.waterTempMax}°C)`,
    },
    dissolvedOxygen: {
      label: 'Dissolved Oxygen (DO)',
      unit: 'mg/L',
      stroke: '#2dd4bf',
      threshold: thresholds.dissolvedOxygenMin,
      thresholdLabel: `Aerator Trigger (< ${thresholds.dissolvedOxygenMin} mg/L)`,
    },
    solarWatts: {
      label: 'Solar PV Output',
      unit: 'W',
      stroke: '#f59e0b',
      threshold: 1500,
      thresholdLabel: `Nominal PV (> 1500W)`,
    },
    batterySoc: {
      label: 'Battery SoC',
      unit: '%',
      stroke: '#10b981',
      threshold: thresholds.batterySocMin,
      thresholdLabel: `Eco Shedding (< ${thresholds.batterySocMin}%)`,
    },
    reservoirEc: {
      label: 'Nutrient Conductivity (EC)',
      unit: 'mS/cm',
      stroke: '#a78bfa',
      threshold: thresholds.reservoirEcMin,
      thresholdLabel: `Dosing Trigger (< ${thresholds.reservoirEcMin} mS/cm)`,
    },
    temperature: {
      label: 'Canopy Air Temp',
      unit: '°C',
      stroke: '#34d399',
      threshold: thresholds.temperatureMax,
      thresholdLabel: `Fan Purge Trigger (≥ ${thresholds.temperatureMax}°C)`,
    },
    co2Ppm: {
      label: 'CO2 Concentration',
      unit: 'ppm',
      stroke: '#f472b6',
      threshold: thresholds.co2Max,
      thresholdLabel: `Purge Trigger (≥ ${thresholds.co2Max} ppm)`,
    },
  };

  const currentMetric = chartMetricsConfig[selectedChartMetric];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
          Comprehensive Telemetry & Diagnostic Console
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Solar generation, energy storage, dual water storage tanks, filtration, and hydroponic chemistry
        </p>
      </div>

      {/* 24-Hour Historical Diagnostic Chart */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-color)]">
              Historical Diagnostics
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              {currentMetric.label} Historical Trend
            </h3>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex flex-wrap gap-1 p-1 bg-[var(--bg-surface-subtle)] rounded-lg border border-[var(--border-theme)]">
            {(
              [
                { id: 'waterTemperature', label: 'Water Temp' },
                { id: 'dissolvedOxygen', label: 'Oxygen (DO)' },
                { id: 'solarWatts', label: 'Solar Watts' },
                { id: 'batterySoc', label: 'Battery %' },
                { id: 'reservoirEc', label: 'EC / TDS' },
                { id: 'temperature', label: 'Air Temp' },
                { id: 'co2Ppm', label: 'CO2' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedChartMetric(m.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedChartMetric === m.id
                    ? 'bg-[var(--accent-color)] text-black font-semibold shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Chart Area */}
        <div className="relative h-48 w-full mt-2 overflow-hidden">
          <div className="absolute top-2 right-2 text-[10px] font-mono text-[var(--accent-color)] bg-[var(--accent-bg)] px-2 py-0.5 rounded border border-[var(--border-theme)]">
            {currentMetric.thresholdLabel}
          </div>

          <svg viewBox="0 0 600 180" className="w-full h-full overflow-hidden" preserveAspectRatio="none">
            <line x1="0" y1="30" x2="600" y2="30" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="90" x2="600" y2="90" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="150" x2="600" y2="150" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" strokeDasharray="3 3" />

            {/* Area Fill */}
            {chartData.length > 1 && (
              <path
                d={`${chartData
                  .map((d, i) => {
                    const x = (i / (chartData.length - 1)) * 600;
                    const y = 160 - ((d.value - minVal) / range) * 130;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ')} L 600 170 L 0 170 Z`}
                fill={`${currentMetric.stroke}18`}
              />
            )}

            {/* Line Path */}
            {chartData.length > 1 && (
              <path
                d={chartData
                  .map((d, i) => {
                    const x = (i / (chartData.length - 1)) * 600;
                    const y = 160 - ((d.value - minVal) / range) * 130;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke={currentMetric.stroke}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Points */}
            {chartData.map((d, i) => {
              const x = (i / (chartData.length - 1)) * 600;
              const y = 160 - ((d.value - minVal) / range) * 130;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="var(--bg-surface)"
                  stroke={currentMetric.stroke}
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)] mt-2">
            <span>{chartData[0]?.time || 'Past'}</span>
            <span>{chartData[Math.floor(chartData.length / 2)]?.time || 'Mid'}</span>
            <span>{chartData[chartData.length - 1]?.time || 'Now'}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[var(--border-theme)] text-center">
          <div>
            <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">Min Observed</div>
            <div className="text-sm font-mono font-bold text-[var(--text-primary)]">
              {minVal} {currentMetric.unit}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">Max Observed</div>
            <div className="text-sm font-mono font-bold text-[var(--text-primary)]">
              {maxVal} {currentMetric.unit}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-[var(--accent-color)]">Current Live</div>
            <div className="text-sm font-mono font-bold text-[var(--accent-color)]">
              {values[values.length - 1]} {currentMetric.unit}
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED DIAGNOSTIC MODULES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Module 1: Solar PV Generation & ESS Battery Telemetry */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Solar PV & Battery ESS Power</h3>
                <span className="text-[11px] text-[var(--text-secondary)]">48V LiFePO4 Energy Storage Bank</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>{readings.solar.inverterStatus.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <span className="text-xs text-[var(--text-secondary)]">Solar PV Generation</span>
              <span className="text-sm font-mono font-bold text-amber-300">
                {readings.solar.solarWatts} W ({readings.solar.solarVoltage}V · {readings.solar.solarCurrentAmps}A)
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <span className="text-xs text-[var(--text-secondary)]">Battery State of Charge</span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {readings.solar.batterySocPercent.toFixed(1)}% ({readings.solar.batteryVoltage}V)
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <span className="text-xs text-[var(--text-secondary)]">Greenhouse Load / Runtime</span>
              <span className="text-xs font-mono text-[var(--text-primary)]">
                {readings.solar.loadConsumptionWatts}W · {readings.solar.estimatedRuntimeHours} hrs left
              </span>
            </div>
          </div>
        </div>

        {/* Module 2: Dual Water Tanks & Filtration Diagnostics */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Dual Water Tanks & Filtration</h3>
                <span className="text-[11px] text-[var(--text-secondary)]">Supply storage, nutrient tank & RO filter</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-sky-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{readings.waterSystem.filterStatus}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <div>
                <span className="text-xs text-[var(--text-secondary)] block">Freshwater Supply Tank</span>
                <span className="text-[10px] text-[var(--text-muted)]">Purity: {readings.waterSystem.freshwaterTdsPpm} ppm TDS</span>
              </div>
              <span className="text-sm font-mono font-bold text-sky-400">
                {readings.waterSystem.freshwaterVolumeLiters} L ({readings.waterSystem.freshwaterLevelPercent.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <div>
                <span className="text-xs text-[var(--text-secondary)] block">Nutrient Mixing Reservoir</span>
                <span className="text-[10px] text-[var(--text-muted)]">Capacity: {readings.waterSystem.nutrientTankCapacityLiters} L</span>
              </div>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {readings.waterSystem.nutrientTankVolumeLiters} L ({readings.waterSystem.nutrientTankLevelPercent.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <span className="text-xs text-[var(--text-secondary)]">Filter Pressure Drop (ΔP)</span>
              <span className="text-xs font-mono text-[var(--text-primary)]">
                {readings.waterSystem.filterPressureDiffPsi.toFixed(1)} PSI (Limit: {thresholds.filterDeltaPsiMax} PSI)
              </span>
            </div>
          </div>
        </div>

        {/* Module 3: Solution Temp & Inline Chiller */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <ThermometerSnowflake className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Nutrient Solution Temperature</h3>
                <span className="text-[11px] text-[var(--text-secondary)]">Root zone thermal control & pythium prevention</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Inline Chiller</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <span className="text-xs text-[var(--text-secondary)]">Current Water Temp</span>
              <span className="text-sm font-mono font-bold text-[var(--text-primary)]">
                {formatTemp(readings.waterTemperature)}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <span className="text-xs text-[var(--text-secondary)]">Target Setpoint</span>
              <span className="text-xs font-mono text-emerald-400">18.0°C - 21.0°C</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <span className="text-xs text-[var(--text-secondary)]">Root Rot Hazard Line</span>
              <span className="text-xs font-mono text-red-400">
                Chills at &gt; {thresholds.waterTempMax}°C
              </span>
            </div>
          </div>
        </div>

        {/* Module 4: Dissolved Oxygen (DO) */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <Waves className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Dissolved Oxygen (DO)</h3>
                <span className="text-[11px] text-[var(--text-secondary)]">Aerobic root respiration & nutrient ion uptake</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-teal-400">
              <Zap className="w-3 h-3 text-teal-400" />
              <span>Micro-Aerator</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <span className="text-xs text-[var(--text-secondary)]">Measured DO</span>
              <span className="text-sm font-mono font-bold text-teal-300">
                {readings.dissolvedOxygen.toFixed(1)} mg/L
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <span className="text-xs text-[var(--text-secondary)]">Target Aeration Setpoint</span>
              <span className="text-xs font-mono text-emerald-400">7.0 - 9.0 mg/L</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <span className="text-xs text-[var(--text-secondary)]">Hypoxia Safety Line</span>
              <span className="text-xs font-mono text-amber-400">
                Boosts @ &lt; {thresholds.dissolvedOxygenMin} mg/L
              </span>
            </div>
          </div>
        </div>

        {/* Module 5: Hydroponic Mineral Chemistry & Bioavailability */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Solution pH & Mineral Nutrients</h3>
                <span className="text-[11px] text-[var(--text-secondary)]">Ion bioavailability & NPK macro-concentrations</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-purple-400">
              <Activity className="w-3.5 h-3.5" />
              <span>Auto-Doser Ready</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <div>
                <span className="text-xs text-[var(--text-secondary)] block">Solution pH & EC</span>
                <span className="text-[10px] text-[var(--text-muted)]">Target: 5.6 - 6.2 pH · 1.6 - 2.2 mS/cm</span>
              </div>
              <span className="text-sm font-mono font-bold text-purple-300">
                {readings.reservoirPh.toFixed(2)} pH · {readings.reservoirEc.toFixed(2)} mS/cm
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <span className="text-xs text-[var(--text-secondary)]">TDS & ORP Sanitization</span>
              <span className="text-xs font-mono text-teal-300">
                {readings.reservoirTds} ppm · {readings.waterOrpMv} mV ORP
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <div className="text-[10px] uppercase font-mono text-[var(--text-muted)] mb-1">
                Dissolved NPK Ratios (mg/L)
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="bg-[var(--bg-canvas)] py-1 rounded">
                  <span className="text-slate-400 block text-[10px]">N</span>
                  <span className="text-emerald-400 font-bold">{readings.nitrogen}</span>
                </div>
                <div className="bg-[var(--bg-canvas)] py-1 rounded">
                  <span className="text-slate-400 block text-[10px]">P</span>
                  <span className="text-sky-400 font-bold">{readings.phosphorus}</span>
                </div>
                <div className="bg-[var(--bg-canvas)] py-1 rounded">
                  <span className="text-slate-400 block text-[10px]">K</span>
                  <span className="text-amber-400 font-bold">{readings.potassium}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Module 6: Canopy Microclimate & Transpiration VPD */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Canopy Microclimate & Transpiration</h3>
                <span className="text-[11px] text-[var(--text-secondary)]">VPD, CO2 assimilation & photoperiod</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <Thermometer className="w-3.5 h-3.5" />
              <span>Exhaust & Foggers</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <div>
                <span className="text-xs text-[var(--text-secondary)] block">Ambient Air & Humidity</span>
                <span className="text-[10px] text-[var(--text-muted)]">Heat Index: {formatTemp(readings.heatIndex)}</span>
              </div>
              <span className="text-sm font-mono font-bold text-emerald-300">
                {formatTemp(readings.temperature)} · {readings.humidity.toFixed(1)}% RH
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <span className="text-xs text-[var(--text-secondary)]">Vapour Pressure Deficit (VPD)</span>
              <span className="text-sm font-mono font-bold text-teal-400">
                {readings.vpd.toFixed(2)} kPa (Ideal: 0.8 - 1.2 kPa)
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
              <div>
                <span className="text-xs text-[var(--text-secondary)] block">CO2 & Light Radiation</span>
                <span className="text-[10px] text-[var(--text-muted)]">Daily Integral: {readings.dli} mol/m²/day</span>
              </div>
              <span className="text-xs font-mono text-[var(--text-primary)]">
                {readings.co2Ppm} ppm · {readings.par} µmol/m²/s
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
