
import React, { useState, useEffect } from 'react';
import { Page, Employee, Shifts } from './types';
import { INITIAL_EMPLOYEES, INITIAL_SHIFTS } from './constants';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import SchedulePage from './pages/Schedule';
import ProductionPage from './pages/Production';
import LabourPage from './pages/Labour';
import AdminPage from './pages/Admin';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Schedule);
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('plant_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });
  const [shifts, setShifts] = useState<Shifts>(() => {
    const saved = localStorage.getItem('plant_shifts');
    return saved ? JSON.parse(saved) : INITIAL_SHIFTS;
  });
  const [notification, setNotification] = useState("Welcome to CROSSBOND Plant Management System. Safety First!");

  useEffect(() => {
    localStorage.setItem('plant_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('plant_shifts', JSON.stringify(shifts));
  }, [shifts]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Schedule:
        return <SchedulePage shifts={shifts} employees={employees} notification={notification} />;
      case Page.Production:
        return <ProductionPage employees={employees} />;
      case Page.Labour:
        return <LabourPage employees={employees} />;
      case Page.Admin:
        return (
          <AdminPage 
            employees={employees} 
            setEmployees={setEmployees} 
            shifts={shifts} 
            setShifts={setShifts} 
            notification={notification}
            setNotification={setNotification}
          />
        );
      default:
        return <SchedulePage shifts={shifts} employees={employees} notification={notification} />;
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
