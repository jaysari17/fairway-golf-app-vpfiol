
# FAIRWAY App Icon & Splash Screen Creation Guide

## App Icon Design Specifications

### Design Concept
A minimalist monogram "F" with a golf flag built into the top stroke on a deep mint green background.

### Color Palette
- **Background:** #57C8A1 (Deep mint green)
- **Symbol:** #228B22 (Dark forest green)
- **Style:** Clean, modern, minimalist

### Required Sizes

#### iOS
- **App Store:** 1024x1024px (PNG, no transparency)
- **iPhone:** Multiple sizes generated automatically by Expo

#### Android
- **Google Play:** 512x512px (PNG)
- **Adaptive Icon:** 432x432px foreground + solid color background

### Design Tips
1. Keep the design simple and recognizable at small sizes
2. Ensure good contrast between the "F" symbol and background
3. The golf flag should be subtle but visible
4. Test the icon at various sizes (from 20px to 1024px)
5. Avoid text or fine details that won't be visible at small sizes

## Splash Screen Specifications

### Design
- **Background Color:** #57C8A1 (Deep mint green)
- **Logo:** Centered FAIRWAY logo or "F" monogram
- **Size:** 200px width (as configured in app.json)

### Platform Requirements
- **iOS:** PNG image, centered on solid color background
- **Android:** PNG image with adaptive icon support
- **Web:** Favicon 192x192px

## Asset Locations

Place your generated assets in the following locations:

```
assets/
├── images/
│   ├── app-icon.png          (1024x1024 for iOS, 512x512 for Android)
│   └── splash-icon.png        (200px width, transparent background)
```

## Design Tools Recommendations

### Free Tools
- **Figma** (https://figma.com) - Professional design tool
- **Canva** (https://canva.com) - Easy-to-use design platform
- **GIMP** (https://gimp.org) - Free Photoshop alternative

### Paid Tools
- **Adobe Illustrator** - Vector graphics (recommended for icons)
- **Adobe Photoshop** - Raster graphics
- **Sketch** - macOS design tool

## Icon Generator Tools

After creating your base design, use these tools to generate all required sizes:

- **Expo Asset Generator:** Built into Expo (run `npx expo prebuild`)
- **App Icon Generator:** https://appicon.co
- **Icon Kitchen:** https://icon.kitchen

## Current Placeholder

The app currently uses placeholder images from the Natively template. You should replace:
- `assets/images/app-icon.png` - Your custom app icon
- `assets/images/splash-icon.png` - Your custom splash screen logo

## Testing Your Icons

1. **iOS Simulator:** Run `npm run ios` and check the home screen
2. **Android Emulator:** Run `npm run android` and check the app drawer
3. **Physical Device:** Test on real devices to see actual appearance
4. **Different Backgrounds:** Test icon on various wallpapers (light/dark)

## Accessibility Considerations

- Ensure sufficient contrast (WCAG AA standard: 4.5:1 minimum)
- Test with color blindness simulators
- Icon should be recognizable in grayscale
- Avoid relying solely on color to convey meaning

## Brand Consistency

Your app icon should:
- Match the in-app color scheme (#57C8A1 primary color)
- Reflect the FAIRWAY brand identity
- Be consistent across all platforms
- Stand out among other golf apps

## Next Steps

1. Create your app icon design (1024x1024px)
2. Create your splash screen logo (200px width)
3. Replace placeholder images in `assets/images/`
4. Test on both iOS and Android
5. Submit to app stores with your custom assets
