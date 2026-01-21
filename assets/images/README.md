
# Fairway App Icons

## Quick Start

1. Open `generate-icons.html` in your web browser
2. Click "Generate All Icons"
3. Download the icons
4. Replace the placeholder images in this directory

## Required Icons

### iOS
- **app-icon.png** (1024x1024) - Main app icon for App Store
  - No transparency
  - No rounded corners
  - Square format

### Android
- **adaptive-icon.png** (1024x1024) - Adaptive icon foreground
  - Keep important content in center 66% (safe zone)
  - Can have transparency
  - Will be masked to different shapes

### Splash Screen
- **splash-icon.png** (400x400) - Centered logo for splash screen
  - Transparent background recommended
  - Will be centered on mint green background

## Design Specifications

**Brand Colors:**
- Primary: #57C8A1 (Deep mint green)
- Accent: #1a4d3a (Dark forest green)

**Logo:**
- Minimalist "F" monogram
- Golf flag integrated into top stroke
- Dark forest green on mint green background

## Testing Icons

After generating icons:

```bash
# Clean and rebuild
npx expo prebuild --clean

# Test on iOS simulator
npm run ios

# Test on Android emulator
npm run android
```

## Troubleshooting

**Icons not updating?**
- Clear build cache: `npx expo prebuild --clean`
- Delete `ios` and `android` folders
- Run `npx expo prebuild` again

**Wrong size or format?**
- Use the HTML generator - it creates correct specifications
- Don't manually resize - use the generator for each size

**Adaptive icon looks wrong on Android?**
- Ensure logo is centered in safe zone (66% of canvas)
- Test on different Android devices with different icon shapes
