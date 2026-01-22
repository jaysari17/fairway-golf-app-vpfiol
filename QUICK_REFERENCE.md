
# 🎯 Fairway - Quick Reference Card

## 🚀 Launch Commands

```bash
# Verify everything is ready
npm run verify-launch

# Generate icons
open assets/images/generate-icons.html

# Set up EAS
eas init

# Build for production
eas build --platform all --profile production

# Submit to stores
eas submit --platform all --profile production
```

## 📱 App Information

| Item | Value |
|------|-------|
| **Name** | Fairway |
| **Tagline** | Track Your Golf Journey |
| **Version** | 1.0.0 |
| **iOS Bundle ID** | com.fairway.golftracker |
| **Android Package** | com.fairway.golftracker |
| **Category** | Sports / Social Networking |

## 🌍 Golf Course API - ACTIVE ✅

| Item | Value |
|------|-------|
| **Provider** | golfcourseapi.com |
| **API Key** | U2RVDJNGLFSNE5B2MAOAZGX2SM |
| **Status** | Configured and active |
| **Coverage** | Worldwide golf courses |
| **File** | `utils/golfCourseApi.ts` |

Users can now search for any golf course worldwide when adding rounds!

## 🎨 Brand Colors

```
Primary:   #57C8A1  (Deep mint green)
Accent:    #1a4d3a  (Dark forest green)
Light BG:  #FFFFFF
Dark BG:   #000000
```

## 📋 Required Icons

| Icon | Size | Location |
|------|------|----------|
| App Icon (iOS) | 1024x1024 | `assets/images/app-icon.png` |
| Adaptive Icon (Android) | 1024x1024 | `assets/images/adaptive-icon.png` |
| Splash Icon | 400x400 | `assets/images/splash-icon.png` |

## 📸 Screenshot Sizes

### iOS
- iPhone 6.7": 1290 x 2796
- iPhone 6.5": 1242 x 2688
- iPad Pro 12.9": 2048 x 2732

### Android
- Phone: 1080 x 1920 (recommended)
- Tablet: 1920 x 1080 (optional)

## 🔑 Key Features (for App Store)

1. **Worldwide Course Search** - Search any golf course globally (NEW ✅)
2. **Course Tracking** - Log every round
3. **Smart Ratings** - Comparison-based rating system
4. **Social Network** - Connect with friends
5. **Personal Profile** - Golf taste profile
6. **Discovery** - Find new courses
7. **Progress** - Badges and achievements

## 📝 App Store Description (Short)

"Track your golf journey. Log rounds, rate courses, and build your ultimate golf profile. Like Beli for golf courses."

## 🔍 Keywords

golf, golf courses, golf tracker, course ratings, golf social, golf friends, golf stats, golf profile, course reviews, golf app

## 🔐 Permissions

| Permission | Reason |
|------------|--------|
| Camera | Take photos of courses |
| Photo Library | Add course photos |
| Location | Discover nearby courses |
| Contacts | Find friends on the app |

## 📞 URLs

| Type | URL |
|------|-----|
| Privacy Policy | https://yourdomain.com/privacy |
| Terms of Service | https://yourdomain.com/terms |
| Support | https://yourdomain.com/support |
| Website | https://yourdomain.com |

## ⏱️ Timeline

| Task | Time |
|------|------|
| Generate icons | 5 min |
| EAS setup | 10 min |
| App Store setup | 1 hour |
| Screenshots | 1-2 hours |
| Build & test | 30 min |
| Submit | 15 min |
| **Total** | **3-4 hours** |
| Review (iOS) | 1-3 days |
| Review (Android) | 1-7 days |

## 🎯 Pre-Launch Checklist

- [ ] Icons generated
- [ ] EAS project initialized
- [ ] App Store Connect configured
- [ ] Google Play Console configured
- [ ] Screenshots prepared
- [ ] Privacy policy live
- [ ] Terms of service live
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Builds successful
- [ ] Ready to submit

## 📚 Documentation

- **Launch Guide**: [LAUNCH_READY.md](LAUNCH_READY.md)
- **Detailed Steps**: [APP_STORE_LAUNCH_GUIDE.md](APP_STORE_LAUNCH_GUIDE.md)
- **Full Checklist**: [FINAL_PRE_LAUNCH_CHECKLIST.md](FINAL_PRE_LAUNCH_CHECKLIST.md)
- **Development**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 🆘 Quick Help

**Icons not showing?**
```bash
npx expo prebuild --clean
```

**Build failing?**
```bash
npm install
eas build:configure
```

**Need EAS project ID?**
```bash
eas init
# Then update app.json with the project ID
```

## 🎉 You're Ready!

Run `npm run verify-launch` to check everything, then follow [LAUNCH_READY.md](LAUNCH_READY.md) for step-by-step launch instructions.

Good luck! 🚀⛳
