
/**
 * Fairway Launch Readiness Verification Script
 * 
 * This script checks if all necessary files and configurations
 * are in place for App Store submission.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Fairway Launch Readiness...\n');

let allChecks = true;

// Check 1: Required files exist
console.log('📁 Checking required files...');
const requiredFiles = [
  'app.json',
  'eas.json',
  'package.json',
  'privacy-policy.html',
  'terms-of-service.html',
  'assets/images/generate-icons.html',
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allChecks = false;
});

// Check 2: Icon files
console.log('\n🎨 Checking app icons...');
const iconFiles = [
  'assets/images/app-icon.png',
  'assets/images/adaptive-icon.png',
  'assets/images/splash-icon.png',
];

iconFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✅' : '⚠️'} ${file} ${exists ? '' : '(generate using HTML tool)'}`);
  if (!exists) {
    console.log('     → Open assets/images/generate-icons.html to create icons');
  }
});

// Check 3: app.json configuration
console.log('\n⚙️ Checking app.json configuration...');
try {
  const appJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'app.json'), 'utf8'));
  
  const checks = [
    { key: 'expo.name', value: appJson.expo?.name, expected: 'Fairway' },
    { key: 'expo.slug', value: appJson.expo?.slug, expected: 'fairway' },
    { key: 'expo.version', value: appJson.expo?.version, expected: '1.0.0' },
    { key: 'expo.ios.bundleIdentifier', value: appJson.expo?.ios?.bundleIdentifier },
    { key: 'expo.android.package', value: appJson.expo?.android?.package },
    { key: 'expo.extra.eas.projectId', value: appJson.expo?.extra?.eas?.projectId },
  ];

  checks.forEach(check => {
    const hasValue = check.value && check.value !== 'your-project-id-here';
    const matches = check.expected ? check.value === check.expected : true;
    const status = hasValue && matches ? '✅' : '⚠️';
    console.log(`  ${status} ${check.key}: ${check.value || 'NOT SET'}`);
    if (!hasValue || !matches) {
      if (check.key === 'expo.extra.eas.projectId') {
        console.log('     → Run "eas init" to set project ID');
      }
    }
  });
} catch (error) {
  console.log('  ❌ Error reading app.json:', error.message);
  allChecks = false;
}

// Check 4: eas.json configuration
console.log('\n🚀 Checking eas.json configuration...');
try {
  const easJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'eas.json'), 'utf8'));
  
  const hasProduction = easJson.build?.production;
  console.log(`  ${hasProduction ? '✅' : '❌'} Production build profile configured`);
  
  const hasSubmit = easJson.submit?.production;
  console.log(`  ${hasSubmit ? '✅' : '⚠️'} Submission profile configured`);
  
  if (hasSubmit) {
    const iosConfig = easJson.submit.production.ios;
    const androidConfig = easJson.submit.production.android;
    
    if (iosConfig) {
      const needsUpdate = iosConfig.appleId?.includes('example.com') || 
                         iosConfig.ascAppId === '1234567890';
      console.log(`  ${needsUpdate ? '⚠️' : '✅'} iOS submission config ${needsUpdate ? '(needs update)' : ''}`);
    }
    
    if (androidConfig) {
      const needsUpdate = androidConfig.serviceAccountKeyPath?.includes('path/to');
      console.log(`  ${needsUpdate ? '⚠️' : '✅'} Android submission config ${needsUpdate ? '(needs update)' : ''}`);
    }
  }
} catch (error) {
  console.log('  ❌ Error reading eas.json:', error.message);
  allChecks = false;
}

// Check 5: Dependencies
console.log('\n📦 Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const requiredDeps = [
    'expo',
    'expo-router',
    'react-native',
    'expo-contacts',
    'expo-store-review',
  ];
  
  requiredDeps.forEach(dep => {
    const installed = packageJson.dependencies?.[dep];
    console.log(`  ${installed ? '✅' : '❌'} ${dep} ${installed ? `(${installed})` : ''}`);
    if (!installed) allChecks = false;
  });
} catch (error) {
  console.log('  ❌ Error reading package.json:', error.message);
  allChecks = false;
}

// Check 6: Documentation
console.log('\n📚 Checking documentation...');
const docFiles = [
  'LAUNCH_READY.md',
  'APP_STORE_LAUNCH_GUIDE.md',
  'FINAL_PRE_LAUNCH_CHECKLIST.md',
  'README.md',
];

docFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allChecks = false;
});

// Summary
console.log('\n' + '='.repeat(50));
if (allChecks) {
  console.log('✅ All critical checks passed!');
  console.log('\n📋 Next steps:');
  console.log('1. Generate app icons (if not done)');
  console.log('2. Run "eas init" to set up EAS project');
  console.log('3. Update eas.json with your Apple/Google credentials');
  console.log('4. Follow LAUNCH_READY.md for complete launch guide');
} else {
  console.log('⚠️ Some checks failed. Please review the issues above.');
  console.log('\n📖 See LAUNCH_READY.md for detailed instructions.');
}
console.log('='.repeat(50) + '\n');

process.exit(allChecks ? 0 : 1);
