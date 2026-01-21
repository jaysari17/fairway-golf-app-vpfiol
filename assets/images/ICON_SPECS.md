
# 📐 Fairway Icon Specifications

## 🎨 Design Guidelines

### Logo Design
- **Symbol**: Minimalist "F" monogram
- **Feature**: Golf flag integrated into top stroke
- **Colors**: Dark forest green (#1a4d3a) on mint green (#57C8A1)
- **Style**: Clean, modern, minimalist

### Design Principles
- ✅ Simple and recognizable at small sizes
- ✅ Works in both light and dark contexts
- ✅ No fine details that disappear when scaled
- ✅ Strong contrast between foreground and background
- ❌ No text or wordmarks
- ❌ No gradients or complex effects
- ❌ No transparency on iOS app icon

## 📱 Required Sizes

### iOS App Icon
- **Size**: 1024 x 1024 pixels
- **Format**: PNG
- **Transparency**: NO (must be opaque)
- **Rounded Corners**: NO (iOS adds them automatically)
- **Color Space**: sRGB or P3
- **File**: `app-icon.png`

**Important**: iOS will reject icons with:
- Transparency/alpha channel
- Pre-rounded corners
- Size other than 1024x1024

### Android Adaptive Icon
- **Size**: 1024 x 1024 pixels
- **Format**: PNG
- **Transparency**: YES (recommended)
- **Safe Zone**: Center 66% (684 x 684 pixels)
- **Background**: Solid color (#57C8A1)
- **File**: `adaptive-icon.png`

**Safe Zone Guide**:
```
┌─────────────────────────┐
│                         │  Outer 17% may be
│   ┌─────────────────┐   │  cropped on some
│   │                 │   │  Android devices
│   │   SAFE ZONE     │   │
│   │   684 x 684     │   │  Keep logo centered
│   │                 │   │  in this area
│   └─────────────────┘   │
│                         │
└─────────────────────────┘
```

### Splash Screen Icon
- **Size**: 400 x 400 pixels
- **Format**: PNG
- **Transparency**: YES (recommended)
- **Background**: Will be placed on #57C8A1
- **File**: `splash-icon.png`

**Usage**: Centered logo shown during app launch

### Additional Sizes (Optional)

#### PWA Icons
- **192 x 192**: `icon-192.png`
- **512 x 512**: `icon-512.png`

#### Favicon
- **32 x 32**: `favicon-32.png`
- **16 x 16**: `favicon-16.png`

## 🛠️ Generation Tool

Use the provided HTML generator: `generate-icons.html`

### How to Use
1. Open `generate-icons.html` in any modern browser
2. Click "Generate All Icons"
3. Preview all sizes
4. Download individual icons or all as ZIP
5. Place in `assets/images/` directory

### What It Generates
- ✅ Correct dimensions for each platform
- ✅ Proper color profiles
- ✅ Optimized file sizes
- ✅ Platform-specific requirements

## ✅ Verification Checklist

Before submitting:

### iOS Icon
- [ ] Exactly 1024 x 1024 pixels
- [ ] PNG format
- [ ] No transparency
- [ ] No rounded corners
- [ ] File size < 1MB
- [ ] Named `app-icon.png`

### Android Icon
- [ ] Exactly 1024 x 1024 pixels
- [ ] PNG format
- [ ] Logo centered in safe zone
- [ ] File size < 1MB
- [ ] Named `adaptive-icon.png`

### Splash Icon
- [ ] Exactly 400 x 400 pixels
- [ ] PNG format
- [ ] Transparent background
- [ ] File size < 500KB
- [ ] Named `splash-icon.png`

## 🧪 Testing Icons

### Test on iOS
```bash
npx expo prebuild --clean
npm run ios
```

Check:
- [ ] Icon appears on home screen
- [ ] Icon looks sharp (not blurry)
- [ ] Colors are correct
- [ ] Splash screen displays properly

### Test on Android
```bash
npx expo prebuild --clean
npm run android
```

Check:
- [ ] Icon appears on home screen
- [ ] Icon adapts to device shape (circle, square, squircle)
- [ ] Logo is not cropped
- [ ] Colors are correct
- [ ] Splash screen displays properly

## 🎨 Color Reference

```css
/* Primary Background */
--mint-green: #57C8A1;

/* Logo/Foreground */
--forest-green: #1a4d3a;

/* Alternative Light */
--white: #FFFFFF;

/* Alternative Dark */
--black: #000000;
```

## 📏 Dimensions Quick Reference

| Platform | Size | Transparency | Corners | File |
|----------|------|--------------|---------|------|
| iOS App Store | 1024x1024 | ❌ No | ❌ No | app-icon.png |
| Android Adaptive | 1024x1024 | ✅ Yes | ❌ No | adaptive-icon.png |
| Splash Screen | 400x400 | ✅ Yes | ❌ No | splash-icon.png |
| PWA Large | 512x512 | ✅ Yes | ❌ No | icon-512.png |
| PWA Small | 192x192 | ✅ Yes | ❌ No | icon-192.png |

## 🚨 Common Mistakes

### ❌ Don't Do This
- Using JPEG format (use PNG)
- Adding rounded corners to iOS icon
- Making logo too large (extends beyond safe zone on Android)
- Using gradients or complex effects
- Including text or wordmarks
- Wrong dimensions

### ✅ Do This
- Use PNG format for all icons
- Keep iOS icon square with no transparency
- Center Android icon in safe zone
- Use simple, bold design
- Test on real devices
- Use the HTML generator tool

## 🆘 Troubleshooting

**Icon not updating after change?**
```bash
# Clear build cache
npx expo prebuild --clean

# Delete native folders
rm -rf ios android

# Rebuild
npx expo prebuild
```

**Icon looks blurry?**
- Ensure you're using exact pixel dimensions
- Don't scale up from smaller images
- Use the generator tool for correct sizes

**Android icon gets cropped?**
- Keep logo within center 66% safe zone
- Test on different Android devices
- Use the adaptive icon preview in generator

**iOS rejects icon?**
- Remove transparency/alpha channel
- Remove rounded corners
- Ensure exactly 1024x1024 pixels
- Use sRGB color space

## 📞 Need Help?

- Check [TROUBLESHOOTING.md](../../TROUBLESHOOTING.md)
- Review [LAUNCH_READY.md](../../LAUNCH_READY.md)
- See Expo documentation: https://docs.expo.dev/guides/app-icons/

---

**Ready to generate?** Open `generate-icons.html` and click "Generate All Icons"! 🎨
