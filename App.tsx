
import React, { useState, useEffect } from 'react';
import { Page, Employee, Shifts, DailyShifts } from './types';
import { INITIAL_EMPLOYEES, INITIAL_SHIFTS } from './constants';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import SchedulePage from './pages/Schedule';
import ProductionPage from './pages/Production';
import LabourPage from './pages/Labour';
import AdminPage from './pages/Admin';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';

export interface NotificationConfig {
  text: string;
  font: string;
  size: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Schedule);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [dailyShiftHistory, setDailyShiftHistory] = useState<DailyShifts>({});
  const [notification, setNotification] = useState<NotificationConfig>({
    text: "Welcome to CROSSBOND Plant Management System. Safety First!",
    font: "orbitron",
    size: "text-xs"
  });
  const [rosterMonth, setRosterMonth] = useState<number>(0);
  const [rosterYear, setRosterYear] = useState<number>(2026);

  // Sync state with Firebase Realtime Database
  useEffect(() => {
    const employeesRef = ref(db, 'employees');
    const shiftsRef = ref(db, 'dailyShiftHistory');
    const notificationRef = ref(db, 'notification');
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

    const unsubNotification = onValue(notificationRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setNotification(data);
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
      unsubNotification();
      unsubMonth();
      unsubYear();
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Schedule:
        return (
          <SchedulePage 
            employees={employees} 
            notification={notification} 
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
            notification={notification}
            rosterMonth={rosterMonth}
            rosterYear={rosterYear}
          />
        );
      default:
        return (
          <SchedulePage 
            employees={employees} 
            notification={notification} 
            rosterMonth={rosterMonth}
            rosterYear={rosterYear}
            dailyShiftHistory={dailyShiftHistory}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main className="flex-grow pb-24 px-4 sm:px-6 lg:px-8">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
};

export default App;
