
# FAIRWAY - Asset Creation Guide

## 🎨 Brand Colors

- **Primary**: #57C8A1 (Deep Mint Green)
- **Secondary**: #228B22 (Dark Forest Green)
- **Background**: #F8F8FF (Off-white)
- **Text**: #333333 (Dark Gray)

## 📱 Required Assets

### 1. App Icon (1024x1024px)

**Design Specifications**:
- Size: 1024 x 1024 pixels
- Format: PNG (no transparency)
- Background: #57C8A1 (mint green)
- Logo: Dark forest green (#228B22) "F" with golf flag integrated into the top stroke
- Style: Minimalist, modern, clean
- No rounded corners (iOS adds them)
- No text (icon only)

**Design Tips**:
- Keep it simple and recognizable at small sizes
- The "F" should be bold and clear
- Golf flag should be subtle but visible
- Test at 60x60px to ensure it's readable

**Tools**:
- Figma (free): https://figma.com
- Canva (free): https://canva.com
- Adobe Illustrator
- Sketch

**File Location**: `./assets/images/app-icon.png`

### 2. Splash Screen (1284x2778px)

**Design Specifications**:
- Size: 1284 x 2778 pixels (iPhone 14 Pro Max)
- Format: PNG
- Background: #57C8A1 (solid mint green)
- Logo: Centered FAIRWAY logo or "F" symbol
- Keep it simple - it's only shown briefly

**Design Tips**:
- Center the logo vertically and horizontally
- Logo should be about 200-300px wide
- Solid background color (no gradients for consistency)
- Will be resized for different devices

**File Location**: `./assets/images/splash-icon.png`

### 3. App Store Screenshots

#### iOS Screenshots Sizes:
- **iPhone 6.7"**: 1290 x 2796 pixels (iPhone 14/15 Pro Max)
- **iPhone 6.5"**: 1242 x 2688 pixels (iPhone 11 Pro Max)
- **iPhone 5.5"**: 1242 x 2208 pixels (iPhone 8 Plus)

#### Android Screenshots Sizes:
- **Phone**: 1080 x 1920 pixels minimum

#### Recommended Screenshots (5-10):

1. **Home Screen**
   - Show recent rounds
   - Display stats (rounds played, courses, avg rating)
   - Clean, organized layout

2. **Rating Flow - Play Again Step**
   - "Would you play [Course Name] again?"
   - Three colorful buttons: Definitely, Maybe, No
   - Shows the unique rating system

3. **Comparison Step**
   - Two course cards side-by-side
   - "Which course do you like more?"
   - Shows the Beli-style comparison

4. **Drag-to-Rank Interface**
   - List of ranked courses
   - Placement slots between courses
   - Shows the interactive ranking

5. **Confirmation Screen**
   - Final score display
   - Course ranking position
   - Success state with stats

6. **Profile Screen**
   - User stats and badges
   - Total rounds and courses
   - Golf journey overview

7. **Course List**
   - Beautiful course cards
   - Ratings and locations
   - Clean, scrollable list

#### Screenshot Tips:
- Use real-looking data (not "Test Course")
- Show the app in action
- Include diverse course names and locations
- Use both light and dark mode screenshots
- Add text overlays explaining features (optional)
- Keep UI clean and uncluttered

#### Tools for Screenshots:
- **iOS**: Use Xcode Simulator + Screenshot tool
- **Android**: Use Android Studio Emulator
- **Design**: Figma, Sketch, or Photoshop for adding text overlays
- **Mockups**: Use device mockup generators like:
  - https://mockuphone.com
  - https://smartmockups.com
  - https://previewed.app

### 4. Feature Graphic (Android Only)

**Design Specifications**:
- Size: 1024 x 500 pixels
- Format: PNG or JPEG
- Shows app name and key features
- Used in Google Play Store listing

**Design Tips**:
- Include FAIRWAY branding
- Show 2-3 key features with icons
- Use brand colors
- Keep text readable

## 🛠️ Creating Assets Without Design Skills

### Option 1: Use Canva (Easiest)
1. Go to https://canva.com
2. Create custom size (1024x1024 for icon)
3. Use mint green background (#57C8A1)
4. Add text "F" in dark green
5. Add golf flag emoji or icon
6. Download as PNG

### Option 2: Use Figma (Free, Professional)
1. Go to https://figma.com
2. Create new file
3. Create frame (1024x1024)
4. Add rectangle with mint green fill
5. Add text or shapes for logo
6. Export as PNG

### Option 3: Hire a Designer
- **Fiverr**: $5-50 for app icon
- **Upwork**: $50-200 for full asset package
- **99designs**: Contest-based, $299+

### Option 4: Use AI Tools
- **Midjourney**: Generate logo concepts
- **DALL-E**: Create icon designs
- **Looka**: AI logo generator

## 📸 Taking Screenshots

### Method 1: Expo Go (Quick)
1. Run app with `npm run ios` or `npm run android`
2. Navigate to each screen
3. Take screenshots using device/simulator
4. Transfer to computer

### Method 2: Xcode Simulator (iOS)
1. Run `npm run ios`
2. Choose device (iPhone 14 Pro Max)
3. Navigate to screen
4. Press `Cmd + S` to save screenshot
5. Screenshots saved to Desktop

### Method 3: Android Studio Emulator
1. Run `npm run android`
2. Choose device (Pixel 6)
3. Navigate to screen
4. Click camera icon in emulator toolbar
5. Screenshots saved to emulator folder

### Method 4: Physical Device
1. Install app on your phone
2. Navigate to each screen
3. Take screenshots:
   - **iOS**: Press Volume Up + Side Button
   - **Android**: Press Volume Down + Power Button
4. Transfer to computer via AirDrop/USB

## ✅ Asset Checklist

Before submitting:
- [ ] App icon created (1024x1024px)
- [ ] Splash screen created (1284x2778px)
- [ ] iOS screenshots taken (5-10 images)
- [ ] Android screenshots taken (5-10 images)
- [ ] Feature graphic created (Android, 1024x500px)
- [ ] All assets are high quality
- [ ] Assets follow brand guidelines
- [ ] Assets tested on different devices
- [ ] Files saved in correct locations
- [ ] Files named correctly

## 📁 File Structure

```
assets/
  images/
    app-icon.png          (1024x1024)
    splash-icon.png       (1284x2778)
    screenshots/
      ios/
        iphone-6.7/
          01-home.png
          02-rating.png
          03-comparison.png
          04-ranking.png
          05-confirmation.png
        iphone-6.5/
          [same screenshots]
      android/
        phone/
          01-home.png
          02-rating.png
          [etc...]
      feature-graphic.png (1024x500, Android only)
```

## 🎨 Design Resources

### Free Icon Resources:
- **SF Symbols** (iOS): https://developer.apple.com/sf-symbols/
- **Material Icons** (Android): https://fonts.google.com/icons
- **Flaticon**: https://flaticon.com
- **Icons8**: https://icons8.com

### Free Fonts:
- **Google Fonts**: https://fonts.google.com
- Recommended: Inter, Poppins, Montserrat

### Color Tools:
- **Coolors**: https://coolors.co
- **Adobe Color**: https://color.adobe.com

### Mockup Tools:
- **Mockuphone**: https://mockuphone.com
- **Previewed**: https://previewed.app
- **Smartmockups**: https://smartmockups.com

## 💡 Pro Tips

1. **Keep it Simple**: The best app icons are simple and recognizable
2. **Test at Small Sizes**: Your icon will be displayed at 60x60px on devices
3. **Use Consistent Branding**: All assets should use the same colors and style
4. **Show Real Features**: Screenshots should show actual app functionality
5. **Add Context**: Consider adding text overlays to screenshots explaining features
6. **Use High Quality**: All images should be crisp and clear
7. **Follow Guidelines**: Read Apple and Google's asset guidelines

## 📚 Official Guidelines

- **Apple Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/
- **Google Material Design**: https://material.io/design
- **App Store Screenshot Specs**: https://help.apple.com/app-store-connect/#/devd274dd925
- **Google Play Asset Guidelines**: https://support.google.com/googleplay/android-developer/answer/9866151

## 🆘 Need Help?

If you're stuck:
1. Check the official guidelines above
2. Look at similar apps for inspiration
3. Use the templates provided by Canva/Figma
4. Consider hiring a designer on Fiverr ($5-50)
5. Ask in Expo Discord or forums

Good luck creating your assets! 🎨🏌️
