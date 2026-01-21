
# App Store Submission Checklist

## ✅ Pre-Submission Checklist

### Apple Developer Account
- [ ] Apple Developer Program membership active ($99/year)
- [ ] Apple ID verified and working
- [ ] Team ID obtained from developer.apple.com/account
- [ ] Xcode authenticated with Apple ID

### App Configuration
- [ ] Bundle identifier registered in Apple Developer Portal
- [ ] Bundle identifier is unique (not already taken)
- [ ] `app.json` has correct bundle identifier
- [ ] `eas.json` updated with Apple ID, Team ID, and App Store Connect App ID
- [ ] App icon is 1024x1024 PNG with no transparency
- [ ] All required permissions have usage descriptions in Info.plist

### App Store Connect
- [ ] App created in App Store Connect
- [ ] App Store Connect App ID (ascAppId) added to eas.json
- [ ] SKU matches between eas.json and App Store Connect

### App Content
- [ ] App name: **Fairway**
- [ ] Subtitle: **Track Your Golf Journey**
- [ ] Category: **Sports**
- [ ] Privacy policy URL added
- [ ] Support URL or email provided
- [ ] App description written (4000 characters max)
- [ ] Keywords added (100 characters max)
- [ ] Screenshots prepared:
  - [ ] 6.7" Display (1290 x 2796) - iPhone 15 Pro Max
  - [ ] 6.5" Display (1242 x 2688) - iPhone 11 Pro Max
  - [ ] 5.5" Display (1242 x 2208) - iPhone 8 Plus
- [ ] App preview video (optional but recommended)

### Privacy & Compliance
- [ ] Privacy policy created and hosted
- [ ] Data collection practices declared
- [ ] Export compliance: ITSAppUsesNonExemptEncryption set to false
- [ ] Age rating completed
- [ ] Content rights confirmed

### Testing
- [ ] App tested on real iOS device (not just simulator)
- [ ] All core features working:
  - [ ] Course logging
  - [ ] Rating flow
  - [ ] Profile creation
  - [ ] Social features
  - [ ] Contact sync
  - [ ] Course search
- [ ] No crashes or critical bugs
- [ ] App loads within 3 seconds
- [ ] All screens display correctly on different device sizes
- [ ] Dark mode and light mode both work
- [ ] Permissions requested with clear explanations

### Build & Submit
- [ ] EAS CLI installed: `npm install -g eas-cli`
- [ ] Logged in to EAS: `eas login`
- [ ] Production build created: `eas build --platform ios --profile production`
- [ ] Build completed successfully
- [ ] IPA file downloaded (optional, for manual submission)
- [ ] App submitted: `eas submit --platform ios --profile production`

### App Store Listing Complete
- [ ] App Information filled out
- [ ] Pricing and Availability set
- [ ] App Privacy details completed
- [ ] Screenshots uploaded for all required sizes
- [ ] App description and keywords added
- [ ] Support and marketing URLs added
- [ ] Version information completed
- [ ] Build selected for submission
- [ ] App Review Information completed
- [ ] Rating selected

### Final Review
- [ ] All required fields in App Store Connect are green (no red warnings)
- [ ] Test account provided (if app requires login)
- [ ] Demo video or instructions provided (if app has complex features)
- [ ] App complies with App Store Review Guidelines
- [ ] No placeholder content or "Lorem ipsum" text
- [ ] All links work (privacy policy, support, etc.)
- [ ] App doesn't crash on launch

### Submit for Review
- [ ] Clicked "Add for Review"
- [ ] Answered all App Review questions
- [ ] Confirmed export compliance
- [ ] Clicked "Submit for Review"
- [ ] Received confirmation email from Apple

---

## 📱 Required Screenshots

Take screenshots of these screens:

1. **Home/Discover Screen** - Show course discovery and search
2. **Course Logging** - Show the course selection and round logging
3. **Rating Flow** - Show the unique rating system
4. **Profile Screen** - Show stats, badges, and user profile
5. **Social Feed** - Show friend activity and social features

**Tips:**
- Use real data, not placeholder content
- Show the app in use, not empty states
- Highlight unique features
- Use consistent device frame (optional)
- Add text overlays explaining features (optional)

---

## 🚨 Common Rejection Reasons (Avoid These!)

- ❌ App crashes on launch
- ❌ Missing privacy policy
- ❌ Permissions not explained clearly
- ❌ Placeholder content or incomplete features
- ❌ Broken links (privacy policy, support)
- ❌ App doesn't match description
- ❌ Missing required screenshots
- ❌ App icon has transparency or doesn't meet guidelines
- ❌ Requires login but no test account provided
- ❌ Contains bugs or broken features

---

## ⏱️ Timeline

- **Build time:** 10-20 minutes
- **Submission time:** 5 minutes
- **App Review:** 24-48 hours (can take up to 7 days)
- **If rejected:** Fix issues and resubmit (usually reviewed faster)

---

## 🎉 After Approval

Once approved:
- [ ] App appears in App Store within 24 hours
- [ ] Share App Store link with friends and testers
- [ ] Monitor reviews and ratings
- [ ] Respond to user feedback
- [ ] Plan updates and new features

---

## 📞 Support Resources

- **EAS Build Issues:** https://docs.expo.dev/build/introduction/
- **App Store Connect Help:** https://developer.apple.com/support/app-store-connect/
- **Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Expo Forums:** https://forums.expo.dev/

---

**Good luck with your submission! 🚀⛳**
