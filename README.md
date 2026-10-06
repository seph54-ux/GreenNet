# GreenNet — Smart Greenhouse Monitoring & Autonomous Vertical Hydroponics Control System

> **Made by Philjoseph Orlina**  
> *Revised from our Major Thesis*

---

## 1. Project Overview

**GreenNet** is a mobile-first, responsive Internet of Things (IoT) monitoring and autonomous climate/nutrient control dashboard designed specifically for modern **vertical hydroponics greenhouses** (such as aeroponic towers and vertical nutrient film technique / NFT gutter stacks).

Unlike traditional soil bed systems, vertical hydroponics exposes roots directly to recirculating nutrient solutions and atmospheric microclimates. Without soil buffers, imbalances in water temperature, dissolved oxygen, or pH can cause catastrophic crop loss within hours. GreenNet provides 24/7 continuous telemetry, autonomous threshold-driven actuator responses, programmable gravity recirculation cycles, real-time push alerts, and an adaptive 6-theme display engine for both indoor consoles and harsh outdoor daylight environments.

---

## 2. Key Capabilities & Monitored Parameters

### A. Vertical Hydroponic Solution Telemetry
- **Nutrient Solution Temperature (°C / °F)**: Critical root-zone parameter. Monitors against the dangerous $> 22.0^\circ\text{C}$ threshold where dissolved oxygen drops and *Pythium* (root rot) proliferates.
- **Dissolved Oxygen (DO in mg/L)**: Real-time aeration telemetry ($7.0\text{–}9.0\text{ mg/L}$ nominal). Automatically trips oxygenators when DO drops below $6.5\text{ mg/L}$.
- **Solution pH & Mineral Bioavailability**: Tracks acid/base balance ($5.6\text{–}6.2\text{ pH}$ optimal) to prevent iron, phosphorus, and micronutrient lockout.
- **Electrical Conductivity (EC in mS/cm) & TDS (ppm)**: Measures dissolved mineral salt concentration ($1.6\text{–}2.2\text{ mS/cm}$).
- **Sump Reservoir Fluid Level (%)**: Real-time tank capacity gauge with autonomous pump dry-run cavitation protection when level drops below $25\%$.
- **Tower Manifold Flow Rate & Line Pressure (L/min & PSI)**: Confirms delivery to the uppermost tiers of vertical columns.
- **Oxidation-Reduction Potential (ORP in mV)**: Biological cleanliness and water sanitization index ($\approx 380\text{–}420\text{ mV}$).
- **Dissolved NPK Macro-Minerals**: Real-time concentrations of Nitrate-Nitrogen, Phosphate-Phosphorus, and Potassium ions in solution.

### B. Canopy Microclimate & Atmosphere
- **Ambient Air Temperature (°C / °F)**: With quick Celsius/Fahrenheit switching.
- **Heat Index & Solar Radiation Flux (W/m²)**: Evaluates thermal canopy stress.
- **Relative Air Humidity (%) & Vapour Pressure Deficit (VPD in kPa)**: Guides stomatal transpiration and prevents tipburn.
- **Carbon Dioxide (CO₂ in ppm) & Air Quality (AQI / VOC)**: Monitors photosynthetic carbon assimilation.
- **Photosynthetic Active Radiation (PAR in µmol/m²/s) & Daily Light Integral (DLI in mol/m²/day)**: Quantifies accumulated usable photons across vertical columns.

### C. Solar Power & 48V Battery ESS Telemetry
- **Solar Photovoltaic Generation (Watts)**: Real-time array power generation.
- **PV Array Voltage & Current (Volts & Amperes)**: String health and solar MPPT efficiency tracking.
- **Daily Energy Yield (kWh)**: Cumulative accumulated clean energy generated per diurnal cycle.
- **Battery State of Charge (SoC %)**: 48V LiFePO4 battery bank capacity indicator.
- **Battery Terminal Voltage (V) & Net Current (A)**: Distinguishes charging (+) versus heavy discharge (-).
- **Battery Cell Temperature (°C) & State of Health (SoH %)**: Prevents thermal runaway and tracks aging.
- **Greenhouse Power Load (Watts)**: Real-time demand from pumps, chillers, exhaust fans, and LED arrays.
- **Inverter Operating Mode & Efficiency (%)**: Telemetry for off-grid solar, battery backup, or eco-shedding states.
- **Estimated Reserve Runtime (Hours)**: Predictive battery endurance calculation under current electrical load.

### D. Dual Water Storage Tanks & Filtration Subsystem
- **Freshwater Supply Tank Level (% and Liters)**: Main rainwater/bulk supply reservoir storage monitoring.
- **Raw Water Source TDS (ppm)**: Inlet mineral baseline prior to filtration.
- **Dedicated Nutrient Solution Tank (% and Liters)**: Secondary concentrated reservoir dedicated to recirculating tower feed.
- **Filter Pressure Differential (ΔP in PSI)**: Real-time pressure drop across the media filter (normal: 2–4 PSI; auto-backwash alarm: > 8 PSI).
- **Filter Clogging Index (%) & Flow Rate (L/h)**: Real-time hydraulic throughput and fouling progress.
- **Raw Turbidity vs. Filtered Turbidity (NTU)**: Real-time water clarity purification verification.
- **Reverse Osmosis Membrane Rejection Rate (%)**: Dissolved ion rejection efficiency index (~97.4%).
- **Automated Filter Backwash State**: Real-time status (OPTIMAL, SERVICE DUE, BACKWASH ACTIVE, CLOGGED) and historical flush logs.

---

## 3. Hardware Actuators & Autonomous Control

GreenNet supports both **Autonomous Sensor-Threshold Operation** and **Manual Operator Overrides** (with countdown timers and duration presets):

1. **Tower Recirculation Lift Pump**: Submersible main pump with **Continuous**, **15m ON / 15m OFF Intermittent**, and **Eco Pulse** modes. Features automatic dry-run cavitation cutoff if sump level drops below $25\%$.
2. **Inline Hydroponic Water Chiller / Heater**: Auto-activates whenever nutrient water exceeds $22.0^\circ\text{C}$ to suppress *Pythium* pathogens.
3. **Dissolved Oxygen Micro-Bubbler Aerator**: High-efficiency diffuser that boosts to $100\%$ if DO falls below $6.5\text{ mg/L}$.
4. **Peristaltic Auto-Dosing System**: Autonomous and manual micro-injection for:
   - **pH Down** (Phosphoric Acid)
   - **pH Up** (Potassium Carbonate)
   - **Nutrient Part A & Part B**
5. **Freshwater Transfer Refill Pump**: Transfers filtered water from the primary supply tank into the nutrient mixing tank to balance transpiration losses without interrupting vertical flow.
6. **Automated Filter Backwash Flush Valve**: Automatically trips a 45-second high-velocity reverse purge when differential pressure ($\Delta P$) exceeds $8.0\text{ PSI}$.
7. **Solar ESS Intelligent Eco-Saver**: Autonomous load-shedder that steps down non-critical grow lighting when battery SoC drops below $30\%$, protecting circulation and chilling reliability.
8. **High-Pressure Canopy Foggers & Sprinklers**: Emits micro-droplets to alleviate stomatal stress when humidity falls below $48\%$.
9. **Canopy Exhaust & Air Circulation Fan**: High-volume thermal and CO₂ purge fan.
10. **Vertical UV/LED Photoperiod Array**: Full-spectrum daylight and supplemental grow array.
11. **Emergency Master All-Stop**: Single-click fail-safe kill switch that shuts down all pumps, chillers, foggers, aerators, and lights simultaneously.

---

## 4. Software Features & User Experience

- **Autonomous Threshold Matrix**: Transparent trigger rules linking sensor thresholds directly to hardware responses.
- **Scheduled Irrigation & Hydroponic Cycles**: Program recurring tower pulses, canopy misting, or reservoir refreshes with custom day selection, duration, and moisture safeguard cutoffs.
- **Real-Time Push Notifications & Urgent Alerts**:
  - W3C Web Notifications API integration with one-tap browser permission.
  - Synthesized Web Audio API alert chimes (double-pulse for critical alarms, gentle tones for info).
  - Floating in-app toasts, dismissible top urgency banner, and chronological audit log with severity filters.
- **Interactive Automation Simulation Bench**: One-tap stress-testing for *Warm Water ($24.6^\circ\text{C}$)*, *Low DO ($4.8\text{ mg/L}$)*, *Sump Depletion ($18\%$)*, *pH Drift ($6.85$)*, and *Air Heat ($33.6^\circ\text{C}$)*.
- **Mobile-First Responsive Layout**:
  - Fixed 5-tab ergonomic bottom navigation bar for smartphone thumb zones ($\ge 44\text{px}$ hitboxes).
  - Clean responsive header with a slide-down mobile/tablet drawer that prevents horizontal overflow on portrait screens.
- **Multi-Zone Support**: Toggle between different tower wings (Aeroponic Towers, Vertical NFT Gutters, Nursery Seedling Columns).

---

## 5. 6-Theme Adaptive Display Engine

Operators can switch between 6 purpose-built functional and aesthetic visual profiles:

| Theme | Category | Operational Utility |
| :--- | :--- | :--- |
| **Botanical Dark** | Dark (Default) | Deep forest canvas (`#0b130e`) with emerald accents. Standard balanced mode for 24/7 monitoring. |
| **Daylight Clean** | Light Mode | High-contrast white canvas (`#ffffff`) and slate text. Built for bright sunlight inside glasshouses. |
| **Sunlight High-Contrast** | High Contrast | Pitch OLED black (`#000000`) with luminous lime borders (`#00ff88`). Anti-glare for direct outdoor sun. |
| **Muted Sage** | Low Contrast | Soft desaturated olive-sage tones. Reduces blue-light fatigue during overnight shifts. |
| **Hydro Bio-Lab** | Specialized | Aquatic cyan and deep slate (`#07131b`). Emphasizes water chemistry and nutrient telemetry. |
| **Harvest Amber** | Specialized | Warm obsidian and bronze-amber spectrum (`#13100d`). Minimizes night photoperiod light pollution. |

---

## 6. Build Environment & Technology Stack

- **Runtime & Bundler**: Vite 8, Node.js / Bun
- **Language**: TypeScript 7 (strict type safety)
- **Frontend Framework**: React 19 (Hooks & Context API)
- **Styling**: Tailwind CSS v4 (configured with CSS custom properties for instant theme switching)
- **Icons**: Lucide React
- **Audio Engine**: Web Audio API (frequency-synthesized chimes; zero external MP3 assets)
- **Push Notification API**: Browser-native `Notification` API

---

## 7. Project Structure

```
├── .env.example                       # Runtime environment variable templates
├── index.html                         # HTML entry point with meta tags & typography
├── metadata.json                      # AI Studio applet capabilities & permissions
├── package.json                       # Dependencies & scripts
├── README.md                          # Project documentation (this file)
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite bundler configuration
└── src/
    ├── App.tsx                        # Main application orchestrator & shell
    ├── main.tsx                       # React DOM entry point
    ├── index.css                      # Tailwind 4 setup, typography & CSS theme tokens
    ├── types/
    │   ├── greennet.ts                # TypeScript interfaces for sensors, actuators & schedules
    │   └── theme.ts                   # Theme options, palettes & metadata
    ├── context/
    │   ├── GreenNetContext.tsx        # Central state, telemetry simulator & automation engine
    │   └── ThemeContext.tsx           # Theme persistence & document attribute manager
    ├── utils/
    │   ├── audio.ts                   # Web Audio API synthesized alert chime generator
    │   └── notification.ts            # Web Notifications API bridge
    └── components/
        ├── Header.tsx                 # Responsive top bar & mobile/tablet drawer
        ├── BottomNav.tsx              # Ergonomic mobile bottom tab bar (>=44px hitboxes)
        ├── MetricCard.tsx             # Anti-slop sensor card with inline SVG sparklines
        ├── ActuatorCard.tsx           # Auto/Manual actuator cockpit with sliders & timers
        ├── UrgentAlertBanner.tsx      # Top dismissible critical threshold banner
        ├── PushNotificationToast.tsx  # Floating real-time push alert toasts
        ├── SimulationControls.tsx     # Quick stress-testing simulation bench
        ├── ThemeSelectorModal.tsx     # Interactive visual theme switcher modal
        └── views/
            ├── OverviewView.tsx       # Live vertical hydroponic summary & vital stats
            ├── SensorsView.tsx        # Deep solution chemistry & 24h interactive SVG chart
            ├── ControlsView.tsx       # Full actuator command center & rule matrix
            ├── IrrigationView.tsx     # Tower recirculation scheduler & hydraulic gauge
            └── AlertsView.tsx         # Push notification settings, threshold sliders & logs
```

---

## 8. Getting Started & Development

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### Type-Check & Lint
```bash
npm run lint
```

### Production Build
```bash
npm run build
```

---

*GreenNet: Revised from our major thesis, engineered by Philjoseph Orlina for precision vertical farming and autonomous microclimate intelligence.*
