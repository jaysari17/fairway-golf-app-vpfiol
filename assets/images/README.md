
# Fairway App Icons

## 🚨 IMPORTANT: Icon Files Required

Your app needs these icon files to build successfully:

- ✅ `icon.png` (1024x1024) - iOS app icon
- ✅ `adaptive-icon.png` (1024x1024) - Android adaptive icon
- ✅ `splash.png` (400x400) - Splash screen logo
- ✅ `favicon.png` (48x48) - Web favicon

**If these files are missing, you'll get build errors like "HTML not found".**

## 🔧 Quick Fix (If Icons Are Missing)

If you're getting errors about missing icons:

### Step 1: Create Placeholder Icons

Run this command from the project root:

```bash
node generate-placeholder-icons.js
```

This creates minimal placeholder files so your app can build.

### Step 2: Clean and Rebuild

```bash
npx expo prebuild --clean
rm -rf ios android
npx expo prebuild
```

### Step 3: Replace with Actual Icons

**⚠️ IMPORTANT**: The placeholders are just 1x1 pixel images. You MUST replace them with actual Fairway logo icons before submitting to app stores.

## 🎨 Creating Fairway Icons

### Option 1: Use the HTML Generator (Easiest)

1. Open `generate-icons.html` in your web browser
2. Click "Generate All Icons"
3. Download the generated icons
4. Replace the placeholder files in this directory

### Option 2: Use Design Software

Create icons with these specifications:

**Design:**
- Minimalist "F" monogram
- Golf flag integrated into top stroke
- Dark forest green (#1a4d3a) on mint green (#57C8A1)

**Sizes:**
- `icon.png`: 1024x1024, NO transparency, NO rounded corners
- `adaptive-icon.png`: 1024x1024, can have transparency, logo in center 66%
- `splash.png`: 400x400, transparent background
- `favicon.png`: 48x48, simplified logo

### Option 3: Use Online Tools

1. Go to https://www.appicon.co/
2. Upload a 1024x1024 PNG of your logo
3. Generate all sizes
4. Download and place in this directory

## 📋 Icon Requirements

### iOS Icon (`icon.png`)
- **Size**: 1024 x 1024 pixels
- **Format**: PNG
- **Transparency**: ❌ NO (must be opaque)
- **Rounded Corners**: ❌ NO (iOS adds them)
- **File Size**: < 1MB

### Android Icon (`adaptive-icon.png`)
- **Size**: 1024 x 1024 pixels
- **Format**: PNG
- **Transparency**: ✅ YES (recommended)
- **Safe Zone**: Keep logo in center 66% (684x684 pixels)
- **File Size**: < 1MB

### Splash Icon (`splash.png`)
- **Size**: 400 x 400 pixels
- **Format**: PNG
- **Transparency**: ✅ YES (recommended)
- **Background**: Will be placed on #57C8A1
- **File Size**: < 500KB

### Favicon (`favicon.png`)
- **Size**: 48 x 48 pixels
- **Format**: PNG
- **File Size**: < 100KB

## 🧪 Testing Icons

After creating/replacing icons:

```bash
# Clean build
npx expo prebuild --clean

# Test on iOS
npm run ios

# Test on Android
npm run android
```

Check:
- ✅ Icon appears on home screen
- ✅ Icon looks sharp (not blurry)
- ✅ Colors are correct
- ✅ Logo is not cropped
- ✅ Splash screen displays properly

## 🚨 Common Issues

### "HTML not found" error
**Cause**: Icon PNG files are missing
**Fix**: Run `node generate-placeholder-icons.js`

### iOS rejects icon
**Cause**: Icon has transparency or rounded corners
**Fix**: Remove alpha channel, ensure square corners

### Android icon gets cropped
**Cause**: Logo extends beyond safe zone
**Fix**: Keep logo within center 66% of canvas

### Icons not updating
**Cause**: Build cache
**Fix**: Run `npx expo prebuild --clean`

## 📱 Brand Colors

```css
/* Primary Background */
--mint-green: #57C8A1;

/* Logo/Foreground */
--forest-green: #1a4d3a;
```

## 📞 Need Help?

- See `ICON_SPECS.md` for detailed specifications
- See `ICON_FIX_GUIDE.md` for troubleshooting
- See `../TROUBLESHOOTING.md` for general issues

## ✅ Verification Checklist

Before app store submission:

- [ ] All 4 icon files exist (icon.png, adaptive-icon.png, splash.png, favicon.png)
- [ ] iOS icon is 1024x1024 with NO transparency
- [ ] Android icon keeps logo in safe zone
- [ ] Icons tested on real iOS device
- [ ] Icons tested on real Android device
- [ ] Icons look sharp and professional
- [ ] Colors match brand (#57C8A1, #1a4d3a)

---

**Quick Check**: Run `ls -lh *.png` in this directory. You should see 4 PNG files with reasonable file sizes (not just 1 byte).
