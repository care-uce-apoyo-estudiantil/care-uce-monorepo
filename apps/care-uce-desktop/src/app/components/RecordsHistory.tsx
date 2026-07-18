// Location: apps/care-uce-desktop/src/app/components/RecordsHistory.tsx
import React, { useState, useEffect } from 'react';
import { Search, Eye, Download, FileText, Activity } from 'lucide-react';
import { PatientRecord } from '../../types/clinical';
import triageService from '../../services/triage.service';
import { ExpedienteClinico } from '../ExpedienteClinico';

export const RecordsHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [resolvedCases, setResolvedCases] = useState<PatientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(
    null,
  );

  // Fetch resolved cases securely on mount
  useEffect(() => {
    const loadRecords = async () => {
      setIsLoading(true);
      try {
        const records = await triageService.getResolvedCases();
        setResolvedCases(records);
      } catch (error) {
        console.error('Failed to load resolved clinical records:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRecords();
  }, []);

  // Isolate records based on ID or Name
  const filteredRecords = resolvedCases.filter(
    (record) =>
      record.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Trigger native OS print layout for PDF generation
  const handleDownloadPDF = () => {
    window.print();
  };

  // If a record is selected, show the read-only clinical file
  if (selectedRecord) {
    return (
      <ExpedienteClinico
        paciente={selectedRecord}
        isReadOnly={true}
        onVolver={() => setSelectedRecord(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans print:bg-white print:p-0">
      {/* Header Panel - Excluded from PDF Print */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0 print:hidden">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
          <FileText size={24} className="text-teal-600" />
          Clinical History Repository
        </h2>
        <div className="relative w-96">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by ID or Patient Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-slate-50 transition-all"
          />
        </div>
      </header>

      {/* Main Data Table */}
      <div className="flex-1 p-8 overflow-y-auto print:p-0 print:overflow-visible">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none">
          {/* Institutional Print Layout - Only visible when generating PDF */}
          <div className="hidden print:flex items-center justify-between border-b-2 border-slate-800 pb-4 m-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                UNIVERSIDAD CENTRAL DEL ECUADOR
              </h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ecosistema CareUCE — Historial Clínico Estudiantil
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">
                Date: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-16 text-slate-400 gap-4">
              <Activity className="animate-spin text-teal-500" size={36} />
              <p className="font-medium">Loading historical records...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider print:bg-white print:text-slate-800">
                <tr>
                  <th className="px-8 py-5">Expedient ID</th>
                  <th className="px-8 py-5">Patient Name</th>
                  <th className="px-8 py-5">Date Resolved</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right print:hidden">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-8 py-5 font-mono text-sm text-teal-700 font-bold">
                        EXP-{record.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="px-8 py-5 font-bold text-slate-800">
                        {record.paciente}
                      </td>
                      <td className="px-8 py-5 text-slate-600 font-medium text-sm">
                        {new Date(
                          record.fechaAtencion || Date.now(),
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wide">
                          {record.estado}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right print:hidden">
                        <div className="flex items-center justify-end gap-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setSelectedRecord(record)}
                            className="hover:text-teal-600 transition-colors p-2 hover:bg-teal-50 rounded-full"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRecord(record);
                              setTimeout(() => handleDownloadPDF(), 500);
                            }}
                            className="hover:text-teal-600 transition-colors p-2 hover:bg-teal-50 rounded-full"
                            title="Export PDF"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-8 py-16 text-center text-slate-500 font-medium"
                    >
                      No clinical records found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
