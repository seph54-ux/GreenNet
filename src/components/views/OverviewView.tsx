import React from 'react';
import { useGreenNet } from '../../context/GreenNetContext';
import { MetricCard } from '../MetricCard';
import {
  ThermometerSnowflake,
  Waves,
  FlaskConical,
  Activity,
  Droplets,
  Thermometer,
  Wind,
  Flame,
  SunMedium,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  Zap,
  Gauge,
  Layers,
  Sun,
  BatteryCharging,
  Filter,
  Sparkles,
} from 'lucide-react';

interface OverviewViewProps {
  onNavigateToTab: (tab: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigateToTab }) => {
  const {
    readings,
    thresholds,
    formatTemp,
    history,
    activeZone,
    fan,
    sprinklers,
    uvLighting,
    recirculationPump,
    waterChiller,
    oxygenAerator,
    autoDoser,
    transferPump,
    filterBackwash,
    solarEcoSaver,
    togglePumpPower,
    toggleChillerPower,
    toggleAeratorPower,
    toggleTransferPump,
    triggerFilterBackwash,
    nextScheduledTime,
    runScheduleNow,
    schedules,
    activeUrgentAlert,
  } = useGreenNet();

  // Extract history series
  const tempSeries = history.map((h) => h.temperature);
  const waterTempSeries = history.map((h) => h.waterTemperature);
  const doSeries = history.map((h) => h.dissolvedOxygen);
  const ecSeries = history.map((h) => h.reservoirEc);
  const solarSeries = history.map((h) => h.solarWatts);
  const batterySeries = history.map((h) => h.batterySoc);

  // Critical checks
  const isSolarLow = readings.solar.batterySocPercent < thresholds.batterySocMin;
  const isFilterClogged = readings.waterSystem.filterPressureDiffPsi > thresholds.filterDeltaPsiMax;
  const isFreshwaterLow = readings.waterSystem.freshwaterLevelPercent < thresholds.freshwaterTankMin;
  const isWaterTempCritical = readings.waterTemperature > thresholds.waterTempMax;
  const isDoCritical = readings.dissolvedOxygen < thresholds.dissolvedOxygenMin;
  const isPhCritical = readings.reservoirPh < thresholds.reservoirPhMin || readings.reservoirPh > thresholds.reservoirPhMax;

  const hasAnyCritical =
    isSolarLow ||
    isFilterClogged ||
    isFreshwaterLow ||
    isWaterTempCritical ||
    isDoCritical ||
    isPhCritical;

  return (
    <div className="space-y-6">
      {/* Zone Overview Banner */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-color)]">
            <Layers className="w-3.5 h-3.5" />
            <span>{activeZone.systemType}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            {activeZone.name} · {activeZone.cropType}
          </h2>
          <div className="text-xs text-[var(--text-secondary)] flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Stage: {activeZone.stage}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[var(--accent-color)] font-semibold">{activeZone.towerCount} Columns ({activeZone.plantSites} Sites)</span>
            <span aria-hidden="true">·</span>
            <span>Power: Solar Off-Grid ({readings.solar.solarWatts}W Generation)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-3.5 py-2 rounded-lg border flex items-center gap-2 text-xs font-semibold ${
              hasAnyCritical || activeUrgentAlert
                ? 'bg-red-950/60 border-red-700/60 text-red-300'
                : 'bg-[var(--accent-bg)] border-[var(--border-theme-strong)] text-[var(--accent-color)]'
            }`}
          >
            {hasAnyCritical || activeUrgentAlert ? (
              <>
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Intervention Required</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
                <span>Solar, Water & Hydro Nominal</span>
              </>
            )}
          </div>

          <button
            onClick={() => onNavigateToTab('controls')}
            className="hidden sm:flex items-center gap-1 text-xs font-medium text-[var(--accent-color)] hover:text-[var(--text-primary)] px-3 py-2 rounded-lg bg-[var(--bg-surface-subtle)] hover:bg-[var(--accent-bg)] border border-[var(--border-theme)] transition-colors whitespace-nowrap min-h-[38px]"
          >
            <span>Command Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SOLAR POWER & ENERGY STORAGE SUBSYSTEM BAR */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              Solar PV Generation & 48V Battery ESS Telemetry
            </h3>
          </div>
          <div className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
            <span>Inverter: {readings.solar.inverterStatus.replace('_', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>Est. Battery Runtime: {readings.solar.estimatedRuntimeHours} hrs</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {/* PV Generation */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="text-[10px] uppercase font-mono text-[var(--text-muted)] flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" />
              <span>Solar PV Output</span>
            </div>
            <div className="text-lg sm:text-xl font-mono font-bold text-amber-300 mt-0.5">
              {readings.solar.solarWatts} W
            </div>
            <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-0.5">
              {readings.solar.solarVoltage}V · {readings.solar.solarCurrentAmps}A
            </div>
          </div>

          {/* Daily Yield */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">
              Daily Energy Yield
            </div>
            <div className="text-lg sm:text-xl font-mono font-bold text-[var(--text-primary)] mt-0.5">
              {readings.solar.solarDailyKwh} kWh
            </div>
            <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
              100% Clean Solar Energy
            </div>
          </div>

          {/* Battery State of Charge */}
          <div className={`p-3 rounded-xl border ${
            readings.solar.batterySocPercent < thresholds.batterySocMin
              ? 'bg-amber-950/40 border-amber-600/60'
              : 'bg-[var(--bg-surface-subtle)] border-[var(--border-theme)]'
          }`}>
            <div className="text-[10px] uppercase font-mono text-[var(--text-muted)] flex items-center gap-1">
              <BatteryCharging className="w-3 h-3 text-emerald-400" />
              <span>Battery SoC</span>
            </div>
            <div className="text-lg sm:text-xl font-mono font-bold text-emerald-400 mt-0.5">
              {readings.solar.batterySocPercent.toFixed(1)}%
            </div>
            <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-0.5">
              {readings.solar.batteryVoltage}V · {readings.solar.batteryCurrentAmps > 0 ? `+${readings.solar.batteryCurrentAmps}A (Chg)` : `${readings.solar.batteryCurrentAmps}A`}
            </div>
          </div>

          {/* Greenhouse Load */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="text-[10px] uppercase font-mono text-[var(--text-muted)] flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Greenhouse Load</span>
            </div>
            <div className="text-lg sm:text-xl font-mono font-bold text-cyan-300 mt-0.5">
              {readings.solar.loadConsumptionWatts} W
            </div>
            <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-0.5">
              Pumps, Chiller & Fans Active
            </div>
          </div>

          {/* Battery Health & Temp */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)] col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">
              ESS Bank Health & Temp
            </div>
            <div className="text-lg sm:text-xl font-mono font-bold text-[var(--text-primary)] mt-0.5">
              {readings.solar.batteryHealthSoH}% SoH
            </div>
            <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-0.5">
              Cell Temp: {readings.solar.batteryTempC}°C (Nominal)
            </div>
          </div>
        </div>
      </section>

      {/* DUAL WATER TANKS & FILTRATION SYSTEM SECTION */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-sky-400">
              Dual Water Storage Tanks & Filtration Subsystem
            </h3>
          </div>
          <div className="text-xs font-mono text-[var(--text-muted)]">
            Filtered Turbidity: <span className="text-emerald-400 font-bold">{readings.waterSystem.filteredTurbidityNtu} NTU</span> (from {readings.waterSystem.rawTurbidityNtu} NTU raw)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Freshwater Storage Tank */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Supply Water Tank</span>
              <span className="text-xs font-mono font-bold text-sky-400">{readings.waterSystem.freshwaterLevelPercent.toFixed(1)}%</span>
            </div>
            <div className="text-lg font-mono font-bold text-[var(--text-primary)]">
              {readings.waterSystem.freshwaterVolumeLiters} <span className="text-xs text-[var(--text-muted)]">/ {readings.waterSystem.freshwaterCapacityLiters} L</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${readings.waterSystem.freshwaterLevelPercent}%` }} />
            </div>
            <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-2">
              Raw Source Purity: {readings.waterSystem.freshwaterTdsPpm} ppm TDS
            </div>
          </div>

          {/* 2. Nutrient Mixing Solution Tank */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Nutrient Reservoir</span>
              <span className="text-xs font-mono font-bold text-emerald-400">{readings.waterSystem.nutrientTankLevelPercent.toFixed(1)}%</span>
            </div>
            <div className="text-lg font-mono font-bold text-[var(--text-primary)]">
              {readings.waterSystem.nutrientTankVolumeLiters} <span className="text-xs text-[var(--text-muted)]">/ {readings.waterSystem.nutrientTankCapacityLiters} L</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${readings.waterSystem.nutrientTankLevelPercent}%` }} />
            </div>
            <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-2">
              EC: {readings.reservoirEc.toFixed(2)} mS/cm · pH: {readings.reservoirPh.toFixed(2)}
            </div>
          </div>

          {/* 3. Filter Pressure Differential (Delta PSI) */}
          <div className={`p-3.5 rounded-xl border ${
            readings.waterSystem.filterPressureDiffPsi > thresholds.filterDeltaPsiMax
              ? 'bg-rose-950/40 border-rose-600'
              : 'bg-[var(--bg-surface-subtle)] border-[var(--border-theme)]'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Filter Differential (ΔP)</span>
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-mono font-bold text-[var(--text-primary)]">
              {readings.waterSystem.filterPressureDiffPsi.toFixed(1)} <span className="text-xs text-[var(--text-muted)]">PSI (Limit: {thresholds.filterDeltaPsiMax} PSI)</span>
            </div>
            <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-2 flex items-center justify-between">
              <span>Clog Index: {readings.waterSystem.filterClogPercent}%</span>
              <span className="text-cyan-400">{readings.waterSystem.filterFlowRateLph} L/h</span>
            </div>
          </div>

          {/* 4. RO Membrane & Clarification Metrics */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">
              RO Membrane & Purity
            </div>
            <div className="text-lg font-mono font-bold text-teal-300">
              {readings.waterSystem.membraneRejectionPercent}% Rejection
            </div>
            <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-2 flex items-center justify-between">
              <span>Status: {readings.waterSystem.filterStatus}</span>
              <span className="text-[var(--text-muted)]">{readings.waterSystem.lastBackwashTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRIMARY VERTICAL HYDROPONIC SOLUTION METRICS */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                Nutrient Solution & Reservoir Vital Telemetry
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Real-time recirculating water chemistry, oxygenation, and temperature control
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('sensors')}
            className="text-xs text-[var(--accent-color)] hover:underline font-medium flex items-center gap-1 transition-colors"
          >
            <span>Full Telemetry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Solution Water Temp */}
          <MetricCard
            title="Solution Temperature"
            kicker="Reservoir Chiller"
            value={formatTemp(readings.waterTemperature)}
            subValue={waterChiller.isOn ? '❄️ Active Inline Chiller' : 'Target: 18.0° - 21.0°C'}
            status={isWaterTempCritical ? 'critical' : 'nominal'}
            statusText={isWaterTempCritical ? 'Critical Root Rot Hazard' : 'Pythium-Free Safe Zone'}
            optimalRange={`< ${thresholds.waterTempMax}°C`}
            icon={ThermometerSnowflake}
            sparklineData={waterTempSeries}
            onClick={() => onNavigateToTab('sensors')}
          />

          {/* Dissolved Oxygen */}
          <MetricCard
            title="Dissolved Oxygen (DO)"
            kicker="Root Aeration"
            value={`${readings.dissolvedOxygen.toFixed(1)}`}
            unit="mg/L"
            subValue={oxygenAerator.isOn ? `Aerator @ ${oxygenAerator.bubbleRatePercent}%` : 'Standard Aeration'}
            status={isDoCritical ? 'critical' : 'nominal'}
            statusText={isDoCritical ? 'Root Hypoxia Risk' : 'Super-Oxygenated Roots'}
            optimalRange={`> ${thresholds.dissolvedOxygenMin} mg/L`}
            icon={Waves}
            sparklineData={doSeries}
            onClick={() => onNavigateToTab('sensors')}
          />

          {/* Solution pH */}
          <MetricCard
            title="Nutrient Solution pH"
            kicker="Bioavailability"
            value={`${readings.reservoirPh.toFixed(2)}`}
            unit="pH"
            subValue={autoDoser.isDosing ? '⚡ Auto-Dosing Active' : 'Target: 5.6 - 6.2 pH'}
            status={isPhCritical ? 'warning' : 'nominal'}
            statusText={readings.reservoirPh > thresholds.reservoirPhMax ? 'Alkaline Drift' : 'Optimal Uptake'}
            optimalRange="5.6 - 6.2 pH"
            icon={FlaskConical}
            sparklineData={ecSeries}
            onClick={() => onNavigateToTab('sensors')}
          />

          {/* EC / TDS */}
          <MetricCard
            title="Conductivity (EC / TDS)"
            kicker="Nutrient Strength"
            value={`${readings.reservoirEc.toFixed(2)}`}
            unit="mS/cm"
            subValue={`${readings.reservoirTds} ppm TDS · 395 mV ORP`}
            status="nominal"
            statusText="Optimal Nutrient Strength"
            optimalRange="1.6 - 2.2 mS/cm"
            icon={Activity}
            sparklineData={ecSeries}
            onClick={() => onNavigateToTab('sensors')}
          />
        </div>
      </section>

      {/* ACTUATOR COMMAND COCKPIT */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Active Actuator Controls
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Auto-threshold active response with instant manual override capability
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('controls')}
            className="text-xs text-[var(--accent-color)] hover:underline font-medium flex items-center gap-1 transition-colors"
          >
            <span>All Controls</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Recirculation Lift Pump */}
          <div className="p-4 rounded-xl border border-[var(--border-theme)] bg-[var(--bg-surface)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">Tower Pump</h4>
              </div>
              <button
                onClick={() => togglePumpPower()}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  recirculationPump.isOn ? 'bg-emerald-600 text-white' : 'bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                {recirculationPump.isOn ? 'Active' : 'Off'}
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{recirculationPump.flowRateLpm} L/min · {recirculationPump.cycleMode}</p>
          </div>

          {/* Water Chiller */}
          <div className="p-4 rounded-xl border border-[var(--border-theme)] bg-[var(--bg-surface)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ThermometerSnowflake className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">Water Chiller</h4>
              </div>
              <button
                onClick={() => toggleChillerPower()}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  waterChiller.isOn ? 'bg-cyan-600 text-white' : 'bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                {waterChiller.isOn ? 'Chilling' : 'Off'}
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{waterChiller.activeReason}</p>
          </div>

          {/* Filter Backwash Valve */}
          <div className="p-4 rounded-xl border border-[var(--border-theme)] bg-[var(--bg-surface)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-rose-400" />
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">Filter Backwash</h4>
              </div>
              <button
                onClick={() => triggerFilterBackwash()}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  filterBackwash.isFlushing ? 'bg-rose-600 text-white' : 'bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                {filterBackwash.isFlushing ? 'Flushing' : 'Flush'}
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{filterBackwash.activeReason}</p>
          </div>

          {/* Water Transfer Pump */}
          <div className="p-4 rounded-xl border border-[var(--border-theme)] bg-[var(--bg-surface)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-400" />
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">Transfer Pump</h4>
              </div>
              <button
                onClick={() => toggleTransferPump()}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  transferPump.isOn ? 'bg-sky-600 text-white' : 'bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                {transferPump.isOn ? 'Transferring' : 'Off'}
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{transferPump.activeReason}</p>
          </div>
        </div>
      </section>

      {/* RECIRCULATION SCHEDULE HIGHLIGHT */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-mono tracking-wider text-cyan-400">
              Tower Gravity Recirculation Program
            </div>
            <h4 className="text-base font-semibold text-[var(--text-primary)]">
              {nextScheduledTime ? nextScheduledTime.name : 'Continuous Recirculation Active'}
            </h4>
            <div className="text-xs text-[var(--text-secondary)] flex items-center gap-2 mt-0.5">
              <span>Next cycle: {nextScheduledTime ? nextScheduledTime.time : 'Continuous'}</span>
              <span aria-hidden="true">·</span>
              <span>Pump Dry-Run Safeguard: Tank &gt; 25%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center">
          {schedules.length > 0 && (
            <button
              onClick={() => runScheduleNow(schedules[0].id)}
              className="px-3.5 py-2 rounded-lg bg-[var(--accent-color)] text-black font-semibold text-xs flex items-center gap-1.5 transition-opacity hover:opacity-90 min-h-[38px]"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Trigger Gravity Flush</span>
            </button>
          )}
          <button
            onClick={() => onNavigateToTab('irrigation')}
            className="px-3 py-2 rounded-lg bg-[var(--bg-surface-subtle)] hover:bg-[var(--accent-bg)] text-[var(--text-primary)] text-xs font-medium border border-[var(--border-theme)] transition-colors min-h-[38px]"
          >
            Hydro Schedules
          </button>
        </div>
      </section>
    </div>
  );
};
