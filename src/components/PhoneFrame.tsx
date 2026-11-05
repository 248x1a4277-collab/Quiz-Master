import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Volume2, VolumeX, Smartphone, Monitor } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface PhoneFrameProps {
  children: React.ReactNode;
  isFramed: boolean;
  onToggleFrame: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  isFramed,
  onToggleFrame,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('9:41');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sound.isEnabled());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const next = sound.toggle();
    setSoundEnabled(next);
  };

  if (!isFramed) {
    return (
      <div className="w-full min-h-screen bg-slate-900 flex flex-col">
        {/* Fullscreen Toolbar */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-indigo-400">QuizMaster Engine</span>
            <span>·</span>
            <span>Flutter 3.35 Android Runtime Simulation</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSound}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {soundEnabled ? <Volume2 size={14} className="text-emerald-400" /> : <VolumeX size={14} className="text-slate-500" />}
              <span>{soundEnabled ? 'Sound ON' : 'Muted'}</span>
            </button>
            <button
              onClick={onToggleFrame}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
            >
              <Smartphone size={14} />
              <span>Switch to Phone Frame</span>
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 w-full max-w-xl mx-auto bg-slate-50 flex flex-col shadow-2xl relative">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 py-6 px-4 flex flex-col items-center justify-center">
      {/* Frame Controls Bar */}
      <div className="mb-4 flex items-center justify-between w-full max-w-[420px] text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-slate-300">Android 14 (API 34)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            aria-label="Toggle Sound"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            title={soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {soundEnabled ? <Volume2 size={15} className="text-emerald-400" /> : <VolumeX size={15} className="text-slate-500" />}
          </button>
          <button
            onClick={onToggleFrame}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            title="Expand to Fullscreen"
          >
            <Monitor size={14} />
            <span>Expand</span>
          </button>
        </div>
      </div>

      {/* Android Device Outer Chassis */}
      <div className="relative w-full max-w-[400px] h-[820px] max-h-[92vh] bg-slate-950 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.1),0_0_40px_rgba(99,102,241,0.25)] flex flex-col">
        {/* Subtle Edge Reflection */}
        <div className="absolute inset-0 rounded-[48px] pointer-events-none border border-white/10" />

        {/* Device Screen Frame */}
        <div className="relative flex-1 bg-slate-50 rounded-[38px] overflow-hidden flex flex-col border border-slate-900/40">
          {/* Android Status Bar */}
          <div className="h-10 bg-slate-900/90 text-white px-6 flex items-center justify-between text-xs select-none z-30 shrink-0 backdrop-blur-md">
            <span className="font-semibold tracking-tight">{currentTime}</span>

            {/* Camera Hole Punch */}
            <div className="w-4 h-4 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-950/80"></div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider opacity-90">5G</span>
              <Wifi size={13} className="opacity-90" />
              <Battery size={14} className="opacity-90" />
            </div>
          </div>

          {/* Screen Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col relative bg-slate-50">
            {children}
          </div>

          {/* Android Bottom Navigation Pill Bar */}
          <div className="h-5 bg-slate-50 flex items-center justify-center pb-1 shrink-0">
            <div className="w-32 h-1 bg-slate-400/60 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
