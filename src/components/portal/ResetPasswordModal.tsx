import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HospitalAccount } from '../../types';
import { EASE_SMOOTH } from '../MotionPrimitives';
import { 
  generateRandomTempPassword, 
  createHospitalWhatsAppMessage, 
  openWhatsAppShare 
} from '../../data/crmData';
import { api } from '../../services/api';
import { 
  KeyRound, 
  X, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  MessageSquare, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

interface ResetPasswordModalProps {
  account: HospitalAccount;
  onClose: () => void;
  onSuccess: (updatedAccount: HospitalAccount) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  account,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'generate' | 'manual'>('generate');
  const [manualPassword, setManualPassword] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState(generateRandomTempPassword());
  const [showPassword, setShowPassword] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [finalPassword, setFinalPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleRegenerate = () => {
    setGeneratedPassword(generateRandomTempPassword());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const targetPassword = mode === 'generate' ? generatedPassword : manualPassword.trim();
    if (!targetPassword) {
      setError('Password cannot be empty');
      return;
    }
    if (targetPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.resetHospitalPassword(account.id, targetPassword);
      const activePassword = res.tempPassword || targetPassword;
      setFinalPassword(activePassword);
      setResetSuccess(true);
      onSuccess({
        ...account,
        mustChangePassword: true,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(finalPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const msg = createHospitalWhatsAppMessage({
      hospitalName: account.hospitalName,
      username: account.username,
      tempPassword: finalPassword,
    });
    openWhatsAppShare(account.mobile, msg);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <motion.div 
        id="reset-password-modal"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.24, ease: EASE_SMOOTH }}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#062B61] to-[#0A3B75] px-5 sm:px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-white/10 shrink-0">
              <KeyRound className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white truncate">Reset Hospital Password</h2>
              <p className="text-[11px] text-slate-300 truncate">{account.hospitalName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <AnimatePresence mode="wait">
          {!resetSuccess ? (
            <motion.form
              key="reset-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="text-xs text-slate-600">
                Resetting password for username: <strong className="text-slate-900 font-mono">{account.username}</strong>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Mode Selection */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMode('generate')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    mode === 'generate'
                      ? 'bg-white text-[#062B61] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Generate Temporary
                </button>
                <button
                  type="button"
                  onClick={() => setMode('manual')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    mode === 'manual'
                      ? 'bg-white text-[#062B61] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Manually Set
                </button>
              </div>

              {mode === 'generate' ? (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Generated Temporary Password
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 font-mono text-sm font-bold text-[#062B61] bg-white px-3 py-2 rounded-lg border border-slate-200">
                      {generatedPassword}
                    </div>
                    <button
                      type="button"
                      onClick={handleRegenerate}
                      className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Generate another"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>New</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    The hospital coordinator will be prompted to change this temporary password after logging in.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Enter New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={manualPassword}
                      onChange={(e) => setManualPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#062B61] hover:bg-[#0A3B75] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Confirm Reset'}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="reset-success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: EASE_SMOOTH }}
              className="space-y-4 text-center py-2"
            >
              <motion.div
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto"
              >
                <CheckCircle2 className="w-6 h-6" />
              </motion.div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Password Reset Successfully!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  The authentication password has been updated securely for {account.hospitalName}.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left">
                <div className="text-[11px] text-slate-500 font-medium">New Temporary Password:</div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="font-mono text-sm font-bold text-[#062B61] break-all">{finalPassword}</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded bg-white border border-slate-200 cursor-pointer shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* WhatsApp Action Button */}
              <div className="space-y-2 pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={handleShareWhatsApp}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send New Login Details via WhatsApp</span>
                </motion.button>

                <button
                  onClick={onClose}
                  className="w-full min-h-[40px] py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
