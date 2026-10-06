/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GreenNetProvider } from './context/GreenNetContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { UrgentAlertBanner } from './components/UrgentAlertBanner';
import { PushNotificationToast } from './components/PushNotificationToast';
import { SimulationControls } from './components/SimulationControls';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { OverviewView } from './components/views/OverviewView';
import { SensorsView } from './components/views/SensorsView';
import { ControlsView } from './components/views/ControlsView';
import { IrrigationView } from './components/views/IrrigationView';
import { AlertsView } from './components/views/AlertsView';

function GreenNetDashboard() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const { currentTheme } = useTheme();

  return (
    <div className="min-h-screen relative bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col antialiased transition-colors duration-300">
      {/* Opulent Glassmorphic Atmospheric Botanical Background Layer */}
      {currentTheme === 'opulent-glass' && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
          <img
            src="/src/assets/images/luxury_greenhouse_bg_1791272641703.jpg"
            alt="Opulent Greenhouse Atrium"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105 animate-subtle-drift motion-reduce:transform-none"
          />
          {/* Multi-layered Frosted Vignette & Obsidian Tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020704]/70 via-[#030906]/60 to-[#010402]/92" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.15)_0%,_transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.18)_0%,_transparent_70%)]" />
          {/* Subtle Golden-Emerald Dust Glow Particles */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_35%,_rgba(212,175,55,0.22)_0%,_transparent_40%),_radial-gradient(circle_at_80%_65%,_rgba(52,211,153,0.18)_0%,_transparent_50%)] animate-pulse-slow" />
        </div>
      )}

      {/* Real-time Push Toast Notifications (Fixed overlay) */}
      <PushNotificationToast />

      {/* Theme Selection Modal */}
      <ThemeSelectorModal />

      {/* Top Navigation Bar */}
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Urgent Alert Banner (Conditionally rendered when critical thresholds trigger) */}
      <UrgentAlertBanner onNavigateToControls={() => setCurrentTab('controls')} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-4 md:py-6 pb-24 md:pb-12 relative z-10">
        {/* Quick Automation Stress-Test & Simulation Bench */}
        <SimulationControls />

        {/* View Switcher */}
        {currentTab === 'overview' && (
          <OverviewView onNavigateToTab={(tab) => setCurrentTab(tab)} />
        )}
        {currentTab === 'sensors' && <SensorsView />}
        {currentTab === 'controls' && <ControlsView />}
        {currentTab === 'irrigation' && <IrrigationView />}
        {currentTab === 'alerts' && <AlertsView />}
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on desktop/tablet) */}
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Quiet Desktop/Tablet Footer */}
      <footer className="hidden md:block border-t border-[var(--border-theme)] py-6 text-center text-xs text-[var(--text-muted)] font-mono relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 justify-center">
            <span>GreenNet Autonomous Vertical Hydroponics & Microclimate Loop</span>
            {currentTheme === 'opulent-glass' && (
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300">
                Imperial Glass Suite
              </span>
            )}
          </span>
          <span>Adaptive Display Profile Active · High-Reliability Telemetry</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <GreenNetProvider>
        <GreenNetDashboard />
      </GreenNetProvider>
    </ThemeProvider>
  );
}
