
# 🔧 Icon Fix Guide - Resolving "HTML Not Found" Error

## Problem Identified

Your `app.json` was referencing icon files that don't exist:
- ❌ `./assets/images/fairway-icon.png`
- ❌ `./assets/images/fairway-icon-foreground.png`
- ❌ `./assets/images/splash-icon.png`

The error about "HTML not found" occurs because:
1. The build process can't find the PNG files
2. It may be trying to use `generate-icons.html` as an icon (which is wrong)
3. Missing icon files cause the build to fail

## ✅ Solution - 3 Steps

### Step 1: Generate Placeholder Icons (Immediate Fix)

Run this command to create placeholder icons:

```bash
node generate-placeholder-icons.js
```

This creates minimal placeholder files so your app can build:
- `assets/images/icon.png` (1024x1024)
- `assets/images/adaptive-icon.png` (1024x1024)
- `assets/images/splash.png` (400x400)
- `assets/images/favicon.png` (48x48)

**Note**: These are just 1x1 pixel placeholders. You MUST replace them with actual icons before submitting to app stores.

### Step 2: Clean and Rebuild

After creating the placeholder icons:

```bash
# Clean the build cache
npx expo prebuild --clean

# Remove native folders
rm -rf ios android

# Rebuild
npx expo prebuild

# Test on iOS
npm run ios

# Test on Android
npm run android
```

### Step 3: Create Actual Fairway Icons

You have 3 options:

#### Option A: Use the HTML Generator (Easiest)

1. Open `assets/images/generate-icons.html` in your web browser
2. The tool will generate icons with the Fairway logo design:
   - Minimalist "F" monogram
   - Golf flag in top stroke
   - Dark forest green (#1a4d3a) on mint green (#57C8A1)
3. Click "Generate All Icons"
4. Download each icon:
   - `icon.png` (1024x1024) - iOS app icon
   - `adaptive-icon.png` (1024x1024) - Android icon
   - `splash.png` (400x400) - Splash screen
   - `favicon.png` (48x48) - Web favicon
5. Replace the placeholder files in `assets/images/`

#### Option B: Use Design Software

If you have Figma, Sketch, Photoshop, or Illustrator:

1. **Create the Fairway Logo**:
   - Canvas: 1024x1024 pixels
   - Background: Mint green (#57C8A1)
   - Logo: Dark forest green (#1a4d3a)
   - Design: Minimalist "F" with golf flag

2. **Export iOS Icon** (`icon.png`):
   - Size: 1024x1024 pixels
   - Format: PNG
   - **NO transparency** (must be opaque)
   - No rounded corners
   - Color space: sRGB

3. **Export Android Icon** (`adaptive-icon.png`):
   - Size: 1024x1024 pixels
   - Format: PNG
   - Can have transparency
   - Keep logo in center 66% (684x684 safe zone)

4. **Export Splash Icon** (`splash.png`):
   - Size: 400x400 pixels
   - Format: PNG
   - Transparent background
   - Logo centered

5. **Export Favicon** (`favicon.png`):
   - Size: 48x48 pixels
   - Format: PNG
   - Simplified version of logo

#### Option C: Use Online Icon Generator

1. Go to https://www.appicon.co/ or https://easyappicon.com/
2. Upload a 1024x1024 PNG of your Fairway logo
3. Generate all sizes
4. Download and extract
5. Copy the required files to `assets/images/`:
   - iOS icon → `icon.png`
   - Android adaptive icon → `adaptive-icon.png`
   - Create splash and favicon manually

## 📋 Icon Requirements Checklist

Before submitting to app stores, verify:

### iOS Icon (`icon.png`)
- [ ] Exactly 1024 x 1024 pixels
- [ ] PNG format
- [ ] **NO transparency** (opaque background)
- [ ] **NO rounded corners** (iOS adds them automatically)
- [ ] File size < 1MB
- [ ] sRGB color space

### Android Icon (`adaptive-icon.png`)
- [ ] Exactly 1024 x 1024 pixels
- [ ] PNG format
- [ ] Logo centered in safe zone (center 66%)
- [ ] Can have transparency
- [ ] File size < 1MB

### Splash Icon (`splash.png`)
- [ ] Exactly 400 x 400 pixels
- [ ] PNG format
- [ ] Transparent background (recommended)
- [ ] Logo centered
- [ ] File size < 500KB

### Favicon (`favicon.png`)
- [ ] 48 x 48 pixels (or 32x32)
- [ ] PNG format
- [ ] Simplified logo design
- [ ] File size < 100KB

## 🧪 Testing Your Icons

After replacing the placeholder icons:

### Test Locally

```bash
# Clean build
npx expo prebuild --clean

# Test iOS
npm run ios
# Check: Icon appears on home screen, looks sharp, correct colors

# Test Android
npm run android
# Check: Icon adapts to device shape, not cropped, correct colors
```

### Test on Real Devices

1. **iOS**: Use TestFlight
   - Build with EAS: `eas build --platform ios --profile preview`
   - Install on iPhone via TestFlight
   - Verify icon on home screen

2. **Android**: Use internal testing
   - Build with EAS: `eas build --platform android --profile preview`
   - Install APK on Android device
   - Verify icon on home screen and app drawer

## 🚨 Common Issues & Fixes

### Issue: "Icon has transparency" (iOS rejection)

**Fix**: Remove alpha channel from iOS icon
```bash
# Using ImageMagick
convert icon.png -background "#57C8A1" -alpha remove -alpha off icon.png
```

### Issue: "Icon has rounded corners" (iOS rejection)

**Fix**: Ensure icon is perfectly square with sharp corners. iOS adds rounded corners automatically.

### Issue: Android icon gets cropped

**Fix**: Keep logo within center 66% safe zone (684x684 pixels on 1024x1024 canvas)

### Issue: Icons not updating after change

**Fix**: Clear cache and rebuild
```bash
npx expo prebuild --clean
rm -rf ios android
npx expo prebuild
```

### Issue: Wrong icon appears

**Fix**: Check file names match exactly:
- `icon.png` (not `Icon.png` or `app-icon.png`)
- `adaptive-icon.png` (not `adaptive_icon.png`)
- `splash.png` (not `splash-icon.png`)

## 📱 App Store Submission

Before submitting:

1. **Replace all placeholder icons** with actual Fairway logo
2. **Test on real devices** (iOS and Android)
3. **Verify icon quality**:
   - Sharp and clear at all sizes
   - Colors match brand (#57C8A1 mint green, #1a4d3a forest green)
   - Logo recognizable at small sizes
4. **Check file sizes**:
   - iOS icon < 1MB
   - Android icon < 1MB
   - All icons optimized

## 🎨 Fairway Logo Design Specs

For reference when creating icons:

**Logo Elements**:
- Minimalist "F" monogram
- Golf flag integrated into top stroke of "F"
- Clean, modern, simple design

**Colors**:
- Background: Mint green (#57C8A1)
- Foreground: Dark forest green (#1a4d3a)

**Style**:
- Flat design (no gradients)
- Bold, recognizable
- Works at small sizes
- No fine details

## 📞 Need Help?

If you're still having issues:

1. Check `assets/images/ICON_SPECS.md` for detailed specifications
2. Review `assets/images/README.md` for quick reference
3. See `TROUBLESHOOTING.md` for common problems
4. Verify all icon files exist: `ls -la assets/images/*.png`

## ✅ Quick Verification

Run this to check if all required icons exist:

```bash
ls -lh assets/images/icon.png assets/images/adaptive-icon.png assets/images/splash.png assets/images/favicon.png
```

Expected output:
```
-rw-r--r--  1 user  staff   XXX KB  icon.png
-rw-r--r--  1 user  staff   XXX KB  adaptive-icon.png
-rw-r--r--  1 user  staff   XXX KB  splash.png
-rw-r--r--  1 user  staff   XXX KB  favicon.png
```

If any file is missing or shows "No such file", create it using one of the methods above.

---

**Summary**: The "HTML not found" error was caused by missing icon PNG files. Run `node generate-placeholder-icons.js` to create placeholders, then replace them with actual Fairway logo icons before app store submission.
