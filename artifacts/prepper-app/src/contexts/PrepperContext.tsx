import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PantryItem {
  id: string;
  name: string;
  caloriesPerItem: number;
  currentQuantity: number;
  targetQuantity: number;
  category: 'tinned' | 'dried' | 'freeze-dried' | 'other';
}

export type MedicineCategory = 'prescription' | 'over-counter' | 'supplements';

export interface MedicineItem {
  id: string;
  name: string;
  doses: number;
  expiry: string; // MM/YYYY
  targetAmount: number;
  category: MedicineCategory;
}

export interface HouseholdSettings {
  numberOfPeople: number;
  dailyCalorieTarget: number;
  litresPerPersonPerDay: number;
  totalLitresStored: number;
}

export interface HealthInputs {
  gender: 'male' | 'female';
  age: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'inches';
  activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extra-active';
}

export type ThemeMode = 'dark' | 'light';

interface PrepperContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  householdSettings: HouseholdSettings;
  updateHouseholdSettings: (settings: Partial<HouseholdSettings>) => void;
  pantryItems: PantryItem[];
  addPantryItem: (item: Omit<PantryItem, 'id'>) => void;
  updatePantryItem: (id: string, updates: Partial<PantryItem>) => void;
  deletePantryItem: (id: string) => void;
  clearPantry: () => void;
  medicineItems: MedicineItem[];
  addMedicineItem: (item: Omit<MedicineItem, 'id'>) => void;
  updateMedicineItem: (id: string, updates: Partial<MedicineItem>) => void;
  deleteMedicineItem: (id: string) => void;
  clearMedicines: () => void;
  healthInputs: HealthInputs;
  updateHealthInputs: (inputs: Partial<HealthInputs>) => void;
}

const PrepperContext = createContext<PrepperContextType | undefined>(undefined);

const defaultPantryItems: PantryItem[] = [
  { id: 'tin-1', name: 'Baked Beans', caloriesPerItem: 300, currentQuantity: 12, targetQuantity: 24, category: 'tinned' },
  { id: 'tin-2', name: 'Canned Tuna', caloriesPerItem: 130, currentQuantity: 8, targetQuantity: 20, category: 'tinned' },
  { id: 'dry-1', name: 'White Rice (1kg bag)', caloriesPerItem: 3500, currentQuantity: 4, targetQuantity: 10, category: 'dried' },
  { id: 'dry-2', name: 'Pasta (500g)', caloriesPerItem: 1750, currentQuantity: 6, targetQuantity: 12, category: 'dried' },
  { id: 'fd-1', name: 'Emergency Ration Pack', caloriesPerItem: 1800, currentQuantity: 2, targetQuantity: 6, category: 'freeze-dried' },
  { id: 'fd-2', name: 'Freeze-Dried Chicken', caloriesPerItem: 250, currentQuantity: 4, targetQuantity: 8, category: 'freeze-dried' },
  { id: 'oth-1', name: 'Protein Bars (box of 12)', caloriesPerItem: 2400, currentQuantity: 3, targetQuantity: 5, category: 'other' },
  { id: 'oth-2', name: 'Meal Replacement Shakes', caloriesPerItem: 200, currentQuantity: 10, targetQuantity: 20, category: 'other' },
];

const defaultMedicineItems: MedicineItem[] = [
  { id: 'rx-1', name: 'Blood Pressure Medication', doses: 30, expiry: '08/2026', targetAmount: 90, category: 'prescription' },
  { id: 'rx-2', name: 'Antibiotic Course', doses: 14, expiry: '03/2027', targetAmount: 42, category: 'prescription' },
  { id: 'otc-1', name: 'Paracetamol', doses: 24, expiry: '06/2027', targetAmount: 96, category: 'over-counter' },
  { id: 'otc-2', name: 'Ibuprofen', doses: 16, expiry: '11/2026', targetAmount: 64, category: 'over-counter' },
  { id: 'sup-1', name: 'Vitamin D3', doses: 60, expiry: '01/2028', targetAmount: 180, category: 'supplements' },
  { id: 'sup-2', name: 'Multivitamin', doses: 30, expiry: '09/2027', targetAmount: 90, category: 'supplements' },
];

const defaultHouseholdSettings: HouseholdSettings = {
  numberOfPeople: 2,
  dailyCalorieTarget: 2000,
  litresPerPersonPerDay: 4,
  totalLitresStored: 0,
};

const defaultHealthInputs: HealthInputs = {
  gender: 'male',
  age: 30,
  weight: 70,
  weightUnit: 'kg',
  height: 175,
  heightUnit: 'cm',
  activityLevel: 'moderately-active',
};

export function PrepperProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('prepper-theme');
    return (stored === 'light' || stored === 'dark') ? stored : 'dark';
  });

  const [householdSettings, setHouseholdSettings] = useState<HouseholdSettings>(() => {
    const stored = localStorage.getItem('prepper-household');
    return stored ? JSON.parse(stored) : defaultHouseholdSettings;
  });

  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    const stored = localStorage.getItem('prepper-pantry');
    return stored ? JSON.parse(stored) : defaultPantryItems;
  });

  const [medicineItems, setMedicineItems] = useState<MedicineItem[]>(() => {
    const stored = localStorage.getItem('prepper-medicines');
    return stored ? JSON.parse(stored) : defaultMedicineItems;
  });

  const [healthInputs, setHealthInputs] = useState<HealthInputs>(() => {
    const stored = localStorage.getItem('prepper-health');
    return stored ? JSON.parse(stored) : defaultHealthInputs;
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('prepper-theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('prepper-household', JSON.stringify(householdSettings));
  }, [householdSettings]);

  useEffect(() => {
    localStorage.setItem('prepper-pantry', JSON.stringify(pantryItems));
  }, [pantryItems]);

  useEffect(() => {
    localStorage.setItem('prepper-medicines', JSON.stringify(medicineItems));
  }, [medicineItems]);

  useEffect(() => {
    localStorage.setItem('prepper-health', JSON.stringify(healthInputs));
  }, [healthInputs]);

  const setThemeMode = (mode: ThemeMode) => setThemeModeState(mode);

  const updateHouseholdSettings = (settings: Partial<HouseholdSettings>) => {
    setHouseholdSettings(prev => ({ ...prev, ...settings }));
  };

  const addPantryItem = (item: Omit<PantryItem, 'id'>) => {
    const newItem: PantryItem = {
      ...item,
      id: `${item.category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setPantryItems(prev => [...prev, newItem]);
  };

  const updatePantryItem = (id: string, updates: Partial<PantryItem>) => {
    setPantryItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deletePantryItem = (id: string) => {
    setPantryItems(prev => prev.filter(item => item.id !== id));
  };

  const clearPantry = () => setPantryItems([]);

  const addMedicineItem = (item: Omit<MedicineItem, 'id'>) => {
    const newItem: MedicineItem = {
      ...item,
      id: `med-${item.category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setMedicineItems(prev => [...prev, newItem]);
  };

  const updateMedicineItem = (id: string, updates: Partial<MedicineItem>) => {
    setMedicineItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteMedicineItem = (id: string) => {
    setMedicineItems(prev => prev.filter(item => item.id !== id));
  };

  const clearMedicines = () => setMedicineItems([]);

  const updateHealthInputs = (inputs: Partial<HealthInputs>) => {
    setHealthInputs(prev => ({ ...prev, ...inputs }));
  };

  return (
    <PrepperContext.Provider
      value={{
        themeMode,
        setThemeMode,
        householdSettings,
        updateHouseholdSettings,
        pantryItems,
        addPantryItem,
        updatePantryItem,
        deletePantryItem,
        clearPantry,
        medicineItems,
        addMedicineItem,
        updateMedicineItem,
        deleteMedicineItem,
        clearMedicines,
        healthInputs,
        updateHealthInputs,
      }}
    >
      {children}
    </PrepperContext.Provider>
  );
}

export function usePrepper() {
  const context = useContext(PrepperContext);
  if (!context) {
    throw new Error('usePrepper must be used within PrepperProvider');
  }
  return context;
}
