
import React, { useState, useCallback, useRef, useEffect } from 'react';
import VehicleInfoForm from './components/VehicleInfoForm';
import InspectionSectionCard from './components/InspectionSectionCard';
import KabaleboModule from './components/KabaleboModule';
import { VehicleInfo, InspectionSection, InspectionReport, InspectionItem, VehicleStatus, RatingCode } from './types';
import { INITIAL_SECTIONS, STATUS_CODES, DAMAGE_CODES } from './constants';

type Tab = 'home' | 'inspect' | 'kabalebo';
type InspectView = 'form' | 'inventory';

interface User {
  name: string;
  pin: string;
  role: 'inspector' | 'validator' | 'viewer';
}

const USERS: User[] = [
  { name: 'Ms Vriesde', pin: '4009', role: 'inspector' },
  { name: 'Ms Binda', pin: '5007', role: 'validator' },
  { name: 'Mr Ismail', pin: '8080', role: 'viewer' }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [inspectView, setInspectView] = useState<InspectView>('form');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [status, setStatus] = useState<string>('');
  const [hasDraft, setHasDraft] = useState(false);
  
  // Security State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const SESSION_TIMEOUT = 90;

  const [vehicle, setVehicle] = useState<VehicleInfo>({
    make: '', model: '', year: '', vin: '', color: '', mileage: '', licensePlate: '', inspectorName: ''
  });
  const [sections, setSections] = useState<InspectionSection[]>(INITIAL_SECTIONS);
  const [savedReports, setSavedReports] = useState<InspectionReport[]>(() => {
    const saved = localStorage.getItem('pa_auto_reports');
    return saved ? JSON.parse(saved) : [];
  });
  
  const reportRef = useRef<HTMLDivElement>(null);

  const handleSignOut = useCallback(() => {
    setCurrentUser(null);
    setPinInput('');
    if (activeTab === 'inspect') setActiveTab('home');
    setInspectView('form');
    setStatus('Afgemeld');
    setTimeout(() => setStatus(''), 2000);
  }, [activeTab]);

  // Timer & Activity Logic (Only for Inspect Session)
  useEffect(() => {
    let interval: number;
    if (currentUser) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSignOut();
            return SESSION_TIMEOUT;
          }
          return prev - 1;
        });
      }, 1000);

      const resetTimer = () => setTimeLeft(SESSION_TIMEOUT);
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      window.addEventListener('scroll', resetTimer);
      window.addEventListener('touchstart', resetTimer);

      return () => {
        clearInterval(interval);
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keydown', resetTimer);
        window.removeEventListener('scroll', resetTimer);
        window.removeEventListener('touchstart', resetTimer);
      };
    }
  }, [currentUser, handleSignOut]);

  // Pre-fill inspector name if authenticated
  useEffect(() => {
    if (currentUser && !vehicle.inspectorName) {
      setVehicle(prev => ({ ...prev, inspectorName: currentUser.name }));
    }
  }, [currentUser]);

  const handlePinKey = (num: string) => {
    if (pinInput.length < 4) {
      const newVal = pinInput + num;
      setPinInput(newVal);
      if (newVal.length === 4) {
        const foundUser = USERS.find(u => u.pin === newVal);
        if (foundUser) {
          setCurrentUser(foundUser);
          setTimeLeft(SESSION_TIMEOUT);
          setPinInput('');
          setPinError(false);
        } else {
          setPinError(true);
          setPinInput('');
          setTimeout(() => setPinError(false), 2000);
        }
      }
    }
  };

  // Check for existing draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('pa_inspect_draft');
    if (draft) setHasDraft(true);
  }, []);

  // Persist reports
  useEffect(() => {
    localStorage.setItem('pa_auto_reports', JSON.stringify(savedReports));
  }, [savedReports]);

  // Auto-save draft logic (Only for active roles)
  useEffect(() => {
    if (currentUser && currentUser.role !== 'viewer' && inspectView === 'form' && (vehicle.make || sections !== INITIAL_SECTIONS)) {
      const draftData = { vehicle, sections };
      localStorage.setItem('pa_inspect_draft', JSON.stringify(draftData));
    }
  }, [vehicle, sections, inspectView, currentUser]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const restoreDraft = () => {
    const draft = localStorage.getItem('pa_inspect_draft');
    if (draft) {
      const { vehicle: dVehicle, sections: dSections } = JSON.parse(draft);
      setVehicle({ ...dVehicle, inspectorName: currentUser?.name });
      setSections(dSections);
      setHasDraft(false);
      setStatus('Sessie hersteld!');
      setTimeout(() => setStatus(''), 2000);
    }
  };

  const clearDraft = () => {
    if (confirm("Weet u zeker dat u de huidige kladversie wilt wissen?")) {
      localStorage.removeItem('pa_inspect_draft');
      setHasDraft(false);
      setVehicle({ make: '', model: '', year: '', vin: '', color: '', mileage: '', licensePlate: '', inspectorName: currentUser?.name });
      setSections(INITIAL_SECTIONS);
    }
  };

  const updateItem = useCallback((sectionTitle: string, itemId: string, updates: Partial<InspectionItem>) => {
    if (currentUser?.role === 'viewer') return;
    setSections(prev => prev.map(section => {
      if (section.title !== sectionTitle) return section;
      return {
        ...section,
        items: section.items.map(item => item.id === itemId ? { ...item, ...updates } : item)
      };
    }));
  }, [currentUser]);

  const generateCode = () => `PA-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSave = () => {
    if (currentUser?.role === 'viewer') return;
    if (!vehicle.make || !vehicle.model || !vehicle.inspectorName) {
      alert("Vul tenminste Merk, Model en Naam Inspecteur in.");
      return;
    }

    let missingPhotos: string[] = [];
    sections.forEach(s => {
      s.items.forEach(i => {
        if (i.hasDamage && i.photos.length === 0) {
          missingPhotos.push(`${s.title}: ${i.label}`);
        }
      });
    });

    if (missingPhotos.length > 0) {
      alert("Fout: Foto bewijs ontbreekt bij beschadigde items:\n\n" + missingPhotos.join("\n"));
      return;
    }

    const report: InspectionReport = {
      id: `rep-${Date.now()}`,
      referenceCode: generateCode(),
      date: new Date().toISOString(),
      vehicle,
      sections: JSON.parse(JSON.stringify(sections)),
      status: 'Available',
      isValidated: false
    };
    setSavedReports(prev => [report, ...prev]);
    setStatus(`Opgeslagen (niet gevalideerd)`);
    
    localStorage.removeItem('pa_inspect_draft');
    setHasDraft(false);
    
    setVehicle({ make: '', model: '', year: '', vin: '', color: '', mileage: '', licensePlate: '', inspectorName: currentUser?.name });
    setSections(INITIAL_SECTIONS);
    setTimeout(() => { setStatus(''); setInspectView('inventory'); }, 2000);
  };

  const handleValidate = (id: string) => {
    if (currentUser?.role !== 'validator') {
      alert("Niet geautoriseerd voor validatie.");
      return;
    }
    if (confirm(`Wilt u dit rapport als ${currentUser.name} definitief valideren?`)) {
      setSavedReports(prev => prev.map(r => r.id === id ? { 
        ...r, 
        isValidated: true, 
        validatedBy: currentUser.name,
        validatedAt: new Date().toISOString()
      } : r));
      setStatus('Rapport Gevalideerd ✅');
      setTimeout(() => setStatus(''), 2000);
    }
  };

  const deleteReport = (id: string) => {
    if (currentUser?.role === 'viewer') return;
    if (confirm("Weet u zeker dat u dit rapport wilt verwijderen?")) {
      setSavedReports(prev => prev.filter(r => r.id !== id));
    }
  };

  const updateStatus = (id: string, newStatus: VehicleStatus) => {
    if (currentUser?.role === 'viewer') return;
    setSavedReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleExportPDF = async (reportData?: InspectionReport) => {
    const element = reportRef.current;
    if (!element) return;
    setStatus('Genereren PDF...');
    try {
      const { jsPDF } = (window as any).jspdf;
      const html2canvas = (window as any).html2canvas;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const fileName = reportData 
        ? `PA-Report-${reportData.referenceCode}.pdf` 
        : `PAMotors-Draft.pdf`;
      pdf.save(fileName);
      setStatus('Success!');
    } catch (e) {
      setStatus('Error');
    } finally {
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const getStatusColor = (s: VehicleStatus) => {
    switch (s) {
      case 'Available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Reserved': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'On-Hold': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Sold': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const AuthOverlay = () => (
    <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
           <span className="text-4xl">🔐</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Beveiligde Inspectie</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Voer uw pincode in</p>
        
        <div className="flex justify-center gap-3 mb-10">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                pinInput.length > i ? 'bg-blue-600 border-blue-600 scale-125' : 'bg-transparent border-slate-200'
              } ${pinError ? 'bg-rose-500 border-rose-500 animate-bounce' : ''}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button 
              key={num} 
              onClick={() => handlePinKey(num.toString())}
              className="h-16 rounded-2xl bg-slate-50 text-slate-800 font-black text-xl hover:bg-slate-100 active:bg-blue-600 active:text-white transition-all shadow-sm"
            >
              {num}
            </button>
          ))}
          <button onClick={() => setPinInput('')} className="h-16 rounded-2xl bg-slate-50 text-rose-500 font-black text-xs hover:bg-rose-50">CLEAR</button>
          <button onClick={() => handlePinKey('0')} className="h-16 rounded-2xl bg-slate-50 text-slate-800 font-black text-xl hover:bg-slate-100">0</button>
          <button onClick={() => setActiveTab('home')} className="h-16 rounded-2xl bg-slate-50 text-slate-400 font-black text-xs hover:bg-slate-100">CANCEL</button>
        </div>
        {pinError && <p className="text-rose-500 font-black text-xs uppercase tracking-widest animate-shake">Code niet geautoriseerd</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="sticky top-0 z-[100] bg-white border-b border-slate-200 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 md:h-20">
          <div onClick={() => setActiveTab('home')} className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">PA</span>
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900">PA-Tools</span>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden sm:flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 border-l pl-3 md:pl-6 border-slate-100">
              {(['home', 'inspect', 'kabalebo'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 md:px-5 py-2 rounded-full font-bold transition-all text-[11px] md:text-sm capitalize ${activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  {tab === 'inspect' ? 'AutoInspect' : tab === 'kabalebo' ? 'Kabalebo' : tab}
                </button>
              ))}
              {currentUser && (
                <button
                  onClick={handleSignOut}
                  className="px-3 md:px-5 py-2 rounded-full font-bold transition-all text-[11px] md:text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100"
                >
                  Afmelden
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auto Logout Alert */}
      {currentUser && timeLeft < 21 && (
        <div className="fixed top-24 right-4 z-[150] animate-in slide-in-from-right-4">
          <div className="bg-rose-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-white/20">
            <span className="text-xl animate-pulse">⏳</span>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase leading-none opacity-80 mb-1">Inactiviteit Login</p>
              <p className="text-sm font-black">{timeLeft}s tot logout</p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 mb-24 md:mb-0">
        {activeTab === 'home' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {isOnline ? 'Systeem Online' : 'Offline Modus Actief'}
                   </span>
                   {currentUser && (
                     <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                       Sessie: {currentUser.name} {currentUser.role === 'viewer' && '(Alleen Lezen)'}
                     </span>
                   )}
                </div>
                <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tighter">Internal field suite.</h1>
                <p className="text-slate-400 text-lg md:text-xl font-medium mb-8">Secure operational engine for PA Motors Suriname. Offline-first workflow.</p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setActiveTab('inspect')} className="px-10 py-5 bg-blue-600 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">AutoInspect</button>
                  <button onClick={() => setActiveTab('kabalebo')} className="px-10 py-5 bg-white/10 backdrop-blur-md rounded-2xl font-black hover:bg-white/20 transition-all">Kabalebo Ops</button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div onClick={() => setActiveTab('inspect')} className="group bg-white p-10 rounded-[3rem] border border-slate-200 cursor-pointer hover:border-blue-500 transition-all shadow-sm hover:shadow-xl">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🚗</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-3">AutoInspect</h3>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">Secure inspection cycles for Ms Vriesde & Ms Binda. Features validation double-checks and PDF export.</p>
              </div>

              <div onClick={() => setActiveTab('kabalebo')} className="group bg-white p-10 rounded-[3rem] border border-slate-200 cursor-pointer hover:border-teal-500 transition-all shadow-sm hover:shadow-xl">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">📦</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-3">Kabalebo Ops</h3>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">Open access logistics hub. Food inventory, fuel tracking, and maintenance logs for mining equipment.</p>
              </div>
            </div>
          </div>
        )}

        {/* AUTH GATE ONLY FOR INSPECT */}
        {activeTab === 'inspect' && !currentUser && <AuthOverlay />}

        {activeTab === 'inspect' && currentUser && (
          <div className="animate-in fade-in duration-500 pb-20">
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => setInspectView('form')}
                className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${inspectView === 'form' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200'}`}
              >
                {currentUser.role === 'viewer' ? 'Inspectie Inzien' : '+ Nieuwe Inspectie'}
              </button>
              <button 
                onClick={() => setInspectView('inventory')}
                className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${inspectView === 'inventory' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200'}`}
              >
                🚗 Garage ({savedReports.length})
              </button>
            </div>

            {inspectView === 'form' ? (
              <div className="space-y-8">
                {currentUser.role === 'viewer' && (
                  <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg">
                    <span className="text-xl">👁️</span>
                    <p className="text-[10px] font-black uppercase tracking-widest">Alleen Lezen Modus (Mr Ismail) - Wijzigingen worden niet opgeslagen.</p>
                  </div>
                )}

                {hasDraft && currentUser.role !== 'viewer' && (
                  <div className="bg-blue-600 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">💡</span>
                      <div>
                        <p className="font-black text-sm">Onvoltooide sessie gevonden!</p>
                        <p className="text-xs opacity-80">Wilt u doorgaan met de vorige inspectie van {vehicle.inspectorName}?</p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button onClick={restoreDraft} className="flex-1 md:flex-none bg-white text-blue-600 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors">Doorgaan</button>
                      <button onClick={clearDraft} className="flex-1 md:flex-none bg-blue-700 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-colors">Wissen</button>
                    </div>
                  </div>
                )}

                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">STATUS CODES</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {STATUS_CODES.map(c => (
                          <div key={c.code} className="flex items-center gap-2">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${c.color}`}>{c.code}</span>
                            <span className="text-[10px] font-bold text-slate-500">{c.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">BESCHADIGD CODES</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {DAMAGE_CODES.map(c => (
                          <div key={c.code} className="flex items-center gap-2">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${c.color}`}>{c.code}</span>
                            <span className="text-[10px] font-bold text-slate-500">{c.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div ref={reportRef} className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-xl">
                  <div className="mb-12 flex justify-between items-start border-b-2 border-slate-100 pb-10">
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">AutoInspect Report</h2>
                      <div className="flex items-center gap-4">
                        <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-slate-400 uppercase">INTERNAL USE</span>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">PA MOTORS SURINAME</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Datum</p>
                      <p className="text-lg font-black text-slate-900">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <VehicleInfoForm data={vehicle} onChange={setVehicle} />
                  
                  <div className={`grid grid-cols-1 gap-6 ${currentUser.role === 'viewer' ? 'pointer-events-none grayscale-[0.5]' : ''}`}>
                    {sections.map(section => (
                      <InspectionSectionCard key={section.title} section={section} onUpdateItem={updateItem} />
                    ))}
                  </div>

                  <div className="mt-16 border-t pt-10">
                    <div className="flex items-center justify-between bg-slate-50 p-8 rounded-3xl border border-slate-100">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inspecteur</p>
                         <p className="text-2xl font-black text-blue-900 tracking-tight">
                            {vehicle.inspectorName || currentUser.name}
                         </p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Validatie Status</p>
                         <span className="px-6 py-2 bg-amber-100 text-amber-700 rounded-xl text-[10px] font-black uppercase border border-amber-200">Wacht op Double Check</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur-xl p-5 rounded-[2.5rem] border border-slate-200 shadow-2xl z-[100] w-[92%] md:w-auto">
                  {status && <span className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black tracking-widest shadow-2xl uppercase animate-bounce">{status}</span>}
                  
                  {currentUser.role !== 'viewer' ? (
                    <button onClick={handleSave} className="flex-1 md:px-24 py-5 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all uppercase tracking-widest text-[11px]">
                      Opslaan in Garage
                    </button>
                  ) : (
                    <div className="flex-1 md:px-24 py-5 bg-slate-200 text-slate-400 font-black rounded-3xl text-center text-[11px] uppercase tracking-widest">
                      Inzien Modus (Geen Opslag)
                    </div>
                  )}
                  
                  <button onClick={() => handleExportPDF()} className="p-5 bg-slate-100 hover:bg-slate-200 rounded-3xl transition-all shadow-sm" title="Directe PDF">📄</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedReports.length === 0 ? (
                  <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                    <span className="text-5xl mb-6 block">📭</span>
                    <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em]">Geen auto's in de garage</p>
                  </div>
                ) : (
                  savedReports.map(report => (
                    <div key={report.id} className={`bg-white rounded-[3rem] border-2 p-8 flex flex-col transition-all group shadow-sm hover:shadow-2xl relative overflow-hidden ${report.isValidated ? 'border-emerald-100' : 'border-slate-100 hover:border-blue-500'}`}>
                      {report.isValidated && (
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white px-6 py-1.5 rounded-bl-2xl text-[9px] font-black uppercase tracking-widest z-10 shadow-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          Volledig Gevalideerd
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Ref: {report.referenceCode}</span>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{report.vehicle.make}</h3>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{report.vehicle.model} • {report.vehicle.licensePlate}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border-2 ${getStatusColor(report.status)}`}>
                          {report.status}
                        </div>
                      </div>

                      <div className="mb-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                        <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                           <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Inspecteur</p>
                              <p className="text-[11px] font-black text-slate-700">{report.vehicle.inspectorName}</p>
                           </div>
                           <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Validator</p>
                              <p className={`text-[11px] font-black ${report.isValidated ? 'text-emerald-600' : 'text-slate-300 italic'}`}>
                                {report.isValidated ? report.validatedBy : 'Wacht op check...'}
                              </p>
                           </div>
                        </div>
                        
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Checklist Score</p>
                          <div className="flex gap-3 items-center">
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 transition-all duration-1000" 
                                style={{ width: `${(report.sections.reduce((acc, s) => acc + s.items.filter(i => i.ratingCode === '√').length, 0) / report.sections.reduce((acc, s) => acc + s.items.length, 0)) * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-black text-slate-600 whitespace-nowrap">
                              {report.sections.reduce((acc, s) => acc + s.items.filter(i => i.ratingCode === '√').length, 0)} OK
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-8">
                        {(['Available', 'Reserved', 'On-Hold', 'Sold'] as VehicleStatus[]).map(s => (
                          <button 
                            key={s}
                            disabled={report.isValidated || currentUser.role === 'viewer'}
                            onClick={() => updateStatus(report.id, s)}
                            className={`flex-1 h-2 rounded-full transition-all ${report.status === s ? 'scale-y-150' : 'opacity-20'} ${getStatusColor(s).split(' ')[0]} ${report.isValidated || currentUser.role === 'viewer' ? 'cursor-not-allowed' : ''}`}
                            title={s}
                          />
                        ))}
                      </div>

                      <div className="mt-auto space-y-3">
                        {!report.isValidated && currentUser?.role === 'validator' && (
                          <button 
                            onClick={() => handleValidate(report.id)}
                            className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 animate-pulse"
                          >
                            ✅ Valideer Rapport (Ms Binda)
                          </button>
                        )}
                        
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                          <button onClick={() => {
                            setVehicle(report.vehicle);
                            setSections(report.sections);
                            setInspectView('form');
                          }} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${report.isValidated || currentUser.role === 'viewer' ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'}`}>
                            {report.isValidated || currentUser.role === 'viewer' ? 'Inzien' : 'Bewerken'}
                          </button>
                          
                          {currentUser.role !== 'viewer' && (
                            <button onClick={() => deleteReport(report.id)} className="w-14 h-14 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* KABALEBO IS PUBLICLY ACCESSIBLE */}
        {activeTab === 'kabalebo' && <KabaleboModule />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-start gap-2 text-center md:text-left">
            <div className="flex items-center gap-2 grayscale opacity-50 justify-center md:justify-start">
              <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-[10px]">PA</span>
              </div>
              <span className="font-black text-sm tracking-tighter text-slate-900 uppercase">PA-Tools Suite</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enterprise Field Hub v2.3-Secured</p>
          </div>
          <p className="text-slate-400 text-xs font-medium text-center">© 2026 PA-Tools ontworpen door Serge Veldhuizen. Alle rechten voorbehouden.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
