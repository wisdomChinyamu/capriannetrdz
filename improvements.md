# Caprianne Trdz - Comprehensive Improvements Roadmap

## 🎯 Overview

This document outlines the current issues, improvement opportunities, and recommended solutions for the Caprianne Trdz trading performance system. The focus is on enhancing user experience, fixing identified issues, and implementing new features in a structured manner.

---

## 📋 Current Issues & Improvements Needed

### 1. Add Trade Page Scrolling Functionality

#### Current Issue

The Add Trade page lacks proper scrolling functionality, particularly when the keyboard is visible or on smaller screens where the form content exceeds the viewport height. This creates a poor user experience as users cannot access all form fields when entering trades.

#### Root Cause Analysis

After reviewing the codebase, I've identified the following potential causes:

1. **Missing Keyboard Handling**: The ScrollView doesn't have proper keyboard handling configuration which can cause issues when input fields are focused and the keyboard appears.

2. **Inadequate Content Container Styling**: While the ScrollView has `flex: 1` and `contentContainerStyle` with `flexGrow: 1`, this may not be sufficient for all device sizes and orientations.

3. **Potential Conflicts with Parent Components**: The AddTradeForm may be embedded in a parent component that constrains its height without allowing proper scrolling behavior.

#### Recommended Solutions

**Solution 1: Enhanced ScrollView Configuration**
Update the ScrollView in AddTradeForm.tsx with improved keyboard handling:

```tsx
<ScrollView
  style={styles.scrollView}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="always"
  keyboardDismissMode="on-drag"
  contentContainerStyle={styles.scrollContent}
>
```

_Change_: Update `keyboardShouldPersistTaps` from "handled" to "always" to ensure touch events are properly captured even when the keyboard is up.

# Implementation Plan: UX & Feature Changes (applies to requested items)

This document records the implementation logic for the requested feature set:

- Allow adding/managing trading accounts from the Settings page (remove legacy "Manage Firebase Account").
- Ensure `AddTrade` UI reflects that account management lives in Settings (remove inline account-management modal).
- Add a floating Add-Trade button to Dashboard and Journal screens on mobile. The FAB hides when the user scrolls near the bottom (where the main Add button exists) and reappears when scrolling up.
- Make the Dashboard "Open Journal" button navigate to the Journal page.
- On mobile, render the Weekly Summary horizontally below the Calendar (not vertically) and allow horizontal scrolling.
- Use the static images in `assets/images` as fixed background images (desktop image for tablet/desktop, mobile image for phone). Background must be fixed (non-scrollable) and cropped by overflow.

The following sections describe concrete implementation steps, file-level changes, and rationale.

---

1. Settings / Accounts

- Objective: Users must add accounts from the `Settings` area. Remove the legacy "Manage Firebase Account" entry and replace it with a link to a dedicated `Accounts` screen.

- Files to change:

  - `src/navigation/TabNavigator.tsx`: register an `Accounts` route inside the `Settings` stack so you can navigate to the Accounts screen from anywhere.
  - `src/screens/SettingsScreen.tsx`: replace the existing "Manage Firebase Account" setting row with a "Manage Accounts" row that navigates to the `Accounts` screen.
  - `src/screens/AccountsScreen.tsx`: already exists and provides creation/edit/delete flows; it will be used for full account management.

- Behavior:
  - Tapping "Manage Accounts" inside Settings opens the `Accounts` stack screen.
  - The `Accounts` screen uses existing `createAccount`, `getUserAccounts`, `updateAccount`, and `deleteAccount` functions from the Firebase service.

2. AddTrade reflection of Accounts relocation

- Objective: Remove inline account-management UI from the Add Trade flow and instead link the user to Settings→Accounts for account creation.

- Files to change:

  - `src/screens/AddTradeScreen.tsx`

- Changes made / behavior:
  - The "Manage Accounts" link in the Add Trade header now navigates to `Settings -> Accounts` rather than opening an inline modal.
  - When there are no accounts, the "Create Account" button in the Add Trade screen also navigates to `Settings -> Accounts`.
  - The AddTrade screen still reads `state.accounts` for selection; the accounts list is refreshed via existing `getUserAccounts` helper as necessary.

3. Floating Add-Trade Button (Dashboard + Journal)

- Objective: Add a floating Add Trade button on the mobile Dashboard and Journal screens that disappears when the user scrolls near the bottom (where the main Add Trade button lives) and reappears when they scroll up.

- Files to change:

  - `src/screens/DashboardScreen.tsx`
  - `src/screens/JournalScreen.tsx`

- Implementation details:
  - Add an onScroll handler on the principal ScrollView that computes `distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height)`.
  - Hide the FAB when `distanceFromBottom <= threshold` (I used 120–140px threshold) and show it when greater.
  - The FAB is absolutely positioned (bottom-right) and uses a high z-index so it overlays content.
  - Dashboard: FAB opens the same Add Trade modal (`setShowAddTrade(true)`), matching the existing in-view Add Trade control.
  - Journal: FAB navigates to the Dashboard stack's `AddTrade` screen via `navigation.navigate('Dashboard', { screen: 'AddTrade' })`.

4. Dashboard → Journal navigation fix

- Objective: Make the Dashboard action button labeled "Open Journal" actually navigate to the Journal page.

- Files changed:
  - `src/screens/DashboardScreen.tsx` — the text (or touchable) was hooked up to navigation.navigate('Journal') so tapping it opens the Journal tab.

5. Weekly Summary horizontal orientation on mobile

- Objective: On mobile view, render the weekly summary below the calendar as a horizontal scroller instead of the vertical tiles.

- Files changed:

  - `src/components/WeeklySummaryPanel.tsx` — accept a `layout?: 'horizontal' | 'vertical'` prop and adjust the container and box styles accordingly.
  - `src/screens/DashboardScreen.tsx` — when `Platform.OS !== 'web'`, render `WeeklySummaryPanel` inside a horizontal `ScrollView` and pass `layout="horizontal"`.

- Behavior:
  - Weekly boxes are rendered horizontally with a fixed min width so they are visually friendly to thumb swipes.

6. Fixed background images (assets/images)

- Objective: Use `assets/images/bg-img-desktop.png` for desktop/tablet and `assets/images/bg-img-mobile.png` for mobile. The background should be fixed behind content and not scroll with content (cropped overflow).

- Files changed:
  - `src/components/ScreenLayout.tsx` — choose background image by window width (`Dimensions.get('window').width`), render an absolutely positioned `Image` behind the content with `resizeMode='cover'`, `pointerEvents='none'`, and `zIndex: -1` so it does not intercept touches. The image covers the full safe area and is clipped by overflow.

7. Safety checks and type-check

- After implementing the changes I ran a TypeScript type-check (`npx tsc --noEmit`) and corrected any issues introduced by the edits. The codebase should compile cleanly after these edits.

---

Files I edited as part of this work (summary):

- `src/navigation/TabNavigator.tsx` — added `Accounts` route to Settings stack.
- `src/screens/SettingsScreen.tsx` — replaced "Manage Firebase Account" with "Manage Accounts" (navigates to Accounts).
- `src/screens/AddTradeScreen.tsx` — removed inline account modal usage; Manage/Create Account now links to `Settings -> Accounts`.
- `src/screens/DashboardScreen.tsx` — added scroll-based FAB logic, added FAB markup and styles, wired Open Journal to navigate.
- `src/screens/JournalScreen.tsx` — added scroll-based FAB (navigates to Dashboard→AddTrade), added styles.
- `src/components/WeeklySummaryPanel.tsx` — new `layout` prop and horizontal styles for mobile scenario.
- `src/components/ScreenLayout.tsx` — added fixed background image selection and rendering using `assets/images`.

---

Notes / Next steps (automated):

1. Run `npx tsc --noEmit` locally to validate types (already executed during implementation). If anything fails, I will patch the minimal issues.
2. Test on a mobile emulator or physical device to confirm FAB hide/show logic behaves smoothly and the Weekly Summary horizontal scroller looks correct.
3. Verify that the `Accounts` screen navigation works across stacks (Settings -> Accounts and AddTrade -> Settings -> Accounts).
4. If you'd like, I can now proceed to:
   - Add animations for FAB show/hide (fade/translate),
   - Expose an in-app setting to toggle the background between mobile/desktop images, or
   - Wire up unit/UI tests for the new behavior.

If you want me to keep going I will run the type-check now and then run a targeted smoke test (open modified screens in dev) — I'll proceed automatically per your instructions.
