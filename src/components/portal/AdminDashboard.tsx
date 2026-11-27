import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { EASE_SMOOTH } from '../MotionPrimitives';
import {
  AuthUser,
  Lead,
  Hospital,
  CRM_LEAD_STATUSES,
  PATIENT_CONDITIONS,
  AFFORDABLE_BUDGETS,
} from '../../types';
import { api } from '../../services/api';
import { Logo } from '../Logo';
import { LeadsNotesModal } from './LeadsNotesModal';
import {
  LogOut,
  Search,
  RefreshCw,
  Download,
  MessageSquare,
  Calendar,
  Phone,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

interface AdminDashboardProps {
  user: AuthUser;
  onLogout: () => void;
  onClose?: () => void;
  onSwitchToHospital?: (hospitalId: string) => void;
}

const TEAM_MEMBERS = [
  'Unassigned',
  'Dr. Vikram Malhotra',
  'Pooja Hegde',
  'Suresh Nambiar',
  'Dr. Anita Sen',
  'Rohan Kulkarni',
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onClose,
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [budgetFilter, setBudgetFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLeadForNotes, setSelectedLeadForNotes] = useState<Lead | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await api.getLeads();
      setLeads(data);
    } catch (err) {
      console.error('Error loading leads:', err);
      showToast('Failed to load leads from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const normalizeStatus = (raw: string): string => {
    switch (raw) {
      case 'New Leads':
        return 'New Enquiry';
      case 'RNR':
        return 'Contacted';
      case 'Followup':
        return 'Requirements Under Review';
      case 'Junk':
        return 'Not Interested';
      default:
        return raw || 'New Enquiry';
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const condition = lead.condition || lead.treatment || '';
      const displayStatus = normalizeStatus(lead.status);
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.mobile.toLowerCase().includes(q) ||
        (lead.leadCode || '').toLowerCase().includes(q) ||
        condition.toLowerCase().includes(q) ||
        (lead.suggestedTreatmentPlan || '').toLowerCase().includes(q) ||
        (lead.insuranceCompany || '').toLowerCase().includes(q) ||
        (lead.utmCampaign || lead.source || '').toLowerCase().includes(q);

      const matchesCondition =
        conditionFilter === 'All' ||
        condition.toLowerCase() === conditionFilter.toLowerCase();

      const matchesBudget =
        budgetFilter === 'All' || lead.budget === budgetFilter;

      const matchesStatus =
        statusFilter === 'All' || displayStatus === statusFilter;

      return matchesSearch && matchesCondition && matchesBudget && matchesStatus;
    });
  }, [leads, searchQuery, conditionFilter, budgetFilter, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of CRM_LEAD_STATUSES) counts[s] = 0;
    for (const lead of leads) {
      const s = normalizeStatus(lead.status);
      counts[s] = (counts[s] || 0) + 1;
    }
    return counts;
  }, [leads]);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const updated = await api.updateLead(leadId, {
        status: newStatus,
        authorName: user.name,
        note: `Status updated to "${newStatus}"`,
      });
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
      showToast(`Status updated to ${newStatus}`);
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleAssigneeChange = async (leadId: string, assignee: string) => {
    try {
      const updated = await api.updateLead(leadId, {
        assignedRep: assignee,
        authorName: user.name,
        note: `Assigned to ${assignee}`,
      });
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
      showToast(`Assigned to ${assignee}`);
    } catch {
      showToast('Failed to assign team member', 'error');
    }
  };

  const handleExportExcel = () => {
    if (filteredLeads.length === 0) {
      showToast('No lead records match the current filters to export', 'error');
      return;
    }

    const rows = filteredLeads.map((l) => ({
      'Lead ID': l.leadCode || l.id,
      'Submission Date & Time': new Date(l.createdAt).toLocaleString('en-IN'),
      'Patient / Contact Name': l.name,
      'Mobile Number': l.mobile,
      'Patient Condition': l.condition || l.treatment,
      'Suggested Treatment Plan': l.suggestedTreatmentPlan || '',
      'Health Insurance': l.insuranceStatus || 'Not Sure',
      'Insurance Company / TPA': l.insuranceCompany || '',
      'Expected Surgery Date': l.expectedSurgeryDate || 'Undecided',
      'Affordable Budget': l.budget,
      'Lead Status': normalizeStatus(l.status),
      'Assigned Team Member': l.assignedRep || 'Unassigned',
      'Follow-up Date': l.followUpDate || '',
      'Source / Campaign': l.source || 'Direct',
      'UTM Source': l.utmSource || '',
      'UTM Medium': l.utmMedium || '',
      'UTM Campaign': l.utmCampaign || '',
      'Landing Page URL': l.landingPageUrl || '',
      'Internal Remarks': (l.notes || []).join(' | '),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Surgical Leads');
    const dateSlug = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Acquire_Surgery_Leads_${dateSlug}.xlsx`);
    showToast(`Exported ${filteredLeads.length} lead records to Excel`);
  };

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'New Enquiry':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Contacted':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Requirements Under Review':
      case 'Options Shared':
      case 'Consultation Scheduled':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Converted':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Not Interested':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800">
      {/* Top CRM Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Logo size="sm" showTagline={false} />
            <span className="hidden sm:inline-block text-xs font-medium text-slate-500 truncate">
              Lead Management CRM
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Landing Page</span>
              </button>
            )}
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: EASE_SMOOTH }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div
              className={`px-4 py-3 rounded-xl border shadow-lg text-xs font-semibold flex items-center gap-2 ${
                toastMsg.type === 'success'
                  ? 'bg-white border-emerald-200 text-emerald-800'
                  : 'bg-white border-rose-200 text-rose-800'
              }`}
            >
              {toastMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{toastMsg.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Pipeline Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.16, ease: EASE_SMOOTH }}
            onClick={() => setStatusFilter('All')}
            className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
              statusFilter === 'All'
                ? 'bg-[#062B61] text-white border-[#062B61]'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className={`text-[11px] font-medium block ${statusFilter === 'All' ? 'text-blue-100' : 'text-slate-500'}`}>
              All Leads
            </span>
            <span className="font-mono text-xl font-bold tabular-nums mt-1 block">
              {leads.length}
            </span>
          </motion.button>

          {CRM_LEAD_STATUSES.map((status) => {
            const active = statusFilter === status;
            return (
              <motion.button
                key={status}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.16, ease: EASE_SMOOTH }}
                onClick={() => setStatusFilter(active ? 'All' : status)}
                className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#062B61] text-white border-[#062B61]'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`text-[11px] font-medium block truncate ${active ? 'text-blue-100' : 'text-slate-500'}`}>
                  {status}
                </span>
                <span className="font-mono text-xl font-bold tabular-nums mt-1 block">
                  {statusCounts[status] || 0}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* CRM Lead Directory & Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-lg font-bold text-slate-900">
                Surgical Enquiry Leads
              </h1>
              <p className="text-xs text-slate-500 font-mono tabular-nums">
                Showing {filteredLeads.length} of {leads.length} records
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={loadLeads}
                className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </motion.button>
              <motion.button
                id="export-excel-btn"
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleExportExcel}
                className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export to Excel (.xlsx)</span>
              </motion.button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Lead ID, name, mobile, TPA, campaign..."
                className="w-full min-h-[40px] pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#062B61]"
              />
            </div>

            <select
              aria-label="Filter by patient condition"
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="w-full min-h-[40px] px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 font-medium"
            >
              <option value="All">All Conditions</option>
              {PATIENT_CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by budget range"
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="w-full min-h-[40px] px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 font-medium"
            >
              <option value="All">All Budget Ranges</option>
              {AFFORDABLE_BUDGETS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by lead status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full min-h-[40px] px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 font-medium"
            >
              <option value="All">All Lead Statuses</option>
              {CRM_LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Loading / Empty / Data Table */}
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading surgical enquiry records...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-800">
                No lead records match your filters
              </p>
              <p className="text-xs text-slate-500">
                New enquiries submitted on the landing page will appear here immediately.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile / Tablet Card View */}
              <div className="lg:hidden divide-y divide-slate-200">
                {filteredLeads.map((lead) => {
                  const status = normalizeStatus(lead.status);
                  return (
                    <div key={lead.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-mono text-[11px] font-semibold text-[#062B61] tabular-nums break-words">
                            {lead.leadCode || lead.id.slice(-6)} · {new Date(lead.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 mt-0.5 break-words">
                            {lead.name}
                          </h3>
                          <a
                            href={`tel:${lead.mobile.replace(/\s+/g, '')}`}
                            className="inline-flex items-center gap-1 font-mono text-xs text-slate-700 hover:text-[#062B61] mt-0.5"
                          >
                            <Phone className="w-3 h-3 shrink-0" />
                            <span>{lead.mobile}</span>
                          </a>
                        </div>
                        <span className={`px-2 py-1 text-[11px] font-semibold rounded-md border shrink-0 ${statusBadgeClass(status)}`}>
                          {status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="min-w-0">
                          <span className="text-slate-500 block">Condition</span>
                          <span className="font-semibold text-slate-900 break-words">{lead.condition || lead.treatment}</span>
                        </div>
                        <div className="min-w-0">
                          <span className="text-slate-500 block">Budget</span>
                          <span className="font-semibold text-slate-900 break-words">{lead.budget}</span>
                        </div>
                        <div className="min-w-0">
                          <span className="text-slate-500 block">Insurance</span>
                          <span className="font-medium text-slate-800 break-words">
                            {lead.insuranceStatus || 'Not Sure'}
                            {lead.insuranceCompany ? ` (${lead.insuranceCompany})` : ''}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <span className="text-slate-500 block">Expected Surgery</span>
                          <span className="font-mono text-slate-800 break-words">
                            {lead.expectedSurgeryDate || 'Undecided'}
                          </span>
                        </div>
                      </div>

                      {lead.suggestedTreatmentPlan && (
                        <p className="text-xs text-slate-600 break-words">
                          <strong className="text-slate-700">Doctor Plan:</strong> {lead.suggestedTreatmentPlan}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="w-full min-w-0 min-h-[40px] px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                        >
                          {CRM_LEAD_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <select
                          value={lead.assignedRep || 'Unassigned'}
                          onChange={(e) => handleAssigneeChange(lead.id, e.target.value)}
                          className="w-full min-w-0 min-h-[40px] px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                        >
                          {TEAM_MEMBERS.map((member) => (
                            <option key={member} value={member}>
                              {member}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                        <span className="text-slate-500 flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          Follow-up: {lead.followUpDate || 'Not set'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedLeadForNotes(lead)}
                          className="inline-flex items-center gap-1 font-semibold text-[#062B61] hover:underline cursor-pointer py-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                          <span>Remarks ({lead.notes?.length || 0})</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop High-Density Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 whitespace-nowrap">Lead ID &amp; Date</th>
                      <th className="px-4 py-3 whitespace-nowrap">Patient &amp; Mobile</th>
                      <th className="px-4 py-3 whitespace-nowrap">Condition &amp; Plan</th>
                      <th className="px-4 py-3 whitespace-nowrap">Insurance &amp; TPA</th>
                      <th className="px-4 py-3 whitespace-nowrap">Expected Date</th>
                      <th className="px-4 py-3 whitespace-nowrap">Budget</th>
                      <th className="px-4 py-3 whitespace-nowrap">Source / UTM</th>
                      <th className="px-4 py-3 whitespace-nowrap">Status</th>
                      <th className="px-4 py-3 whitespace-nowrap">Assigned To</th>
                      <th className="px-4 py-3 whitespace-nowrap">Follow-up &amp; Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.map((lead) => {
                      const status = normalizeStatus(lead.status);
                      return (
                        <tr key={lead.id} className="hover:bg-slate-50/70 align-top">
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="font-mono font-semibold text-[#062B61] tabular-nums">
                              {lead.leadCode || lead.id.slice(-6)}
                            </div>
                            <div className="font-mono text-[11px] text-slate-500 tabular-nums mt-0.5">
                              {new Date(lead.createdAt).toLocaleString('en-IN', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-bold text-slate-900">{lead.name}</div>
                            <a
                              href={`tel:${lead.mobile.replace(/\s+/g, '')}`}
                              className="font-mono text-slate-700 hover:text-[#062B61] tabular-nums block mt-0.5"
                            >
                              {lead.mobile}
                            </a>
                          </td>
                          <td className="px-4 py-3.5 max-w-[220px]">
                            <div className="font-semibold text-slate-900">
                              {lead.condition || lead.treatment}
                            </div>
                            {lead.suggestedTreatmentPlan && (
                              <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2" title={lead.suggestedTreatmentPlan}>
                                {lead.suggestedTreatmentPlan}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-medium text-slate-800">
                              {lead.insuranceStatus || 'Not Sure'}
                            </div>
                            {lead.insuranceCompany && (
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {lead.insuranceCompany}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-700 tabular-nums">
                            {lead.expectedSurgeryDate || 'Undecided'}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-900">
                            {lead.budget}
                          </td>
                          <td className="px-4 py-3.5 max-w-[160px]">
                            <div className="text-slate-700 truncate" title={lead.source}>
                              {lead.source || 'Direct'}
                            </div>
                            {lead.utmCampaign && (
                              <div className="font-mono text-[10px] text-slate-400 truncate mt-0.5">
                                {lead.utmCampaign}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <select
                              aria-label={`Status for ${lead.name}`}
                              value={status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${statusBadgeClass(status)}`}
                            >
                              {CRM_LEAD_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3.5">
                            <select
                              aria-label={`Assign lead ${lead.name}`}
                              value={lead.assignedRep || 'Unassigned'}
                              onChange={(e) => handleAssigneeChange(lead.id, e.target.value)}
                              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 cursor-pointer"
                            >
                              {TEAM_MEMBERS.map((member) => (
                                <option key={member} value={member}>
                                  {member}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="font-mono text-[11px] text-slate-600 tabular-nums mb-1">
                              {lead.followUpDate ? `Due: ${lead.followUpDate}` : 'No date set'}
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedLeadForNotes(lead)}
                              className="inline-flex items-center gap-1 text-[#062B61] font-semibold hover:underline cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Remarks ({lead.notes?.length || 0})</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedLeadForNotes && (
          <LeadsNotesModal
            lead={selectedLeadForNotes}
            currentUser={user}
            onClose={() => setSelectedLeadForNotes(null)}
            onLeadUpdated={(updated) => {
              setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
              setSelectedLeadForNotes(updated);
              showToast('Remarks & follow-up saved');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
