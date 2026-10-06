import React from 'react';
import { LayoutDashboard, Activity, Sliders, Droplet, Bell } from 'lucide-react';
import { useGreenNet } from '../context/GreenNetContext';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { unreadAlertCount, activeUrgentAlert } = useGreenNet();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'sensors', label: 'Sensors', icon: Activity },
    { id: 'controls', label: 'Controls', icon: Sliders },
    { id: 'irrigation', label: 'Hydro', icon: Droplet },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unreadAlertCount },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-header)] backdrop-blur-lg border-t border-[var(--border-theme)] pb-safe w-full max-w-full overflow-hidden transition-colors">
      <div className="grid grid-cols-5 h-16 items-center px-1 w-full max-w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          const hasUrgent = tab.id === 'alerts' && activeUrgentAlert !== null;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`min-h-[48px] min-w-[44px] flex flex-col items-center justify-center relative transition-colors ${
                isActive
                  ? 'text-[var(--accent-color)] font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`absolute -top-1 -right-2 px-1 min-w-[16px] h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center text-white ${
                      hasUrgent ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-4 h-0.5 rounded-full bg-[var(--accent-color)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
