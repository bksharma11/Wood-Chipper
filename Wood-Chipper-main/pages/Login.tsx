import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInAnonymously } from 'firebase/auth';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '967514') {
      try {
        await signInAnonymously(auth);
        setError('');
        onLoginSuccess();
      } catch (err: any) {
        // Fallback for demo if auth fails but pin is right (though writes might fail)
        // Better to show error
        console.error(err);
        if (err.code === 'auth/admin-restricted-operation' || err.code === 'auth/operation-not-allowed') {
          setError('Login Error: Anonymous Auth likely disabled in Firebase Console.');
        } else {
          setError('Connection Error: ' + err.message);
        }
      }
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 animate-fadeIn relative">
      <div className="absolute inset-0 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <GlassCard className="w-full max-w-md border-cyan-500/30 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-700 shadow-[0_0_15px_rgba(6,182,212,0.3)] mb-4">
            <span className="text-3xl">🛡️</span>
          </div>
          <h2 className="text-3xl font-black orbitron text-center text-white tracking-widest">
            ADMIN <span className="text-cyan-400">ACCESS</span>
          </h2>
          <p className="text-center text-slate-400 text-xs uppercase tracking-wider mt-2">Secure Gateway • Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="relative group">
            <input
              type="password"
              autoFocus
              maxLength={6}
              placeholder="••••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-700 p-6 rounded-xl text-center text-4xl font-black text-white tracking-[1.5em] focus:ring-2 focus:ring-cyan-500/50 outline-none focus:border-cyan-500 transition-all placeholder-slate-700"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center justify-center space-x-2 animate-slideUp">
              <span className="text-red-400 text-xs font-bold uppercase tracking-wide">{error}</span>
            </div>
          )}

          <GlassButton
            type="submit"
            className="w-full"
            size="lg"
            icon={<span>🔓</span>}
          >
            Authenticate System
          </GlassButton>
        </form>
      </GlassCard>

      <div className="mt-8 text-[10px] text-slate-600 font-mono">
        SYSTEM ID: 8X-992-ALPHA
      </div>
    </div>
  );
};

export default LoginPage;
