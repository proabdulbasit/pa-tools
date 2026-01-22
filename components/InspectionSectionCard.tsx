
import React from 'react';
import { InspectionSection, InspectionItem, RatingCode, DamageLevel } from '../types';
import { STATUS_CODES, DAMAGE_CODES } from '../constants';

interface Props {
  section: InspectionSection;
  onUpdateItem: (sectionTitle: string, itemId: string, updates: Partial<InspectionItem>) => void;
}

const InspectionSectionCard: React.FC<Props> = ({ section, onUpdateItem }) => {
  const handlePhotoUpload = async (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const base64Photos: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const promise = new Promise<string>((resolve) => {
        reader.onload = (event) => resolve(event.target?.result as string);
      });
      reader.readAsDataURL(files[i]);
      base64Photos.push(await promise);
    }
    // Append to existing photos instead of replacing
    const item = section.items.find(i => i.id === itemId);
    onUpdateItem(section.title, itemId, { photos: [...(item?.photos || []), ...base64Photos] });
  };

  const setStatus = (item: InspectionItem, code: RatingCode) => {
    onUpdateItem(section.title, item.id, { 
      ratingCode: item.ratingCode === code ? undefined : code,
      rating: code === '√' ? 1 : 0 
    });
  };

  const setDamage = (item: InspectionItem, damage: DamageLevel) => {
    onUpdateItem(section.title, item.id, { 
      damageLevel: item.damageLevel === damage ? undefined : damage,
      hasDamage: true // Auto-toggle damage if a level is selected
    });
  };

  const toggleDamageSwitch = (item: InspectionItem) => {
    const newState = !item.hasDamage;
    onUpdateItem(section.title, item.id, { 
      hasDamage: newState,
      // If turning off damage, also clear damage level
      damageLevel: newState ? item.damageLevel : undefined
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="bg-slate-900 px-6 py-3 flex justify-between items-center">
        <h3 className="font-black text-white text-sm tracking-widest uppercase">{section.title}</h3>
        <span className="text-[10px] text-slate-400 font-bold">AANVINKBAAR</span>
      </div>
      <div className="divide-y divide-slate-100">
        {section.items.map((item) => {
          const photoRequired = item.hasDamage && item.photos.length === 0;
          
          return (
            <div key={item.id} className={`p-4 md:p-6 transition-colors ${photoRequired ? 'bg-rose-50/30' : 'hover:bg-slate-50/50'}`}>
              <div className="flex flex-col gap-6">
                
                {/* Header: Label and Main Status */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm border-2 ${item.ratingCode === '√' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                      {item.ratingCode === '√' ? '√' : ''}
                    </div>
                    <div className="flex flex-col">
                      <p className={`font-black text-sm tracking-tight ${item.ratingCode || item.hasDamage ? 'text-slate-900' : 'text-slate-400'}`}>
                        {item.label}
                      </p>
                      {photoRequired && (
                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Foto Verplicht!</span>
                      )}
                    </div>
                  </div>

                  {/* Damage Toggle Switch */}
                  <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button 
                      onClick={() => toggleDamageSwitch(item)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${!item.hasDamage ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      GEEN SCHADE
                    </button>
                    <button 
                      onClick={() => toggleDamageSwitch(item)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${item.hasDamage ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400'}`}
                    >
                      SCHADE
                    </button>
                  </div>

                  {/* Status Codes Row */}
                  <div className="flex flex-wrap gap-1">
                    {STATUS_CODES.map((sc) => (
                      <button
                        key={sc.code}
                        onClick={() => setStatus(item, sc.code as RatingCode)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                          item.ratingCode === sc.code 
                            ? sc.color + " ring-2 ring-offset-1 ring-slate-900 scale-105" 
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {sc.code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secondary Options: Damage & Notes */}
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-start transition-opacity ${!item.hasDamage ? 'opacity-50' : 'opacity-100'}`}>
                  
                  {/* Damage Levels */}
                  <div className="lg:col-span-4 space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Beschadigd Niveau (1-5)</p>
                    <div className="flex gap-1">
                      {DAMAGE_CODES.map((dc) => (
                        <button
                          key={dc.code}
                          disabled={!item.hasDamage}
                          onClick={() => setDamage(item, dc.code as DamageLevel)}
                          title={dc.label}
                          className={`flex-1 py-2 rounded-lg text-xs font-black transition-all border-2 ${
                            item.damageLevel === dc.code 
                              ? dc.color + " border-slate-900 scale-105" 
                              : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                          } ${!item.hasDamage ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                          {dc.code}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes & Photos */}
                  <div className="lg:col-span-8 flex flex-col md:flex-row gap-3">
                    <textarea
                      placeholder="Extra opmerkingen..."
                      value={item.notes}
                      onChange={(e) => onUpdateItem(section.title, item.id, { notes: e.target.value })}
                      className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none h-16"
                    />
                    <div className="flex flex-col gap-2 shrink-0 md:w-40">
                      <label className={`flex flex-col items-center justify-center gap-1 px-4 py-2 border-2 border-dashed rounded-xl transition-all cursor-pointer h-full ${photoRequired ? 'bg-rose-50 border-rose-400 text-rose-500 animate-pulse' : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'}`}>
                        <span className="text-xl">📸</span>
                        <span className="text-[8px] font-black uppercase text-center leading-tight">
                          {item.hasDamage ? 'FOTO BEWIJS VERPLICHT' : 'VOEG FOTO TOE'}
                        </span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(item.id, e)} />
                      </label>
                      {item.photos.length > 0 && (
                        <div className="flex gap-1 overflow-x-auto pb-1 max-w-full">
                          {item.photos.map((src, idx) => (
                            <div key={idx} className="relative shrink-0">
                               <img src={src} className="w-8 h-8 object-cover rounded border shadow-sm" alt="Preview" />
                               <button 
                                 onClick={() => {
                                   const newPhotos = [...item.photos];
                                   newPhotos.splice(idx, 1);
                                   onUpdateItem(section.title, item.id, { photos: newPhotos });
                                 }}
                                 className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]"
                               >
                                 ×
                               </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InspectionSectionCard;
