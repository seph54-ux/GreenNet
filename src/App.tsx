/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GreenNetProvider } from './context/GreenNetContext';
import { ThemeProvider } from './context/ThemeContext';
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

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col antialiased transition-colors duration-200">
      {/* Real-time Push Toast Notifications (Fixed overlay) */}
      <PushNotificationToast />

      {/* Theme Selection Modal */}
      <ThemeSelectorModal />

      {/* Top Navigation Bar */}
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Urgent Alert Banner (Conditionally rendered when critical thresholds trigger) */}
      <UrgentAlertBanner onNavigateToControls={() => setCurrentTab('controls')} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-4 md:py-6 pb-24 md:pb-12">
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
      <footer className="hidden md:block border-t border-[var(--border-theme)] py-6 text-center text-xs text-[var(--text-muted)] font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GreenNet Autonomous Vertical Hydroponics & Microclimate Loop</span>
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
