
import React, { useState } from 'react';

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
      <div className="brushed-metal p-10 rounded-2xl border border-slate-600 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-black orbitron mb-6 text-center silver-gradient bg-clip-text text-transparent">ADMIN LOGIN</h2>
        <p className="text-center text-slate-400 mb-8 text-sm">Enter the 6-digit PIN to access the console.</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            type="password" 
            autoFocus 
            maxLength={6} 
            placeholder="••••••" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)} 
            className="w-full bg-slate-900 border border-slate-700 p-4 rounded text-center text-3xl font-black text-white tracking-[1rem] focus:ring-2 focus:ring-slate-500 outline-none" 
          />
          {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
          <button type="submit" className="w-full py-3 silver-gradient text-slate-900 font-bold orbitron rounded shadow-xl uppercase">
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
