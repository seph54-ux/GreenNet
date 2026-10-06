import React from 'react';
import { useGreenNet } from '../../context/GreenNetContext';
import { ActuatorCard } from '../ActuatorCard';
import {
  ThermometerSnowflake,
  Waves,
  FlaskConical,
  Gauge,
  Fan,
  Droplets,
  SunMedium,
  OctagonX,
  Zap,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Sun,
  BatteryCharging,
  Filter,
  ArrowDownUp,
  RotateCcw,
} from 'lucide-react';

export const ControlsView: React.FC = () => {
  const {
    recirculationPump,
    waterChiller,
    oxygenAerator,
    autoDoser,
    fan,
    sprinklers,
    uvLighting,
    transferPump,
    filterBackwash,
    solarEcoSaver,
    toggleTransferPump,
    triggerFilterBackwash,
    toggleSolarEcoSaver,
    setPumpMode,
    togglePumpPower,
    setPumpCycleMode,
    setChillerMode,
    toggleChillerPower,
    setChillerTargetTemp,
    setAeratorMode,
    toggleAeratorPower,
    setAeratorBubbleRate,
    triggerManualDose,
    setFanMode,
    toggleFanPower,
    setFanSpeed,
    setFanTimer,
    setSprinklersMode,
    toggleSprinklersPower,
    setSprinklersTimer,
    setUvMode,
    toggleUvPower,
    setUvIntensity,
    setUvSpectrum,
    setUvTimer,
    emergencyAllStop,
    thresholds,
  } = useGreenNet();

  return (
    <div className="space-y-6">
      {/* Header + Emergency All-Stop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-color)]">
            <Sliders className="w-3.5 h-3.5" />
            <span>Vertical Hydroponic, Solar & Filtration Command Center</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
            Actuator Command & Overrides
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Individual hardware controls with automatic critical threshold trigger rules and manual operator bypass
          </p>
        </div>

        {/* Master Emergency Kill Switch */}
        <button
          onClick={emergencyAllStop}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700/80 text-red-200 text-xs font-semibold shadow-md transition-all active:scale-[0.98] min-h-[44px] shrink-0 cursor-pointer"
        >
          <OctagonX className="w-4 h-4 text-red-400" />
          <span>Emergency Master All-Stop</span>
        </button>
      </div>

      {/* Section 1: Hydroponic & Climate Actuators Grid */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-color)]" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
            Vertical Hydroponic Solution & Canopy Actuators
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Recirculation Tower Lift Pump */}
          <ActuatorCard
            title="Tower Recirculation Pump"
            subtitle="Vertical Manifold Delivery"
            icon={Gauge}
            isOn={recirculationPump.isOn}
            mode={recirculationPump.mode}
            onModeChange={setPumpMode}
            onTogglePower={() => togglePumpPower()}
            activeReason={recirculationPump.activeReason}
            thresholdNote={`Pump Cavitation Safeguard: Automatically trips if sump level < ${thresholds.waterLevelMin}%`}
          >
            {/* Cycle Mode Switcher */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Recirculation Cycle:</span>
                <span className="text-[var(--accent-color)] font-semibold">
                  {recirculationPump.cycleMode === 'CONTINUOUS'
                    ? '24/7 Flow'
                    : recirculationPump.cycleMode === 'INTERMITTENT_15M'
                    ? '15m ON / 15m OFF'
                    : 'Eco Pulse (5m/10m)'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 bg-[var(--bg-canvas)] p-1 rounded-lg border border-[var(--border-theme)]">
                {(
                  [
                    { id: 'CONTINUOUS', label: 'Continuous' },
                    { id: 'INTERMITTENT_15M', label: '15m/15m' },
                    { id: 'ECO_PULSE', label: 'Eco Pulse' },
                  ] as const
                ).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setPumpCycleMode(c.id)}
                    className={`py-1 text-[11px] font-mono rounded transition-colors ${
                      recirculationPump.cycleMode === c.id
                        ? 'bg-[var(--accent-color)] text-black font-semibold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </ActuatorCard>

          {/* 2. Inline Hydroponic Water Chiller */}
          <ActuatorCard
            title="Inline Water Chiller"
            subtitle="Root Zone Pythium Inhibitor"
            icon={ThermometerSnowflake}
            isOn={waterChiller.isOn}
            mode={waterChiller.mode}
            onModeChange={setChillerMode}
            onTogglePower={() => toggleChillerPower()}
            activeReason={waterChiller.activeReason}
            thresholdNote={`Auto-activates when Water Temp > ${thresholds.waterTempMax}°C to prevent root rot`}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Target Setpoint:</span>
                <span className="text-cyan-400 font-bold">{waterChiller.targetTempC.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="16"
                  max="22"
                  step="0.5"
                  value={waterChiller.targetTempC}
                  onChange={(e) => setChillerTargetTemp(Number(e.target.value))}
                  aria-label="Target Solution Temperature"
                  className="w-full h-2 bg-[var(--bg-canvas)] rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>
          </ActuatorCard>

          {/* 3. Dissolved Oxygen Micro-Bubbler Aerator */}
          <ActuatorCard
            title="Micro-Bubbler Aerator"
            subtitle="Root Zone DO Oxygenator"
            icon={Waves}
            isOn={oxygenAerator.isOn}
            mode={oxygenAerator.mode}
            onModeChange={setAeratorMode}
            onTogglePower={() => toggleAeratorPower()}
            activeReason={oxygenAerator.activeReason}
            thresholdNote={`Auto-boosts to 100% capacity when Dissolved Oxygen < ${thresholds.dissolvedOxygenMin} mg/L`}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Aeration Output:</span>
                <span className="text-teal-400 font-bold">{oxygenAerator.bubbleRatePercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={oxygenAerator.bubbleRatePercent}
                onChange={(e) => setAeratorBubbleRate(Number(e.target.value))}
                aria-label="Micro-bubbler Aeration Rate"
                className="w-full h-2 bg-[var(--bg-canvas)] rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            </div>
          </ActuatorCard>

          {/* 4. Peristaltic Auto-Doser */}
          <ActuatorCard
            title="Peristaltic Dosing Pumps"
            subtitle="pH Balance & NPK Injections"
            icon={FlaskConical}
            isOn={autoDoser.isDosing}
            mode={autoDoser.mode}
            onModeChange={() => {}}
            onTogglePower={() => triggerManualDose('pH Down (Phosphoric Acid)')}
            activeReason={autoDoser.activeReason}
            thresholdNote={`Auto-doses pH Down if pH > ${thresholds.reservoirPhMax}; Doses A+B if EC < ${thresholds.reservoirEcMin}`}
          >
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-[var(--text-muted)]">Manual Micro-Dose Injections (25ml):</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => triggerManualDose('pH Down (Phosphoric Acid)')}
                  className="py-1.5 px-2 rounded bg-[var(--bg-canvas)] hover:bg-purple-950/40 border border-[var(--border-theme)] text-[11px] text-purple-300 font-mono transition-colors text-left"
                >
                  - pH Down (Acid)
                </button>
                <button
                  onClick={() => triggerManualDose('pH Up (Potassium Carbonate)')}
                  className="py-1.5 px-2 rounded bg-[var(--bg-canvas)] hover:bg-blue-950/40 border border-[var(--border-theme)] text-[11px] text-blue-300 font-mono transition-colors text-left"
                >
                  + pH Up (Base)
                </button>
                <button
                  onClick={() => triggerManualDose('Nutrient Part A')}
                  className="py-1.5 px-2 rounded bg-[var(--bg-canvas)] hover:bg-emerald-950/40 border border-[var(--border-theme)] text-[11px] text-emerald-300 font-mono transition-colors text-left"
                >
                  Nutrient Part A
                </button>
                <button
                  onClick={() => triggerManualDose('Nutrient Part B')}
                  className="py-1.5 px-2 rounded bg-[var(--bg-canvas)] hover:bg-teal-950/40 border border-[var(--border-theme)] text-[11px] text-teal-300 font-mono transition-colors text-left"
                >
                  Nutrient Part B
                </button>
              </div>
            </div>
          </ActuatorCard>

          {/* 5. Canopy Exhaust Fan */}
          <ActuatorCard
            title="Canopy Exhaust Fan"
            subtitle="Thermal & CO2 Airflow Purge"
            icon={Fan}
            isOn={fan.isOn}
            mode={fan.mode}
            onModeChange={setFanMode}
            onTogglePower={() => toggleFanPower()}
            activeReason={fan.activeReason}
            thresholdNote={`Auto-triggers when Ambient Temp ≥ ${thresholds.temperatureMax}°C or CO2 ≥ ${thresholds.co2Max} ppm`}
            remainingMinutes={fan.remainingMinutes}
            onQuickTimer={(mins) => setFanTimer(mins)}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Airflow Speed:</span>
                <span className="text-emerald-300 font-bold">{fan.speed}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={fan.speed}
                onChange={(e) => setFanSpeed(Number(e.target.value))}
                aria-label="Ventilation Fan Speed"
                className="w-full h-2 bg-[var(--bg-canvas)] rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </ActuatorCard>

          {/* 6. Canopy Misting Foggers */}
          <ActuatorCard
            title="Canopy Misting Foggers"
            subtitle="Micro-Droplet Stomatal Cooling"
            icon={Droplets}
            isOn={sprinklers.isOn}
            mode={sprinklers.mode}
            onModeChange={setSprinklersMode}
            onTogglePower={() => toggleSprinklersPower()}
            activeReason={sprinklers.activeReason}
            thresholdNote={`Auto-triggers when Air Humidity ≤ ${thresholds.humidityMin}%`}
            remainingMinutes={sprinklers.remainingMinutes}
            onQuickTimer={(mins) => setSprinklersTimer(mins)}
          >
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-[var(--bg-canvas)] rounded-lg border border-[var(--border-theme)]">
              <div>
                <div className="text-[10px] font-mono text-[var(--text-muted)]">Fog Delivery</div>
                <div className="text-sm font-mono font-bold text-sky-400">{sprinklers.flowRateLpm} L/min</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-[var(--text-muted)]">Line Pressure</div>
                <div className="text-sm font-mono font-bold text-sky-400">{sprinklers.pressurePsi} psi</div>
              </div>
            </div>
          </ActuatorCard>

          {/* 7. Vertical UV / LED Array */}
          <ActuatorCard
            title="Vertical LED/UV Grow Array"
            subtitle="Tower Photoperiod Lighting"
            icon={SunMedium}
            isOn={uvLighting.isOn}
            mode={uvLighting.mode}
            onModeChange={setUvMode}
            onTogglePower={() => toggleUvPower()}
            activeReason={uvLighting.activeReason}
            thresholdNote={`Auto-triggers when Ambient PAR < ${thresholds.parMin} µmol/m²/s`}
            remainingMinutes={uvLighting.remainingMinutes}
            onQuickTimer={(mins) => setUvTimer(mins)}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Light Intensity:</span>
                <span className="text-indigo-300 font-bold">{uvLighting.intensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={uvLighting.intensity}
                onChange={(e) => setUvIntensity(Number(e.target.value))}
                aria-label="UV Light Intensity"
                className="w-full h-2 bg-[var(--bg-canvas)] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </ActuatorCard>
        </div>
      </div>

      {/* Section 2: Solar Power & Water Filtration Subsystem Actuators */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
            Solar ESS & Water Filtration Actuators
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 8. Water Transfer Refill Pump */}
          <ActuatorCard
            title="Freshwater Transfer Pump"
            subtitle="Supply Tank to Nutrient Reservoir Refill"
            icon={ArrowDownUp}
            isOn={transferPump.isOn}
            mode={transferPump.mode}
            onModeChange={() => {}}
            onTogglePower={() => toggleTransferPump()}
            activeReason={transferPump.activeReason}
            thresholdNote="Manually or autonomously transfers filtered water from supply tank into nutrient mixing reservoir"
          >
            <div className="space-y-2 p-2.5 bg-[var(--bg-canvas)] rounded-lg border border-[var(--border-theme)]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Transfer Flow Rate:</span>
                <span className="text-sky-400 font-bold">{transferPump.flowRateLpm} L/min</span>
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                Replenishes nutrient reservoir without interrupting tower drip flow
              </div>
            </div>
          </ActuatorCard>

          {/* 9. Automated Filter Backwash Flush Valve */}
          <ActuatorCard
            title="Filter Backwash Flush Valve"
            subtitle="High Differential (ΔP) Auto-Purge"
            icon={Filter}
            isOn={filterBackwash.isFlushing}
            mode={filterBackwash.mode}
            onModeChange={() => {}}
            onTogglePower={() => triggerFilterBackwash()}
            activeReason={filterBackwash.activeReason}
            thresholdNote={`Auto-purges filter media when Differential Pressure exceeds ${thresholds.filterDeltaPsiMax} PSI`}
          >
            <div className="space-y-2 p-2.5 bg-[var(--bg-canvas)] rounded-lg border border-[var(--border-theme)]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Last Flush:</span>
                <span className="text-cyan-400 font-medium">{filterBackwash.lastFlushTime}</span>
              </div>
              <button
                onClick={triggerFilterBackwash}
                disabled={filterBackwash.isFlushing}
                className="w-full py-1.5 px-2 rounded bg-[var(--accent-bg)] hover:bg-[var(--accent-color)] hover:text-black border border-[var(--border-theme)] text-xs font-mono font-medium text-[var(--accent-color)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${filterBackwash.isFlushing ? 'animate-spin' : ''}`} />
                <span>{filterBackwash.isFlushing ? 'Purging Filter Cake...' : 'Initiate 45s Backwash Cycle'}</span>
              </button>
            </div>
          </ActuatorCard>

          {/* 10. Solar Eco-Saver / Load Shedder */}
          <ActuatorCard
            title="Solar ESS Eco-Saver"
            subtitle="Intelligent Off-Grid Load Shedding"
            icon={BatteryCharging}
            isOn={solarEcoSaver.isEnabled}
            mode="AUTO"
            onModeChange={() => {}}
            onTogglePower={() => toggleSolarEcoSaver()}
            activeReason={solarEcoSaver.activeReason}
            thresholdNote={`Automatically dims grow lighting and non-critical loads when Battery SoC falls below ${thresholds.batterySocMin}%`}
          >
            <div className="space-y-2 p-2.5 bg-[var(--bg-canvas)] rounded-lg border border-[var(--border-theme)]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Shedding Status:</span>
                <span className={solarEcoSaver.isEnabled ? 'text-emerald-400 font-bold' : 'text-slate-400 font-medium'}>
                  {solarEcoSaver.isEnabled ? 'ACTIVE (Safeguarding ESS)' : 'DISABLED'}
                </span>
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                Guarantees recirculation pump & chiller stay powered during overnight or overcast periods
              </div>
            </div>
          </ActuatorCard>
        </div>
      </div>

      {/* Threshold Automation Rules Matrix */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl p-4 sm:p-5 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-[var(--accent-color)]" />
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            Autonomous Safety & Control Trigger Matrix
          </h3>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mb-4">
          In <strong>AUTO</strong> mode, hardware actuators autonomously fire within milliseconds of any sensor breach:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="text-xs font-mono font-bold text-cyan-400 mb-1">
              RULE 01 · ROOT ROT PREVENTION
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              If <strong>Water Temp &gt; {thresholds.waterTempMax}°C</strong>:
            </p>
            <div className="mt-2 text-xs font-mono text-cyan-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Inline Water Chiller turns on to preserve root health.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="text-xs font-mono font-bold text-teal-400 mb-1">
              RULE 02 · ROOT OXYGENATION
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              If <strong>Dissolved Oxygen &lt; {thresholds.dissolvedOxygenMin} mg/L</strong>:
            </p>
            <div className="mt-2 text-xs font-mono text-teal-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-teal-400" />
              <span>Micro-bubble aerator boosts to 100% capacity.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="text-xs font-mono font-bold text-amber-400 mb-1">
              RULE 03 · PUMP DRY-RUN PROTECTION
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              If <strong>Sump Water Level &lt; {thresholds.waterLevelMin}%</strong>:
            </p>
            <div className="mt-2 text-xs font-mono text-amber-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Pump is protected against cavitation & urgent refill alarm fires.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="text-xs font-mono font-bold text-rose-400 mb-1">
              RULE 04 · FILTER BACKWASH PURGE
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              If <strong>Filter ΔP &gt; {thresholds.filterDeltaPsiMax} PSI</strong>:
            </p>
            <div className="mt-2 text-xs font-mono text-rose-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>Automated backwash flush valve initiates filter cake clean.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="text-xs font-mono font-bold text-amber-400 mb-1">
              RULE 05 · SOLAR ESS LOAD SHEDDING
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              If <strong>Battery SoC &lt; {thresholds.batterySocMin}%</strong>:
            </p>
            <div className="mt-2 text-xs font-mono text-amber-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Non-vital lighting sheds to reserve power for circulation & chilling.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)]">
            <div className="text-xs font-mono font-bold text-sky-400 mb-1">
              RULE 06 · FRESHWATER REFILL SAFETY
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              If <strong>Supply Tank Level &lt; {thresholds.freshwaterTankMin}%</strong>:
            </p>
            <div className="mt-2 text-xs font-mono text-sky-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              <span>Urgent replenishment alert dispatches to notify operator.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
