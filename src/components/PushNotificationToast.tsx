import React, { useEffect, useState } from 'react';
import { useGreenNet } from '../context/GreenNetContext';
import { PushAlert } from '../types/greennet';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const PushNotificationToast: React.FC = () => {
  const { alerts } = useGreenNet();
  const [activeToasts, setActiveToasts] = useState<PushAlert[]>([]);

  // When a new alert arrives in alerts array, if it was created < 4s ago, show toast
  useEffect(() => {
    if (alerts.length > 0) {
      const latest = alerts[0];
      if (latest.timestamp === 'Just now') {
        setActiveToasts((prev) => {
          if (prev.some((t) => t.id === latest.id)) return prev;
          return [latest, ...prev.slice(0, 2)];
        });

        // Auto remove after 5 seconds
        const timer = setTimeout(() => {
          setActiveToasts((prev) => prev.filter((t) => t.id !== latest.id));
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [alerts]);

  const removeToast = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed top-16 sm:top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {activeToasts.map((toast) => {
        const isCritical = toast.severity === 'critical';
        const isWarning = toast.severity === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-top-4 fade-in duration-200 ${
              isCritical
                ? 'bg-red-950/95 border-red-700/80 text-white'
                : isWarning
                ? 'bg-amber-950/95 border-amber-700/80 text-white'
                : 'bg-slate-900/95 border-slate-700/80 text-slate-100'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="shrink-0 mt-0.5">
                {isCritical ? (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                ) : isWarning ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                ) : (
                  <Info className="w-5 h-5 text-emerald-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h5 className="text-xs font-semibold leading-tight truncate">
                    {toast.title}
                  </h5>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    Just now
                  </span>
                </div>
                <p className="text-xs text-slate-200/90 mt-1 line-clamp-2">
                  {toast.message}
                </p>
                {toast.actuatorTriggered && (
                  <div className="mt-1 text-[11px] font-mono font-medium text-emerald-300">
                    ⚡ {toast.actuatorTriggered}
                  </div>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-slate-400 hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
