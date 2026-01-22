
# Fix "Apple login missing username" Error

## 🚨 Problem
You're getting this error during EAS build:
```
CommandError: API failed: {"message":"Apple login missing username","data":{"code":"BAD_REQUEST","apiCode":"APPLE_AUTH_NOT_STARTED","httpStatus":400}}
```

## ✅ Solution: Set Up App Store Connect API Key

This is the **recommended and most reliable** way to authenticate EAS with Apple.

### Step 1: Create App Store Connect API Key

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Sign in with your Apple ID: **sarijason@icloud.com**
3. Click **Users and Access** in the top navigation
4. Click the **Integrations** tab
5. Under **App Store Connect API**, click the **+** button (or "Generate API Key")
6. Fill in the form:
   - **Name:** EAS Build Key (or any name you prefer)
   - **Access:** Select **Admin** (required for EAS to manage certificates)
7. Click **Generate**
8. **IMPORTANT:** Download the API Key file immediately (you can only download it once!)
   - The file will be named something like: `AuthKey_ABCD123456.p8`
   - Save it securely - you'll need it in the next step

### Step 2: Note Your Key Information

After creating the key, you'll see:
- **Issuer ID:** A UUID like `12345678-1234-1234-1234-123456789012`
- **Key ID:** A 10-character string like `ABCD123456`

**Write these down - you'll need them!**

### Step 3: Configure EAS with Your API Key

Run this command in your project directory:

```bash
eas credentials
```

Then:
1. Select **iOS**
2. Select **Production**
3. Select **App Store Connect API Key**
4. Select **Set up a new App Store Connect API Key**
5. When prompted, provide:
   - **Issuer ID:** (from Step 2)
   - **Key ID:** (from Step 2)
   - **Path to .p8 file:** (path to the AuthKey_ABCD123456.p8 file you downloaded)

EAS will securely store these credentials and use them for all future builds.

### Step 4: Update eas.json (Optional but Recommended)

You can remove the `appleId` field from `eas.json` since you're now using API Key authentication:

```json
"submit": {
  "production": {
    "ios": {
      "ascAppId": "",
      "appleTeamId": "JS45B47FNT"
    }
  }
}
```

### Step 5: Rebuild

Now try building again:

```bash
eas build --platform ios --profile production
```

This should work without the "Apple login missing username" error!

---

## 🔄 Alternative: Use Username/Password (Less Secure)

If you prefer to use username/password authentication instead:

```bash
eas credentials
```

Then:
1. Select **iOS**
2. Select **Production**
3. Select **App Store Connect: Manage your API Key**
4. Select **Set up App Store Connect authentication**
5. Enter your Apple ID: **sarijason@icloud.com**
6. Enter your password (or app-specific password if you have 2FA enabled)

**Note:** If you have two-factor authentication enabled (which you should!), you'll need to create an **app-specific password**:

1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in
3. Go to **Security** → **App-Specific Passwords**
4. Click **Generate Password**
5. Name it "EAS Build"
6. Copy the generated password and use it when EAS asks for your password

---

## 🎯 Recommended Approach

**Use the App Store Connect API Key method** (Steps 1-5 above). It's:
- ✅ More secure
- ✅ Doesn't require your Apple ID password
- ✅ Works with 2FA without app-specific passwords
- ✅ Recommended by both Apple and Expo
- ✅ Won't expire like passwords might

---

## 📞 Still Having Issues?

If you continue to get errors:

1. **Check your Team ID is correct:**
   - Go to [developer.apple.com/account](https://developer.apple.com/account)
   - Click **Membership**
   - Verify your Team ID matches `JS45B47FNT` in eas.json

2. **Verify your bundle identifier is registered:**
   - Go to [developer.apple.com/account/resources/identifiers](https://developer.apple.com/account/resources/identifiers)
   - Make sure `com.fairway.golftracker` is registered

3. **Clear credentials and start fresh:**
   ```bash
   eas credentials --platform ios
   # Select "Remove all credentials"
   # Then set up API Key again
   ```

---

## ✅ Success!

Once you've set up the API Key, your builds should work smoothly without authentication errors. The API Key will be used automatically for all future builds and submissions.
