import React, { useState } from 'react';
import { useGreenNet } from '../context/GreenNetContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sprout,
  Bell,
  Volume2,
  VolumeX,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  Palette,
  LayoutDashboard,
  Activity,
  Sliders,
  Droplet,
  OctagonX,
  Check,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab }) => {
  const {
    zones,
    activeZoneId,
    setActiveZoneId,
    tempUnit,
    setTempUnit,
    soundEnabled,
    setSoundEnabled,
    unreadAlertCount,
    activeUrgentAlert,
    isLiveStreaming,
    setIsLiveStreaming,
    emergencyAllStop,
  } = useGreenNet();

  const { themeConfig, setIsThemeModalOpen } = useTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'sensors', label: 'Sensors', icon: Activity },
    { id: 'controls', label: 'Controls', icon: Sliders },
    { id: 'irrigation', label: 'Hydro Cycles', icon: Droplet },
    { id: 'alerts', label: 'Alerts & Rules', icon: Bell, badge: unreadAlertCount },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[var(--bg-header)] backdrop-blur-md border-b border-[var(--border-theme)] transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Zone 1: Wordmark & Compact Zone Selector */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('overview')}
              className="flex items-center gap-2 shrink-0 group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg)] border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-color)] group-hover:scale-105 transition-all">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-base sm:text-lg tracking-tight text-[var(--text-primary)]">
                  GreenNet
                </span>
                <span className="hidden xs:inline text-[9px] uppercase font-mono tracking-widest text-[var(--accent-color)] font-semibold">
                  Hydro
                </span>
              </div>
            </button>

            <span className="hidden sm:inline text-[var(--text-muted)]">|</span>

            {/* Responsive Zone Selector */}
            <div className="relative max-w-[110px] xs:max-w-[140px] sm:max-w-[180px] md:max-w-[210px] min-w-0">
              <select
                aria-label="Greenhouse Zone"
                value={activeZoneId}
                onChange={(e) => setActiveZoneId(e.target.value)}
                className="w-full appearance-none bg-[var(--bg-surface-subtle)] hover:bg-[var(--accent-bg)] text-[var(--text-primary)] text-xs font-medium pl-2.5 pr-6 py-1.5 rounded-lg border border-[var(--border-theme)] focus:outline-none focus:border-[var(--accent-color)] transition-colors cursor-pointer truncate"
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                    {zone.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--accent-color)] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Zone 2: Desktop Navigation Links (Only on lg: screens >= 1024px) */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap relative ${
                    isActive
                      ? 'text-[var(--text-primary)] bg-[var(--accent-bg)] border border-[var(--accent-color)]/60 shadow-sm font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]'
                  }`}
                >
                  {link.label}
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Mobile/Tablet Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Theme Selector Trigger */}
            <button
              onClick={() => setIsThemeModalOpen(true)}
              title={`Active Theme: ${themeConfig.name} (Click to customize)`}
              className="h-8 px-2 sm:px-2.5 rounded-lg bg-[var(--bg-surface-subtle)] hover:bg-[var(--accent-bg)] border border-[var(--border-theme)] text-xs text-[var(--text-primary)] transition-colors flex items-center gap-1.5 min-h-[36px]"
            >
              <Palette className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span className="hidden xl:inline text-[11px] font-medium">{themeConfig.name}</span>
            </button>

            {/* Live Status Indicator */}
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              title={isLiveStreaming ? 'Live data streaming active (Click to pause)' : 'Paused (Click to resume)'}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-md border transition-all ${
                isLiveStreaming
                  ? 'bg-[var(--accent-bg)] text-[var(--accent-color)] border-[var(--border-theme-strong)]'
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/40'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveStreaming ? 'bg-[var(--accent-color)] animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="hidden md:inline">{isLiveStreaming ? 'LIVE' : 'PAUSED'}</span>
            </button>

            {/* Unit Toggle */}
            <button
              onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
              title="Toggle Temperature Unit"
              className="hidden sm:flex h-8 px-2.5 rounded-lg bg-[var(--bg-surface-subtle)] hover:bg-[var(--accent-bg)] border border-[var(--border-theme)] text-xs font-mono font-medium text-[var(--text-primary)] transition-colors items-center justify-center min-h-[36px]"
            >
              °{tempUnit}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute alert chimes' : 'Unmute alert chimes'}
              className="hidden sm:flex w-8 h-8 rounded-lg bg-[var(--bg-surface-subtle)] hover:bg-[var(--accent-bg)] border border-[var(--border-theme)] text-[var(--text-secondary)] transition-colors items-center justify-center min-h-[36px]"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[var(--accent-color)]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[var(--text-muted)]" />
              )}
            </button>

            {/* Alerts Bell */}
            <button
              onClick={() => handleNavClick('alerts')}
              title="Push Notifications & Thresholds"
              className={`relative w-8 h-8 sm:w-8 sm:h-8 rounded-lg border transition-colors flex items-center justify-center min-h-[36px] min-w-[36px] ${
                activeUrgentAlert
                  ? 'bg-red-950/60 border-red-700/60 text-red-400 animate-pulse'
                  : unreadAlertCount > 0
                  ? 'bg-amber-950/50 border-amber-700/50 text-amber-400'
                  : 'bg-[var(--bg-surface-subtle)] hover:bg-[var(--accent-bg)] border border-[var(--border-theme)] text-[var(--text-primary)]'
              }`}
            >
              {activeUrgentAlert ? (
                <ShieldAlert className="w-4 h-4" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white font-mono text-[9px] font-bold flex items-center justify-center">
                  {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
                </span>
              )}
            </button>

            {/* Responsive Hamburger Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden p-2 rounded-lg bg-[var(--bg-surface-subtle)] hover:bg-[var(--accent-bg)] border border-[var(--border-theme)] text-[var(--text-primary)] transition-colors flex items-center justify-center min-h-[38px] min-w-[38px]"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[var(--accent-color)]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Mobile & Tablet Slide-Down Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-theme)] bg-[var(--bg-header)] backdrop-blur-xl px-4 py-4 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          {/* Section 1: Navigation Destinations */}
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] mb-2">
              Navigation
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentTab === link.id;

                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
                      isActive
                        ? 'bg-[var(--accent-bg)] border border-[var(--accent-color)]/60 text-[var(--text-primary)] font-semibold'
                        : 'bg-[var(--bg-surface-subtle)] hover:bg-[var(--accent-bg)] text-[var(--text-secondary)] border border-[var(--border-theme)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-[var(--accent-color)]' : 'text-[var(--text-muted)]'
                        }`}
                      />
                      <span>{link.label}</span>
                    </div>

                    {link.badge !== undefined && link.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs font-mono font-bold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Visual Theme Picker */}
          <div className="pt-2 border-t border-[var(--border-theme)]">
            <div className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] mb-2 flex items-center justify-between">
              <span>Display Theme Profile</span>
              <span className="text-[var(--accent-color)] font-mono">{themeConfig.name}</span>
            </div>
            <button
              onClick={() => {
                setIsThemeModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)] hover:border-[var(--accent-color)] transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <Palette className="w-4 h-4 text-[var(--accent-color)]" />
                <div className="text-left">
                  <div className="font-semibold text-[var(--text-primary)]">Change Display Theme</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{themeConfig.utility}</div>
                </div>
              </div>
              <span className="text-xs font-mono text-[var(--accent-color)] font-semibold">Select ➜</span>
            </button>
          </div>

          {/* Section 3: Greenhouse Zone Switcher */}
          <div className="pt-2 border-t border-[var(--border-theme)]">
            <div className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] mb-2">
              Select Active Tower Wing
            </div>
            <div className="space-y-1.5">
              {zones.map((zone) => {
                const isSelected = zone.id === activeZoneId;
                return (
                  <button
                    key={zone.id}
                    onClick={() => {
                      setActiveZoneId(zone.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs text-left transition-colors border ${
                      isSelected
                        ? 'bg-[var(--accent-bg)] border-[var(--accent-color)]/60 text-[var(--text-primary)]'
                        : 'bg-[var(--bg-surface-subtle)] border-[var(--border-theme)] text-[var(--text-secondary)] hover:bg-[var(--accent-bg)]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-[var(--text-primary)]">{zone.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{zone.cropType} · {zone.systemType}</div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Quick System Settings Row */}
          <div className="pt-2 border-t border-[var(--border-theme)]">
            <div className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] mb-2">
              System Settings & Controls
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* Temp Unit Toggle */}
              <button
                onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)] text-xs text-[var(--text-primary)] transition-colors min-h-[44px]"
              >
                <span>Temperature Unit</span>
                <span className="font-mono font-bold text-[var(--accent-color)]">°{tempUnit}</span>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)] text-xs text-[var(--text-primary)] transition-colors min-h-[44px]"
              >
                <span>Alert Audio</span>
                <span className="font-mono font-bold text-[var(--accent-color)]">
                  {soundEnabled ? 'ON' : 'MUTED'}
                </span>
              </button>

              {/* Live Streaming Toggle */}
              <button
                onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-theme)] text-xs text-[var(--text-primary)] transition-colors min-h-[44px]"
              >
                <span>Telemetry Stream</span>
                <span
                  className={`font-mono font-bold ${
                    isLiveStreaming ? 'text-[var(--accent-color)]' : 'text-amber-400'
                  }`}
                >
                  {isLiveStreaming ? 'ACTIVE' : 'PAUSED'}
                </span>
              </button>

              {/* Master Emergency Stop */}
              <button
                onClick={() => {
                  emergencyAllStop();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-200 hover:bg-red-900/60 transition-colors min-h-[44px]"
              >
                <span>Emergency Stop</span>
                <OctagonX className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
