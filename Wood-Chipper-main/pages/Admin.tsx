import React, { useState, useEffect } from 'react';
import { Employee, DailyShifts, AdminPageType, NotificationConfig, LeaveRequest, ShiftSwapRequest } from '../types';
import MasterSchedule from '../components/admin/MasterSchedule';
import DailyRoster from '../components/admin/DailyRoster';
import SystemNotification from '../components/admin/SystemNotification';
import LeaveManagement from '../components/admin/LeaveManagement';
import LeaveRequestsAdmin from '../components/admin/LeaveRequestsAdmin';
import ShiftSwapAdmin from '../components/admin/ShiftSwapAdmin';
import GlassCard from '../components/ui/GlassCard';
import GlassInput from '../components/ui/GlassInput';
import GlassSelect from '../components/ui/GlassSelect';
import { db } from '../firebase';
import { ref, update, onValue } from 'firebase/database';

interface AdminPageProps {
  employees: Employee[];
  dailyShiftHistory: DailyShifts;
  notifications: NotificationConfig[];
  leaveRequests: LeaveRequest[];
  shiftSwapRequests?: ShiftSwapRequest[];
  rosterMonth: number;
  rosterYear: number;
  onLogout: () => void;
  setEmployees: (employees: Employee[]) => void;
}

const AdminPage: React.FC<AdminPageProps> = (props) => {
  const { employees, setEmployees, onLogout } = props;

  const getInitialView = () => {
    const hasPending = props.leaveRequests.some(r => r.status === 'pending');
    return hasPending ? AdminPageType.Requests : AdminPageType.Notification;
  };

  const [activeView, setActiveView] = useState<AdminPageType | 'settings' | 'inbox'>(getInitialView());
  const [locationQuery, setLocationQuery] = useState('');
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const [complaints, setComplaints] = useState<any[]>([]);

  // Environment State
  const [envData, setEnvData] = useState({
    temp: '--',
    humidity: '--',
    condition: 'Sunny',
    location: 'Not Set'
  });

  useEffect(() => {
    // Fetch Environment
    const unsubEnv = onValue(ref(db, 'environment'), (snapshot) => {
      const data = snapshot.val();
      if (data) setEnvData(data);
    });

    // Fetch Complaints
    const unsubComplaints = onValue(ref(db, 'complaints'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setComplaints(list.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setComplaints([]);
      }
    });

    return () => { unsubEnv(); unsubComplaints(); };
  }, []);

  const handleFetchWeather = async () => {
    if (!locationQuery.trim()) return alert("Please enter a location");
    setIsFetchingWeather(true);
    try {
      // 1. Geocoding
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${locationQuery}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) throw new Error("Location not found");

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2. Weather Data
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`);
      const weatherData = await weatherRes.json();

      const current = weatherData.current;

      // Map Weather Code to String
      let condition = 'Sunny';
      const code = current.weather_code;
      if (code >= 95) condition = 'Stormy';
      else if (code >= 61) condition = 'Rainy';
      else if (code >= 51) condition = 'Cloudy'; // Drizzle is rainy/cloudy
      else if (code >= 1) condition = 'Cloudy';
      else condition = 'Sunny / Clear';

      const newEnv = {
        temp: Math.round(current.temperature_2m).toString(),
        humidity: Math.round(current.relative_humidity_2m).toString(),
        condition: condition,
        location: `${name}, ${country}`
      };

      setEnvData(newEnv);
      await update(ref(db, 'environment'), newEnv);
      alert(`Weather updated for ${name}!`);

    } catch (err) {
      alert("Failed to fetch weather. Check location name.");
      console.error(err);
    } finally {
      setIsFetchingWeather(false);
    }
  };

  const adminTabs = [
    { id: AdminPageType.Requests, label: 'Requests', icon: '📩' },
    { id: AdminPageType.SwapRequests, label: 'Swap Requests', icon: '⇄' },
    { id: AdminPageType.Schedule, label: 'Master Schedule', icon: '📅' },
    { id: AdminPageType.Roster, label: 'Daily Roster', icon: '📋' },
    { id: AdminPageType.Notification, label: 'Notifications', icon: '🔔' },
    { id: AdminPageType.Leave, label: 'Leave Data', icon: '🗃️' },
    { id: 'inbox', label: 'Help Desk', icon: '📥' },
    { id: 'settings', label: 'Environment', icon: '☁️' }
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case AdminPageType.Schedule:
        return <MasterSchedule employees={props.employees} rosterMonth={props.rosterMonth} rosterYear={props.rosterYear} />;
      case AdminPageType.Roster:
        return <DailyRoster employees={props.employees} dailyShiftHistory={props.dailyShiftHistory} />;
      case AdminPageType.Notification:
        return <SystemNotification notifications={props.notifications} />;
      case AdminPageType.Leave:
        return <LeaveManagement employees={props.employees} />;
      case AdminPageType.Requests:
        return <LeaveRequestsAdmin requests={props.leaveRequests} employees={props.employees} />;
      case AdminPageType.SwapRequests:
        return <ShiftSwapAdmin requests={props.shiftSwapRequests || []} employees={props.employees} />;

      case 'inbox':
        return (
          <GlassCard title="Help Desk Inbox" icon={<span>📥</span>}>
            <div className="space-y-4">
              {complaints.length === 0 ? (
                <div className="text-center text-slate-500 py-10 italic">No messages received yet.</div>
              ) : (
                complaints.map(item => (
                  <div key={item.id} className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-4">
                    <div className="md:w-48 flex-shrink-0 border-r border-white/5 pr-4">
                      <div className={`text-xs font-bold uppercase px-2 py-1 rounded inline-block mb-2 ${item.type === 'Safety Issue' ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                        {item.type}
                      </div>
                      <div className="text-white font-bold">{item.author}</div>
                      <div className="text-[10px] text-slate-500">{new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}</div>
                      <div className="text-[10px] mt-2 text-slate-400 uppercase tracking-wider">Status: <span className="text-white">{item.status}</span></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-300 text-sm whitespace-pre-wrap">{item.text}</p>
                    </div>
                    <div className="flex flex-col justify-center">
                      {item.status !== 'Resolved' && (
                        <button
                          onClick={() => update(ref(db, `complaints/${item.id}`), { status: 'Resolved' }).catch(e => alert("Error: " + e.message))}
                          className="bg-green-600/20 hover:bg-green-600/40 text-green-400 text-xs font-bold uppercase py-2 px-4 rounded transition-all"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <GlassCard title="Factory Location & Weather" icon={<span>☁️</span>}>
              <div className="max-w-xl mx-auto text-center space-y-6">
                <div className="bg-cyan-900/10 p-6 rounded-xl border border-cyan-500/20">
                  <h3 className="text-cyan-400 font-bold uppercase tracking-widest mb-4 text-sm">📍 Current Location Environment</h3>
                  <div className="text-4xl font-black text-white orbitron mb-2">{envData.location}</div>
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="flex flex-col">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Temperature</span>
                      <span className="text-2xl text-white font-mono">{envData.temp}°C</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Humidity</span>
                      <span className="text-2xl text-white font-mono">{envData.humidity}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Condition</span>
                      <span className="text-lg text-white orbitron mt-1">{envData.condition}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-left text-xs text-slate-500 font-bold uppercase mb-2">Update Factory Location</label>
                    <GlassInput
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      placeholder="e.g. London, Mumbai, New York"
                    />
                  </div>
                  <button
                    onClick={handleFetchWeather}
                    disabled={isFetchingWeather}
                    className="h-[46px] px-6 bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-widest rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFetchingWeather ? 'Fetching...' : 'Update'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 italic">Powered by Open-Meteo API. No API Key required.</p>
              </div>
            </GlassCard>
          </div>
        );
      default:
        return <LeaveRequestsAdmin requests={props.leaveRequests} employees={props.employees} />;
    }
  };

  const pendingCount = props.leaveRequests.filter(r => r.status === 'pending').length;
  const pendingSwapCount = (props.shiftSwapRequests || []).filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">

      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-xl border border-white/5 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-2xl font-black orbitron text-white tracking-widest uppercase flex items-center">
          <span className="text-cyan-400 mr-2">Admin</span> Console
        </h1>
        <button
          onClick={onLogout}
          className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors border-2 border-slate-700 hover:border-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Admin Navigation */}
        <aside className="lg:w-64 flex-shrink-0">
          <GlassCard className="p-2 sticky top-24">
            <h2 className="text-[10px] font-bold orbitron text-slate-500 border-b border-white/5 pb-3 mb-3 uppercase tracking-[0.2em] text-center">Control Panel</h2>
            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {adminTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as AdminPageType | 'settings')}
                  className={`relative whitespace-nowrap lg:whitespace-normal w-full text-left p-4 rounded-xl text-xs font-bold transition-all duration-300 orbitron uppercase flex items-center group overflow-hidden ${activeView === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'text-slate-400 hover:bg-white/5 border border-transparent'
                    }`}
                >
                  {activeView === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent"></div>
                  )}
                  <span className="text-xl mr-3 group-hover:scale-110 transition-transform duration-300">{tab.icon}</span>
                  <span className="relative z-10">{tab.label}</span>

                  {tab.id === AdminPageType.Requests && pendingCount > 0 && (
                    <span className="absolute top-2 right-2 min-w-[20px] h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-black animate-pulse shadow-lg px-1">
                      {pendingCount}
                    </span>
                  )}
                  {tab.id === AdminPageType.SwapRequests && pendingSwapCount > 0 && (
                    <span className="absolute top-2 right-2 min-w-[20px] h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-[10px] font-black animate-pulse shadow-lg px-1">
                      {pendingSwapCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </GlassCard>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Wrapping content in standard fade-in for smooth transitions */}
          <div key={activeView} className="animate-fadeIn">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
