import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  SensorReading,
  FanActuator,
  SprinklersActuator,
  UvLightingActuator,
  RecirculationPumpActuator,
  WaterChillerActuator,
  OxygenAeratorActuator,
  AutoDoserActuator,
  WaterTransferPumpActuator,
  FilterBackwashValveActuator,
  SolarEcoSaverActuator,
  ThresholdConfig,
  IrrigationSchedule,
  PushAlert,
  GreenhouseZone,
  HistoryPoint
} from '../types/greennet';
import { playAlertChime } from '../utils/audio';
import {
  requestBrowserNotificationPermission,
  sendBrowserPushNotification,
  getBrowserNotificationPermission
} from '../utils/notification';

interface GreenNetContextType {
  // Telemetry & Units
  readings: SensorReading;
  tempUnit: 'C' | 'F';
  setTempUnit: (unit: 'C' | 'F') => void;
  formatTemp: (celsius: number) => string;
  history: HistoryPoint[];

  // Zones
  zones: GreenhouseZone[];
  activeZoneId: string;
  setActiveZoneId: (id: string) => void;
  activeZone: GreenhouseZone;

  // Climate & Hydroponic Actuators
  fan: FanActuator;
  sprinklers: SprinklersActuator;
  uvLighting: UvLightingActuator;
  recirculationPump: RecirculationPumpActuator;
  waterChiller: WaterChillerActuator;
  oxygenAerator: OxygenAeratorActuator;
  autoDoser: AutoDoserActuator;

  // Solar & Filtration Actuators
  transferPump: WaterTransferPumpActuator;
  filterBackwash: FilterBackwashValveActuator;
  solarEcoSaver: SolarEcoSaverActuator;

  setFanMode: (mode: 'AUTO' | 'MANUAL') => void;
  toggleFanPower: (forceState?: boolean) => void;
  setFanSpeed: (speed: number) => void;
  setFanTimer: (minutes: number) => void;

  setSprinklersMode: (mode: 'AUTO' | 'MANUAL') => void;
  toggleSprinklersPower: (forceState?: boolean) => void;
  setSprinklersTimer: (minutes: number) => void;

  setUvMode: (mode: 'AUTO' | 'MANUAL') => void;
  toggleUvPower: (forceState?: boolean) => void;
  setUvIntensity: (intensity: number) => void;
  setUvSpectrum: (spectrum: UvLightingActuator['spectrum']) => void;
  setUvTimer: (minutes: number) => void;

  setPumpMode: (mode: 'AUTO' | 'MANUAL') => void;
  togglePumpPower: (forceState?: boolean) => void;
  setPumpCycleMode: (cycle: RecirculationPumpActuator['cycleMode']) => void;

  setChillerMode: (mode: 'AUTO' | 'MANUAL') => void;
  toggleChillerPower: (forceState?: boolean) => void;
  setChillerTargetTemp: (tempC: number) => void;

  setAeratorMode: (mode: 'AUTO' | 'MANUAL') => void;
  toggleAeratorPower: (forceState?: boolean) => void;
  setAeratorBubbleRate: (rate: number) => void;

  triggerManualDose: (type: AutoDoserActuator['lastDoseType']) => void;

  // Solar & Water Tank Handlers
  toggleTransferPump: (forceState?: boolean) => void;
  triggerFilterBackwash: () => void;
  toggleSolarEcoSaver: () => void;

  emergencyAllStop: () => void;

  // Thresholds
  thresholds: ThresholdConfig;
  updateThresholds: (updates: Partial<ThresholdConfig>) => void;
  resetThresholdsToDefault: () => void;

  // Schedules
  schedules: IrrigationSchedule[];
  toggleSchedule: (id: string) => void;
  addSchedule: (schedule: Omit<IrrigationSchedule, 'id'>) => void;
  deleteSchedule: (id: string) => void;
  runScheduleNow: (id: string) => void;
  nextScheduledTime: { time: string; name: string } | null;

  // Push Notifications & Alerts
  alerts: PushAlert[];
  unreadAlertCount: number;
  activeUrgentAlert: PushAlert | null;
  dismissUrgentAlert: () => void;
  markAlertAsRead: (id: string) => void;
  markAllAlertsRead: () => void;
  clearResolvedAlerts: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  browserPushStatus: NotificationPermission;
  enableBrowserPush: () => Promise<void>;

  // Simulation Controls
  isLiveStreaming: boolean;
  setIsLiveStreaming: (live: boolean) => void;
  triggerSimulation: (
    type:
      | 'ambient_heat_spike'
      | 'water_heat_spike'
      | 'oxygen_drop'
      | 'low_reservoir'
      | 'ph_drift'
      | 'solar_depletion'
      | 'filter_clog'
      | 'freshwater_low'
      | 'reset'
  ) => void;
  activeSimulation: string | null;
}

const DEFAULT_THRESHOLDS: ThresholdConfig = {
  temperatureMax: 30.5,
  heatIndexMax: 35.0,
  humidityMin: 48.0,
  humidityMax: 82.0,
  waterTempMax: 22.0,
  waterTempMin: 16.5,
  dissolvedOxygenMin: 6.5,
  reservoirPhMin: 5.5,
  reservoirPhMax: 6.4,
  reservoirEcMin: 1.4,
  reservoirEcMax: 2.4,
  waterLevelMin: 25.0,
  co2Max: 1150,
  parMin: 280,
  rootMoistureMin: 45.0,

  // Solar Thresholds
  batterySocMin: 30.0,
  batterySocCritical: 15.0,
  batteryTempMax: 45.0,

  // Water & Filtration Thresholds
  freshwaterTankMin: 20.0,
  filterDeltaPsiMax: 8.0,
};

const ZONES: GreenhouseZone[] = [
  {
    id: 'zone-1',
    name: 'Tower Wing A · Aeroponic Towers',
    systemType: 'Vertical Aeroponic Tower Stack (32 Columns)',
    cropType: 'Culinary Sweet Basil & Tuscan Kale',
    stage: 'Rapid Vegetative Biomass',
    towerCount: 32,
    plantSites: 896,
    targetWaterTemp: '18°C - 21°C',
    targetEc: '1.6 - 2.0 mS/cm',
    targetPh: '5.8 - 6.2 pH',
  },
  {
    id: 'zone-2',
    name: 'Tower Wing B · Vertical NFT Gutters',
    systemType: 'Vertical Tiered Nutrient Film Array',
    cropType: 'Butterhead Lettuce & Red Romaine',
    stage: 'Mature Canopy Heading',
    towerCount: 24,
    plantSites: 672,
    targetWaterTemp: '18°C - 20°C',
    targetEc: '1.4 - 1.8 mS/cm',
    targetPh: '5.6 - 6.0 pH',
  },
  {
    id: 'zone-3',
    name: 'Tower Wing C · Nursery Vertical Seedlings',
    systemType: 'Micro-Aeroponic Propagation Columns',
    cropType: 'Microgreens, Chives & Radish Sprouts',
    stage: 'Cotyledon & First True Leaves',
    towerCount: 16,
    plantSites: 1280,
    targetWaterTemp: '19°C - 21°C',
    targetEc: '1.0 - 1.4 mS/cm',
    targetPh: '5.8 - 6.2 pH',
  },
];

const INITIAL_SCHEDULES: IrrigationSchedule[] = [
  {
    id: 'sched-1',
    name: 'Tower Manifold Gravity Pulse Cycle',
    time: '06:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    durationMinutes: 15,
    zoneId: 'zone-1',
    cycleType: 'TOWER_RECIRCULATION',
    moistureCutoff: 85,
    enabled: true,
    lastRun: '15 min ago (Recirculating)',
  },
  {
    id: 'sched-2',
    name: 'Midday Canopy Fog Mist & Cooling',
    time: '12:30',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    durationMinutes: 4,
    zoneId: 'zone-1',
    cycleType: 'CANOPY_FOG_MIST',
    moistureCutoff: 75,
    enabled: true,
    lastRun: 'Yesterday, 12:30 PM',
  },
  {
    id: 'sched-3',
    name: 'Automated Sump Nutrient Equalization',
    time: '20:00',
    days: ['Mon', 'Wed', 'Fri', 'Sun'],
    durationMinutes: 10,
    zoneId: 'zone-2',
    cycleType: 'RESERVOIR_REFRESH',
    moistureCutoff: 90,
    enabled: true,
    lastRun: '2 days ago',
  },
];

function calculateHeatIndex(celsius: number, rh: number): number {
  const T = (celsius * 9) / 5 + 32;
  const R = rh;
  if (T < 80) {
    return Math.round((celsius + 0.5 * (celsius - 20) * (rh / 100)) * 10) / 10;
  }
  const hiF =
    -42.379 +
    2.04901523 * T +
    10.14333127 * R -
    0.22475541 * T * R -
    0.00683783 * T * T -
    0.05481717 * R * R +
    0.00122874 * T * T * R +
    0.00085282 * T * R * R -
    0.00000199 * T * T * R * R;
  const hiC = ((hiF - 32) * 5) / 9;
  return Math.round(hiC * 10) / 10;
}

function calculateVpd(tempC: number, rh: number): number {
  const vpsat = 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  const vpair = vpsat * (rh / 100);
  return Math.round((vpsat - vpair) * 100) / 100;
}

const GreenNetContext = createContext<GreenNetContextType | undefined>(undefined);

export const GreenNetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeZoneId, setActiveZoneId] = useState<string>('zone-1');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [thresholds, setThresholds] = useState<ThresholdConfig>(DEFAULT_THRESHOLDS);
  const [schedules, setSchedules] = useState<IrrigationSchedule[]>(INITIAL_SCHEDULES);
  const [browserPushStatus, setBrowserPushStatus] = useState<NotificationPermission>(() =>
    getBrowserNotificationPermission()
  );

  // Sensor state initialized with Solar Power & Dual Water Filtration
  const [readings, setReadings] = useState<SensorReading>(() => {
    const temp = 25.8;
    const hum = 63.0;
    const waterTemp = 19.4;
    return {
      temperature: temp,
      heatIndex: calculateHeatIndex(temp, hum),
      solarFlux: 540,
      humidity: hum,
      vpd: calculateVpd(temp, hum),
      airQualityIndex: 38,
      co2Ppm: 860,
      vocIndex: 34,

      // Vertical Hydroponics Telemetry
      waterTemperature: waterTemp,
      dissolvedOxygen: 7.9,
      reservoirPh: 5.85,
      reservoirEc: 1.82,
      reservoirTds: 910,
      waterLevelPercent: 82.5,
      towerFlowRateLpm: 5.4,
      waterOrpMv: 395,
      rootZoneMoisture: 72.5,
      rootZoneTemp: 20.2,

      nitrogen: 165,
      phosphorus: 52,
      potassium: 235,

      par: 480,
      dli: 16.8,

      // Solar Power Subsystem
      solar: {
        solarWatts: 2850,
        solarVoltage: 84.5,
        solarCurrentAmps: 33.7,
        solarDailyKwh: 14.8,
        batterySocPercent: 88.5,
        batteryVoltage: 51.8,
        batteryCurrentAmps: 18.4,
        batteryTempC: 26.2,
        batteryHealthSoH: 99.0,
        loadConsumptionWatts: 1180,
        inverterStatus: 'OFF_GRID_SOLAR',
        inverterEfficiencyPercent: 95.8,
        estimatedRuntimeHours: 16.4,
      },

      // Dual Water Tanks & Filtration
      waterSystem: {
        freshwaterLevelPercent: 84.0,
        freshwaterVolumeLiters: 2520,
        freshwaterCapacityLiters: 3000,
        freshwaterTdsPpm: 68,
        nutrientTankLevelPercent: 82.5,
        nutrientTankVolumeLiters: 825,
        nutrientTankCapacityLiters: 1000,
        filterPressureDiffPsi: 3.4,
        filterClogPercent: 24,
        filterFlowRateLph: 480,
        rawTurbidityNtu: 8.6,
        filteredTurbidityNtu: 0.4,
        membraneRejectionPercent: 97.4,
        filterStatus: 'OPTIMAL',
        lastBackwashTime: '6 hours ago',
      },

      timestamp: Date.now(),
    };
  });

  // History buffer
  const [history, setHistory] = useState<HistoryPoint[]>(() => {
    const points: HistoryPoint[] = [];
    const now = Date.now();
    for (let i = 14; i >= 0; i--) {
      const t = new Date(now - i * 15 * 60 * 1000);
      const timeStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      points.push({
        time: timeStr,
        temperature: Math.round((24.5 + Math.sin(i / 3) * 2.5) * 10) / 10,
        heatIndex: Math.round((25.5 + Math.sin(i / 3) * 2.5) * 10) / 10,
        humidity: Math.round(64 - Math.sin(i / 3) * 5),
        waterTemperature: Math.round((19.2 + Math.sin(i / 4) * 0.8) * 10) / 10,
        dissolvedOxygen: Math.round((8.1 - Math.sin(i / 4) * 0.4) * 10) / 10,
        reservoirEc: 1.82,
        co2Ppm: Math.round(820 + Math.sin(i) * 40),
        par: Math.round(420 + Math.cos(i / 2) * 110),
        solarWatts: Math.round(2400 + Math.sin(i / 2) * 600),
        batterySoc: Math.round(85 + (14 - i) * 0.25),
        loadWatts: 1180,
      });
    }
    return points;
  });

  // Actuators
  const [fan, setFan] = useState<FanActuator>({
    isOn: false,
    mode: 'AUTO',
    speed: 0,
    activeReason: 'Canopy temperature nominal — Standby',
    thresholdC: DEFAULT_THRESHOLDS.temperatureMax,
  });

  const [sprinklers, setSprinklers] = useState<SprinklersActuator>({
    isOn: false,
    mode: 'AUTO',
    flowRateLpm: 0,
    pressurePsi: 0,
    activeReason: 'Canopy humidity optimal — Standby',
    thresholdMoisture: DEFAULT_THRESHOLDS.rootMoistureMin,
    thresholdHumidity: DEFAULT_THRESHOLDS.humidityMin,
  });

  const [uvLighting, setUvLighting] = useState<UvLightingActuator>({
    isOn: false,
    mode: 'AUTO',
    intensity: 0,
    spectrum: 'Full Supplemental',
    activeReason: 'Solar radiation sufficient — Standby',
    thresholdPar: DEFAULT_THRESHOLDS.parMin,
  });

  const [recirculationPump, setRecirculationPump] = useState<RecirculationPumpActuator>({
    isOn: true,
    mode: 'AUTO',
    cycleMode: 'CONTINUOUS',
    flowRateLpm: 5.4,
    activeReason: 'Auto: Continuous Vertical Tower Recirculation Active',
  });

  const [waterChiller, setWaterChiller] = useState<WaterChillerActuator>({
    isOn: false,
    mode: 'AUTO',
    targetTempC: 19.5,
    activeReason: 'Reservoir temp within safe limits (19.4°C ≤ 22.0°C)',
    thresholdWaterTempC: DEFAULT_THRESHOLDS.waterTempMax,
  });

  const [oxygenAerator, setOxygenAerator] = useState<OxygenAeratorActuator>({
    isOn: true,
    mode: 'AUTO',
    bubbleRatePercent: 45,
    activeReason: 'Baseline oxygenation active (DO: 7.9 mg/L)',
    thresholdDoMgL: DEFAULT_THRESHOLDS.dissolvedOxygenMin,
  });

  const [autoDoser, setAutoDoser] = useState<AutoDoserActuator>({
    isDosing: false,
    mode: 'AUTO',
    lastDoseType: 'pH Down (Phosphoric Acid)',
    lastDoseTime: '2 hours ago',
    activeReason: 'Nutrient EC & pH balanced within setpoints',
  });

  // Solar & Water Filtration Actuators
  const [transferPump, setTransferPump] = useState<WaterTransferPumpActuator>({
    isOn: false,
    mode: 'AUTO',
    flowRateLpm: 0,
    activeReason: 'Nutrient tank capacity full (825L) — Standby',
  });

  const [filterBackwash, setFilterBackwash] = useState<FilterBackwashValveActuator>({
    isFlushing: false,
    mode: 'AUTO',
    lastFlushTime: '6 hours ago',
    activeReason: 'Filter differential pressure clean (3.4 PSI < 8.0 PSI)',
    thresholdDeltaPsi: DEFAULT_THRESHOLDS.filterDeltaPsiMax,
  });

  const [solarEcoSaver, setSolarEcoSaver] = useState<SolarEcoSaverActuator>({
    isEnabled: true,
    activeReason: 'Battery SoC healthy (88.5%) — Full power profile',
  });

  // Alerts
  const [alerts, setAlerts] = useState<PushAlert[]>([
    {
      id: 'alert-solar-1',
      timestamp: '25 min ago',
      title: 'Solar PV Array Peak Generation',
      message: 'Solar array producing 2,850W at 84.5V. Battery charging at +18.4A.',
      severity: 'info',
      sensorKey: 'solarPower',
      read: true,
      resolved: true,
    },
    {
      id: 'alert-init-1',
      timestamp: '40 min ago',
      title: 'Water Filtration Differential Nominal',
      message: 'Sediment & RO membrane filter operating at 3.4 PSI delta (0.4 NTU clarity).',
      severity: 'info',
      sensorKey: 'filtration',
      read: true,
      resolved: true,
    },
  ]);

  const [activeUrgentAlert, setActiveUrgentAlert] = useState<PushAlert | null>(null);

  const activeZone = useMemo(() => {
    return ZONES.find((z) => z.id === activeZoneId) || ZONES[0];
  }, [activeZoneId]);

  const formatTemp = useCallback(
    (celsius: number): string => {
      if (tempUnit === 'F') {
        const f = (celsius * 9) / 5 + 32;
        return `${f.toFixed(1)}°F`;
      }
      return `${celsius.toFixed(1)}°C`;
    },
    [tempUnit]
  );

  const triggerAlert = useCallback(
    (
      title: string,
      message: string,
      severity: 'critical' | 'warning' | 'info',
      sensorKey: PushAlert['sensorKey'],
      actuatorTriggered?: string
    ) => {
      const newAlert: PushAlert = {
        id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: 'Just now',
        title,
        message,
        severity,
        sensorKey,
        actuatorTriggered,
        read: false,
        resolved: false,
      };

      setAlerts((prev) => [newAlert, ...prev.slice(0, 49)]);

      if (severity === 'critical') {
        setActiveUrgentAlert(newAlert);
      }

      if (soundEnabled) {
        playAlertChime(severity);
      }

      if (severity === 'critical' || severity === 'warning') {
        sendBrowserPushNotification(`GreenNet: ${title}`, {
          body: message,
          tag: `greennet-${sensorKey}`,
        });
      }
    },
    [soundEnabled]
  );

  // Simulation handler
  const triggerSimulation = useCallback(
    (
      type:
        | 'ambient_heat_spike'
        | 'water_heat_spike'
        | 'oxygen_drop'
        | 'low_reservoir'
        | 'ph_drift'
        | 'solar_depletion'
        | 'filter_clog'
        | 'freshwater_low'
        | 'reset'
    ) => {
      setActiveSimulation(type);

      if (type === 'solar_depletion') {
        setReadings((prev) => ({
          ...prev,
          solar: {
            ...prev.solar,
            batterySocPercent: 18.5,
            batteryVoltage: 46.2,
            solarWatts: 240,
            solarCurrentAmps: 2.8,
            inverterStatus: 'ECO_SHEDDING',
            estimatedRuntimeHours: 3.2,
          },
        }));
        triggerAlert(
          'Critical Low Battery & Solar Depletion',
          'Battery SoC dropped to 18.5% (Threshold: 30.0%). Inverter engaged Eco Load-Shedding. Non-essential lights disabled.',
          'critical',
          'solarPower',
          'Solar Eco-Shedding Mode'
        );
      } else if (type === 'filter_clog') {
        setReadings((prev) => ({
          ...prev,
          waterSystem: {
            ...prev.waterSystem,
            filterPressureDiffPsi: 9.4,
            filterClogPercent: 88,
            filterStatus: 'BACKWASH_ACTIVE',
          },
        }));
        triggerAlert(
          'Filtration System Pressure Clog',
          'Filter pressure differential reached 9.4 PSI (Limit: 8.0 PSI). Automated backwash reverse-flush valve triggered.',
          'critical',
          'filtration',
          'Auto-Filter Backwash Valve'
        );
      } else if (type === 'freshwater_low') {
        setReadings((prev) => ({
          ...prev,
          waterSystem: {
            ...prev.waterSystem,
            freshwaterLevelPercent: 14.5,
            freshwaterVolumeLiters: 435,
          },
        }));
        triggerAlert(
          'Low Freshwater Supply Reservoir',
          'Freshwater tank volume at 14.5% (435L remaining). Raw well/rainwater transfer required.',
          'warning',
          'waterTanks'
        );
      } else if (type === 'water_heat_spike') {
        setReadings((prev) => ({
          ...prev,
          waterTemperature: 24.6,
          dissolvedOxygen: 5.6,
        }));
        triggerAlert(
          'Critical Nutrient Solution Temperature Spike',
          'Reservoir water reached 24.6°C (Threshold: 22.0°C). Active inline water chiller auto-engaged.',
          'critical',
          'waterQuality',
          'Inline Hydroponic Chiller Activated'
        );
      } else if (type === 'oxygen_drop') {
        setReadings((prev) => ({
          ...prev,
          dissolvedOxygen: 4.8,
        }));
        triggerAlert(
          'Critical Dissolved Oxygen Depletion',
          'Solution DO dropped to 4.8 mg/L (Threshold: 6.5 mg/L). High-flow oxygen aerator triggered.',
          'critical',
          'dissolvedOxygen',
          'Oxygen Aerator @ 100% Boost'
        );
      } else if (type === 'low_reservoir') {
        setReadings((prev) => ({
          ...prev,
          waterLevelPercent: 18.2,
          towerFlowRateLpm: 2.1,
        }));
        triggerAlert(
          'Critical Low Sump Reservoir Level',
          'Reservoir level at 18.2% (Threshold: 25.0%). Pump dry-run cavitation protection tripped.',
          'critical',
          'reservoir',
          'Pump Cavitation Safeguard Triggered'
        );
      } else if (type === 'ph_drift') {
        setReadings((prev) => ({
          ...prev,
          reservoirPh: 6.85,
        }));
        triggerAlert(
          'Nutrient pH Alkaline Drift',
          'Solution pH drifted to 6.85 (Threshold: 6.40). Auto-dosing pH Down (Phosphoric Acid).',
          'warning',
          'nutrients',
          'Auto-Dosing pH Down Pump'
        );
      } else if (type === 'ambient_heat_spike') {
        setReadings((prev) => {
          const temp = 33.6;
          const hum = 45.0;
          return {
            ...prev,
            temperature: temp,
            humidity: hum,
            heatIndex: calculateHeatIndex(temp, hum),
            vpd: calculateVpd(temp, hum),
          };
        });
        triggerAlert(
          'Greenhouse Canopy Thermal Spike',
          'Ambient air temperature reached 33.6°C. High-volume exhaust cooling fan engaged.',
          'critical',
          'heat',
          'Exhaust Fan Purge @ 90%'
        );
      } else if (type === 'reset') {
        setActiveSimulation(null);
        setReadings((prev) => ({
          ...prev,
          temperature: 25.5,
          heatIndex: calculateHeatIndex(25.5, 63.5),
          humidity: 63.5,
          vpd: calculateVpd(25.5, 63.5),
          waterTemperature: 19.4,
          dissolvedOxygen: 7.9,
          reservoirPh: 5.85,
          reservoirEc: 1.82,
          reservoirTds: 910,
          waterLevelPercent: 82.0,
          towerFlowRateLpm: 5.4,
          solar: {
            solarWatts: 2850,
            solarVoltage: 84.5,
            solarCurrentAmps: 33.7,
            solarDailyKwh: 14.8,
            batterySocPercent: 88.5,
            batteryVoltage: 51.8,
            batteryCurrentAmps: 18.4,
            batteryTempC: 26.2,
            batteryHealthSoH: 99.0,
            loadConsumptionWatts: 1180,
            inverterStatus: 'OFF_GRID_SOLAR',
            inverterEfficiencyPercent: 95.8,
            estimatedRuntimeHours: 16.4,
          },
          waterSystem: {
            freshwaterLevelPercent: 84.0,
            freshwaterVolumeLiters: 2520,
            freshwaterCapacityLiters: 3000,
            freshwaterTdsPpm: 68,
            nutrientTankLevelPercent: 82.5,
            nutrientTankVolumeLiters: 825,
            nutrientTankCapacityLiters: 1000,
            filterPressureDiffPsi: 3.4,
            filterClogPercent: 24,
            filterFlowRateLph: 480,
            rawTurbidityNtu: 8.6,
            filteredTurbidityNtu: 0.4,
            membraneRejectionPercent: 97.4,
            filterStatus: 'OPTIMAL',
            lastBackwashTime: '6 hours ago',
          },
        }));
        triggerAlert(
          'All Solar, Water & Hydro Systems Nominal',
          'PV generation, battery state, dual tanks, filtration, and climate nominal.',
          'info',
          'system'
        );
      }
    },
    [triggerAlert]
  );

  // Automated Actuators & Trigger Loop
  const lastAlertRef = useRef<{ chiller?: number; aerator?: number; filter?: number; solar?: number }>({});

  useEffect(() => {
    const now = Date.now();
    const cooldown = 30000;

    // Filter Backwash Automation
    if (readings.waterSystem.filterPressureDiffPsi > thresholds.filterDeltaPsiMax) {
      if (!filterBackwash.isFlushing) {
        setFilterBackwash((prev) => ({
          ...prev,
          isFlushing: true,
          activeReason: `Auto: High Delta PSI (${readings.waterSystem.filterPressureDiffPsi.toFixed(1)} > ${thresholds.filterDeltaPsiMax}) — Flushing`,
          lastFlushTime: 'Just now',
        }));

        if (!lastAlertRef.current.filter || now - lastAlertRef.current.filter > cooldown) {
          lastAlertRef.current.filter = now;
          triggerAlert(
            'Automated Filter Backwash Triggered',
            `Filter differential reached ${readings.waterSystem.filterPressureDiffPsi.toFixed(1)} PSI. Automated reverse-flush in progress.`,
            'critical',
            'filtration',
            'Filter Backwash Flush Valve'
          );
        }

        setTimeout(() => {
          setFilterBackwash((prev) => ({ ...prev, isFlushing: false, activeReason: 'Filter backwash complete — Clean flow restored' }));
          setReadings((p) => ({
            ...p,
            waterSystem: {
              ...p.waterSystem,
              filterPressureDiffPsi: 2.8,
              filterClogPercent: 12,
              filterStatus: 'OPTIMAL',
            },
          }));
        }, 8000);
      }
    }

    // Solar Load Shedding Automation
    if (solarEcoSaver.isEnabled && readings.solar.batterySocPercent < thresholds.batterySocMin) {
      if (uvLighting.isOn) {
        setUvLighting((prev) => ({ ...prev, isOn: false, activeReason: 'Solar Eco-Shedding: Disabled to protect battery' }));
        if (!lastAlertRef.current.solar || now - lastAlertRef.current.solar > cooldown) {
          lastAlertRef.current.solar = now;
          triggerAlert('Solar Eco-Mode: UV Light Shed', 'UV supplemental lights shed to reserve battery for tower pumps.', 'warning', 'solarPower');
        }
      }
    }
  }, [readings.waterSystem.filterPressureDiffPsi, readings.solar.batterySocPercent, thresholds, filterBackwash.isFlushing, solarEcoSaver.isEnabled, uvLighting.isOn, triggerAlert]);

  // Live telemetry generator
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setReadings((prev) => {
        // Natural fluctuations
        const deltaWatts = (Math.random() - 0.49) * 25;
        const deltaSoc = prev.solar.solarWatts > prev.solar.loadConsumptionWatts ? 0.04 : -0.05;
        const newSoc = Math.max(10, Math.min(100, Math.round((prev.solar.batterySocPercent + deltaSoc) * 10) / 10));

        return {
          ...prev,
          solar: {
            ...prev.solar,
            solarWatts: Math.max(0, Math.round(prev.solar.solarWatts + deltaWatts)),
            batterySocPercent: newSoc,
            batteryVoltage: Math.round((48 + (newSoc / 100) * 4.2) * 10) / 10,
          },
          waterSystem: {
            ...prev.waterSystem,
            filterPressureDiffPsi: Math.round((prev.waterSystem.filterPressureDiffPsi + (Math.random() - 0.5) * 0.05) * 10) / 10,
          },
          timestamp: Date.now(),
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Handlers
  const toggleTransferPump = useCallback((forceState?: boolean) => {
    setTransferPump((prev) => {
      const next = forceState !== undefined ? forceState : !prev.isOn;
      return {
        ...prev,
        isOn: next,
        flowRateLpm: next ? 18.0 : 0,
        activeReason: next ? 'Manual transfer to nutrient tank active' : 'Transfer pump standby',
      };
    });
  }, []);

  const triggerFilterBackwash = useCallback(() => {
    setFilterBackwash((prev) => ({
      ...prev,
      isFlushing: true,
      lastFlushTime: 'Just now',
      activeReason: 'Manual reverse-flush initiated by operator',
    }));
    triggerAlert('Filter Backwash Initiated', 'Reverse-flush cycle clearing particulate manifold.', 'info', 'filtration');
    setTimeout(() => {
      setFilterBackwash((prev) => ({ ...prev, isFlushing: false, activeReason: 'Backwash complete' }));
      setReadings((p) => ({
        ...p,
        waterSystem: { ...p.waterSystem, filterPressureDiffPsi: 2.6, filterClogPercent: 10, filterStatus: 'OPTIMAL' },
      }));
    }, 6000);
  }, [triggerAlert]);

  const toggleSolarEcoSaver = useCallback(() => {
    setSolarEcoSaver((prev) => ({ ...prev, isEnabled: !prev.isEnabled }));
  }, []);

  // Standard Handlers
  const setFanMode = useCallback((mode: 'AUTO' | 'MANUAL') => setFan((p) => ({ ...p, mode })), []);
  const toggleFanPower = useCallback((f?: boolean) => setFan((p) => ({ ...p, isOn: f !== undefined ? f : !p.isOn, mode: 'MANUAL', speed: p.isOn ? 0 : 70 })), []);
  const setFanSpeed = useCallback((s: number) => setFan((p) => ({ ...p, speed: s, isOn: s > 0, mode: 'MANUAL' })), []);
  const setFanTimer = useCallback((m: number) => setFan((p) => ({ ...p, isOn: true, mode: 'MANUAL', remainingMinutes: m })), []);

  const setSprinklersMode = useCallback((m: 'AUTO' | 'MANUAL') => setSprinklers((p) => ({ ...p, mode: m })), []);
  const toggleSprinklersPower = useCallback((f?: boolean) => setSprinklers((p) => ({ ...p, isOn: f !== undefined ? f : !p.isOn, mode: 'MANUAL', flowRateLpm: p.isOn ? 0 : 8.5 })), []);
  const setSprinklersTimer = useCallback((m: number) => setSprinklers((p) => ({ ...p, isOn: true, mode: 'MANUAL', remainingMinutes: m })), []);

  const setUvMode = useCallback((m: 'AUTO' | 'MANUAL') => setUvLighting((p) => ({ ...p, mode: m })), []);
  const toggleUvPower = useCallback((f?: boolean) => setUvLighting((p) => ({ ...p, isOn: f !== undefined ? f : !p.isOn, mode: 'MANUAL', intensity: p.isOn ? 0 : 80 })), []);
  const setUvIntensity = useCallback((i: number) => setUvLighting((p) => ({ ...p, intensity: i, isOn: i > 0, mode: 'MANUAL' })), []);
  const setUvSpectrum = useCallback((s: UvLightingActuator['spectrum']) => setUvLighting((p) => ({ ...p, spectrum: s })), []);
  const setUvTimer = useCallback((m: number) => setUvLighting((p) => ({ ...p, isOn: true, mode: 'MANUAL', remainingMinutes: m })), []);

  const setPumpMode = useCallback((m: 'AUTO' | 'MANUAL') => setRecirculationPump((p) => ({ ...p, mode: m })), []);
  const togglePumpPower = useCallback((f?: boolean) => setRecirculationPump((p) => ({ ...p, isOn: f !== undefined ? f : !p.isOn, mode: 'MANUAL', flowRateLpm: p.isOn ? 0 : 5.4 })), []);
  const setPumpCycleMode = useCallback((c: RecirculationPumpActuator['cycleMode']) => setRecirculationPump((p) => ({ ...p, cycleMode: c })), []);

  const setChillerMode = useCallback((m: 'AUTO' | 'MANUAL') => setWaterChiller((p) => ({ ...p, mode: m })), []);
  const toggleChillerPower = useCallback((f?: boolean) => setWaterChiller((p) => ({ ...p, isOn: f !== undefined ? f : !p.isOn, mode: 'MANUAL' })), []);
  const setChillerTargetTemp = useCallback((t: number) => setWaterChiller((p) => ({ ...p, targetTempC: t })), []);

  const setAeratorMode = useCallback((m: 'AUTO' | 'MANUAL') => setOxygenAerator((p) => ({ ...p, mode: m })), []);
  const toggleAeratorPower = useCallback((f?: boolean) => setOxygenAerator((p) => ({ ...p, isOn: f !== undefined ? f : !p.isOn, mode: 'MANUAL', bubbleRatePercent: p.isOn ? 0 : 80 })), []);
  const setAeratorBubbleRate = useCallback((r: number) => setOxygenAerator((p) => ({ ...p, bubbleRatePercent: r, isOn: r > 0 })), []);

  const triggerManualDose = useCallback((t: AutoDoserActuator['lastDoseType']) => {
    setAutoDoser((p) => ({ ...p, isDosing: true, lastDoseType: t, lastDoseTime: 'Just now' }));
    setTimeout(() => setAutoDoser((p) => ({ ...p, isDosing: false })), 5000);
  }, []);

  const emergencyAllStop = useCallback(() => {
    setFan((p) => ({ ...p, isOn: false, speed: 0, mode: 'MANUAL' }));
    setSprinklers((p) => ({ ...p, isOn: false, flowRateLpm: 0, mode: 'MANUAL' }));
    setUvLighting((p) => ({ ...p, isOn: false, intensity: 0, mode: 'MANUAL' }));
    setRecirculationPump((p) => ({ ...p, isOn: false, flowRateLpm: 0, mode: 'MANUAL' }));
    setWaterChiller((p) => ({ ...p, isOn: false, mode: 'MANUAL' }));
    setOxygenAerator((p) => ({ ...p, isOn: false, bubbleRatePercent: 0, mode: 'MANUAL' }));
    setTransferPump((p) => ({ ...p, isOn: false, flowRateLpm: 0, mode: 'MANUAL' }));
    setFilterBackwash((p) => ({ ...p, isFlushing: false, mode: 'MANUAL' }));
    triggerAlert('Emergency Master All-Stop Executed', 'All pumps, chillers, solar loads, and actuators powered down.', 'critical', 'system');
  }, [triggerAlert]);

  const updateThresholds = useCallback((u: Partial<ThresholdConfig>) => setThresholds((p) => ({ ...p, ...u })), []);
  const resetThresholdsToDefault = useCallback(() => setThresholds(DEFAULT_THRESHOLDS), []);

  const toggleSchedule = useCallback((id: string) => setSchedules((p) => p.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))), []);
  const addSchedule = useCallback((ns: Omit<IrrigationSchedule, 'id'>) => setSchedules((p) => [...p, { ...ns, id: `sched-${Date.now()}` }]), []);
  const deleteSchedule = useCallback((id: string) => setSchedules((p) => p.filter((s) => s.id !== id)), []);
  const runScheduleNow = useCallback((id: string) => {
    const s = schedules.find((x) => x.id === id);
    if (!s) return;
    setSprinklersTimer(s.durationMinutes);
    triggerAlert(`Scheduled Run: ${s.name}`, `Activated for ${s.durationMinutes} min.`, 'info', 'reservoir');
  }, [schedules, setSprinklersTimer, triggerAlert]);

  const nextScheduledTime = useMemo(() => {
    const a = schedules.filter((s) => s.enabled);
    return a.length > 0 ? { time: a[0].time, name: a[0].name } : null;
  }, [schedules]);

  const unreadAlertCount = useMemo(() => alerts.filter((a) => !a.read).length, [alerts]);
  const dismissUrgentAlert = useCallback(() => setActiveUrgentAlert(null), []);
  const markAlertAsRead = useCallback((id: string) => setAlerts((p) => p.map((a) => (a.id === id ? { ...a, read: true } : a))), []);
  const markAllAlertsRead = useCallback(() => setAlerts((p) => p.map((a) => ({ ...a, read: true }))), []);
  const clearResolvedAlerts = useCallback(() => setAlerts((p) => p.filter((a) => a.severity === 'critical' && !a.resolved)), []);

  const enableBrowserPush = useCallback(async () => {
    const perm = await requestBrowserNotificationPermission();
    setBrowserPushStatus(perm);
    if (perm === 'granted') {
      sendBrowserPushNotification('GreenNet Push Enabled', { body: 'Solar, water tanks & hydroponics alerts active.' });
    }
  }, []);

  return (
    <GreenNetContext.Provider
      value={{
        readings,
        tempUnit,
        setTempUnit,
        formatTemp,
        history,
        zones: ZONES,
        activeZoneId,
        setActiveZoneId,
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
        toggleTransferPump,
        triggerFilterBackwash,
        toggleSolarEcoSaver,
        emergencyAllStop,
        thresholds,
        updateThresholds,
        resetThresholdsToDefault,
        schedules,
        toggleSchedule,
        addSchedule,
        deleteSchedule,
        runScheduleNow,
        nextScheduledTime,
        alerts,
        unreadAlertCount,
        activeUrgentAlert,
        dismissUrgentAlert,
        markAlertAsRead,
        markAllAlertsRead,
        clearResolvedAlerts,
        soundEnabled,
        setSoundEnabled,
        browserPushStatus,
        enableBrowserPush,
        isLiveStreaming,
        setIsLiveStreaming,
        triggerSimulation,
        activeSimulation,
      }}
    >
      {children}
    </GreenNetContext.Provider>
  );
};

export function useGreenNet(): GreenNetContextType {
  const context = useContext(GreenNetContext);
  if (!context) throw new Error('useGreenNet must be used within a GreenNetProvider');
  return context;
}
