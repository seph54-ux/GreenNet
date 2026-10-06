import React, { useState } from 'react';
import { useGreenNet } from '../../context/GreenNetContext';
import {
  Droplets,
  Plus,
  Play,
  Trash2,
  Clock,
  ShieldCheck,
  Calendar,
  X,
  Gauge,
  Layers,
  Sparkles,
} from 'lucide-react';

export const IrrigationView: React.FC = () => {
  const {
    schedules,
    toggleSchedule,
    addSchedule,
    deleteSchedule,
    runScheduleNow,
    recirculationPump,
    togglePumpPower,
    sprinklers,
    toggleSprinklersPower,
    zones,
    readings,
  } = useGreenNet();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Schedule form state
  const [newName, setNewName] = useState('');
  const [newTime, setNewTime] = useState('06:00');
  const [newDuration, setNewDuration] = useState(15);
  const [newCycleType, setNewCycleType] = useState<
    'TOWER_RECIRCULATION' | 'CANOPY_FOG_MIST' | 'RESERVOIR_REFRESH'
  >('TOWER_RECIRCULATION');
  const [newCutoff, setNewCutoff] = useState(85);
  const [newZoneId, setNewZoneId] = useState(zones[0]?.id || 'zone-1');
  const [selectedDays, setSelectedDays] = useState<
    ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[]
  >(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

  const allDays: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[] = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ];

  const handleToggleDay = (day: (typeof allDays)[number]) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addSchedule({
      name: newName.trim(),
      time: newTime,
      durationMinutes: newDuration,
      cycleType: newCycleType,
      moistureCutoff: newCutoff,
      zoneId: newZoneId,
      days: selectedDays.length > 0 ? selectedDays : allDays,
      enabled: true,
      lastRun: 'Never',
    });

    setNewName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Vertical Tower Hydraulics & Sump Telemetry */}
      <div className="bg-[#0e1811] border border-emerald-900/40 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Layers className="w-4 h-4" />
              <span>Vertical Tower Hydraulics & Recirculation</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Hydroponic Feeding & Gravity Pulse Schedules
            </h2>
            <p className="text-xs text-slate-400">
              Automated nutrient solution lift cycles, manifold pulses, and canopy fogging programs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => togglePumpPower()}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all min-h-[44px] ${
                recirculationPump.isOn
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Gauge className="w-4 h-4" />
              <span>{recirculationPump.isOn ? 'Tower Pump (Active)' : 'Start Tower Lift'}</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hydro Schedule</span>
            </button>
          </div>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="text-[10px] uppercase font-mono text-slate-400">Sump Tank Fluid Level</div>
            <div className="text-base font-mono font-bold text-emerald-400 mt-0.5">
              {readings.waterLevelPercent.toFixed(1)}% Full
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="text-[10px] uppercase font-mono text-slate-400">Manifold Delivery Flow</div>
            <div className="text-base font-mono font-bold text-cyan-300 mt-0.5">
              {recirculationPump.flowRateLpm.toFixed(1)} L/min
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="text-[10px] uppercase font-mono text-slate-400">Nutrient Solution EC</div>
            <div className="text-base font-mono font-bold text-purple-400 mt-0.5">
              {readings.reservoirEc.toFixed(2)} mS/cm
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="text-[10px] uppercase font-mono text-slate-400">Recirculation Efficiency</div>
            <div className="text-base font-mono font-bold text-emerald-300 mt-0.5">
              98.2% (Closed Loop)
            </div>
          </div>
        </div>
      </div>

      {/* Schedules List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Vertical Recirculation & Fogging Programs ({schedules.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {schedules.filter((s) => s.enabled).length} Enabled
          </span>
        </div>

        {schedules.map((schedule) => {
          const zoneObj = zones.find((z) => z.id === schedule.zoneId);

          return (
            <div
              key={schedule.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                schedule.enabled
                  ? 'bg-[#0f1912] border-slate-800 hover:border-emerald-800/60'
                  : 'bg-[#0c130e] border-slate-900 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      schedule.enabled
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-semibold text-white tracking-tight">
                        {schedule.name}
                      </h4>
                      <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                        {schedule.time}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                      <span>Target: {zoneObj?.name || 'All Tower Wings'}</span>
                      <span aria-hidden="true">·</span>
                      <span>Duration: {schedule.durationMinutes} minutes</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-cyan-400">
                        Type: {schedule.cycleType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mt-2.5">
                      {allDays.map((day) => {
                        const isDayActive = schedule.days.includes(day);
                        return (
                          <span
                            key={day}
                            className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-medium ${
                              isDayActive
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                                : 'bg-slate-900/60 text-slate-600'
                            }`}
                          >
                            {day[0]}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => runScheduleNow(schedule.id)}
                    title="Execute schedule run now"
                    className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-300 text-xs font-medium flex items-center gap-1.5 transition-colors min-h-[40px] px-3"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Pulse</span>
                  </button>

                  <button
                    onClick={() => toggleSchedule(schedule.id)}
                    aria-label={`Toggle schedule ${schedule.name}`}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      schedule.enabled ? 'bg-emerald-600' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        schedule.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => deleteSchedule(schedule.id)}
                    title="Delete schedule"
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Schedule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0f1912] border border-slate-700/80 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Create Hydro Recirculation Program</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Program Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Gravity Tower Pulse"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Cycle Program Type</label>
                <select
                  value={newCycleType}
                  onChange={(e) => setNewCycleType(e.target.value as typeof newCycleType)}
                  aria-label="Cycle Program Type"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="TOWER_RECIRCULATION">Vertical Tower Gravity Recirculation</option>
                  <option value="CANOPY_FOG_MIST">High-Pressure Canopy Fogger Misting</option>
                  <option value="RESERVOIR_REFRESH">Sump Nutrient Equalization Flush</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Duration ({newDuration} mins)</label>
                  <input
                    type="range"
                    min="2"
                    max="60"
                    step="1"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    aria-label="Cycle Duration"
                    className="w-full mt-2 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">Repeat On Days</label>
                <div className="grid grid-cols-7 gap-1.5">
                  {allDays.map((day) => {
                    const active = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        className={`h-9 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center justify-center ${
                          active
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {day.slice(0, 2)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Target Tower Wing</label>
                <select
                  value={newZoneId}
                  onChange={(e) => setNewZoneId(e.target.value)}
                  aria-label="Target Tower Wing"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.cropType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors min-h-[40px]"
                >
                  Save Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
