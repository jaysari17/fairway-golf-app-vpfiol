
# FAIRWAY - Asset Creation Instructions

## 🎨 Required Assets for App Store Submission

You need to create 2 main assets before submitting to the app stores:

### 1. App Icon (1024x1024px)

#### Specifications
- **Size**: 1024x1024 pixels
- **Format**: PNG (24-bit)
- **Color Space**: sRGB or P3
- **No Transparency**: Must have opaque background
- **No Rounded Corners**: iOS and Android handle this automatically

#### Design Guidelines
```
Background: Deep mint green (#57C8A1)
Logo: Dark forest green (#2C5F4F) "F" with golf flag
Style: Minimalist, modern, clean
```

#### Design Description
- Solid mint green (#57C8A1) background
- Centered dark forest green "F" letter
- Small golf flag integrated into the top of the "F"
- Clean, simple, recognizable at small sizes

#### Tools to Create
1. **Figma** (Free) - https://figma.com
2. **Canva** (Free) - https://canva.com
3. **Adobe Illustrator** (Paid)
4. **Sketch** (Mac only, Paid)

#### Save Location
```
assets/images/app-icon.png
```

### 2. Splash Screen (2048x2048px)

#### Specifications
- **Size**: 2048x2048 pixels
- **Format**: PNG (24-bit)
- **Background**: Mint green (#57C8A1)
- **Content**: Centered logo/text

#### Design Guidelines
```
Background: Mint green (#57C8A1)
Content: "FAIRWAY" text or logo
Style: Clean, centered, minimal
```

#### Design Description
- Full mint green (#57C8A1) background
- "FAIRWAY" text in white or dark green
- Centered both horizontally and vertically
- Optional: Small golf flag icon above text

#### Save Location
```
assets/images/splash-icon.png
```

## 📱 App Store Screenshots (Optional but Recommended)

### iPhone Screenshots

#### Required Sizes
1. **6.7" Display** (iPhone 14 Pro Max, 15 Pro Max)
   - Size: 1290x2796 pixels
   - Most important - shown first in App Store

2. **6.5" Display** (iPhone 11 Pro Max, XS Max)
   - Size: 1242x2688 pixels

3. **5.5" Display** (iPhone 8 Plus)
   - Size: 1242x2208 pixels

#### Recommended Screenshots (5-10 images)
1. **Social Feed** - Show the main social feed with activity
2. **Course Selection** - Display the course selection modal
3. **Rating Flow - Play Again** - Show the first rating step
4. **Rating Flow - Comparison** - Show the comparison cards
5. **Rating Flow - Ranking** - Show the drag-to-rank interface
6. **Profile** - Display user stats and achievements
7. **Course Discovery** - Show the discover screen

### iPad Screenshots

#### Required Sizes
1. **12.9" Display** (iPad Pro)
   - Size: 2048x2732 pixels

2. **11" Display** (iPad Pro)
   - Size: 1668x2388 pixels

### Android Screenshots

#### Required Sizes
- **Phone**: 1080x1920 pixels (minimum)
- **7" Tablet**: 1920x1200 pixels
- **10" Tablet**: 1920x1080 pixels

## 🛠️ How to Create Screenshots

### Method 1: iOS Simulator (Free)
```bash
# Run the app in simulator
npm run ios

# Take screenshots
Cmd + S (saves to Desktop)

# Resize if needed using Preview or online tools
```

### Method 2: Android Emulator (Free)
```bash
# Run the app in emulator
npm run android

# Take screenshots
Click camera icon in emulator toolbar

# Resize if needed
```

### Method 3: Physical Device (Best Quality)
1. Run app on your iPhone/iPad
2. Take screenshots (Power + Volume Up)
3. AirDrop to Mac
4. Resize if needed

### Method 4: Screenshot Tools (Paid)
- **Shotbot** - https://shotbot.io
- **App Store Screenshot Generator** - https://www.appstorescreenshot.com
- **Previewed** - https://previewed.app

## 🎨 Design Tips

### App Icon
- Keep it simple - it needs to be recognizable at 60x60px
- Use high contrast between background and logo
- Avoid text (except single letter)
- Test at different sizes
- Make sure it stands out on both light and dark backgrounds

### Splash Screen
- Keep it minimal - users see this briefly
- Match your brand colors
- Don't include too much detail
- Center your content
- Leave safe area around edges (10% margin)

### Screenshots
- Show actual app content (no mockups)
- Use real data (not lorem ipsum)
- Highlight key features
- Keep text minimal
- Show the app in action
- Use consistent device frames

## 📐 Quick Reference

### Color Palette
```
Primary: #57C8A1 (Mint Green)
Dark: #2C5F4F (Forest Green)
Light: #F8F8FF (Off White)
Text: #333333 (Dark Gray)
```

### Fonts
```
Primary: System Font (San Francisco on iOS, Roboto on Android)
Weight: 700-800 for headings, 400-600 for body
```

## ✅ Asset Checklist

Before submitting:
- [ ] App icon created (1024x1024px)
- [ ] Splash screen created (2048x2048px)
- [ ] App icon saved to `assets/images/app-icon.png`
- [ ] Splash screen saved to `assets/images/splash-icon.png`
- [ ] Icons tested at different sizes
- [ ] Icons look good on light and dark backgrounds
- [ ] Screenshots taken (optional but recommended)
- [ ] All assets are high quality (no pixelation)

## 🚀 After Creating Assets

1. Place files in correct locations:
   ```
   assets/images/app-icon.png
   assets/images/splash-icon.png
   ```

2. Test the app:
   ```bash
   npm run ios
   npm run android
   ```

3. Verify icons appear correctly:
   - Check home screen icon
   - Check splash screen on launch
   - Test on both light and dark mode

4. Build for production:
   ```bash
   eas build --platform ios --profile production
   eas build --platform android --profile production
   ```

## 🆘 Need Help?

### Free Design Resources
- **Figma Community** - Free templates and icons
- **Canva** - Easy drag-and-drop design
- **Unsplash** - Free stock photos (for screenshots)
- **Flaticon** - Free icons

### Hire a Designer (Optional)
- **Fiverr** - $5-50 for app icons
- **99designs** - Design contests
- **Upwork** - Hire professional designers
- **Dribbble** - Find designers

### DIY Tools
- **Figma** - https://figma.com (Free)
- **Canva** - https://canva.com (Free)
- **GIMP** - https://gimp.org (Free Photoshop alternative)
- **Inkscape** - https://inkscape.org (Free Illustrator alternative)

---

**Once you have these assets, you're ready to submit to the app stores! 🎉**
