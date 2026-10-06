export type SensorStatus = 'nominal' | 'warning' | 'critical';

export interface SolarPowerReading {
  // Solar PV Array
  solarWatts: number; // Current generation in Watts (e.g. 2850 W)
  solarVoltage: number; // PV Array Voltage in Volts (e.g. 84.5 V)
  solarCurrentAmps: number; // PV Array Current in Amperes (e.g. 33.7 A)
  solarDailyKwh: number; // Daily accumulated energy in kWh (e.g. 14.8 kWh)

  // Energy Storage Battery Bank (48V LiFePO4 ESS)
  batterySocPercent: number; // Battery State of Charge % (e.g. 88.5%)
  batteryVoltage: number; // Battery Voltage in Volts (e.g. 51.8 V)
  batteryCurrentAmps: number; // Charge (+) or discharge (-) in Amperes (e.g. +18.4 A)
  batteryTempC: number; // Battery Cell Temperature in °C (e.g. 26.2 °C)
  batteryHealthSoH: number; // State of Health % (e.g. 99.0%)
  
  // Consumption & Inverter
  loadConsumptionWatts: number; // Total greenhouse power consumption (e.g. 1180 W)
  inverterStatus: 'OFF_GRID_SOLAR' | 'BATTERY_BACKUP' | 'ECO_SHEDDING' | 'STANDBY';
  inverterEfficiencyPercent: number; // e.g. 95.8%
  estimatedRuntimeHours: number; // Estimated hours on current battery charge
}

export interface WaterSystemReading {
  // Raw / Freshwater Supply Tank
  freshwaterLevelPercent: number; // % Full (e.g. 84.0%)
  freshwaterVolumeLiters: number; // Current Liters (e.g. 2520 L)
  freshwaterCapacityLiters: number; // Total capacity (e.g. 3000 L)
  freshwaterTdsPpm: number; // Raw source mineral content (e.g. 68 ppm)

  // Dedicated Nutrient Solution Tank
  nutrientTankLevelPercent: number; // % Full (e.g. 82.5%)
  nutrientTankVolumeLiters: number; // Current Liters (e.g. 825 L)
  nutrientTankCapacityLiters: number; // Total capacity (e.g. 1000 L)

  // Water Filtration System Telemetry
  filterPressureDiffPsi: number; // Differential Pressure Delta PSI (Normal: 2-4 PSI; Clogged > 8 PSI)
  filterClogPercent: number; // Clogging index % (Normal < 40%)
  filterFlowRateLph: number; // Filtration throughput in Liters per Hour (e.g. 480 L/h)
  rawTurbidityNtu: number; // Input water cloudiness in NTU (e.g. 8.6 NTU)
  filteredTurbidityNtu: number; // Output water clarity in NTU (e.g. 0.4 NTU ultra-clean)
  membraneRejectionPercent: number; // Reverse osmosis rejection rate (e.g. 97.4%)
  filterStatus: 'OPTIMAL' | 'SERVICE_DUE' | 'BACKWASH_ACTIVE' | 'CLOGGED';
  lastBackwashTime: string; // e.g. "6 hours ago"
}

export interface SensorReading {
  // Atmospheric Climate
  temperature: number; // °C ambient
  heatIndex: number; // °C calculated
  solarFlux: number; // W/m² thermal solar radiation
  humidity: number; // % relative humidity
  vpd: number; // kPa Vapour Pressure Deficit
  
  // Air Quality & Composition
  airQualityIndex: number; // AQI 0-500
  co2Ppm: number; // ppm (400 - 2000)
  vocIndex: number; // 0 - 500

  // Vertical Hydroponics - Nutrient Reservoir & Water Solution Telemetry
  waterTemperature: number; // °C (Crucial: 18 - 21°C optimal; >23°C causes pythium/root rot)
  dissolvedOxygen: number; // mg/L (Crucial: 6.5 - 9.0 mg/L for root uptake)
  reservoirPh: number; // pH 0-14 (Target 5.6 - 6.2)
  reservoirEc: number; // mS/cm (Electrical Conductivity: Target 1.6 - 2.2)
  reservoirTds: number; // ppm (Total Dissolved Solids: EC * 500)
  waterLevelPercent: number; // % Sump Tank Level (Pump dry-run safeguard < 25%)
  towerFlowRateLpm: number; // L/min (Vertical top-manifold gravity delivery)
  waterOrpMv: number; // mV (Oxidation-Reduction Potential ~ 350 - 450 mV)

  // Substrate / Vertical Root-Zone
  rootZoneMoisture: number; // % saturation in rockwool / coconut coir inserts
  rootZoneTemp: number; // °C
  
  // Nutrients Mineral Concentrations
  nitrogen: number; // mg/L dissolved NO3-/NH4+
  phosphorus: number; // mg/L dissolved H2PO4-
  potassium: number; // mg/L dissolved K+

  // Photosynthesis Radiation
  par: number; // µmol/m²/s
  dli: number; // mol/m²/day Daily Light Integral

  // Solar Power Subsystem Reading
  solar: SolarPowerReading;

  // Dual Water Tanks & Filtration Subsystem Reading
  waterSystem: WaterSystemReading;

  timestamp: number;
}

export type ActuatorMode = 'AUTO' | 'MANUAL';

export interface FanActuator {
  isOn: boolean;
  mode: ActuatorMode;
  speed: number; // 0 - 100%
  activeReason: string;
  remainingMinutes?: number;
  thresholdC: number;
}

export interface SprinklersActuator {
  isOn: boolean;
  mode: ActuatorMode;
  flowRateLpm: number;
  pressurePsi: number;
  activeReason: string;
  remainingMinutes?: number;
  thresholdMoisture: number;
  thresholdHumidity: number;
}

export interface UvLightingActuator {
  isOn: boolean;
  mode: ActuatorMode;
  intensity: number; // 0 - 100%
  spectrum: 'UV-A (Growth)' | 'UV-B (Resilience)' | 'Sanitizing UV-C' | 'Full Supplemental';
  activeReason: string;
  remainingMinutes?: number;
  thresholdPar: number;
}

// Hydroponic-Specific Actuators
export interface RecirculationPumpActuator {
  isOn: boolean;
  mode: ActuatorMode;
  cycleMode: 'CONTINUOUS' | 'INTERMITTENT_15M' | 'ECO_PULSE';
  flowRateLpm: number;
  activeReason: string;
  remainingMinutes?: number;
}

export interface WaterChillerActuator {
  isOn: boolean;
  mode: ActuatorMode;
  targetTempC: number; // e.g. 19.5 °C
  activeReason: string;
  thresholdWaterTempC: number; // Auto activates when water temp > 22.0 °C
}

export interface OxygenAeratorActuator {
  isOn: boolean;
  mode: ActuatorMode;
  bubbleRatePercent: number; // 0 - 100%
  activeReason: string;
  thresholdDoMgL: number; // Auto activates when DO < 6.5 mg/L
}

export interface AutoDoserActuator {
  isDosing: boolean;
  mode: ActuatorMode;
  lastDoseType: 'pH Down (Phosphoric Acid)' | 'pH Up (Potassium Carbonate)' | 'Nutrient Part A' | 'Nutrient Part B' | 'None';
  lastDoseTime: string;
  activeReason: string;
}

// Filtration & Solar Actuators
export interface WaterTransferPumpActuator {
  isOn: boolean;
  mode: ActuatorMode;
  flowRateLpm: number; // e.g. 18.0 L/min
  activeReason: string;
}

export interface FilterBackwashValveActuator {
  isFlushing: boolean;
  mode: ActuatorMode;
  lastFlushTime: string;
  activeReason: string;
  thresholdDeltaPsi: number; // Auto triggers when filter differential > 8.0 PSI
}

export interface SolarEcoSaverActuator {
  isEnabled: boolean; // Auto sheds non-critical lights when battery < 30%
  activeReason: string;
}

export interface ThresholdConfig {
  temperatureMax: number; // 30.5 °C ambient
  heatIndexMax: number; // 35.0 °C
  humidityMin: number; // 48.0 %
  humidityMax: number; // 82.0 %
  
  // Hydroponics Thresholds
  waterTempMax: number; // 22.0 °C (Critical: prevents pythium root rot)
  waterTempMin: number; // 16.5 °C (Cold root shock limit)
  dissolvedOxygenMin: number; // 6.5 mg/L (Critical root asphyxiation)
  reservoirPhMin: number; // 5.5
  reservoirPhMax: number; // 6.4
  reservoirEcMin: number; // 1.4 mS/cm
  reservoirEcMax: number; // 2.4 mS/cm
  waterLevelMin: number; // 25.0 % (Dry-run pump protection)

  // Solar Power Thresholds
  batterySocMin: number; // 30.0 % (Triggers eco load shedding)
  batterySocCritical: number; // 15.0 % (Critical battery alarm)
  batteryTempMax: number; // 45.0 °C (Thermal run-away guard)

  // Water & Filtration Thresholds
  freshwaterTankMin: number; // 20.0 % (Supply tank refill alert)
  filterDeltaPsiMax: number; // 8.0 PSI (Auto-backwash trigger limit)

  // Air & Light
  co2Max: number; // 1200 ppm
  parMin: number; // 280 µmol/m²/s
  rootMoistureMin: number; // 40.0 %
}

export interface IrrigationSchedule {
  id: string;
  name: string;
  time: string; // "06:30"
  days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  durationMinutes: number;
  zoneId: string;
  cycleType: 'TOWER_RECIRCULATION' | 'CANOPY_FOG_MIST' | 'RESERVOIR_REFRESH';
  moistureCutoff: number; // Skip if root zone moisture > cutoff%
  enabled: boolean;
  lastRun?: string;
}

export interface PushAlert {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  sensorKey:
    | 'heat'
    | 'temperature'
    | 'humidity'
    | 'airQuality'
    | 'waterQuality'
    | 'dissolvedOxygen'
    | 'reservoir'
    | 'nutrients'
    | 'solarPower'
    | 'filtration'
    | 'waterTanks'
    | 'system';
  actuatorTriggered?: string;
  read: boolean;
  resolved: boolean;
}

export interface GreenhouseZone {
  id: string;
  name: string;
  systemType: string;
  cropType: string;
  stage: string;
  towerCount: number;
  plantSites: number;
  targetWaterTemp: string;
  targetEc: string;
  targetPh: string;
}

export interface HistoryPoint {
  time: string;
  temperature: number;
  heatIndex: number;
  humidity: number;
  waterTemperature: number;
  dissolvedOxygen: number;
  reservoirEc: number;
  co2Ppm: number;
  par: number;
  solarWatts: number;
  batterySoc: number;
  loadWatts: number;
}
