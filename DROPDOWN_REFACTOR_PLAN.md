# Dropdown Refactor - Complete Plan

## Current Status
- Dropdowns work with hover
- Animation: fade + 8px slide (close to Medusa)
- Issue: Still two separate containers causing height jumping

## Refactor Steps

### 1. Update State (lines 49-52)
**Replace:**
```tsx
const [gearDropdownOpen, setGearDropdownOpen] = useState(false)
const [racesDropdownOpen, setRacesDropdownOpen] = useState(false)
const [gearCloseTimeout, setGearCloseTimeout] = useState<NodeJS.Timeout | null>(null)
const [racesCloseTimeout, setRacesCloseTimeout] = useState<NodeJS.Timeout | null>(null)
```

**With:**
```tsx
const [activeDropdown, setActiveDropdown] = useState<'gear' | 'races' | null>(null)
const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null)
```

### 2. Update Handlers (lines 57-85)
**Replace all 4 handlers with 2:**
```tsx
const handleDropdownEnter = (dropdown: 'gear' | 'races') => {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    setCloseTimeout(null)
  }
  setActiveDropdown(dropdown)
}

const handleDropdownLeave = () => {
  const timeout = setTimeout(() => {
    setActiveDropdown(null)
  }, 100)
  setCloseTimeout(timeout)
}
```

### 3. Replace Gear Trigger (lines 137-155)
**Replace entire section with:**
```tsx
{/* Gear Trigger */}
<button
  className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200"
  onMouseEnter={() => handleDropdownEnter('gear')}
  onMouseLeave={handleDropdownLeave}
  aria-expanded={activeDropdown === 'gear'}
  aria-haspopup="true"
>
  Gear
  <ChevronDown className="h-4 w-4" />
</button>
```

### 4. Delete Lines 156-293 (entire Gear dropdown AnimatePresence)

### 5. Replace Races Trigger (lines 295-313)
**Same pattern as Gear - simple button**

### 6. Delete Lines 314-401 (entire Races dropdown AnimatePresence)

### 7. Add Shared Container After `</nav>` (line 402)
**Insert:**
```tsx
          {/* Single Shared Dropdown Container - Medusa Style */}
          <div
            className={`fixed left-0 right-0 top-16 w-screen bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 shadow-elevation-flyout z-40 transition-all duration-200 ease-in-out ${
              activeDropdown ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
            onMouseEnter={() => activeDropdown && handleDropdownEnter(activeDropdown)}
            onMouseLeave={handleDropdownLeave}
          >
            <AnimatePresence mode="wait">
              {activeDropdown === 'gear' && (
                <motion.div
                  key="gear"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* PASTE GEAR CONTENT HERE (lines 168-288 from old code) */}
                </motion.div>
              )}
              {activeDropdown === 'races' && (
                <motion.div
                  key="races"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* PASTE RACES CONTENT HERE (lines 326-396 from old code) */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
```

## Result
- One container that slides down/up
- Content cross-fades inside when switching
- No height jumping between Gear/Races
