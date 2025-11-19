# EditableChecklistTable Component Documentation

## Overview

The `EditableChecklistTable` component is the core UI for managing your SMC-based confluence checklist. It displays items in a **table format** with inline editing capabilities.

## Features

### 1. Table Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Item     │ Description  │ Weight │ Category   │ Actions        │
├─────────────────────────────────────────────────────────────────┤
│ Directi… │ Bias check   │   20   │ Critical   │ ✎  🗑         │
│ Order Bl │ Valid OB met │   15   │ Important  │ ✎  🗑         │
│ Liquidi… │ Sweep detect │   10   │ Optional   │ ✎  🗑         │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Column Breakdown

| Column          | Type    | Editable    | Description                                    |
| --------------- | ------- | ----------- | ---------------------------------------------- |
| **Item**        | String  | Yes         | Checklist item name (e.g., "Directional Bias") |
| **Description** | String  | Yes         | Detailed explanation of what to check          |
| **Weight**      | Number  | Yes         | Maximum points for this item (e.g., 20)        |
| **Category**    | Badge   | Yes (cycle) | Critical / Important / Optional                |
| **Actions**     | Buttons | N/A         | ✎ Edit, 🗑 Delete, ✓ Save, ✕ Cancel             |

### 3. Categories & Colors

- **Critical** (Red `#ff6b6b`): Must-have conditions for a valid setup
  - Examples: Directional bias broken? Valid order block?
- **Important** (Gold `#ffd700`): Strong confluence criteria
  - Examples: 1M ChoCh confirmation, liquidity sweep
- **Optional** (Light Blue `#87ceeb`): Nice-to-have factors
  - Examples: Additional confluence, macro alignment

### 4. Default SMC Checklist Template

When you initialize a new checklist, consider including:

```javascript
[
  {
    label: "Directional Bias",
    description: "Is the bias still valid? Any break?",
    weight: 25,
    category: "Critical",
  },
  {
    label: "Order Block Validity",
    description: "Is there a valid order block at current level?",
    weight: 20,
    category: "Critical",
  },
  {
    label: "Liquidity Sweep",
    description: "Did price sweep liquidity before entry?",
    weight: 15,
    category: "Important",
  },
  {
    label: "1M Confirmation",
    description: "Is there ChoCh confirmation on 1M?",
    weight: 20,
    category: "Critical",
  },
  {
    label: "R:R Quality",
    description: "Is R:R at least 1:1.5?",
    weight: 10,
    category: "Important",
  },
  {
    label: "FVG Presence",
    description: "Is there a clean FVG for entry?",
    weight: 10,
    category: "Optional",
  },
];
```

**Total Weight: 100 points**

## Usage in Code

### In SettingsScreen (Manage Checklist)

```typescript
<EditableChecklistTable
  items={state.checklistTemplate?.items || []}
  onAddItem={(item) => {
    // Add new item to template
    dispatch({
      type: "ADD_CHECKLIST_ITEM",
      payload: { ...item, id: `item-${Date.now()}`, createdAt: new Date() },
    });
  }}
  onUpdateItem={(item) => {
    // Update existing item
    dispatch({
      type: "UPDATE_CHECKLIST_ITEM",
      payload: item,
    });
  }}
  onDeleteItem={(itemId) => {
    // Delete item
    dispatch({
      type: "DELETE_CHECKLIST_ITEM",
      payload: itemId,
    });
  }}
/>
```

### In RoutineScreen (View by Category)

```typescript
const filteredItems =
  state.checklistTemplate?.items.filter(
    (item) => item.category === activeTab
  ) || [];

<EditableChecklistTable
  items={filteredItems}
  onAddItem={handleAddItem}
  onUpdateItem={handleUpdateItem}
  onDeleteItem={handleDeleteItem}
/>;
```

## Interaction Flows

### Adding a New Item

1. **Click** "+ Add Checklist Item" button at bottom
2. **Form appears** as a new row in the table
3. **Fill in** Item, Description, Weight, and Category
4. **Click ✓** to save or **✕** to cancel
5. Item is added to checklist template

### Editing an Item

1. **Click ✎** (pencil icon) on any row
2. Row becomes **editable** with TextInput fields
3. **Modify** any field (Label, Description, Weight, Category)
4. **Click ✓** to save or **✕** to cancel
5. Changes are persisted to state/Firebase

### Cycling Categories

While in edit mode:

- **Click** on the category badge
- **Cycles** through: Critical → Important → Optional → Critical
- Colors update in real-time

### Deleting an Item

1. **Click 🗑** (trash icon) on any row
2. Item is immediately removed from the table
3. Weight distribution updates for confluence calculation

## Confluence Score Calculation

**Formula:**

```
Confluence Score = (Sum of Selected Item Weights / Total Possible Weight) × 100
```

**Example:**

Total Template Weight: 100 points

When recording a trade, if you select:

- Directional Bias (25 points) ✓
- Order Block Validity (20 points) ✓
- Liquidity Sweep (15 points) ✓
- R:R Quality (10 points) ✓

Confluence Score = (25+20+15+10) / 100 × 100 = **70%** → Grade **B**

**Grade Mapping:**

- A+: 95-100%
- A: 85-94%
- B: 70-84%
- C: 50-69%
- D: Below 50%

## Styling & Theme

The component uses the cinematic dark theme:

```typescript
container: {
  backgroundColor: '#0d0d0d',      // Graphite
}
tableHeader: {
  backgroundColor: '#00d4d4',      // Cyan glow header
}
tableRow: {
  borderBottomColor: '#333333',    // Subtle divisions
}
cell: {
  color: '#f5f5f5',                // Whitesmoke text
}
categoryBadge: {
  backgroundColor: getCategoryColor(category)  // Dynamic color
}
```

## Props

```typescript
interface EditableChecklistTableProps {
  items: ChecklistItem[]; // Current items to display
  onAddItem: (item: Omit<ChecklistItem, "id" | "createdAt">) => void;
  onUpdateItem: (item: ChecklistItem) => void;
  onDeleteItem: (itemId: string) => void;
}
```

## Performance Considerations

- **Horizontal scrolling** for mobile (prevents cramped layout)
- **TextInput fields** only appear in edit mode (lightweight)
- **No re-renders** on scroll
- **Lazy validation** (checks only on save)

## Mobile-Friendly Design

- **Responsive columns**: Scale to fit content
- **Touch-friendly buttons**: 32x32px minimum tap area
- **Horizontal scroll**: For tables wider than screen
- **Clear feedback**: Active state highlights, color changes

## Firebase Integration

When connected to Firebase, the component's changes trigger:

```typescript
// Add item
await addChecklistItem(templateId, newItem);

// Update item
await updateChecklistItem(templateId, updatedItem);

// Delete item
await deleteChecklistItem(templateId, itemId);
```

Data is persisted to `checklist_template` collection under the user's document.

## Example: Full Checklist Flow

1. **Settings Screen**: User customizes checklist table

   - Adds "Divergence" with weight 5, category "Optional"
   - Updates "Order Block" weight from 20 to 25
   - Deletes "FVG Presence" item

2. **Trade Entry Screen**: User records trade

   - Selects which checklist items apply to this setup
   - Confluence score auto-calculates: 75%
   - Grade assigned: **B**

3. **Analytics Screen**: Trades visualized by grade

   - A+ and A trades show consistent entry quality
   - C and D trades show when confluence was weak
   - User identifies patterns

4. **Weekly Review**: User refines checklist
   - C-D trades clustered around specific missing item
   - Adds that item back, increases weight
   - Template evolves with trader's edge

---

The **EditableChecklistTable** is your interface to dynamic, user-driven SMC rule enforcement.
