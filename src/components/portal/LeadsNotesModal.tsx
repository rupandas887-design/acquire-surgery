import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lead, AuthUser } from '../../types';
import { EASE_SMOOTH } from '../MotionPrimitives';
import { api } from '../../services/api';
import {
  FileText,
  X,
  Send,
  Clock,
  AlertCircle,
  Calendar,
} from 'lucide-react';

interface LeadsNotesModalProps {
  lead: Lead;
  currentUser: AuthUser;
  onClose: () => void;
  onLeadUpdated: (updatedLead: Lead) => void;
}

export const LeadsNotesModal: React.FC<LeadsNotesModalProps> = ({
  lead,
  currentUser,
  onClose,
  onLeadUpdated,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [followUpDate, setFollowUpDate] = useState(lead.followUpDate || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() && followUpDate === (lead.followUpDate || '')) return;

    setIsSubmitting(true);
    setError('');
    try {
      const updatedLead = await api.updateLead(lead.id, {
        note: newNoteText.trim() || undefined,
        followUpDate,
        authorName: currentUser.name || 'Admin',
      });
      onLeadUpdated(updatedLead);
      setNewNoteText('');
      if (!newNoteText.trim()) {
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save remarks or follow-up date');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <motion.div
        id="leads-notes-modal"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22, ease: EASE_SMOOTH }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-[#062B61] px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-teal-300" />
            <div>
              <h2 className="text-sm font-bold text-white">
                Internal Remarks &amp; Follow-up
              </h2>
              <p className="text-xs text-blue-100">
                <span className="font-mono">{lead.leadCode || lead.id.slice(-6)}</span> · {lead.name} ({lead.condition || lead.treatment})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Summary Strip */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-3 gap-2 shrink-0">
          <div>
            <span className="text-slate-500 block">Mobile</span>
            <strong className="font-mono text-slate-900 tabular-nums">{lead.mobile}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Budget</span>
            <strong className="text-slate-900">{lead.budget}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Insurance</span>
            <strong className="text-slate-900">
              {lead.insuranceStatus || 'Not Sure'}
              {lead.insuranceCompany ? ` (${lead.insuranceCompany})` : ''}
            </strong>
          </div>
        </div>

        {/* Notes Timeline */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Remarks History ({lead.notes?.length || 0})
          </h3>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!lead.notes || lead.notes.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No internal remarks added yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {lead.notes.map((noteStr, idx) => {
                const bracketMatch = noteStr.match(/^\[(.*?)\]\s*(.*)$/);
                const meta = bracketMatch ? bracketMatch[1] : '';
                const content = bracketMatch ? bracketMatch[2] : noteStr;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {meta || 'Log'}
                      </span>
                      <span className="font-mono text-slate-400">#{idx + 1}</span>
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Remark & Follow-up Date Form */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 shrink-0 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            <div>
              <label htmlFor="modal-followup-date" className="text-xs font-semibold text-slate-700 block mb-1">
                Follow-up Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  id="modal-followup-date"
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900 font-mono"
                />
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pb-2">
              Updated by: <strong className="text-slate-700">{currentUser.name}</strong>
            </div>
          </div>

          <div>
            <label htmlFor="modal-new-remark" className="text-xs font-semibold text-slate-700 block mb-1">
              Add Internal Remark
            </label>
            <div className="flex gap-2">
              <textarea
                id="modal-new-remark"
                rows={2}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Enter call summary, surgeon options shared, or follow-up notes..."
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white resize-none focus:ring-2 focus:ring-[#062B61]"
              />
              <button
                type="submit"
                disabled={isSubmitting || (!newNoteText.trim() && followUpDate === (lead.followUpDate || ''))}
                className="px-4 py-2 bg-[#062B61] hover:bg-[#0A3B75] text-white rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
