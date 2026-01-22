
import React from 'react';
import { VehicleInfo } from '../types';

interface Props {
  data: VehicleInfo;
  onChange: (data: VehicleInfo) => void;
}

const CAR_MAKES = [
  "Toyota", "Volkswagen", "Ford", "Honda", "Hyundai", 
  "BMW", "Mercedes-Benz", "Audi", "Land Rover", "Chevrolet", 
  "Nissan", "Kia", "Renault", "Peugeot", "Škoda", 
  "Volvo", "Mazda", "Suzuki", "Jeep", "Porsche"
];

// Generate years from current year down to 1990
const currentYear = new Date().getFullYear();
const CAR_YEARS = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => (currentYear - i).toString());

const VehicleInfoForm: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const fields = [
    { name: 'make', label: 'Make', type: 'select', options: CAR_MAKES },
    { name: 'model', label: 'Model', type: 'text', placeholder: 'e.g. Camry' },
    { name: 'year', label: 'Year', type: 'select', options: CAR_YEARS },
    { name: 'vin', label: 'VIN', type: 'text', placeholder: '17-digit number' },
    { name: 'color', label: 'Color', type: 'text', placeholder: 'Silver' },
    { name: 'mileage', label: 'Mileage', type: 'text', placeholder: '45,000' },
    { name: 'licensePlate', label: 'License Plate', type: 'text', placeholder: 'ABC-1234' },
    { name: 'inspectorName', label: 'Inspecteur (Naam)', type: 'text', placeholder: 'Uw volledige naam', readOnly: true },
  ];

  const selectStyle = { 
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, 
    backgroundRepeat: 'no-repeat', 
    backgroundPosition: 'right 0.75rem center', 
    backgroundSize: '1em' 
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 mb-6 md:mb-8">
      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-slate-800 flex items-center gap-2">
        <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs md:text-sm shrink-0">01</span>
        Vehicle Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {fields.map((field) => (
          <div key={field.name} className={field.name === 'inspectorName' ? 'space-y-1 sm:col-span-2' : 'space-y-1'}>
            <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">
              {field.label} {field.name === 'inspectorName' && <span className="text-rose-500">*</span>}
            </label>
            
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={(data as any)[field.name] || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm md:text-base bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none"
                style={selectStyle}
              >
                <option value="">-- Kies {field.label} --</option>
                {field.options?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {field.name === 'make' && <option value="Andere">Andere / Overige</option>}
              </select>
            ) : (
              <input
                type="text"
                name={field.name}
                value={(data as any)[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder}
                readOnly={field.readOnly}
                className={`w-full px-3 py-2 text-sm md:text-base bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${field.name === 'inspectorName' ? 'border-blue-100 font-bold text-blue-900 bg-blue-50/50 cursor-not-allowed' : 'border-slate-200'}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleInfoForm;
