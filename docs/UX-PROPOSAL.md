# OwnShot Pro - UX Overhaul Proposal

## Current Pain Points

1. **Vertical Scroll Overload** - Options stack vertically, pushing content off-screen
2. **Lost in Options** - Hard to see all available settings at a glance
3. **No Clear Hierarchy** - All options feel equally important
4. **Desktop-First Feel** - Not optimized for thumb-friendly mobile use
5. **Preset Switching** - Buried in a dropdown, should be more prominent

---

## Mobile-First Design Principles

1. **Thumb Zone Design** - Key actions in bottom 1/3 of screen
2. **Progressive Disclosure** - Show essentials first, details on demand
3. **Swipe Navigation** - Horizontal swipes feel native on mobile
4. **Bottom Sheets** - Modal options from bottom, not dropdowns
5. **Sticky Actions** - Generate button always visible
6. **Visual Hierarchy** - Most-used options prominent, advanced tucked away

---

## Proposed New Layout

### Step 1: Upload (Keep Similar)
Current upload screen works well. Minor tweaks:
- Slightly larger drop zone on mobile
- Camera icon option for direct mobile capture

### Step 2: Configure (Major Overhaul)

```
┌─────────────────────────────────────┐
│  ← Back            OwnShot Pro    ⚙ │
├─────────────────────────────────────┤
│                                     │
│    ┌───────────────────────────┐    │
│    │                           │    │
│    │     [Image Preview]       │    │
│    │        Thumbnail          │    │
│    │                           │    │
│    └───────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│  PRESET TABS (horizontal scroll)    │
│ ┌──────┬──────┬──────┬──────┬─────┐ │
│ │ Home │ Prod │ Food │ Auto │ ... │ │
│ └──────┴──────┴──────┴──────┴─────┘ │
├─────────────────────────────────────┤
│                                     │
│  QUICK SETTINGS CARDS               │
│  ┌─────────────┐ ┌─────────────┐    │
│  │  Transform  │ │   Output    │    │
│  │  [Retouch▼] │ │   [2K ▼]    │    │
│  └─────────────┘ └─────────────┘    │
│                                     │
│  ┌─────────────┐ ┌─────────────┐    │
│  │   Aspect    │ │  Strength   │    │
│  │  [Match ▼]  │ │  [●────] 40 │    │
│  └─────────────┘ └─────────────┘    │
│                                     │
│  [+ More Options]  ← Expandable     │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │      ✨ Generate Image      │    │  ← STICKY
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Key Changes:

#### 1. Horizontal Preset Tabs
Replace dropdown with swipeable pill tabs:
```
[ Interior ] [ Product ] [ Food ] [ Auto ] [ People ] [ General ]
     ↑ active (highlighted)
```
- Tap to switch instantly
- Visual indicator for active preset
- Scrollable on mobile if many presets

#### 2. Quick Settings Grid (2x2)
Most-used settings in a compact grid:
- Transform Mode (dropdown/bottom sheet)
- Output Size (1K/2K/4K chips)
- Aspect Ratio (visual ratio icons)
- Strength (inline slider)

#### 3. Expandable "More Options" Section
Preset-specific options hidden by default:
- Tap to expand accordion
- Organized into logical groups
- Uses bottom sheet on mobile for complex selections

#### 4. Sticky Generate Button
Always visible at bottom - never scroll to find it

---

## Preset-Specific Option Panels

### Interior Panel
```
┌─ Quick Settings ────────────────────┐
│ Transform: [Retouch ▼]              │
│ Strength:  [●━━━━━━━━━━━] 40%       │
└─────────────────────────────────────┘

┌─ Advanced (tap to expand) ──────────┐
│ □ HDR Window Recovery               │
│ □ Creative Crop                     │
│ □ Magazine Styling                  │
│                                     │
│ Scene Direction (optional)          │
│ ┌─────────────────────────────────┐ │
│ │ Add computers to desk, close    │ │
│ │ doors in background...          │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```
**Note:** Renamed "Props" → "Scene Direction"

### Product Panel
```
┌─ Quick Preset ──────────────────────┐
│ [ Amazon ] [ Hero ] [ Social ] [Cat]│
└─────────────────────────────────────┘

┌─ Shot Style ────────────────────────┐
│ Type: [ Packshot ] [Lifestyle] [Flat│
│ Scale: ( ) Small  (●) Medium  ( ) XL│  ← NEW!
└─────────────────────────────────────┘

┌─ Background ────────────────────────┐
│ [White] [Grey] [Gradient] [Scene]   │
│ Surface: [None ▼]                   │
└─────────────────────────────────────┘

┌─ Advanced (tap to expand) ──────────┐
│ Camera, Lighting, Shadows...        │
└─────────────────────────────────────┘
```
**New:** Product Scale option (Small/Medium/Large/XL)
- Small: Jewelry, cosmetics, small electronics
- Medium: Bottles, boxes, small appliances
- Large: Furniture, large appliances
- XL: Vehicles → redirects to Automotive

### Automotive Panel (NEW)
```
┌─ Shot Type ─────────────────────────┐
│ [Studio] [Showroom] [Outdoor] [Det] │
└─────────────────────────────────────┘

┌─ Angle ─────────────────────────────┐
│ [3/4 Front] [Side] [Rear] [Interior]│
└─────────────────────────────────────┘

┌─ Environment ───────────────────────┐
│ [Dark Studio] [White Cyc] [Street]  │
│ [Mountain] [Urban] [Showroom]       │
└─────────────────────────────────────┘

┌─ Finish ────────────────────────────┐
│ Reflection:  [●━━━━━━━] High        │
│ Dramatic:    [━━━●━━━━] Medium      │
└─────────────────────────────────────┘
```

### Food Panel (Simplified)
```
┌─ Transform ─────────────────────────┐
│ [Retouch] [Reshoot] [Styled]        │
└─────────────────────────────────────┘

┌─ Style ─────────────────────────────┐
│ Shot:  [Overhead▼] Lighting: [Nat▼] │
│ Boost: [Off] [Tidy] [Appeal] [Hero] │
└─────────────────────────────────────┘

┌─ Effects ───────────────────────────┐
│ □ Add Steam    □ Condensation       │
│ □ Reduce Glare                      │
└─────────────────────────────────────┘
```

---

## Mobile Bottom Sheet Pattern

For complex selections (surfaces, lighting, etc.), use bottom sheets instead of dropdowns:

```
┌─────────────────────────────────────┐
│                                     │
│         (dimmed background)         │
│                                     │
├─────────────────────────────────────┤
│  ━━━  (drag handle)                 │
│                                     │
│  Select Surface                     │
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │     │ │     │ │     │ │     │   │
│  │Wood │ │Marbl│ │Concr│ │Linen│   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐           │
│  │     │ │     │ │     │           │
│  │Slate│ │White│ │Acryl│           │
│  └─────┘ └─────┘ └─────┘           │
│                                     │
└─────────────────────────────────────┘
```

Benefits:
- Larger tap targets
- Visual previews possible
- Native mobile feel
- Easy to dismiss (swipe down)

---

## Step 3: Results (Minor Updates)

```
┌─────────────────────────────────────┐
│  ← Back            OwnShot Pro      │
├─────────────────────────────────────┤
│                                     │
│    ┌───────────────────────────┐    │
│    │                           │    │
│    │                           │    │
│    │     [Enhanced Image]      │    │
│    │                           │    │
│    │                           │    │
│    └───────────────────────────┘    │
│                                     │
│  View: [Enhanced] [Compare] [Orig]  │
│                                     │
│  History: [v1] [v2] [v3●]           │
│                                     │
├─────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────────┐ │
│  │ Download │  │  ↻ Regenerate    │ │
│  └──────────┘  └──────────────────┘ │
│                                     │
│  [ Adjust Settings ]  [ New Image ] │
└─────────────────────────────────────┘
```

---

## Component Architecture

### New Components Needed:
1. `PresetTabs` - Horizontal scrollable preset selector
2. `QuickSettingsGrid` - 2x2 compact settings
3. `BottomSheet` - Mobile-native option selector
4. `OptionChips` - Horizontal chip selector (like Output Size)
5. `ExpandableSection` - Collapsible advanced options
6. `StickyFooter` - Always-visible action area

### Modified Components:
1. `ConfigureScreen` - Complete restructure
2. `ProductOptionsForm` - Add scale option, simplify layout
3. `FoodOptionsForm` - Chip-based selectors
4. `OptionsForm` → Rename fields, new layout

### New Presets:
1. `Automotive` - New category with dedicated prompt builder
2. `LargeProduct` - May be a variant of Product with scale=large

---

## Responsive Breakpoints

| Screen | Layout |
|--------|--------|
| Mobile (<640px) | Single column, bottom sheets, stacked |
| Tablet (640-1024px) | 2 columns for options, side panel |
| Desktop (>1024px) | 3 columns, inline options, no sheets |

---

## Animation & Micro-interactions

1. **Tab Switch** - Smooth underline slide animation
2. **Bottom Sheet** - Spring animation from bottom
3. **Accordion** - Smooth height transition
4. **Chip Select** - Scale bounce on tap
5. **Generate** - Pulse animation while processing

---

## Summary of Changes

| Area | Current | Proposed |
|------|---------|----------|
| Preset Selection | Dropdown | Horizontal tabs |
| Options Layout | Vertical stack | Grid + accordion |
| Advanced Options | Always visible | Collapsed by default |
| Mobile Selectors | Dropdowns | Bottom sheets |
| Generate Button | Scrolls away | Sticky footer |
| Product Scale | N/A | Small/Med/Large/XL |
| Automotive | N/A | New preset category |
| Props Field | "Props" | "Scene Direction" |

---

## Next Steps

1. [ ] Review and approve this proposal
2. [ ] Create new component library (tabs, sheets, chips)
3. [ ] Restructure ConfigureScreen
4. [ ] Add Automotive preset + prompt builder
5. [ ] Add product scale option
6. [ ] Test on mobile devices
7. [ ] Fix interior strength/crop issue

---

*Created: feature/ux-overhaul branch*
