# Caprianne Trdz - Quick Start Guide

## 🎯 What You've Built

A complete **cross-platform trading performance operating system** with:

✅ Manual trade entry with auto-calculated R:R  
✅ Editable SMC checklist as an interactive table  
✅ Real-time confluence scoring and grading  
✅ Psychology logging and mood correlation  
✅ Professional analytics dashboard  
✅ Trading routine checklists (Pre-Market, Execution, Post-Trade, Weekly Review)  
✅ Dark cinematic UI (graphite, whitesmoke, cyan glow)  
✅ Firebase backend (Auth, Firestore, Storage)  
✅ Cross-platform: Mobile (Expo), Web (RN Web), Desktop (Tauri)

---

## 🚀 Getting Started (5 Steps)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Firebase

1. Go to [firebase.google.com](https://firebase.google.com)
2. Create a new project
3. Enable Authentication, Firestore, and Storage
4. Get your config values
5. Create `.env.local` in project root:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=yourproject
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

6. Update `src/config/firebase.ts` with these values

### Step 3: Create Firebase Collections

In Firestore, create these 3 collections (empty is fine, data will populate as you use the app):

- `trades`
- `checklist_template`
- `psychology_logs`

### Step 4: Run the App

**Mobile (Expo):**

```bash
npm start          # Starts Expo dev server
npm run android    # Run on Android phone/emulator
npm run ios        # Run on iPhone/simulator
```

**Web:**

```bash
npm run web        # Open in browser at localhost:19006
```

### Step 5: Create Your Checklist

1. Open the app → **Settings tab**
2. Scroll to "Edit Checklist Template"
3. Click **"+ Add Checklist Item"**
4. Add your first item:
   - **Item**: "Directional Bias"
   - **Description**: "Is the bias still valid?"
   - **Weight**: 25
   - **Category**: Critical
5. Click ✓ to save
6. Repeat for other items (Order Block, Liquidity Sweep, etc.)

---

## 📱 Navigation Structure

```
┌─────────────────────────────────────────┐
│  CAPRIANNE TRDZ (Dashboard)             │
├─────────────────────────────────────────┤
│                                         │
│  Win Rate: 60%    Avg R:R: 1:2.5       │
│  Deviations: 3    Today's Mood: 8/10   │
│                                         │
│  [New Trade] [Journal] [Weekly Review] │
│                                         │
├─────────────────────────────────────────┤
│ Dashboard | Journal | Analytics | ...  │ ← Tabs
└─────────────────────────────────────────┘
```

### 5 Main Tabs:

1. **Dashboard**: Summary stats, quick actions
2. **Journal**: Filterable list of all trades
3. **Analytics**: Charts and performance breakdowns
4. **Routine**: Editable checklists by category
5. **Settings**: Manage checklist template, export data

---

## 💼 Workflow: Recording Your First Trade

### 1. Start New Trade

- **Dashboard** → **+ New Trade** button

### 2. Fill Entry Details

- **Pair**: Select (GBPUSD, EURUSD, etc.)
- **Direction**: Buy or Sell
- **Session**: London, NY, or Asia
- **Entry Price**: 1.2450
- **Stop Loss**: 1.2400
- **Take Profit**: 1.2550

→ _R:R automatically calculates: 1:2.0_

### 3. Add Trade Context

- **Setup Type**: Order Block, Liquidity Sweep, FVG, etc.
- **Emotional Rating**: 7/10
- **Rule Deviation**: Toggle if you broke a rule
- **Notes**: "Clean FVG rejection, 1M ChoCh confirmed"

### 4. (Optional) Exit Details

- **Actual Exit Price**: 1.2540
- **Result**: Win ✓ (or Loss/Break-even)

→ _Confluence Score auto-calculates based on your checklist_  
→ _Grade assigned: A, B, C, D, or A+_

### 5. Submit

- Click **Record Trade**
- Trade saved to Firebase

---

## 🎲 Understanding the Checklist Table

The table in **Settings** looks like this:

```
┌─────────────────────────────────────────────────────┐
│ Item           │ Description │ Wgt │ Cat        │ Act│
├─────────────────────────────────────────────────────┤
│ Directional B. │ Bias valid? │ 25  │ Critical   │ ✎🗑│
│ Order Block    │ Valid OB?   │ 20  │ Critical   │ ✎🗑│
│ Liquidity Swp. │ Sweep there?│ 15  │ Important  │ ✎🗑│
│ 1M Confirm.    │ ChoCh?      │ 20  │ Critical   │ ✎🗑│
│ R:R Quality    │ 1:1.5+?     │ 10  │ Important  │ ✎🗑│
└─────────────────────────────────────────────────────┘

+ Add Checklist Item
```

### Edit Workflow:

**To Edit an Item:**

1. Click ✎ (pencil) on any row
2. Fields become editable
3. Modify text or weight
4. Click category badge to cycle: Critical → Important → Optional
5. Click ✓ to save or ✕ to cancel

**To Delete an Item:**

1. Click 🗑 (trash) on any row
2. Item removed immediately

**To Add New Item:**

1. Click "+ Add Checklist Item" button
2. New row appears at bottom with input fields
3. Fill in all 4 fields
4. Click ✓ to save

---

## 📊 Analytics Explained

After recording 5+ trades, **Analytics tab** shows:

### Key Metrics

- **Win Rate**: % of winning trades
- **Avg R:R**: Average risk-to-reward ratio
- **Profit Factor**: Total wins / Total losses

### Performance Breakdown

- **By Pair**: Win rate for each forex pair
- **By Session**: Win rate for each trading session
- **By Setup**: Win rate for each setup type
- **By Emotion**: Correlation between emotional state and results

### Trends

- Identify which pairs you trade best on
- See if morning vs. evening affects results
- Spot emotional patterns that hurt performance

---

## 🧠 Psychology System

### Daily Logging (Routine Screen)

- **Emotional State**: Rate 1-10
- **Confidence**: Rate 1-10
- **Session Intentions**: What you plan to do
- **Deviations**: Which rules you broke
- **Notes**: Mindset reflections

### What the App Tracks

- Mood vs. Win Rate (does better mood = better trades?)
- Mood vs. R:R Quality (do you set tighter stops when anxious?)
- Mood vs. Deviations (when do you break your rules?)
- Confidence vs. Profit Factor

### Use Cases

- Identify when you're "on tilt" and trading worse
- Recognize your best mental state for trading
- Notice if deviations spike on certain days
- Build a personal trading psychology profile

---

## 🔐 Security & Data

### Your Data

- **Stored in Firebase** (encrypted in transit)
- **User-specific** (only you can see your trades)
- **Backed up** (Firebase handles redundancy)

### Firebase Rules (Already Configured)

Deploy these rules to your Firestore console to fix the "Missing or insufficient permissions" error:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to access only their own data
    // Users collection - for user profiles
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Accounts collection - users can only access their own accounts
    match /accounts/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      // For creating new accounts, allow if the userId matches the authenticated user
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Trades collection - users can only access their own trades
    match /trades/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      // For creating new trades, allow if the userId matches the authenticated user
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Strategies collection - users can only access their own strategies
    match /strategies/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      // For creating new strategies, allow if the userId matches the authenticated user
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Checklist template collection - users can only access their own template
    match /checklist_template/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      // For creating new templates, allow if the userId matches the authenticated user
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Psychology logs collection - users can only access their own logs
    match /psychology_logs/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      // For creating new logs, allow if the userId matches the authenticated user
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Routines collection - users can only access their own routines
    match /routines/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      // For creating new routines, allow if the userId matches the authenticated user
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Transactions collection - users can only access their own transactions
    match /transactions/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      // For creating new transactions, allow if the userId matches the authenticated user
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Export Data

- **Settings** → **Export Data (CSV/PDF)**
- Download backup of all trades and logs
- Keep a local copy for analysis

---

## 🛠️ Troubleshooting

### "Firebase config not found"

→ Check `.env.local` file exists with correct values  
→ Restart app: `npm start`

### "Trades not saving"

→ Check Firestore has `trades` collection  
→ Check Firebase Authentication is enabled  
→ Check user is logged in

### "Checklist not showing"

→ Go to Settings and create a new checklist template  
→ Add at least one item with "+ Add Checklist Item"

### App crashes on trade entry

→ Check all price fields are numbers (no letters)  
→ Ensure Entry > Stop Loss for Buys  
→ Ensure Entry < Stop Loss for Sells

---

## 📈 Example: Your First Week

**Day 1: Setup**

- Install app, configure Firebase
- Create checklist template (6 items)
- Record first 2 practice trades

**Day 2-5: Trading**

- Record daily trades
- Log daily emotion (Psychology logs)
- Refine checklist based on results

**Day 6-7: Review**

- Open Analytics tab
- See first patterns emerge
- Identify best pairs/sessions
- Adjust checklist weights if needed

---

## 🎓 Pro Tips

1. **Consensus Score**: Start with 5-6 key checklist items
2. **Weight Distribution**: Higher weight = more important
3. **Grade Tracking**: A/A+ trades = validate edge, C/D trades = lessons
4. **Psychology Mirror**: Log emotion BEFORE trading (predict), then AFTER (correlate)
5. **Weekly Reviews**: Use Routine screen every Sunday
6. **Export Weekly**: Back up your data every Friday

---

## 📚 Documentation Files

- **README.md**: Full architecture & technical setup
- **CHECKLIST_TABLE_GUIDE.md**: Detailed checklist component docs
- **This file**: Quick start guide

---

## 🚀 Next Steps After Setup

1. ✅ Install dependencies
2. ✅ Configure Firebase
3. ✅ Create checklist template
4. ✅ Record 5+ trades
5. ✅ Review analytics
6. ✅ Refine checklist based on grades
7. ✅ Log daily psychology
8. ✅ Weekly reviews
9. ✅ Validate your edge
10. ✅ Export and analyze patterns

---

**Questions?** Refer to detailed docs or check code comments in respective screens.

**Ready to build your trading edge.** Let's go. 🎯
