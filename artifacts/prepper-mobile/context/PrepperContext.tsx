import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PantryCategory = 'Tinned' | 'Dried' | 'Freeze-Dried' | 'Other';
export type MedicineCategory = 'Prescription' | 'Over Counter' | 'Supplements';

export interface PantryItem {
  id: string;
  name: string;
  caloriesPerItem: number;
  currentQty: number;
  targetQty: number;
  category: PantryCategory;
}

export interface MedicineItem {
  id: string;
  name: string;
  doses: number;
  expiry: string; // "MM/YYYY"
  targetAmount: number;
  category: MedicineCategory;
}

interface PrepperState {
  numPeople: number;
  caloriesPerPerson: number;
  litresPerPersonPerDay: number;
  totalLitresStored: number;
  pantry: PantryItem[];
  medicines: MedicineItem[];
}

interface PrepperContextValue extends PrepperState {
  setNumPeople: (n: number) => void;
  setCaloriesPerPerson: (n: number) => void;
  setLitresPerPersonPerDay: (n: number) => void;
  setTotalLitresStored: (n: number) => void;
  updateItemQty: (id: string, delta: number) => void;
  setItemQty: (id: string, qty: number) => void;
  addPantryItem: (item: Omit<PantryItem, 'id'>) => void;
  deletePantryItem: (id: string) => void;
  clearPantry: () => void;
  updateMedicineDoses: (id: string, delta: number) => void;
  setMedicineDoses: (id: string, doses: number) => void;
  addMedicineItem: (item: Omit<MedicineItem, 'id'>) => void;
  deleteMedicineItem: (id: string) => void;
  clearMedicines: () => void;
  applyTdee: (tdee: number) => void;
  totalCaloriesStored: number;
  daysOfFoodRemaining: number;
  daysOfWaterRemaining: number;
}

const DEFAULT_PANTRY: PantryItem[] = [
  { id: 'p1', name: 'Baked Beans', caloriesPerItem: 300, currentQty: 12, targetQty: 24, category: 'Tinned' },
  { id: 'p2', name: 'Canned Tuna', caloriesPerItem: 130, currentQty: 8, targetQty: 20, category: 'Tinned' },
  { id: 'p3', name: 'White Rice (1kg bag)', caloriesPerItem: 3500, currentQty: 4, targetQty: 10, category: 'Dried' },
  { id: 'p4', name: 'Pasta (500g)', caloriesPerItem: 1750, currentQty: 6, targetQty: 12, category: 'Dried' },
  { id: 'p5', name: 'Emergency Ration Pack', caloriesPerItem: 1800, currentQty: 2, targetQty: 6, category: 'Freeze-Dried' },
  { id: 'p6', name: 'Freeze-Dried Chicken', caloriesPerItem: 250, currentQty: 4, targetQty: 8, category: 'Freeze-Dried' },
  { id: 'p7', name: 'Protein Bars (box of 12)', caloriesPerItem: 2400, currentQty: 3, targetQty: 5, category: 'Other' },
  { id: 'p8', name: 'Meal Replacement Shakes', caloriesPerItem: 200, currentQty: 10, targetQty: 20, category: 'Other' },
];

const DEFAULT_MEDICINES: MedicineItem[] = [
  { id: 'm1', name: 'Blood Pressure Medication', doses: 30, expiry: '06/2026', targetAmount: 90, category: 'Prescription' },
  { id: 'm2', name: 'Antibiotic Course', doses: 2, expiry: '12/2025', targetAmount: 4, category: 'Prescription' },
  { id: 'm3', name: 'Ibuprofen', doses: 48, expiry: '03/2027', targetAmount: 100, category: 'Over Counter' },
  { id: 'm4', name: 'Antihistamines', doses: 14, expiry: '09/2026', targetAmount: 60, category: 'Over Counter' },
  { id: 'm5', name: 'Vitamin C', doses: 60, expiry: '01/2027', targetAmount: 120, category: 'Supplements' },
  { id: 'm6', name: 'Multivitamin', doses: 30, expiry: '06/2026', targetAmount: 90, category: 'Supplements' },
];

const DEFAULT_STATE: PrepperState = {
  numPeople: 2,
  caloriesPerPerson: 2000,
  litresPerPersonPerDay: 4,
  totalLitresStored: 40,
  pantry: DEFAULT_PANTRY,
  medicines: DEFAULT_MEDICINES,
};

const STORAGE_KEY = '@prepper_data_v2';

const PrepperContext = createContext<PrepperContextValue | null>(null);

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function PrepperProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PrepperState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Partial<PrepperState>;
          setState((prev) => ({ ...prev, ...parsed }));
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }
  }, [state, loaded]);

  const totalCaloriesStored = state.pantry.reduce(
    (sum, item) => sum + item.caloriesPerItem * item.currentQty,
    0
  );
  const dailyCaloriesNeeded = state.numPeople * state.caloriesPerPerson;
  const daysOfFoodRemaining = dailyCaloriesNeeded > 0 ? totalCaloriesStored / dailyCaloriesNeeded : 0;
  const dailyWaterNeeded = state.numPeople * state.litresPerPersonPerDay;
  const daysOfWaterRemaining = dailyWaterNeeded > 0 ? state.totalLitresStored / dailyWaterNeeded : 0;

  const setNumPeople = useCallback((n: number) => setState((s) => ({ ...s, numPeople: Math.max(1, n) })), []);
  const setCaloriesPerPerson = useCallback((n: number) => setState((s) => ({ ...s, caloriesPerPerson: Math.max(1, n) })), []);
  const setLitresPerPersonPerDay = useCallback((n: number) => setState((s) => ({ ...s, litresPerPersonPerDay: Math.max(0.1, n) })), []);
  const setTotalLitresStored = useCallback((n: number) => setState((s) => ({ ...s, totalLitresStored: Math.max(0, n) })), []);

  const updateItemQty = useCallback((id: string, delta: number) => {
    setState((s) => ({
      ...s,
      pantry: s.pantry.map((item) =>
        item.id === id ? { ...item, currentQty: Math.max(0, item.currentQty + delta) } : item
      ),
    }));
  }, []);

  const setItemQty = useCallback((id: string, qty: number) => {
    setState((s) => ({
      ...s,
      pantry: s.pantry.map((item) =>
        item.id === id ? { ...item, currentQty: Math.max(0, isNaN(qty) ? 0 : qty) } : item
      ),
    }));
  }, []);

  const addPantryItem = useCallback((item: Omit<PantryItem, 'id'>) => {
    setState((s) => ({ ...s, pantry: [...s.pantry, { ...item, id: genId() }] }));
  }, []);

  const deletePantryItem = useCallback((id: string) => {
    setState((s) => ({ ...s, pantry: s.pantry.filter((i) => i.id !== id) }));
  }, []);

  const clearPantry = useCallback(() => {
    setState((s) => ({ ...s, pantry: [] }));
  }, []);

  const updateMedicineDoses = useCallback((id: string, delta: number) => {
    setState((s) => ({
      ...s,
      medicines: s.medicines.map((item) =>
        item.id === id ? { ...item, doses: Math.max(0, item.doses + delta) } : item
      ),
    }));
  }, []);

  const setMedicineDoses = useCallback((id: string, doses: number) => {
    setState((s) => ({
      ...s,
      medicines: s.medicines.map((item) =>
        item.id === id ? { ...item, doses: Math.max(0, isNaN(doses) ? 0 : doses) } : item
      ),
    }));
  }, []);

  const addMedicineItem = useCallback((item: Omit<MedicineItem, 'id'>) => {
    setState((s) => ({ ...s, medicines: [...s.medicines, { ...item, id: genId() }] }));
  }, []);

  const deleteMedicineItem = useCallback((id: string) => {
    setState((s) => ({ ...s, medicines: s.medicines.filter((i) => i.id !== id) }));
  }, []);

  const clearMedicines = useCallback(() => {
    setState((s) => ({ ...s, medicines: [] }));
  }, []);

  const applyTdee = useCallback((tdee: number) => {
    setState((s) => ({ ...s, caloriesPerPerson: Math.round(tdee / 10) * 10 }));
  }, []);

  if (!loaded) return null;

  return (
    <PrepperContext.Provider
      value={{
        ...state,
        totalCaloriesStored,
        daysOfFoodRemaining,
        daysOfWaterRemaining,
        setNumPeople,
        setCaloriesPerPerson,
        setLitresPerPersonPerDay,
        setTotalLitresStored,
        updateItemQty,
        setItemQty,
        addPantryItem,
        deletePantryItem,
        clearPantry,
        updateMedicineDoses,
        setMedicineDoses,
        addMedicineItem,
        deleteMedicineItem,
        clearMedicines,
        applyTdee,
      }}
    >
      {children}
    </PrepperContext.Provider>
  );
}

export function usePrepper() {
  const ctx = useContext(PrepperContext);
  if (!ctx) throw new Error('usePrepper must be used within PrepperProvider');
  return ctx;
}
