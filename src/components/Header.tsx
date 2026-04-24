import React, { useState } from 'react';
import { MasterLogo } from './MasterLogo';
import { ThemeConfig } from '../types';
import { RefreshCw, Zap, FileText, User as UserIcon, Download, Unlock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface HeaderProps {
  theme: ThemeConfig;
  syncId: string;
  syncKey: string;
  onSyncIdChange: (id: string) => void;
  onSyncKeyChange: (key: string) => void;
  onAuthClick: () => void; // This will now serve as "Force Load/Connect"
  isLoggedIn: boolean;
  userEmail?: string;
  onLogout: () => void;
  isSyncing: boolean;
  onOpenCalendar: () => void;
  onQuickAdd: () => void;
  onExport: () => void;
  onImport: () => void;
  onSyncIcal: () => void;
  onExportAll: () => void;
  onSyncGoogle: () => void;
  onExportReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  syncId,
  syncKey,
  onSyncIdChange,
  onSyncKeyChange,
  onAuthClick,
  isLoggedIn,
  userEmail,
  onLogout,
  isSyncing,
  onOpenCalendar,
  onQuickAdd,
  onExport,
  onImport,
  onSyncIcal,
  onExportAll,
  onSyncGoogle,
  onExportReport
}) => {
  const currentDate = new Date();
  const [showSyncEdit, setShowSyncEdit] = useState(!syncId);

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 shrink-0 gap-4 mt-4 relative">

      <div>
        <div className="flex items-center gap-3">
          <MasterLogo size={44} className="text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center">
              DT 时间管理大师 <span className="text-accent text-[10px] font-mono align-top ml-2 bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20 uppercase">2026 Elite</span>
            </h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-medium leading-none mt-0.5">Tactical Time Matrix Dashboard</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-slate-100">{format(currentDate, 'EEEE, MMMM dd')}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">{format(currentDate, 'hh:mm a')} · System Online</p>
        </div>
        
        <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-2 mr-2 bg-slate-800/40 p-1.5 rounded-2xl border transition-all min-w-[160px]",
              isSyncing ? "border-blue-500 animate-pulse shadow-lg shadow-blue-500/10" : "border-slate-700"
            )}>
              <div 
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer",
                  isLoggedIn ? "bg-emerald-500/20 text-emerald-500" : (syncId ? "bg-blue-500/20 text-blue-500" : "bg-slate-700 text-slate-400 hover:bg-blue-600/30")
                )} 
                onClick={isLoggedIn ? onLogout : onAuthClick} 
                title={isLoggedIn ? "Logout" : "Cloud Sync (Manual Force Load)"}
              >
                {isSyncing ? <RefreshCw size={16} className="animate-spin" /> : (syncId ? <Download size={16} /> : <Unlock size={16} />)}
              </div>
              <div className="flex flex-col flex-1">
                {showSyncEdit ? (
                  <div className="flex flex-col gap-1 pr-2">
                    <input 
                      autoFocus
                      className="bg-transparent text-[10px] text-white font-bold outline-none border-b border-blue-500/50 w-full placeholder:text-slate-600"
                      placeholder="Account ID (Sync ID)"
                      value={syncId}
                      onChange={(e) => onSyncIdChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setShowSyncEdit(false);
                          onAuthClick(); 
                        }
                      }}
                    />
                    <div className="flex gap-2 items-center">
                      <input 
                        className="bg-transparent text-[9px] text-blue-400 font-medium outline-none border-b border-white/10 flex-1 placeholder:text-slate-600"
                        placeholder="Secret Key (Password)"
                        type="password"
                        value={syncKey}
                        onChange={(e) => onSyncKeyChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && setShowSyncEdit(false)}
                      />
                      <button 
                        onClick={() => {
                          const link = `${window.location.origin}${window.location.pathname}?syncId=${encodeURIComponent(syncId)}&syncKey=${encodeURIComponent(syncKey)}`;
                          navigator.clipboard.writeText(link);
                          // We don't have showToast here, maybe it should be passed or we alert
                          alert("Sync Link Copied to Clipboard!\nSend this to your other devices.");
                        }}
                        className="text-[8px] bg-slate-700 px-1.5 py-0.5 rounded text-white font-bold hover:bg-slate-600"
                      >
                        COPY LINK
                      </button>
                      <button 
                        onClick={() => {
                          onAuthClick();
                          setShowSyncEdit(false);
                        }}
                        className="text-[8px] bg-blue-600 px-1.5 py-0.5 rounded text-white font-bold"
                      >
                        CONNECT
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span 
                      onClick={() => setShowSyncEdit(true)}
                      className="text-[10px] text-slate-300 font-bold truncate max-w-[100px] cursor-pointer hover:text-blue-400 group flex items-center gap-1"
                    >
                      {isLoggedIn ? userEmail : (syncId || 'Local Only')}
                      <span className="opacity-0 group-hover:opacity-100 text-[8px] text-blue-500 font-black">EDIT</span>
                    </span>
                    <div className="flex items-center gap-2">
                       <span className="text-[8px] text-slate-500 uppercase tracking-tighter">
                        {isSyncing ? 'Syncing...' : (syncId ? 'Cloud Active' : 'Setup Sync')}
                      </span>
                      {syncId && !isSyncing && (
                        <button 
                          onClick={onAuthClick}
                          className="text-[7px] text-blue-500 border border-blue-500/30 px-1 rounded hover:bg-blue-500/10"
                        >
                          DOWNLOAD DATA
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button 
             onClick={onSyncIcal}
             className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-500 flex items-center justify-center border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-900/20 group"
             title="一键同步 Apple 日历 (Sync Apple Calendar)"
           >
              <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
           </button>
           <button 
             onClick={onExportReport}
             className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-500 flex items-center justify-center border border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-900/20 group"
             title="导出周报 (Export Weekly Report)"
           >
              <FileText size={20} className="group-hover:scale-110 transition-transform" />
           </button>
           <button 
             onClick={onQuickAdd}
             className="w-10 h-10 rounded-2xl bg-accent/20 text-accent flex items-center justify-center border border-accent/20 hover:bg-accent hover:text-white transition-all shadow-lg shadow-accent/20 group"
             title="快速添加"
           >
              <Zap size={20} className="group-hover:scale-110 transition-transform" />
           </button>
        </div>
      </div>
    </header>
  );
};
