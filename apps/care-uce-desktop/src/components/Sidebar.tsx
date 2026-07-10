// Location: apps/care-uce-desktop/src/app/components/Sidebar.tsx
import React from 'react';
import { Stethoscope, AlertCircle, FolderOpen, MessageSquareWarning, LogOut } from 'lucide-react';
import { DashboardView } from '../types/clinical';

interface SidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  userEmail: string;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, userEmail, onLogout }) => {
  // Helper to determine active styles
  const getButtonClass = (view: DashboardView) => {
    const baseClass = "w-full flex items-center gap-3 p-3 rounded-lg font-medium transition-colors";
    return activeView === view 
      ? `${baseClass} bg-teal-600 text-white shadow-md` 
      : `${baseClass} text-slate-300 hover:bg-slate-700 hover:text-white`;
  };

  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col shadow-xl z-10 shrink-0">
      <div className="p-6 border-b border-slate-700 flex items-center gap-3">
        <Stethoscope className="text-teal-400" size={28} />
        <div>
          <h1 className="text-xl font-bold tracking-wide">CareUCE</h1>
          <p className="text-xs text-teal-400 font-semibold uppercase tracking-wider">Clinical Space</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        <button onClick={() => onViewChange('triage')} className={getButtonClass('triage')}>
          <AlertCircle size={20} /> Triage Inbox
        </button>
        <button onClick={() => onViewChange('records')} className={getButtonClass('records')}>
          <FolderOpen size={20} /> Medical Records
        </button>
        <button onClick={() => onViewChange('chat')} className={getButtonClass('chat')}>
          <MessageSquareWarning size={20} /> Crisis Channel
        </button>
      </nav>

      <div className="p-4 bg-slate-900 border-t border-slate-700 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center font-bold text-lg shrink-0 uppercase">
            {userEmail.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate" title={userEmail}>{userEmail}</p>
            <p className="text-xs text-slate-400">Clinical Psychology</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors text-sm font-bold shadow-sm"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
};