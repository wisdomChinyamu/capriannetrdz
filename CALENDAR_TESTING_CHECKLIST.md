# Calendar Heatmap - Responsive Testing Checklist

## Quick Test Commands

### Web Testing (Expo/React Native Web)
```bash
# Start dev server
npm start

# Test responsive in browser
# 1. Open Chrome DevTools (F12)
# 2. Click device toolbar icon or press Ctrl+Shift+M
# 3. Test different device presets
```

### Mobile Testing
```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Expo Go App
# Scan QR code with Expo Go
```

---

## Test Scenarios

### 1. Scale Animation (Press Feedback)

#### Test on All Platforms
- [ ] **Web (Desktop)**: 
  - Click a day cell
  - Verify cell scales down smoothly to 0.95
  - Verify cell springs back smoothly to 1.0
  - No lag or jank observed

- [ ] **Web (Mobile DevTools)**:
  - Tap/click a day cell
  - Verify animation is smooth
  - Try rapid clicks (multiple cells)

- [ ] **iOS Simulator**:
  - Tap a day cell with mouse
  - Verify scale animation is responsive
  - No animation jank at 60 FPS

- [ ] **Android Emulator**:
  - Tap a day cell
  - Verify smooth animation
  - Test on low-end device settings

- [ ] **Physical Device**:
  - Tap multiple cells rapidly
  - Verify animations don't overlap poorly
  - Feel the tactile feedback

#### Animation Characteristics
- [ ] Duration: ~150-200ms (spring animation)
- [ ] No opacity flash (only scale changes)
- [ ] Opacity still reduces on press (combined with scale)
- [ ] No animation if tapping empty cell

---

### 2. Responsive Layouts - Mobile

#### Portrait Mode (375px - 667px)
```
Expected:
├─ 7 cells per row (14.28% width each)
├─ 40px minimum width
├─ Cells stack vertically in 6 rows
└─ All cells visible without horizontal scroll
```

**Test Steps:**
- [ ] iPhone SE (375x667): Verify 7 cells per row
- [ ] iPhone 12 (390x844): Verify cells fit without scroll
- [ ] Pixel 5 (393x851): Check alignment
- [ ] All text readable without magnification

#### Landscape Mode (667px - 812px)
```
Expected:
├─ 7 cells per row (14.28% width each)
├─ Larger visible cells (wider aspect ratio)
├─ Horizontal navigation between months works
└─ Same 7 cells per row as portrait
```

**Test Steps:**
- [ ] Rotate iPhone to landscape
- [ ] Verify cells don't grow too wide
- [ ] Check row heights remain consistent
- [ ] Verify title and controls reposition properly

---

### 3. Responsive Layouts - Tablet

#### Tablet Portrait (768px - 1024px)
```
Expected:
├─ Slightly reduced cell width (13% each)
├─ 48px minimum width per cell
├─ ~7-8 cells can fit
├─ Better spacing than mobile
└─ Optimal viewing experience
```

**Test Steps:**
- [ ] iPad Mini (768x1024): Verify layout
- [ ] iPad Air (820x1180): Check responsiveness
- [ ] Samsung Tab S7 (800x1280): Verify alignment
- [ ] Test month navigation

#### Tablet Landscape (1024px - 1280px)
```
Expected:
├─ Desktop breakpoint triggers (1024px)
├─ Cell width 12% (60px minimum)
├─ ~8 cells can fit comfortably
├─ Optimal spacing between cells
└─ Grid looks professional
```

**Test Steps:**
- [ ] Rotate iPad to landscape
- [ ] Verify 12% width activation
- [ ] Check grid alignment
- [ ] Test all interactions (scroll, tap, animations)

---

### 4. Responsive Layouts - Desktop

#### Desktop (1024px - 1920px)
```
Expected:
├─ Cell width 12% (60px minimum)
├─ Grid centered or left-aligned
├─ Consistent spacing (6px gaps)
├─ Professional appearance
└─ Smooth animations on click
```

**Test Steps:**
- [ ] 1280x720 (small desktop): Verify grid
- [ ] 1920x1080 (HD): Verify spacing
- [ ] 2560x1440 (4K): Check responsiveness
- [ ] Resize browser window to test transitions

#### Ultra-Wide Desktop (1920px+)
```
Expected:
├─ Cell width 12% maintained
├─ Potential max-width constraint applied
├─ Grid doesn't become too large
├─ Horizontal centering if applicable
```

**Test Steps:**
- [ ] 3440x1440 (ultrawide): Check behavior
- [ ] Verify calendar doesn't take entire width
- [ ] Confirm grid remains usable

---

### 5. Responsive Transitions

#### Orientation Change
```
Test: Portrait → Landscape → Portrait
```

- [ ] **Smooth Transition**: No layout shift, cells reposition smoothly
- [ ] **Animation State**: Previous animations don't interfere
- [ ] **Scale Values**: Reset to 1.0 before transition
- [ ] **Content Preservation**: Calendar shows same month/data

**Steps:**
1. Display calendar in portrait
2. Tap a cell (note animation)
3. Rotate to landscape
4. Verify layout updates
5. Tap another cell
6. Verify animation still works
7. Rotate back to portrait

#### Window Resize (Web)
```
Test: 320px → 768px → 1024px → 1920px
```

- [ ] **320px (mobile)**: 14.28% width cells
- [ ] **768px (tablet)**: Transitions to 13% width
- [ ] **1024px (desktop)**: Transitions to 12% width
- [ ] **Smooth resize**: No flash or jump
- [ ] **Cells reflow**: Grid adjusts dynamically

**Steps:**
1. Open browser DevTools
2. Set width to 320px
3. Verify 7 cells per row
4. Resize to 768px
5. Verify cell widths update
6. Resize to 1024px
7. Verify cell widths update again
8. Check no animation lag during resize

---

### 6. Multi-Device Testing Matrix

| Device | Size | Orientation | Expected Cells | Test Status |
|--------|------|-------------|-----------------|------------|
| iPhone SE | 375 | Portrait | 7 | ☐ |
| iPhone SE | 667 | Landscape | 7 | ☐ |
| iPhone 12 | 390 | Portrait | 7 | ☐ |
| iPhone 12 | 844 | Landscape | 7 | ☐ |
| iPad Mini | 768 | Portrait | 7-8 | ☐ |
| iPad Air | 820 | Landscape | 8+ | ☐ |
| Pixel 5 | 393 | Portrait | 7 | ☐ |
| Pixel 5 | 851 | Landscape | 7 | ☐ |
| Desktop | 1280 | - | 8+ | ☐ |
| Desktop | 1920 | - | 8+ | ☐ |
| Desktop | 2560 | - | 8+ | ☐ |

---

### 7. Interaction Testing

#### Touch/Mouse Interactions
- [ ] **Single tap**: Triggers press animation, calls onDayPress
- [ ] **Double tap**: Verifies single handler (no double-fire)
- [ ] **Long press**: No unintended behavior
- [ ] **Drag**: No dragging between cells (if not intended)
- [ ] **Multiple fingers**: No conflicts on multi-touch

#### Keyboard Interactions (Web)
- [ ] **Tab key**: Focus visible on day cells
- [ ] **Enter key**: Activates focused cell
- [ ] **Space key**: Activates focused cell
- [ ] **Arrow keys**: Navigate between cells (if implemented)

#### Accessibility
- [ ] **Screen reader**: Announces day numbers
- [ ] **Color contrast**: Cells readable (especially profit/loss colors)
- [ ] **Touch targets**: Minimum 44x44 points on mobile
- [ ] **Keyboard navigation**: All cells reachable via tab

---

### 8. Animation Performance

#### Smoothness Check
```
Expected: 60 FPS animation (16.67ms per frame)
```

- [ ] **Chrome DevTools - Performance Tab**:
  1. Open DevTools (F12)
  2. Go to Performance tab
  3. Record interaction (tap cell)
  4. Stop recording
  5. Verify green bar (60 FPS) - not red/yellow

- [ ] **React Native Profiler**:
  1. Enable performance monitor
  2. Tap cells rapidly
  3. Monitor FPS (should stay at 60)
  4. Check JS frame time (<16ms)

#### Load Testing
- [ ] **Many trades**: 1000+ trades in history
- [ ] **Animation lag**: Check for frame drops
- [ ] **Memory usage**: Monitor growth
- [ ] **Battery drain**: Check on mobile (long press animation)

---

### 9. Color Contrast Verification

Test with day cell colors:

#### Win Day (Green Gradient)
- [ ] Profit start: `#1f7a1f`
- [ ] Profit end: `#4caf50`
- [ ] Text contrast ratio: 4.5:1+ (WCAG AA)
- [ ] Readable on all backgrounds

#### Loss Day (Red Gradient)
- [ ] Loss start: `#b71c1c`
- [ ] Loss end: `#ef5350`
- [ ] Text contrast ratio: 4.5:1+ (WCAG AA)
- [ ] Readable on all backgrounds

#### Neutral Day (Gray)
- [ ] Neutral color: `#2a2a2a` (dark), `#e8e8e8` (light)
- [ ] Text contrast ratio: 4.5:1+ (WCAG AA)

---

### 10. Dark/Light Mode Testing

#### Dark Mode
- [ ] Calendar displays correctly
- [ ] Scale animation visible
- [ ] Colors appropriate for dark theme
- [ ] No glare or eye strain

#### Light Mode
- [ ] Calendar displays correctly
- [ ] Scale animation visible
- [ ] Colors appropriate for light theme
- [ ] All text readable

---

## Edge Cases

- [ ] **Empty calendar**: No trades entered yet
- [ ] **Single trade**: One cell highlighted
- [ ] **All trades on one day**: High intensity color
- [ ] **Trades across all days**: Full gradient spectrum
- [ ] **Future dates**: Cells should be disabled/grayed
- [ ] **Past year navigation**: Colors load correctly

---

## Bug Report Template

```
### Scale Animation Issue
- Platform: [Web/iOS/Android]
- Device: [Device name/screen size]
- Steps to reproduce:
  1. Tap day cell
  2. Observe animation
- Expected: Smooth 0.95 scale animation
- Actual: [Describe issue]
- Screenshots: [Attach if possible]

### Responsive Layout Issue
- Breakpoint: [Mobile/Tablet/Desktop]
- Screen size: [e.g., 375px]
- Expected layout: [e.g., 7 cells per row]
- Actual layout: [e.g., 6 cells per row]
- Screenshots: [Grid appearance]
```

---

## Performance Benchmarks

After implementing, record these metrics:

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Animation FPS | 60 | ? | ☐ |
| Animation duration | 150-200ms | ? | ☐ |
| Layout update time | <100ms | ? | ☐ |
| Memory (idle) | <5MB | ? | ☐ |
| Memory (animated) | <8MB | ? | ☐ |
| Render time | <16ms | ? | ☐ |

---

## Sign-Off

- [ ] All mobile sizes tested
- [ ] All tablet sizes tested
- [ ] Desktop sizes tested
- [ ] Orientation changes verified
- [ ] Scale animations smooth
- [ ] Responsive breakpoints working
- [ ] Accessibility verified
- [ ] Performance acceptable
- [ ] No regressions found

**Tested by**: ________________
**Date**: ________________
**Result**: ☐ PASS | ☐ FAIL | ☐ NEEDS WORK
