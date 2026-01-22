
# 📦 Supabase Storage Setup for Profile Pictures

## Overview

To enable profile picture uploads, you need to create a storage bucket in Supabase.

## Quick Setup (5 minutes)

### Step 1: Create Avatars Bucket

1. Go to your Supabase Dashboard:
   https://app.supabase.com/project/hwpiblxpxghuzpkaenwg/storage/buckets

2. Click **"New bucket"**

3. Configure the bucket:
   - **Name:** `avatars`
   - **Public bucket:** ✅ Yes (check this box)
   - **File size limit:** 5 MB
   - **Allowed MIME types:** `image/jpeg, image/png, image/webp`

4. Click **"Create bucket"**

### Step 2: Set Up Storage Policies

The bucket needs policies to allow:
- Authenticated users to upload their own avatars
- Everyone to view avatars (public read)

#### Policy 1: Allow Authenticated Uploads
```sql
-- Go to Storage → Policies → New Policy

-- Name: "Users can upload their own avatar"
-- Allowed operation: INSERT
-- Policy definition:
(bucket_id = 'avatars'::text) AND (auth.uid()::text = (storage.foldername(name))[1])
```

#### Policy 2: Allow Public Read
```sql
-- Name: "Avatars are publicly accessible"
-- Allowed operation: SELECT
-- Policy definition:
bucket_id = 'avatars'::text
```

#### Policy 3: Allow Users to Update Their Avatar
```sql
-- Name: "Users can update their own avatar"
-- Allowed operation: UPDATE
-- Policy definition:
(bucket_id = 'avatars'::text) AND (auth.uid()::text = (storage.foldername(name))[1])
```

#### Policy 4: Allow Users to Delete Their Avatar
```sql
-- Name: "Users can delete their own avatar"
-- Allowed operation: DELETE
-- Policy definition:
(bucket_id = 'avatars'::text) AND (auth.uid()::text = (storage.foldername(name))[1])
```

### Step 3: Test Upload

Run the app and try uploading a profile picture:

```bash
npm run ios
```

1. Sign in or create an account
2. Go to Profile tab
3. Tap on the avatar/profile picture
4. Select a photo from your library
5. The photo should upload to Supabase Storage

### Step 4: Verify Upload

1. Go to Supabase Dashboard → Storage → avatars
2. You should see your uploaded image
3. Click on it to view the public URL

## 🔧 Alternative: SQL Setup

If you prefer SQL, run this in the Supabase SQL Editor:

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Policy: Allow authenticated uploads
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow public read
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Policy: Allow users to update their avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow users to delete their avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## 📁 File Structure

Avatars are stored with this structure:
```
avatars/
  └── {user_id}/
      └── {timestamp}.jpg
```

Example:
```
avatars/
  └── 123e4567-e89b-12d3-a456-426614174000/
      └── 1704067200000.jpg
```

## 🔒 Security

The storage policies ensure:
- ✅ Users can only upload to their own folder
- ✅ Users can only update/delete their own avatars
- ✅ Everyone can view avatars (public read)
- ✅ File size limited to 5 MB
- ✅ Only image files allowed

## 🐛 Troubleshooting

### Upload Fails
1. Check bucket exists and is public
2. Verify storage policies are set up
3. Check user is authenticated
4. View console logs for errors

### Image Not Displaying
1. Verify public URL is correct
2. Check bucket is set to public
3. Verify SELECT policy allows public read

### Permission Denied
1. Check user is authenticated
2. Verify INSERT policy allows uploads
3. Check file path matches user ID

## ✅ Verification Checklist

- [ ] Bucket `avatars` created
- [ ] Bucket set to public
- [ ] INSERT policy created
- [ ] SELECT policy created
- [ ] UPDATE policy created
- [ ] DELETE policy created
- [ ] Test upload works
- [ ] Test image displays in app

## 🎯 Next Steps

Once storage is set up:
1. Users can upload profile pictures
2. Pictures are stored securely in Supabase
3. Public URLs are generated automatically
4. Images display in the app and social feed

## 📞 Support

If you have issues:
- **Supabase Storage Docs:** https://supabase.com/docs/guides/storage
- **Dashboard:** https://app.supabase.com/project/hwpiblxpxghuzpkaenwg/storage
- **Policies Guide:** https://supabase.com/docs/guides/storage/security/access-control

## 🎉 Done!

Your storage is now configured for profile pictures! Users can upload avatars and they'll be stored securely in Supabase. 📸⛳
