import React from 'react';
import { useGreenNet } from '../context/GreenNetContext';
import { AlertTriangle, ArrowRight, X, Zap } from 'lucide-react';

interface UrgentAlertBannerProps {
  onNavigateToControls?: () => void;
}

export const UrgentAlertBanner: React.FC<UrgentAlertBannerProps> = ({ onNavigateToControls }) => {
  const { activeUrgentAlert, dismissUrgentAlert } = useGreenNet();

  if (!activeUrgentAlert) return null;

  return (
    <div className="w-full bg-gradient-to-r from-red-950/90 via-red-900/80 to-amber-950/90 border-b border-red-700/60 px-4 py-3 text-white transition-all shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-300 shrink-0 mt-0.5 sm:mt-0 animate-pulse">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider font-bold text-red-200 bg-red-900/60 px-1.5 py-0.5 rounded">
                Urgent Alert
              </span>
              <h4 className="text-sm font-semibold text-white">{activeUrgentAlert.title}</h4>
            </div>
            <p className="text-xs text-red-100/90 mt-0.5">{activeUrgentAlert.message}</p>
            {activeUrgentAlert.actuatorTriggered && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-200 mt-1">
                <Zap className="w-3 h-3 text-amber-300" />
                <span>Automated Response: {activeUrgentAlert.actuatorTriggered}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          {onNavigateToControls && (
            <button
              onClick={onNavigateToControls}
              className="px-3 py-1.5 bg-white text-red-950 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap min-h-[36px]"
            >
              <span>Controls</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={dismissUrgentAlert}
            title="Acknowledge Alert"
            className="p-1.5 text-red-200 hover:text-white hover:bg-red-800/40 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
