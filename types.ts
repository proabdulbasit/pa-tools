
export type RatingCode = '√' | 'O' | 'K' | 'D' | 'X' | 'B' | 'nvt';
export type DamageLevel = '1' | '2' | '3' | '4' | '5';
export type VehicleStatus = 'Available' | 'Reserved' | 'On-Hold' | 'Sold';

export interface VehicleInfo {
  make: string;
  model: string;
  year: string;
  vin: string;
  color: string;
  mileage: string;
  licensePlate: string;
  inspectorName?: string;
}

export interface InspectionItem {
  id: string;
  label: string;
  rating: number;
  ratingCode?: RatingCode;
  damageLevel?: DamageLevel;
  hasDamage?: boolean;
  notes: string;
  photos: string[];
}

export interface InspectionSection {
  title: string;
  items: InspectionItem[];
}

export interface InspectionReport {
  id: string; 
  referenceCode: string;
  date: string; 
  vehicle: VehicleInfo; 
  sections: InspectionSection[];
  status: VehicleStatus;
  isValidated?: boolean;
  validatedBy?: string;
  validatedAt?: string;
}

export interface KabaleboState {
  food: FoodEntry[];
  fuel: FuelEntry[];
  parts: PartEntry[];
}

export interface FoodEntry {
  id: string; date: string; item: string; category: string; quantity: number; unit: string; packaging: string; recordedBy: string; isLocked?: boolean;
}

export interface FuelEntry {
  id: string; date: string; liters: number; type: 'Gasoline' | 'Diesel'; targetMachine: string; meterStart: string; meterEnd: string; hoursStart: string; hoursEnd: string; kmStart: string; kmEnd: string; operator: string; photo: string; isLocked?: boolean;
}

export interface PartEntry {
  id: string; date: string; partName: string; partNumber: string; machineId: string; mechanic: string; workOrder: string; condition: 'Nieuw' | 'Gereviseerd'; reason: string; photo: string; isLocked?: boolean;
}
