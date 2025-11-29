# Visual Guide - Dark Theme & Mobile Menu

## Desktop View

### Light Mode (Default)
```
┌─────────────────────────────────────────────────────────┐
│  📋 FreeClipboard  [Home] [Tools] [About] [Contact] 🌙 │
└─────────────────────────────────────────────────────────┘
```

### Dark Mode (After clicking 🌙)
```
┌─────────────────────────────────────────────────────────┐
│  📋 FreeClipboard  [Home] [Tools] [About] [Contact] ☀️ │  ← Dark background
└─────────────────────────────────────────────────────────┘
```

## Mobile View (≤768px)

### Menu Closed
```
┌──────────────────────────────┐
│ 📋 FreeClipboard    🌙  ☰   │
└──────────────────────────────┘
```

### Menu Open (After clicking ☰)
```
┌──────────────────────────────┐
│ 📋 FreeClipboard    🌙  ✕   │
├──────────────────────────────┤
│ Home                         │
│ Tools                        │
│ About                        │
│ Contact                      │
└──────────────────────────────┘
```

## Theme Toggle Behavior

### Light Mode → Dark Mode
1. User clicks 🌙 button
2. Icon changes to ☀️
3. Background becomes dark (#0F172A)
4. Text becomes light (#F9FAFB)
5. All components adapt to dark theme
6. Preference saved to localStorage

### Dark Mode → Light Mode
1. User clicks ☀️ button
2. Icon changes to 🌙
3. Background becomes light (#F3F4F6)
4. Text becomes dark (#1F2937)
5. All components adapt to light theme
6. Preference saved to localStorage

## Mobile Menu Behavior

### Opening Menu
1. User taps hamburger icon (☰)
2. Icon animates to X (✕)
3. Menu slides down smoothly
4. Navigation links appear
5. Body scroll is prevented

### Closing Menu
1. User taps X icon, outside menu, or a link
2. Icon animates back to ☰
3. Menu slides up smoothly
4. Body scroll is restored

## Responsive Breakpoints

### Small Mobile (≤375px)
- Single column layout
- Smaller fonts
- Compact spacing
- Full-width buttons

### Mobile (376px - 768px)
- Single column layout
- Mobile menu active
- Touch-optimized
- 2-column stats grid

### Tablet (768px - 1024px)
- 2-column layouts
- Condensed navigation
- Balanced spacing
- Hybrid design

### Desktop (≥1024px)
- Multi-column layouts
- Full navigation bar
- Hover effects
- Spacious design

## Color Schemes

### Light Mode Colors
- Background: #F3F4F6 (light gray)
- Cards: #FFFFFF (white)
- Text: #1F2937 (dark gray)
- Primary: #3B82F6 (blue)
- Border: #E5E7EB (light border)

### Dark Mode Colors
- Background: #0F172A (dark blue-gray)
- Cards: #1E293B (dark slate)
- Text: #F9FAFB (off-white)
- Primary: #60A5FA (light blue)
- Border: #374151 (dark border)

## Interactive States

### Buttons
- **Hover**: Slight lift + shadow
- **Active**: Press down effect
- **Focus**: Blue outline ring
- **Disabled**: 50% opacity

### Cards
- **Hover**: Lift + border color change
- **Active**: Scale down slightly
- **Focus**: Outline ring

### Navigation Links
- **Hover**: Underline animation
- **Active**: Primary color
- **Focus**: Outline ring

## Accessibility Features

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close mobile menu
- Focus indicators always visible

### Screen Readers
- Proper ARIA labels
- Semantic HTML structure
- Skip to main content link
- Descriptive button labels

### Touch Targets
- Minimum 44x44px size
- Adequate spacing
- No overlapping targets
- Easy to tap accurately

## Animation Timings

- Theme transition: 300ms
- Menu slide: 300ms
- Button hover: 200ms
- Card hover: 300ms
- Focus ring: Instant

## Browser Support

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ iOS Safari 14+
✅ Android Chrome 90+

## Testing Checklist

### Desktop
- [ ] Theme toggle in header works
- [ ] Theme persists on page reload
- [ ] All pages support dark mode
- [ ] Navigation links work
- [ ] Hover effects smooth

### Mobile
- [ ] Hamburger menu opens/closes
- [ ] Theme toggle accessible
- [ ] No horizontal scroll
- [ ] Touch targets adequate
- [ ] Menu closes on link click

### Tablet
- [ ] Layout adapts properly
- [ ] Navigation functional
- [ ] Content readable
- [ ] Images scale correctly

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] ARIA labels present

## Common Issues & Solutions

### Issue: Theme doesn't persist
**Solution**: Check localStorage is enabled in browser

### Issue: Mobile menu doesn't close
**Solution**: Click outside menu or on a link

### Issue: Icons not showing
**Solution**: Ensure emoji support in browser/OS

### Issue: Layout breaks on small screens
**Solution**: Clear browser cache and reload

### Issue: Dark mode too dark/light
**Solution**: Adjust CSS variables in style.css

## Customization

### Change Theme Colors
Edit CSS variables in `assets/css/style.css`:
```css
:root {
  --primary: #3B82F6;  /* Change primary color */
  --dark: #1F2937;     /* Change text color */
}

[data-theme="dark"] {
  --primary: #60A5FA;  /* Dark mode primary */
  --dark: #F9FAFB;     /* Dark mode text */
}
```

### Adjust Breakpoints
Modify media queries in `assets/css/style.css`:
```css
@media (max-width: 768px) {
  /* Mobile styles */
}
```

### Customize Animations
Edit transition properties:
```css
--transition: all 0.3s ease;  /* Global transition */
```

## Performance Tips

1. **Minimize repaints**: Use transform instead of position
2. **Optimize images**: Use appropriate sizes for devices
3. **Lazy load**: Defer non-critical resources
4. **Cache assets**: Leverage browser caching
5. **Minify CSS/JS**: Reduce file sizes

## Future Enhancements

- [ ] Add theme preview
- [ ] Custom color picker
- [ ] Multiple theme options
- [ ] Animated theme transitions
- [ ] Theme scheduling (auto dark at night)
