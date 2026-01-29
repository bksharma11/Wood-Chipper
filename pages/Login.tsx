
import React, { useState } from 'react';
import NeonCard from '../components/NeonCard';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '967514') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
      <NeonCard className="w-full max-w-md">
        <h2 className="text-3xl font-black orbitron mb-6 text-center text-cyan-300">ADMIN LOGIN</h2>
        <p className="text-center text-slate-400 mb-8 text-sm">Enter the 6-digit PIN to access the console.</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            type="password" 
            autoFocus 
            maxLength={6} 
            placeholder="••••••" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)} 
            className="w-full bg-slate-900/50 border border-slate-700 p-4 rounded text-center text-3xl font-black text-white tracking-[1rem] focus:ring-2 focus:ring-cyan-500 outline-none" 
          />
          {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
          <button type="submit" className="w-full py-3 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/40 transition-colors font-bold orbitron uppercase">
            Authenticate
          </button>
        </form>
      </NeonCard>
    </div>
  );
};

export default LoginPage;
