// Location: apps/care-uce-desktop/src/app/components/CrisisChat.tsx
import React from 'react';
import { Send, AlertTriangle } from 'lucide-react';

export const CrisisChat: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      <header className="h-16 border-b flex items-center justify-between px-8 bg-slate-50 shrink-0">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-red-500" size={24} />
          <h2 className="text-lg font-bold text-slate-800">
            Active Emergency Channels
          </h2>
        </div>
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
          1 Active Alert
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat List */}
        <div className="w-1/3 border-r bg-slate-50 overflow-y-auto">
          <div className="p-4 border-b bg-red-50/50 cursor-pointer hover:bg-red-50">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-bold text-slate-800">
                Anonymous Student #842
              </h4>
              <span className="text-xs font-bold text-red-600">Now</span>
            </div>
            <p className="text-sm text-slate-600 truncate">
              Panic button activated. Geolocation attached.
            </p>
          </div>
        </div>

        {/* Chat Room */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto bg-slate-100/50 space-y-4">
            <div className="flex justify-start">
              <div className="bg-white border border-red-200 p-4 rounded-lg shadow-sm max-w-md">
                <p className="text-sm font-bold text-red-600 mb-1">
                  SYSTEM ALERT
                </p>
                <p className="text-sm text-slate-700">
                  Panic button triggered from Engineering Faculty. High heart
                  rate detected via telemetry.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-teal-600 text-white p-4 rounded-lg shadow-sm max-w-md">
                <p className="text-sm">
                  Hello. I am the clinical psychologist on duty. Are you safe
                  right now? We are sending protocol support.
                </p>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="h-20 border-t p-4 bg-white flex items-center gap-4">
            <input
              type="text"
              placeholder="Type your containment message here..."
              className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
            />
            <button className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-lg transition-colors">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
