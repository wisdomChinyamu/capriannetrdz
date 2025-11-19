# Calendar Heatmap - Responsive Design & Animation Guide

## Overview

The `CalendarHeatmap` component now includes:

1. **Scale Animation on Press**: Subtle tactile feedback with 0.95 scale transform
2. **Responsive Layouts**: Adaptive day cell widths for mobile, tablet, and desktop

---

## Scale Animation (Press Feedback)

### Implementation

The component uses React Native's `Animated` API to create smooth scale animations:

```typescript
const handleDayCellPressIn = (dayKey: string) => {
  const scaleValue = getScaleAnimatedValue(dayKey);
  Animated.spring(scaleValue, {
    toValue: 0.95, // Scale down to 95%
    useNativeDriver: true, // Uses native performance
    tension: 100,
    friction: 8,
  }).start();
};

const handleDayCellPressOut = (dayKey: string) => {
  const scaleValue = getScaleAnimatedValue(dayKey);
  Animated.spring(scaleValue, {
    toValue: 1, // Spring back to normal
    useNativeDriver: true,
    tension: 100,
    friction: 8,
  }).start();
};
```

### Animation Flow

1. **onPressIn**: Day cell scales to 0.95 with spring animation
2. **onPressOut**: Day cell springs back to scale 1.0
3. **Feedback**: Provides tactile visual feedback without additional UI elements

### Customization

To adjust the animation feel:

- **Scale value**: Change `0.95` to adjust press depth (0.8-0.99 recommended)
- **Tension**: Lower values = slower animation (50-150 range)
- **Friction**: Higher values = less bouncy (5-15 range)

---

## Responsive Layouts

### Breakpoints

The component uses theme breakpoints defined in `src/theme/theme.ts`:

```typescript
export const breakpoints = {
  mobile: 0, // Mobile phones (320px - 767px)
  tablet: 768, // Tablets & small laptops (768px - 1023px)
  desktop: 1024, // Desktop & large screens (1024px+)
};
```

### Day Cell Width Adjustments

| Device  | Width  | Min Width | Cells per Row |
| ------- | ------ | --------- | ------------- |
| Mobile  | 14.28% | 40px      | 7             |
| Tablet  | 13%    | 48px      | ~7-8          |
| Desktop | 12%    | 60px      | ~8            |

### Responsive Functions

```typescript
const getResponsiveCellWidth = () => {
  if (isDesktop) {
    return { width: "12%", minWidth: 60 }; // Larger spacing
  }
  if (isTablet) {
    return { width: "13%", minWidth: 48 }; // Medium spacing
  }
  return { width: "14.28%", minWidth: 40 }; // Mobile spacing
};
```

### Dimension Listener

The component automatically listens for screen dimension changes:

```typescript
React.useEffect(() => {
  const subscription = Dimensions.addEventListener("change", ({ window }) => {
    setWindowWidth(window.width);
  });
  return () => subscription?.remove();
}, []);
```

This ensures the calendar updates when:

- Device orientation changes (portrait ↔ landscape)
- Window is resized on web
- Split-screen mode is activated on tablet

---

## Testing Responsive Behavior

### Mobile Portrait

- Window width: 375px (iPhone SE)
- Expected: 7 cells per row, compact layout
- Day cell width: ~52px

### Mobile Landscape

- Window width: 667px (iPhone landscape)
- Expected: 7 cells per row, slightly wider
- Day cell width: ~92px

### Tablet Portrait

- Window width: 768px (iPad)
- Expected: ~7-8 cells per row
- Day cell width: ~98px

### Tablet Landscape

- Window width: 1024px+
- Expected: ~8+ cells per row
- Day cell width: ~122px

### Desktop

- Window width: 1920px+
- Expected: Centered layout, optimal spacing
- Day cell width: ~230px (with max width consideration)

---

## Implementation Details

### Day Cell Wrapping

Each day cell is wrapped in `Animated.View` to apply the scale transformation:

```tsx
<Animated.View
  style={[
    getResponsiveCellWidth(),
    {
      transform: [{ scale: scaleValue }],
    },
  ]}
>
  <Pressable
    onPressIn={() => day && handleDayCellPressIn(dayKey)}
    onPressOut={() => day && handleDayCellPressOut(dayKey)}
    // ... other props
  >
    {day && <Text>{day}</Text>}
  </Pressable>
</Animated.View>
```

### Animation Values Cache

Each day cell has its own `Animated.Value` for independent animations:

```typescript
const scaleAnimations = useRef<Record<string, Animated.Value>>({}).current;

const getScaleAnimatedValue = (dayKey: string) => {
  if (!scaleAnimations[dayKey]) {
    scaleAnimations[dayKey] = new Animated.Value(1);
  }
  return scaleAnimations[dayKey];
};
```

---

## Performance Considerations

1. **Native Driver**: Animation uses `useNativeDriver: true` for 60 FPS performance
2. **Memoization**: Trade grouping uses `useMemo` to prevent recalculations
3. **Lazy Animation Values**: Animation values are created only when needed
4. **Efficient Listeners**: Dimension listener auto-cleans up on unmount

---

## Browser/Platform Support

- ✅ React Native (iOS, Android)
- ✅ React Native Web
- ✅ Expo
- ✅ Modern browsers with CSS transforms
- ✅ Responsive to orientation changes
- ✅ Works with Tauri web view

---

## Troubleshooting

### Animation Not Working

- Ensure `useNativeDriver: true` is set
- Check that `Animated.View` wraps the `Pressable`
- Verify `transform` property uses animation value

### Layout Not Responsive

- Check `Dimensions.addEventListener` is properly subscribed
- Verify breakpoint values in `theme.ts`
- Test with viewport resize tool in browser DevTools

### Performance Issues

- Reduce animation `tension` value to lighten load
- Verify `Platform.OS` check for web-specific features
- Profile using React Native Profiler or Chrome DevTools

---

## Future Enhancements

- [ ] Add haptic feedback on press (react-native-haptic-feedback)
- [ ] Add gesture animations (swipe to navigate months)
- [ ] Add transition animations between responsive layouts
- [ ] Add dark mode transition animation
- [ ] Add pull-to-refresh animation
