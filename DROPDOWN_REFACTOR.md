# Dropdown Refactor Plan

## Current Structure (Two Separate Containers)
- Gear dropdown: own AnimatePresence + motion.div
- Races dropdown: own AnimatePresence + motion.div
- Each animates independently
- Height changes when switching between them

## New Structure (Single Shared Container)
- One AnimatePresence wrapping the shared dropdown container
- Container slides down (height: 0 → auto) when opening
- Container slides up (height: auto → 0) when closing
- When switching between Gear/Races:
  - Container stays in place (no height animation)
  - Only content cross-fades inside

## State Changes
- Replace: `gearDropdownOpen`, `racesDropdownOpen`
- With: `activeDropdown: 'gear' | 'races' | null`

## Handler Changes
- Replace: `handleGearMouseEnter`, `handleGearMouseLeave`, etc.
- With: `handleDropdownEnter(dropdown)`, `handleDropdownLeave()`

## Animation Strategy
- Outer container: AnimatePresence with height animation
- Inner content: AnimatePresence mode="wait" with opacity cross-fade
