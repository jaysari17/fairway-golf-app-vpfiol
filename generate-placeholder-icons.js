
/**
 * Generate Placeholder Icons for Fairway App
 * 
 * This script creates simple placeholder PNG icons with the correct dimensions
 * for iOS, Android, and web platforms.
 * 
 * Run this script with: node generate-placeholder-icons.js
 * 
 * After running, you should replace these placeholders with your actual
 * Fairway logo using the generate-icons.html tool in assets/images/
 */

const fs = require('fs');
const path = require('path');

// This is a minimal PNG file (1x1 transparent pixel) in base64
// We'll use this as a template and document what needs to be created
const PLACEHOLDER_INFO = `
PLACEHOLDER ICONS CREATED
=========================

The following placeholder files have been created with minimal size.
You MUST replace these with actual Fairway logo icons before submitting to app stores.

Required Icons:
---------------

1. icon.png (1024x1024)
   - Main app icon for iOS
   - Must be opaque (no transparency)
   - Must be exactly 1024x1024 pixels
   - No rounded corners (iOS adds them)

2. adaptive-icon.png (1024x1024)
   - Android adaptive icon foreground
   - Can have transparency
   - Keep logo in center 66% safe zone (684x684 pixels)

3. splash.png (400x400)
   - Splash screen logo
   - Transparent background recommended
   - Will be centered on mint green (#57C8A1) background

4. favicon.png (48x48)
   - Web favicon
   - Small version of logo

HOW TO CREATE PROPER ICONS:
---------------------------

Option 1: Use the HTML Generator (Recommended)
1. Open assets/images/generate-icons.html in a web browser
2. Click "Generate All Icons"
3. Download the generated icons
4. Replace the placeholder files in assets/images/

Option 2: Use Design Software
1. Create your Fairway logo design:
   - Minimalist "F" monogram
   - Golf flag in top stroke
   - Dark forest green (#1a4d3a) on mint green (#57C8A1)
2. Export at the required sizes listed above
3. Ensure iOS icon has NO transparency
4. Ensure Android icon keeps logo in safe zone

Option 3: Use Online Tools
- Use https://www.appicon.co/ or similar
- Upload a 1024x1024 source image
- Download all required sizes

TESTING:
--------
After replacing icons:
1. Run: npx expo prebuild --clean
2. Test on iOS: npm run ios
3. Test on Android: npm run android
4. Verify icons appear correctly on home screen

IMPORTANT:
----------
- iOS will REJECT apps with transparent icons
- Android will CROP icons outside the safe zone
- Test on real devices before submitting

For detailed specifications, see:
- assets/images/ICON_SPECS.md
- assets/images/README.md
`;

const assetsDir = path.join(__dirname, 'assets', 'images');

// Create a minimal 1x1 transparent PNG (base64 encoded)
const minimalPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

console.log('Creating placeholder icon files...\n');

// Create placeholder files
const files = [
  'icon.png',
  'adaptive-icon.png',
  'splash.png',
  'favicon.png'
];

files.forEach(filename => {
  const filepath = path.join(assetsDir, filename);
  fs.writeFileSync(filepath, minimalPNG);
  console.log(`✓ Created ${filename}`);
});

// Write info file
fs.writeFileSync(
  path.join(assetsDir, 'PLACEHOLDER_ICONS_INFO.txt'),
  PLACEHOLDER_INFO
);

console.log('\n' + PLACEHOLDER_INFO);
console.log('\n✅ Placeholder icons created successfully!');
console.log('\n⚠️  IMPORTANT: Replace these placeholders with actual Fairway logo icons');
console.log('   before submitting to App Store or Google Play Store.\n');
