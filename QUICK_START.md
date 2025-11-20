
# FAIRWAY - Quick Start Guide

## 🚀 Running the App

### Prerequisites
- Node.js installed (v18 or higher)
- npm or yarn installed
- Expo Go app on your phone (optional)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Run on your device**:
   - **iOS**: Press `i` or run `npm run ios`
   - **Android**: Press `a` or run `npm run android`
   - **Web**: Press `w` or run `npm run web`
   - **Expo Go**: Scan the QR code with your phone

## 📱 Testing the Rating System

### Step 1: Log a Round
1. Open the app
2. Tap the "+" button on the home screen
3. Fill in course details:
   - Course name (e.g., "Pebble Beach")
   - Location (e.g., "Pebble Beach, CA")
   - Date played
   - Score (optional)
4. Tap "Log Round"

### Step 2: Trigger Rating Flow
The rating flow will automatically trigger:
- **Immediately** after logging a round (if no rating exists)
- **On next app session** (if you close and reopen the app)

Or you can manually trigger it by:
1. Logging a round
2. Waiting 1 second
3. The rating flow modal will appear

### Step 3: Complete Rating Flow

**Step 1: Play Again?**
- Tap "Definitely", "Maybe", or "No"
- This is the most important preference signal

**Step 2: Comparisons** (if you have other rated courses)
- You'll see 2 course cards side-by-side
- Tap the course you prefer
- Repeat 3 times (or fewer if you have fewer courses)

**Step 3: Drag-to-Rank**
- See your ranked list of courses
- Tap a placement slot to position the new course
- Tap "Confirm Placement"

**Step 4: Confirmation**
- See your final score (1-10)
- See where it ranks in your list
- Tap "Done"

### Step 4: View Your Ratings
1. Go to the Profile tab
2. See your stats:
   - Total rounds
   - Total courses
   - Average rating
3. Scroll to see all your rated courses

## 🧪 Testing Different Scenarios

### Test 1: First Course Rating
1. Log your first round
2. Complete rating flow
3. You'll only see Step 1 (Play Again) and Step 3 (Ranking)
4. No comparisons since you have no other courses

### Test 2: Multiple Course Ratings
1. Log 3-5 different rounds
2. Rate each one
3. Now you'll see all 4 steps including comparisons
4. Watch how the algorithm selects comparison courses

### Test 3: App Store Review Prompt
1. Log 5+ rounds
2. Complete 3+ ratings
3. After the 3rd rating, you should see the app store review prompt
4. (Only works on physical devices, not simulators)

### Test 4: Session Triggers
1. Log a round but don't rate it
2. Close the app completely
3. Wait 1+ hour (or change device time)
4. Reopen the app
5. Rating flow should trigger automatically

## 🐛 Troubleshooting

### "Rating flow doesn't appear"
- Make sure you've logged a round
- Check that the course doesn't already have a rating
- Try closing and reopening the app
- Check console logs for errors

### "App crashes on rating flow"
- Check that all rating components are imported correctly
- Verify AsyncStorage is working
- Check console for error messages

### "Scores seem wrong"
- This is expected! The algorithm is working
- Scores are based on:
  - Your "Play Again" response
  - Comparison wins/losses
  - Rank position
  - Neighbor ratings

### "No comparisons shown"
- This is normal if you have 0-1 rated courses
- You need at least 2 rated courses to see comparisons

### "App store review prompt doesn't show"
- Only works on physical devices (not simulators)
- Requires 3+ ratings and 5+ rounds
- Maximum 3 times per year
- Minimum 30 days between requests

## 📊 Understanding the Rating Algorithm

### Score Calculation
The final score (1-10) is calculated from:

1. **Play Again Response** (30% weight):
   - Definitely → 8.5 base score
   - Maybe → 6.0 base score
   - No → 3.5 base score

2. **Comparison Results** (20% weight):
   - Win rate mapped to 2-9 scale
   - More wins = higher score

3. **Rank Position** (30% weight):
   - Top of list → 9-10
   - Middle of list → 5-6
   - Bottom of list → 1-2

4. **Neighbor Interpolation** (20% weight):
   - Average of courses above and below
   - Ensures smooth ranking

### Example Calculation
```
Course: Pine Ridge
Play Again: Definitely (8.5)
Comparisons: 2 wins, 1 loss (7.3)
Rank Position: 3rd out of 10 (7.8)
Neighbors: Above=8.2, Below=7.4 (7.8)

Final Score = (8.5 * 0.3) + (7.3 * 0.2) + (7.8 * 0.3) + (7.8 * 0.2)
            = 2.55 + 1.46 + 2.34 + 1.56
            = 7.9
```

## 🎨 Customizing the App

### Change Brand Colors
Edit `styles/commonStyles.ts`:
```typescript
export const colors = {
  primary: '#57C8A1',  // Change this
  secondary: '#45A088', // And this
  // ...
};
```

### Modify Rating Steps
Edit components in `components/rating/`:
- `PlayAgainStep.tsx` - First step
- `ComparisonStep.tsx` - Comparison cards
- `DragRankStep.tsx` - Ranking interface
- `ConfirmationStep.tsx` - Final screen

### Adjust Rating Algorithm
Edit `utils/ratingAlgorithm.ts`:
```typescript
// Change weights
let finalScore = (
  baseScore * 0.3 +           // Play Again weight
  comparisonAdjustment * 0.2 + // Comparison weight
  positionScore * 0.3 +        // Position weight
  neighborScore * 0.2          // Neighbor weight
);
```

## 📱 Building for Production

### iOS
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build
eas build --platform ios --profile production

# Submit
eas submit --platform ios
```

### Android
```bash
# Build
eas build --platform android --profile production

# Submit
eas submit --platform android
```

## 📚 Documentation

- **Full Implementation**: See `IMPLEMENTATION_COMPLETE.md`
- **App Store Submission**: See `APP_STORE_SUBMISSION_CHECKLIST.md`
- **Asset Creation**: See `ASSET_CREATION_GUIDE.md`
- **Immediate Actions**: See `IMMEDIATE_ACTION_ITEMS.md`

## 🆘 Getting Help

- **Expo Docs**: https://docs.expo.dev
- **Expo Discord**: https://chat.expo.dev
- **Expo Forums**: https://forums.expo.dev
- **GitHub Issues**: Create an issue in your repo

## ✅ Quick Checklist

Before submitting to app stores:
- [ ] App runs without crashes
- [ ] Rating flow works end-to-end
- [ ] Data persists after app restart
- [ ] Dark mode works
- [ ] App icon created
- [ ] Splash screen created
- [ ] Screenshots taken
- [ ] Privacy policy hosted
- [ ] EAS build successful
- [ ] Tested on physical device

## 🎉 You're Ready!

The app is fully functional and ready for testing. 

Try logging a few rounds and completing the rating flow to see how it all works together.

Good luck! 🏌️⛳
