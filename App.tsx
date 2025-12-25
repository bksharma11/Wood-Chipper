
import React, { useState, useEffect } from 'react';
import { Page, Employee, DailyShifts, NotificationConfig, LeaveRequest } from './types';
import { INITIAL_EMPLOYEES } from './constants';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import SchedulePage from './pages/Schedule';
import ProductionPage from './pages/Production';
import LabourPage from './pages/Labour';
import AdminPage from './pages/Admin';
import LoginPage from './pages/Login';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Schedule);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [dailyShiftHistory, setDailyShiftHistory] = useState<DailyShifts>({});
  const [notifications, setNotifications] = useState<NotificationConfig[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [rosterMonth, setRosterMonth] = useState<number>(0);
  const [rosterYear, setRosterYear] = useState<number>(2026);

  useEffect(() => {
    const employeesRef = ref(db, 'employees');
    const shiftsRef = ref(db, 'dailyShiftHistory');
    const notificationsRef = ref(db, 'notifications');
    const requestsRef = ref(db, 'leaveRequests');
    const monthRef = ref(db, 'rosterMonth');
    const yearRef = ref(db, 'rosterYear');

    const unsubEmployees = onValue(employeesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setEmployees(data);
    });
    const unsubShifts = onValue(shiftsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setDailyShiftHistory(data);
    });
    const unsubNotifications = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notificationsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setNotifications(notificationsArray);
      } else {
        setNotifications([]);
      }
    });
    const unsubRequests = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reqsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setLeaveRequests(reqsArray);
      } else {
        setLeaveRequests([]);
      }
    });
    const unsubMonth = onValue(monthRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) setRosterMonth(data);
    });
    const unsubYear = onValue(yearRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) setRosterYear(data);
    });

    return () => {
      unsubEmployees();
      unsubShifts();
      unsubNotifications();
      unsubRequests();
      unsubMonth();
      unsubYear();
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setCurrentPage(Page.Admin);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentPage(Page.Schedule);
  };

  const renderPage = () => {
    if (currentPage === Page.Login) {
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
    if (currentPage === Page.Admin && !isAdmin) {
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentPage) {
      case Page.Schedule:
        return (
          <SchedulePage 
            employees={employees} 
            notifications={notifications} 
            rosterMonth={rosterMonth}
            rosterYear={rosterYear}
            dailyShiftHistory={dailyShiftHistory}
          />
        );
      case Page.Production:
        return <ProductionPage employees={employees} />;
      case Page.Labour:
        return <LabourPage employees={employees} />;
      case Page.Admin:
        return (
          <AdminPage 
            employees={employees} 
            dailyShiftHistory={dailyShiftHistory}
            notifications={notifications}
            leaveRequests={leaveRequests}
            rosterMonth={rosterMonth}
            rosterYear={rosterYear}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <SchedulePage 
            employees={employees} 
            notifications={notifications} 
            rosterMonth={rosterMonth}
            rosterYear={rosterYear}
            dailyShiftHistory={dailyShiftHistory}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header isAdmin={isAdmin} setCurrentPage={setCurrentPage} handleLogout={handleLogout} />
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main className="flex-grow pb-24 px-4 sm:px-6 lg:px-8">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
};

export default App;
