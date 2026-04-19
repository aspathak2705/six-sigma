import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import Dashboard from './pages/Dashboard';
import ManualEntry from './pages/ManualEntry';
import OCRUpload from './pages/OCRUpload';
import ExportPage from './pages/ExportPage';

const TopNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-[#fbfaee] shadow-[0_1px_0_0_rgba(0,52,43,0.05)] docked full-width top-0 z-50 sticky">
      <div className="flex justify-between items-center px-8 py-6 w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-['Newsreader'] italic text-[#00342b] font-light tracking-tight">Sigma</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={clsx("font-['Manrope'] transition-colors", isActive('/') ? "text-[#00342b] font-semibold" : "text-[#00342b]/70 font-medium hover:text-[#00342b]")}>Overview</NavLink>
            <NavLink to="/manual" className={clsx("font-['Manrope'] transition-colors", isActive('/manual') ? "text-[#00342b] font-semibold" : "text-[#00342b]/70 font-medium hover:text-[#00342b]")}>Manual Entry</NavLink>
            <NavLink to="/upload" className={clsx("font-['Manrope'] transition-colors", isActive('/upload') ? "text-[#00342b] font-semibold" : "text-[#00342b]/70 font-medium hover:text-[#00342b]")}>OCR Upload</NavLink>
            <NavLink to="/export" className={clsx("font-['Manrope'] transition-colors", isActive('/export') ? "text-[#00342b] font-semibold" : "text-[#00342b]/70 font-medium hover:text-[#00342b]")}>Export</NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon, label }) => {
    const active = isActive(to);
    return (
      <NavLink to={to} className={clsx(
        "flex flex-col items-center justify-center px-6 py-2 transition-all active:scale-90 duration-200 tap-highlight-transparent",
        active ? "bg-[#00342b] text-[#fbfaee] rounded-full shadow-lg" : "text-[#00342b]/50 hover:text-[#00342b]"
      )}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
        <span className="font-['Manrope'] text-[11px] font-medium tracking-wide uppercase mt-1">{label}</span>
      </NavLink>
    );
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-4 bg-[#fbfaee]/90 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,52,43,0.04)] rounded-t-[3rem] pb-safe">
      <NavItem to="/" icon="dashboard" label="Overview" />
      <NavItem to="/manual" icon="keyboard" label="Manual" />
      <NavItem to="/upload" icon="cloud_upload" label="OCR" />
      <NavItem to="/export" icon="description" label="Export" />
    </nav>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-surface">
        <TopNav />
        <main className="flex-1 w-full pb-32">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/manual" element={<ManualEntry />} />
            <Route path="/upload" element={<OCRUpload />} />
            <Route path="/export" element={<ExportPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
};

export default App;
