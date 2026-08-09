# Prepper's Companion

A rugged, tactical survival planning tool for households who take emergency preparedness seriously. Track your food inventory, water supply, and health metrics with a dark, field-ready interface.

## Features

### 📊 Dashboard & Water Tracker
- Configure household size and daily calorie targets
- Monitor total days of food remaining (with color-coded alerts)
- Calculate water supply duration
- Large, scannable metrics designed for at-a-glance status checks

### 📦 Prepper Pantry Inventory
- Four categories: Tinned, Dried, Freeze-Dried, Other
- Pre-populated with realistic starter items
- Track current vs. target quantities with visual progress bars
- Add custom items with calories per item
- Quick quantity adjustment with +/- controls
- Color-coded stock levels (red < 30%, amber 30-99%, green 100%+)

### 🛒 Smart Shopping List
- Auto-generated from items below target stock
- Shows quantity needed to reach target
- Temporary check-off system (resets on refresh)
- "All Stocked Up" celebratory state when fully prepared

### ❤️ Health Tools (BMI & Calorie Calculator)
- Input: gender, age, weight, height, activity level
- Unit conversion support (kg/lbs, cm/inches)
- Calculates:
  - BMI with category badge (Underweight, Normal, Overweight, Obese)
  - Basal Metabolic Rate (BMR) using Mifflin-St Jeor equation
  - Total Daily Energy Expenditure (TDEE)
- "Apply to Dashboard" button to auto-set daily calorie target

## Tech Stack

- **React** + **TypeScript** - Type-safe component architecture
- **Vite** - Lightning-fast dev server and build
- **Tailwind CSS** - Utility-first styling with custom dark palette
- **shadcn/ui** - Accessible, customizable component library
- **Wouter** - Lightweight client-side routing
- **localStorage** - Client-side state persistence (no backend)

## Design System

**Mood:** Tactical Field Tool — dark, precise, information-dense with muted olive accents

**Color Palette:**
- Background: Deep charcoal (`hsl(222 24% 7%)`)
- Cards: Slate gray (`hsl(218 22% 11%)`)
- Primary: Muted olive green (`hsl(78 28% 38%)`)
- Alerts: Amber warnings, red danger, green success

**Typography:**
- Headings: Space Grotesk (geometric, technical)
- Data/Numbers: IBM Plex Mono (monospace precision)

**Interactions:**
- Smooth quantity increment/decrement
- Tab transitions with active state indicators
- Progress bar fills with color-coded thresholds
- Hover/active elevation system

## State Management

All application state lives in React Context (`PrepperContext`) and syncs to localStorage:
- `prepper-household` - Household settings (people count, calorie targets, water data)
- `prepper-pantry` - Pantry items array
- `prepper-health` - Health calculator inputs

No backend required — fully client-side.

## Running Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 (or the port shown in terminal)

## Build for Production

```bash
npm run build
npm run serve
```

## Data Persistence

All data is stored in browser localStorage. To reset:
1. Open browser DevTools → Application → Local Storage
2. Delete `prepper-household`, `prepper-pantry`, and `prepper-health` keys
3. Refresh the page to restore default data

---

**Built for preppers, homesteaders, and anyone who takes emergency readiness seriously.**
