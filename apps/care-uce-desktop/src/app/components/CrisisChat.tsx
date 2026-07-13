// Location: apps/care-uce-desktop/src/app/components/CrisisChat.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, AlertTriangle, User, Activity } from 'lucide-react';
import triageService from '../../services/triage.service';
import { PatientRecord } from '../../types/clinical';

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
}

export const CrisisChat: React.FC = () => {
  const [activePatient, setActivePatient] = useState<PatientRecord | null>(
    null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Synchronize Active Patient from Triage Queue
  const fetchLatestAlert = useCallback(async () => {
    try {
      const cases = await triageService.getActiveCases();
      if (cases.length > 0) {
        const latest = cases[cases.length - 1];

        // Prevent state thrashing if patient hasn't changed
        if (!activePatient || activePatient.id !== latest.id) {
          setActivePatient(latest);
        }
      } else {
        setActivePatient(null);
        setMessages([]);
      }
    } catch (error) {
      console.warn('Polling fallback to active patient failed.', error);
    }
  }, [activePatient]);

  // Sync active patient on interval
  useEffect(() => {
    fetchLatestAlert();
    const alertInterval = setInterval(fetchLatestAlert, 5000);
    return () => clearInterval(alertInterval);
  }, [fetchLatestAlert]);

  // Dedicated Chat Sync Polling
  useEffect(() => {
    if (!activePatient) return;

    const fetchChatMessages = async () => {
      try {
        const chatData = await triageService.getChat(activePatient.id);
        setMessages(chatData);
      } catch (error) {
        console.warn('Silent chat polling failure:', error);
      }
    };

    fetchChatMessages();
    // Fast polling for near real-time interaction
    const chatInterval = setInterval(fetchChatMessages, 2500);
    return () => clearInterval(chatInterval);
  }, [activePatient]);

  // Auto-scroll handler
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activePatient || isSending) return;

    const tempText = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      await triageService.sendChatMessage(activePatient.id, tempText);
      // Force immediate refresh after sending
      const updatedChat = await triageService.getChat(activePatient.id);
      setMessages(updatedChat);
    } catch (error) {
      console.error('Error dispatching message:', error);
      setInputText(tempText); // Restore input if failed
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans">
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
          <AlertTriangle size={24} className="text-red-600" /> Active Emergency
          Channels
        </h2>
        {activePatient ? (
          <span className="px-4 py-2 bg-red-50 text-red-700 text-xs font-black uppercase tracking-wider rounded-full border border-red-200 shadow-sm animate-pulse">
            1 Active Alert
          </span>
        ) : (
          <span className="px-4 py-2 bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider rounded-full">
            Standby
          </span>
        )}
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
          {activePatient ? (
            <div className="p-6 border-b border-slate-100 bg-red-50/40 border-l-4 border-l-red-500">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    <User size={16} />
                  </div>
                  <h3 className="font-bold text-slate-900 truncate max-w-[160px]">
                    {activePatient.paciente}
                  </h3>
                </div>
                <span className="text-xs font-black text-red-600 animate-pulse">
                  LIVE
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Academic Context
              </p>
              <p className="text-sm text-slate-700 font-medium truncate">
                {activePatient.carrera}
              </p>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-3">
              <Activity size={32} className="opacity-50" />
              <p className="text-sm font-medium">
                Monitoring inbound connections...
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col bg-slate-50/50">
          <div className="flex-1 p-8 overflow-y-auto space-y-6">
            {!activePatient ? (
              <div className="h-full flex items-center justify-center text-slate-400 font-medium">
                No active session parameters detected.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-4 shadow-sm ${msg.sender === 'doctor' ? 'bg-teal-600 text-white rounded-2xl rounded-br-none' : msg.sender === 'system' ? 'bg-white border border-red-200 text-slate-800 rounded-xl w-full text-center' : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-none'}`}
                  >
                    {msg.sender === 'system' && (
                      <p className="text-xs font-black text-red-600 mb-2 tracking-wider flex items-center justify-center gap-2">
                        <AlertTriangle size={14} /> SYSTEM TELEMETRY
                      </p>
                    )}
                    <p
                      className={`text-[15px] leading-relaxed ${msg.sender === 'doctor' ? 'text-white' : 'text-slate-800 font-medium'}`}
                    >
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 bg-white border-t border-slate-200">
            <div className="flex items-center gap-4 max-w-4xl mx-auto">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={!activePatient || isSending}
                placeholder={
                  activePatient
                    ? 'Escribe un mensaje de contención...'
                    : 'Esperando conexión...'
                }
                className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!activePatient || !inputText.trim() || isSending}
                className="p-4 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 shadow-md disabled:opacity-50 transition-all flex items-center justify-center min-w-[56px]"
              >
                {isSending ? (
                  <Activity className="animate-spin" size={20} />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
