
# Quick Apple Authentication Steps

## 🚀 Fast Track to App Store Submission

### Step 1: Get Your Apple Team ID (2 minutes)
1. Go to https://developer.apple.com/account
2. Sign in with your Apple ID
3. Click **Membership** in sidebar
4. Copy your **Team ID** (looks like: ABCDE12345)

### Step 2: Update eas.json (1 minute)
Open `eas.json` and replace these values in the `submit.production.ios` section:

```json
"appleId": "your-email@example.com",  ← Your Apple Developer account email
"appleTeamId": "ABCDE12345",          ← Your Team ID from Step 1
```

Leave `ascAppId` empty for now - you'll get this after creating the app in App Store Connect.

### Step 3: Authenticate Xcode (2 minutes)
**Option A - Via Xcode:**
1. Open Xcode
2. Xcode → Settings → Accounts
3. Click **+** → Add Apple ID
4. Sign in with your Apple Developer account

**Option B - Via Terminal:**
```bash
# EAS will prompt you to authenticate during build
eas build --platform ios --profile production
```

### Step 4: Register Bundle Identifier (3 minutes)
1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Click **+** button
3. Select **App IDs** → Continue
4. Select **App** → Continue
5. Enter:
   - Description: **Fairway Golf Tracker**
   - Bundle ID: **com.fairway.golftracker**
6. Enable: **Associated Domains**
7. Click **Register**

### Step 5: Create App in App Store Connect (5 minutes)
1. Go to https://appstoreconnect.apple.com
2. Click **My Apps** → **+** → **New App**
3. Fill in:
   - Platform: **iOS**
   - Name: **Fairway**
   - Language: **English (US)**
   - Bundle ID: **com.fairway.golftracker**
   - SKU: **fairway-golf-tracker**
4. Click **Create**
5. Copy the App ID from the URL (the number after `/apps/`)
6. Update `ascAppId` in `eas.json` with this number

### Step 6: Build & Submit (10 minutes)
```bash
# Install EAS CLI if needed
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS
eas build --platform ios --profile production

# After build completes, submit to App Store
eas submit --platform ios --profile production
```

### Step 7: Complete App Store Listing (30 minutes)
In App Store Connect, add:
- Screenshots (6.7", 6.5", 5.5" displays)
- App description
- Keywords
- Privacy policy URL
- Support URL
- Pricing (Free or paid)

### Step 8: Submit for Review
1. Click **Add for Review**
2. Answer review questions
3. Click **Submit**

---

## ⚡ One-Command Build (After Setup)

Once you've completed steps 1-5 above, you can build and submit with:

```bash
eas build --platform ios --profile production && eas submit --platform ios --profile production
```

---

## 🚨 Troubleshooting

**"No valid signing identity"**
→ Run: `eas build --platform ios --profile production` (EAS auto-generates certificates)

**"Bundle ID already taken"**
→ Change in `app.json`: `"bundleIdentifier": "com.yourname.fairway"`

**"Missing Team ID"**
→ Update `eas.json` with your Team ID from developer.apple.com/account

**"Authentication failed"**
→ Sign in to Xcode: Xcode → Settings → Accounts → Add Apple ID

---

## 📋 Required Information Checklist

Before you start, have these ready:

- [ ] Apple Developer account (active, $99/year paid)
- [ ] Apple ID email
- [ ] Apple Team ID
- [ ] Unique bundle identifier (com.yourcompany.fairway)
- [ ] App icon (1024x1024 PNG)
- [ ] Screenshots for 3 device sizes
- [ ] Privacy policy URL
- [ ] Support email/URL
- [ ] App description and keywords

---

## 🎯 Total Time Estimate

- **First-time setup:** ~1 hour
- **Subsequent builds:** ~15 minutes
- **App Store review:** 24-48 hours

---

## 📞 Quick Links

- Apple Developer Portal: https://developer.apple.com/account
- App Store Connect: https://appstoreconnect.apple.com
- EAS Documentation: https://docs.expo.dev/build/introduction/
- Bundle ID Registration: https://developer.apple.com/account/resources/identifiers/list

---

**You're all set! Follow these steps and you'll have your app in the App Store soon. 🚀⛳**
