
# Email Confirmation Setup - FAIRWAY

## Current Authentication Flow

Your Supabase project is configured with **email confirmation enabled**. This is a security best practice that requires users to verify their email address before they can log in.

## How It Works

### Sign Up Flow:
1. User enters their details on the signup screen
2. Supabase creates the account but marks it as "unconfirmed"
3. Supabase sends a confirmation email to the user's email address
4. User must click the verification link in the email
5. After verification, user can log in with their credentials

### Sign In Flow:
1. User enters email and password
2. If email is not verified, login fails with a helpful message
3. User can request a new confirmation email from the login screen
4. After verifying email, user can successfully log in

## What Was Fixed

### 1. **Enhanced Error Handling**
- Clear error messages when email is not verified
- Option to resend confirmation email from login screen
- Helpful alerts guiding users through the verification process

### 2. **Improved Signup Flow**
- Detects when email confirmation is required
- Shows clear instructions to check email
- Redirects to login screen after signup (waiting for email verification)

### 3. **Resend Confirmation Feature**
- Added "Didn't receive confirmation email?" button on login screen
- Users can request a new confirmation email if needed
- Rate limiting protection to prevent spam

### 4. **Profile Creation**
- Database trigger automatically creates profile when user signs up
- Profile is created even before email confirmation
- Uses `upsert` to handle both new and existing profiles

## Testing the Flow

### Test Account:
The logs show a test account was created:
- Email: `jaysari1117@gmail.com`
- Status: Email confirmed ✅
- User ID: `953a2b41-bfff-4398-bf56-d25046653297`

This account should now be able to log in successfully.

### For New Users:
1. Sign up with a valid email address
2. Check your email inbox (and spam folder)
3. Click the verification link in the email
4. Return to the app and log in

## Disabling Email Confirmation (Optional)

If you want to disable email confirmation for easier testing:

1. Go to Supabase Dashboard
2. Navigate to Authentication → Settings
3. Find "Enable email confirmations"
4. Toggle it OFF
5. Save changes

**Note:** This is NOT recommended for production as it reduces security.

## Common Issues & Solutions

### Issue: "Email not confirmed" error
**Solution:** Check your email inbox for the confirmation link. If you didn't receive it, use the "Resend Email" button on the login screen.

### Issue: Confirmation link expired
**Solution:** Request a new confirmation email from the login screen.

### Issue: Email goes to spam
**Solution:** Check your spam/junk folder. Add `noreply@mail.app.supabase.io` to your contacts.

### Issue: Rate limiting (429 error)
**Solution:** Wait 60 seconds before requesting another confirmation email.

## Email Template Customization

You can customize the confirmation email template in Supabase:

1. Go to Supabase Dashboard
2. Navigate to Authentication → Email Templates
3. Select "Confirm signup"
4. Customize the email content and styling
5. Save changes

## Production Checklist

Before launching to production:

- [ ] Test the complete signup → email → verification → login flow
- [ ] Customize email templates with your branding
- [ ] Set up a custom SMTP provider (optional, for better deliverability)
- [ ] Configure email rate limits appropriately
- [ ] Test email delivery to common providers (Gmail, Outlook, etc.)
- [ ] Ensure confirmation links work on all platforms (iOS, Android, Web)

## Support

If users continue to have issues with email confirmation:

1. Check Supabase Auth logs for specific error messages
2. Verify email delivery in Supabase Dashboard → Authentication → Users
3. Test with different email providers
4. Consider implementing magic link authentication as an alternative
