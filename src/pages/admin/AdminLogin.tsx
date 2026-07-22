import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { Lock, Mail, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  if (user) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await signIn(email, password);
    setIsSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.error || 'Failed to authenticate.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#070a0f] text-gray-100 p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0c1017]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/30 rounded-2xl flex items-center justify-center mx-auto text-sky-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-neutralfacebold text-2xl uppercase tracking-tight text-white pt-2">
            Admin Portal Access
          </h2>
          <p className="text-xs text-gray-400">
            Sign in to manage client inquiries, discovery calls, and schedule availability.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-white font-neutralfacebold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 disabled:opacity-50 cursor-pointer pt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
