
# ✅ Fairway - Final Pre-Launch Checklist

## 🎨 Assets & Branding

- [ ] **Generate App Icons**
  - Open `assets/images/generate-icons.html` in browser
  - Generate all required sizes
  - Download and save to `assets/images/`
  
- [ ] **Verify Icon Files Exist**
  - `assets/images/app-icon.png` (1024x1024)
  - `assets/images/adaptive-icon.png` (1024x1024)
  - `assets/images/splash-icon.png` (400x400)

- [ ] **Test Icons**
  - Run `npx expo prebuild --clean`
  - Test on iOS simulator
  - Test on Android emulator
  - Verify splash screen appears correctly

## ⚙️ Configuration

- [ ] **Update app.json**
  - Set correct EAS project ID in `extra.eas.projectId`
  - Verify bundle identifiers are unique
  - Confirm all permissions are necessary and described

- [ ] **Update eas.json**
  - iOS: Add your Apple ID, App Store Connect ID, Team ID
  - Android: Add path to Google Play service account JSON
  - Verify build profiles are correct

- [ ] **Environment Variables**
  - Create `.env` file with production API URL
  - Add Golf Course API key
  - Set up EAS secrets: `eas secret:create`

- [ ] **Deep Linking**
  - Update domain in `app.json` iOS associatedDomains
  - Update domain in `app.json` Android intentFilters
  - Verify scheme is set to "fairway"

## 🧪 Testing

- [ ] **Functional Testing**
  - Course logging works
  - Rating flow completes successfully
  - Contact sync requests permission and works
  - Social features (friends, feed) work
  - Profile displays correctly
  - Navigation works on all screens

- [ ] **Platform Testing**
  - Test on iOS (simulator and real device)
  - Test on Android (emulator and real device)
  - Test on different screen sizes

- [ ] **Mode Testing**
  - Test in light mode
  - Test in dark mode
  - Verify colors and contrast

- [ ] **Permission Testing**
  - Camera permission prompt works
  - Photo library permission works
  - Location permission works
  - Contacts permission works
  - All permission descriptions are clear

- [ ] **Error Handling**
  - Test with no internet connection
  - Test with API errors
  - Verify error messages are user-friendly
  - Check that app doesn't crash

## 📱 App Store Preparation

### iOS App Store

- [ ] **App Store Connect Setup**
  - Create app record in App Store Connect
  - Set app name: "Fairway"
  - Set bundle ID: `com.fairway.golftracker`
  - Set SKU: `fairway-golf-tracker`

- [ ] **App Information**
  - Add app description (see APP_STORE_LAUNCH_GUIDE.md)
  - Add keywords
  - Set category: Sports
  - Set secondary category: Social Networking
  - Add support URL
  - Add privacy policy URL

- [ ] **Screenshots**
  - iPhone 6.7" (1290 x 2796) - at least 3 screenshots
  - iPhone 6.5" (1242 x 2688) - at least 3 screenshots
  - iPad Pro 12.9" (2048 x 2732) - at least 2 screenshots
  - Show key features: discover, rating, profile, social

- [ ] **App Review Information**
  - Provide demo account if needed
  - Add notes about permissions
  - Add contact information

### Google Play Store

- [ ] **Play Console Setup**
  - Create app in Google Play Console
  - Set app name: "Fairway"
  - Set package name: `com.fairway.golftracker`

- [ ] **Store Listing**
  - Add short description (80 chars)
  - Add full description (see APP_STORE_LAUNCH_GUIDE.md)
  - Set category: Sports
  - Add tags: Golf, Social, Tracking

- [ ] **Graphics**
  - App icon: 512 x 512 PNG
  - Feature graphic: 1024 x 500
  - Screenshots: at least 2 (1080 x 1920 recommended)

- [ ] **Content Rating**
  - Complete questionnaire
  - Confirm rating is appropriate

## 🔐 Legal & Privacy

- [ ] **Privacy Policy**
  - Hosted at accessible URL
  - Covers all data collection
  - Explains contact sync
  - Explains location usage
  - GDPR/CCPA compliant if applicable

- [ ] **Terms of Service**
  - Hosted at accessible URL
  - Covers user responsibilities
  - Covers content policies

- [ ] **App Store Compliance**
  - No misleading information
  - Accurate screenshots
  - Honest feature descriptions
  - Appropriate age rating

## 🚀 Build & Submit

- [ ] **EAS Setup**
  - Run `eas init` to create project
  - Update project ID in `app.json`
  - Configure secrets with `eas secret:create`

- [ ] **iOS Build**
  ```bash
  eas build --platform ios --profile production
  ```
  - Build completes successfully
  - No errors or warnings

- [ ] **Android Build**
  ```bash
  eas build --platform android --profile production
  ```
  - Build completes successfully
  - No errors or warnings

- [ ] **TestFlight (iOS)**
  ```bash
  eas submit --platform ios --profile production
  ```
  - Submit to TestFlight
  - Invite internal testers
  - Collect feedback
  - Fix any issues

- [ ] **Internal Testing (Android)**
  ```bash
  eas submit --platform android --profile production
  ```
  - Submit to internal testing track
  - Invite testers
  - Collect feedback
  - Fix any issues

- [ ] **Final Submission**
  - Submit iOS app for review
  - Submit Android app for review
  - Monitor submission status
  - Respond to any review feedback

## 📊 Post-Launch

- [ ] **Monitoring**
  - Set up crash reporting
  - Monitor user reviews
  - Track analytics
  - Watch for bugs

- [ ] **Support**
  - Set up support email
  - Monitor support requests
  - Respond to user feedback
  - Update FAQ if needed

- [ ] **Marketing**
  - Prepare launch announcement
  - Share on social media
  - Reach out to golf communities
  - Consider press release

## 🎯 Final Checks

- [ ] All icons are generated and in place
- [ ] All configuration files are updated
- [ ] All features have been tested
- [ ] All permissions work correctly
- [ ] App Store listings are complete
- [ ] Legal documents are accessible
- [ ] Builds are successful
- [ ] TestFlight/Internal testing is complete
- [ ] Ready to submit for review

---

## 📞 Need Help?

- **EAS Documentation**: https://docs.expo.dev/eas/
- **App Store Connect**: https://appstoreconnect.apple.com
- **Google Play Console**: https://play.google.com/console
- **Expo Forums**: https://forums.expo.dev

---

**Last Updated**: Ready for launch! 🚀⛳

Once all items are checked, you're ready to submit to the App Store and Google Play Store!
