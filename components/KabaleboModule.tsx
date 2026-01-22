
import React, { useState, useEffect, useRef } from 'react';
import { KabaleboState, FoodEntry, FuelEntry, PartEntry } from '../types';
import { MACHINE_INVENTORY, MachineInventoryItem } from '../constants';

const KabaleboModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'food' | 'fuel' | 'parts' | 'reports'>('food');
  const [state, setState] = useState<KabaleboState>(() => {
    const saved = localStorage.getItem('kabalebo_data');
    return saved ? JSON.parse(saved) : { food: [], fuel: [], parts: [] };
  });

  const [selectedMachine, setSelectedMachine] = useState<MachineInventoryItem | null>(null);
  const [currentFuelPhoto, setCurrentFuelPhoto] = useState<string>('');
  const [currentPartPhoto, setCurrentPartPhoto] = useState<string>('');
  const [pendingFood, setPendingFood] = useState<FoodEntry[]>([]);
  const [pendingParts, setPendingParts] = useState<PartEntry[]>([]);
  const [reportRange, setReportRange] = useState<'day' | 'week' | 'month'>('day');
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('kabalebo_data', JSON.stringify(state));
  }, [state]);

  const handlePhotoRead = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const addPendingFood = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const entry: FoodEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      item: formData.get('item') as string,
      category: formData.get('category') as any,
      quantity: Number(formData.get('quantity')),
      unit: formData.get('unit') as any,
      packaging: formData.get('packaging') as string,
      recordedBy: formData.get('recordedBy') as string,
      isLocked: false
    };
    setPendingFood([...pendingFood, entry]);
    e.currentTarget.reset();
  };

  const commitFood = () => {
    if (pendingFood.length === 0) return;
    if (confirm(`Wilt u deze ${pendingFood.length} items definitief afschrijven?`)) {
      const lockedItems = pendingFood.map(item => ({ ...item, isLocked: true }));
      setState(prev => ({ ...prev, food: [...lockedItems, ...prev.food] }));
      setPendingFood([]);
    }
  };

  const addFuel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentFuelPhoto) {
      alert("Foto van de pomp/bon is verplicht voor brandstof!");
      return;
    }
    if (!selectedMachine) {
      alert("Selecteer eerst een Machine!");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const entry: FuelEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      liters: Number(formData.get('liters')),
      type: formData.get('type') as any,
      targetMachine: selectedMachine.id,
      meterStart: formData.get('meterStart') as string,
      meterEnd: formData.get('meterEnd') as string,
      hoursStart: formData.get('hoursStart') as string,
      hoursEnd: "", 
      kmStart: formData.get('kmStart') as string,
      kmEnd: "", 
      operator: formData.get('operator') as string,
      photo: currentFuelPhoto,
      isLocked: true
    };
    setState(prev => ({ ...prev, fuel: [entry, ...prev.fuel] }));
    setCurrentFuelPhoto('');
    setSelectedMachine(null);
    e.currentTarget.reset();
  };

  const addPendingPart = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentPartPhoto) {
      alert("Foto van het onderdeel is verplicht!");
      return;
    }
    if (!selectedMachine) {
      alert("Selecteer eerst een Machine!");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const entry: PartEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      partName: formData.get('name') as string,
      partNumber: formData.get('number') as string,
      machineId: selectedMachine.id,
      mechanic: formData.get('mechanic') as string,
      workOrder: formData.get('workOrder') as string,
      condition: formData.get('condition') as any,
      reason: formData.get('reason') as string,
      photo: currentPartPhoto,
      isLocked: false
    };
    setPendingParts([...pendingParts, entry]);
    setCurrentPartPhoto('');
    setSelectedMachine(null);
    e.currentTarget.reset();
  };

  const commitParts = () => {
    if (pendingParts.length === 0) return;
    if (confirm(`Wilt u deze ${pendingParts.length} onderdelen definitief registreren?`)) {
      const lockedItems = pendingParts.map(item => ({ ...item, isLocked: true }));
      setState(prev => ({ ...prev, parts: [...lockedItems, ...prev.parts] }));
      setPendingParts([]);
    }
  };

  const deletePending = (type: 'food' | 'parts', id: string) => {
    if (type === 'food') setPendingFood(pendingFood.filter(i => i.id !== id));
    else setPendingParts(pendingParts.filter(i => i.id !== id));
  };

  const exportReport = async () => {
    if (!reportRef.current) return;
    try {
      const { jsPDF } = (window as any).jspdf;
      const html2canvas = (window as any).html2canvas;
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Kabalebo-Report-${reportRange}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      alert('Fout bij genereren report');
    }
  };

  const filterByRange = (data: any[]) => {
    const now = new Date();
    return data.filter(item => {
      const itemDate = new Date(item.date);
      if (reportRange === 'day') return itemDate.toDateString() === now.toDateString();
      if (reportRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return itemDate >= weekAgo;
      }
      if (reportRange === 'month') {
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const getAtvColorStyle = (color?: string) => {
    if (!color) return "";
    switch (color.toUpperCase()) {
      case 'GROEN': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'ROOD': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'CRÈME': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
        {[
          { id: 'food', icon: '🍲', label: 'Voeding', color: 'teal' },
          { id: 'fuel', icon: '⛽', label: 'Brandstof', color: 'orange' },
          { id: 'parts', icon: '⚙️', label: 'Onderdelen', color: 'blue' },
          { id: 'reports', icon: '📊', label: 'Rapporten', color: 'slate' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id as any);
              setSelectedMachine(null);
            }}
            className={`flex-1 min-w-[120px] py-4 px-6 rounded-2xl font-bold transition-all shadow-sm flex flex-col items-center gap-2 ${
              activeSubTab === tab.id 
              ? `bg-${tab.color}-600 text-white shadow-${tab.color}-200 shadow-lg scale-105` 
              : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="text-2xl">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 min-h-[500px]">
        
        {activeSubTab === 'food' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Bulk Voeding Afschrijven</h2>
            <form onSubmit={addPendingFood} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-2xl border border-teal-100">
              <div className="flex flex-col gap-1 lg:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Item Name *</label>
                <input name="item" required className="p-3 rounded-xl border border-slate-200 text-sm" placeholder="Bijv. Rijst" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Aantal *</label>
                <input name="quantity" type="number" step="0.01" required className="p-3 rounded-xl border" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Unit *</label>
                <select name="unit" required className="p-3 rounded-xl border">
                  <option value="kg">kg</option>
                  <option value="liter">liter</option>
                  <option value="zak">zak</option>
                  <option value="doos">doos</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 lg:col-span-2">
                <label className="text-[10px] font-bold text-rose-500 uppercase font-black tracking-widest">Afgeschreven door (Naam) *</label>
                <input name="recordedBy" required className="p-3 rounded-xl border-2 border-rose-100 focus:border-rose-400 outline-none" placeholder="Wie schrijft dit af?" />
              </div>
              <div className="flex items-end lg:col-span-2">
                <button type="submit" className="w-full bg-teal-600 text-white font-black h-12 rounded-xl hover:bg-teal-700 transition-all">+ Voeg toe aan lijst</button>
              </div>
            </form>

            {pendingFood.length > 0 && (
              <div className="bg-teal-50/50 rounded-2xl p-6 border-2 border-dashed border-teal-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-teal-800 text-lg">Wachtrij ({pendingFood.length})</h3>
                  <button onClick={commitFood} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-black shadow-xl shadow-teal-200">DEFINITIEF OPSLAAN</button>
                </div>
                <div className="space-y-2">
                  {pendingFood.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm border border-teal-100">
                      <div>
                        <span className="font-bold text-slate-800">{item.item} - {item.quantity} {item.unit}</span>
                        <p className="text-[10px] text-slate-400">Door: {item.recordedBy}</p>
                      </div>
                      <button onClick={() => deletePending('food', item.id)} className="text-rose-400">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="overflow-x-auto mt-8">
              <table className="w-full text-left text-sm">
                <thead className="text-slate-400 border-b border-slate-50 uppercase text-[10px] font-black">
                  <tr><th className="pb-4">Datum</th><th className="pb-4">Omschrijving</th><th className="pb-4">Afgeschreven door</th><th className="pb-4 text-right">Aantal</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {state.food.map(f => (
                    <tr key={f.id} className="text-slate-600">
                      <td className="py-4 text-xs font-mono">{f.date}</td>
                      <td className="py-4 font-bold">{f.item}</td>
                      <td className="py-4 text-xs">{f.recordedBy}</td>
                      <td className="py-4 text-right">{f.quantity} {f.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BRANDSTOF & ONDERDELEN - Machine Selection UI */}
        {(activeSubTab === 'fuel' || activeSubTab === 'parts') && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selecteer Machine / Equipment *</label>
                  <select 
                    onChange={(e) => {
                      const m = MACHINE_INVENTORY.find(item => item.id === e.target.value);
                      setSelectedMachine(m || null);
                    }}
                    value={selectedMachine?.id || ''}
                    className="p-4 rounded-xl border-2 border-slate-200 font-black text-slate-800 bg-white shadow-sm focus:border-blue-500 outline-none"
                  >
                    <option value="">-- Kies een machine van de lijst --</option>
                    {MACHINE_INVENTORY.map(m => {
                      const isExcavator = m.type.toUpperCase() === 'GRAAFMACHINE' || m.name.toUpperCase().includes('EXCAVATOR');
                      const extraInfo = m.color ? `[${m.color.toUpperCase()}]` : isExcavator ? `[Chassis: ${m.chassis.slice(-6)}]` : '';
                      return (
                        <option key={m.id} value={m.id}>
                          {m.id} {extraInfo} | {m.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {selectedMachine && (
                  <div className="bg-white rounded-xl p-6 border-2 border-blue-100 shadow-md animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Equipment Name</p>
                        <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          {selectedMachine.name}
                          {selectedMachine.color && (
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border-2 ${getAtvColorStyle(selectedMachine.color)}`}>
                              {selectedMachine.color}
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Type</p>
                        <p className="font-bold text-blue-600 text-sm">{selectedMachine.type}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Chassis #</p>
                        <p className="font-mono font-bold text-slate-700 text-xs">{selectedMachine.chassis || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Plate # / NR</p>
                        <p className="font-bold text-slate-900 text-sm">{selectedMachine.plate || 'N/A'}</p>
                      </div>
                      {selectedMachine.notes && (
                        <div className="col-span-2 md:col-span-4 mt-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                          <p className="text-[9px] font-black text-amber-600 uppercase">Notes (OPM)</p>
                          <p className="font-bold text-amber-800 text-xs">{selectedMachine.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FUEL FORM */}
            {activeSubTab === 'fuel' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-slate-800">Brandstof Registratie</h2>
                  <span className="bg-rose-100 text-rose-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Foto Verplicht!</span>
                </div>
                
                <form onSubmit={addFuel} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-2xl border border-orange-100">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Liters *</label>
                    <input name="liters" type="number" step="0.1" required className="p-3 rounded-xl border font-black" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Brandstof Type *</label>
                    <select name="type" required className="p-3 rounded-xl border font-bold text-orange-600">
                      <option value="Diesel">Diesel</option>
                      <option value="Gasoline">Gasoline</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Selected Machine</label>
                    <div className="p-3 rounded-xl bg-white border border-slate-200 font-black text-blue-600 text-sm">
                      {selectedMachine?.id || 'Geen selectie'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Operator Naam *</label>
                    <input name="operator" placeholder="Operator" required className="p-3 rounded-xl border" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Pomp Start *</label>
                    <input name="meterStart" required className="p-3 rounded-xl border" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Pomp Eind *</label>
                    <input name="meterEnd" required className="p-3 rounded-xl border" />
                  </div>
                  <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">KM-stand</label>
                      <input name="kmStart" placeholder="0" className="p-3 rounded-xl border" />
                  </div>
                  <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Urenstand</label>
                      <input name="hoursStart" placeholder="0.0" className="p-3 rounded-xl border" />
                  </div>

                  <div className="md:col-span-4 p-4 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <label className="flex flex-col items-center justify-center cursor-pointer py-4">
                      {currentFuelPhoto ? (
                        <div className="relative">
                          <img src={currentFuelPhoto} className="h-32 rounded-xl border shadow-md" alt="Fuel Proof" />
                          <button type="button" onClick={() => setCurrentFuelPhoto('')} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1">×</button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-3xl">📸</span>
                          <span className="text-xs font-black text-rose-500 uppercase tracking-widest">Maak foto van pomp/bon (Verplicht)</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handlePhotoRead(e.target.files[0], setCurrentFuelPhoto)} />
                    </label>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={!currentFuelPhoto || !selectedMachine}
                    className={`md:col-span-4 font-black h-14 rounded-xl shadow-lg transition-all ${currentFuelPhoto && selectedMachine ? 'bg-orange-500 text-white shadow-orange-200 hover:bg-orange-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                  >
                    {!selectedMachine ? 'SELECTEER MACHINE EERST' : currentFuelPhoto ? 'OPSLAAN & LOCKEN' : 'FOTO VERPLICHT'}
                  </button>
                </form>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-slate-400 border-b border-slate-100 uppercase font-black">
                      <tr><th className="pb-3">Datum</th><th className="pb-3">Machine</th><th className="pb-3">Type</th><th className="pb-3">Liters</th><th className="pb-3 text-right">Pomp</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {state.fuel.map(f => (
                        <tr key={f.id} className="text-slate-600">
                          <td className="py-4 font-mono">{f.date}</td>
                          <td className="py-4 font-bold">{f.targetMachine}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${f.type === 'Diesel' ? 'bg-slate-100 text-slate-600' : 'bg-orange-100 text-orange-600'}`}>{f.type}</span>
                          </td>
                          <td className="py-4 font-black text-orange-600">{f.liters} L</td>
                          <td className="py-4 text-right font-mono text-[10px] text-slate-400">{f.meterStart} → {f.meterEnd}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PARTS FORM */}
            {activeSubTab === 'parts' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-slate-800">Onderhoud Bulk Registratie</h2>
                  <span className="bg-rose-100 text-rose-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Foto per onderdeel verplicht!</span>
                </div>
                
                <form onSubmit={addPendingPart} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-6 rounded-2xl border border-blue-100">
                  <input name="name" placeholder="Onderdeel Naam *" required className="p-3 rounded-xl border" />
                  <input name="number" placeholder="Part Number *" required className="p-3 rounded-xl border font-mono text-xs" />
                  
                  <div className="p-3 rounded-xl bg-white border border-slate-200 font-black text-blue-600 text-sm flex items-center">
                    ID: {selectedMachine?.id || 'Kies machine boven'}
                  </div>

                  <input name="mechanic" placeholder="Monteur Naam *" required className="p-3 rounded-xl border" />
                  <input name="workOrder" placeholder="Work Order #" required className="p-3 rounded-xl border" />
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-rose-500 uppercase">Bewijs Foto *</label>
                    <label className={`flex items-center justify-center p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${currentPartPhoto ? 'bg-blue-50 border-blue-300' : 'bg-white border-rose-200'}`}>
                      {currentPartPhoto ? '✅ Foto Klaar' : '📸 Maak Foto'}
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handlePhotoRead(e.target.files[0], setCurrentPartPhoto)} />
                    </label>
                  </div>

                  <textarea name="reason" placeholder="Reden van vervanging..." className="md:col-span-2 p-3 rounded-xl border h-12" />
                  
                  <button 
                    type="submit" 
                    disabled={!currentPartPhoto || !selectedMachine}
                    className={`bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-md h-12 ${(!currentPartPhoto || !selectedMachine) && 'opacity-50 cursor-not-allowed'}`}
                  >
                    {!selectedMachine ? 'MACHINE EERST' : currentPartPhoto ? '+ Onderdeel Toevoegen' : 'FOTO VERPLICHT'}
                  </button>
                </form>

                {pendingParts.length > 0 && (
                  <div className="bg-blue-50 rounded-2xl p-6 border-2 border-dashed border-blue-200">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-black text-blue-800 text-lg">Wachtrij Onderdelen ({pendingParts.length})</h3>
                      <button onClick={commitParts} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black shadow-xl shadow-blue-200">REGISTREER ALLES</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {pendingParts.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm border border-blue-100">
                          <div className="flex items-center gap-3">
                            <img src={item.photo} className="w-10 h-10 rounded object-cover" alt="Proof" />
                            <div>
                              <p className="font-bold text-slate-800 text-xs">{item.partName}</p>
                              <p className="text-[9px] text-slate-400 font-mono">{item.machineId} • WO:{item.workOrder}</p>
                            </div>
                          </div>
                          <button onClick={() => deletePending('parts', item.id)} className="text-rose-400">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto mt-8">
                   <table className="w-full text-left text-xs">
                    <thead className="text-slate-400 border-b border-slate-50 uppercase font-black">
                      <tr><th className="pb-3">Datum</th><th className="pb-3">Foto</th><th className="pb-3">Onderdeel</th><th className="pb-3">Machine</th><th className="pb-3">Monteur</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {state.parts.map(p => (
                        <tr key={p.id} className="text-slate-600">
                          <td className="py-4 font-mono">{p.date}</td>
                          <td className="py-4">
                            <img src={p.photo} className="w-8 h-8 rounded border object-cover" alt="Part" onClick={() => window.open(p.photo)} />
                          </td>
                          <td className="py-4"><strong>{p.partName}</strong><br/><span className="text-[10px] font-mono text-slate-400">{p.partNumber}</span></td>
                          <td className="py-4 font-bold text-blue-600">{p.machineId}</td>
                          <td className="py-4">{p.mechanic}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* REPORTS */}
        {activeSubTab === 'reports' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Mijn Inventaris Rapportage</h2>
                <p className="text-slate-500 font-medium">Overzicht van verbruik inclusief bewijsvoering (foto's).</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {(['day', 'week', 'month'] as const).map(range => (
                  <button 
                    key={range} onClick={() => setReportRange(range)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${reportRange === range ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {range === 'day' ? 'Dag' : range === 'week' ? 'Week' : 'Maand'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={exportReport} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl flex items-center gap-2 active:scale-95 transition-transform">
                📄 EXPORT PDF
              </button>
            </div>

            <div ref={reportRef} className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 space-y-12">
              <div className="border-b border-slate-100 pb-8 flex justify-between">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">Kabalebo Operations</h3>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Monthly Inventory & Maintenance Report</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 capitalize text-xl">{reportRange}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Fuel Section in Report */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-800 text-sm border-l-4 border-orange-500 pl-3 uppercase">Brandstof Log (incl. Foto)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filterByRange(state.fuel).map(f => (
                    <div key={f.id} className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <img src={f.photo} className="w-16 h-16 rounded-lg object-cover" alt="Proof" />
                      <div className="text-[10px] flex-1">
                        <p className="font-black text-slate-900 uppercase">{f.targetMachine} - {f.liters}L ({f.type})</p>
                        <p className="text-slate-500">{f.date} | By: {f.operator}</p>
                        <p className="font-mono text-slate-400 mt-1">Pomp: {f.meterStart} → {f.meterEnd}</p>
                        <p className="font-mono text-slate-400">KM: {f.kmStart||0} | Uren: {f.hoursStart||0}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parts Section in Report */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-800 text-sm border-l-4 border-blue-500 pl-3 uppercase">Onderhoud & Onderdelen (incl. Foto)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filterByRange(state.parts).map(p => (
                    <div key={p.id} className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <img src={p.photo} className="w-16 h-16 rounded-lg object-cover" alt="Part Proof" />
                      <div className="text-[10px] flex-1">
                        <p className="font-black text-slate-900 uppercase">{p.partName}</p>
                        <p className="text-slate-500">{p.date} | Machine: {p.machineId}</p>
                        <p className="text-slate-400 mt-1">Monteur: {p.mechanic}</p>
                        <p className="text-slate-400">Part #: {p.partNumber} | WO: {p.workOrder}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Food Section in Report */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-800 text-sm border-l-4 border-teal-500 pl-3 uppercase">Voedings Afschrijving</h4>
                <table className="w-full text-left text-[10px]">
                  <thead className="bg-slate-50 text-slate-400 font-black uppercase">
                    <tr><th className="p-2">Datum</th><th className="p-2">Item</th><th className="p-2">Door</th><th className="p-2 text-right">Aantal</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filterByRange(state.food).map(f => (
                      <tr key={f.id} className="text-slate-600">
                        <td className="p-2">{f.date}</td>
                        <td className="p-2 font-bold">{f.item}</td>
                        <td className="p-2 font-mono uppercase text-[9px]">{f.recordedBy}</td>
                        <td className="p-2 text-right font-black">{f.quantity} {f.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-between items-center opacity-30">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Internal Use Only • PA-Tools Kabalebo Node</p>
                <span className="text-[8px] font-black">TIMESTAMP: {new Date().toISOString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KabaleboModule;
