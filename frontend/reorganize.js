import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.join(__dirname, 'src');

// Helper functions
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

function moveFile(oldPath, newPath) {
  const oldFullPath = path.join(srcPath, oldPath);
  const newFullPath = path.join(srcPath, newPath);
  
  if (fs.existsSync(oldFullPath)) {
    ensureDir(path.dirname(newFullPath));
    fs.renameSync(oldFullPath, newFullPath);
    console.log(`✅ Moved: ${oldPath} → ${newPath}`);
  } else {
    console.log(`⚠️  File not found: ${oldPath}`);
  }
}

function updateImportsInFile(filePath, importMappings) {
  const fullPath = path.join(srcPath, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found for import update: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let updated = false;
  
  for (const [oldImport, newImport] of Object.entries(importMappings)) {
    const regex = new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    if (content.includes(oldImport)) {
      content = content.replace(regex, newImport);
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Updated imports in: ${filePath}`);
  }
}

console.log('\n🚀 Starting file reorganization...\n');

// Step 1: Create new directory structure
console.log('📁 Creating new directories...');
ensureDir(path.join(srcPath, 'components/layout'));
ensureDir(path.join(srcPath, 'components/features/home'));
ensureDir(path.join(srcPath, 'components/features/about'));
ensureDir(path.join(srcPath, 'components/features/services'));
ensureDir(path.join(srcPath, 'components/ui'));
ensureDir(path.join(srcPath, 'pages/Home'));
ensureDir(path.join(srcPath, 'pages/About'));
ensureDir(path.join(srcPath, 'pages/Services'));
ensureDir(path.join(srcPath, 'pages/Contact'));
ensureDir(path.join(srcPath, 'hooks'));
ensureDir(path.join(srcPath, 'utils'));

console.log('\n📦 Moving files...\n');

// Step 2: Move layout components
moveFile('components/common/Navbar.tsx', 'components/layout/Navbar.tsx');
moveFile('components/common/Footer.tsx', 'components/layout/Footer.tsx');

// Step 3: Move feature components
moveFile('components/client/Hero.tsx', 'components/features/home/Hero.tsx');
moveFile('components/client/FeatureCard.tsx', 'components/features/home/FeatureCard.tsx');

// Step 4: Move and rename page files
moveFile('pages/client/Home.tsx', 'pages/Home/index.tsx');
moveFile('pages/client/About.tsx', 'pages/About/index.tsx');
moveFile('pages/client/Services.tsx', 'pages/Services/index.tsx');
moveFile('pages/client/Contact.tsx', 'pages/Contact/index.tsx');

// Step 5: Update routes file
moveFile('routes/AppRoutes.tsx', 'routes/index.tsx');

console.log('\n✏️  Updating imports...\n');

// Step 6: Update imports in all affected files
const importMappings = {
  // App.tsx
  'App.tsx': {
    "@/components/common/Navbar": "@/components/layout/Navbar",
    "@/components/common/Footer": "@/components/layout/Footer",
    "@/routes/AppRoutes": "@/routes",
  },
  
  // routes/index.tsx
  'routes/index.tsx': {
    "@/pages/client/Home": "@/pages/Home",
    "@/pages/client/About": "@/pages/About",
    "@/pages/client/Services": "@/pages/Services",
    "@/pages/client/Contact": "@/pages/Contact",
  },
  
  // pages/Home/index.tsx
  'pages/Home/index.tsx': {
    "@/components/client/Hero": "@/components/features/home/Hero",
    "@/components/common/Navbar": "@/components/layout/Navbar",
  },
  
  // pages/About/index.tsx
  'pages/About/index.tsx': {
    "@/components/common/Navbar": "@/components/layout/Navbar",
    "@/components/common/Footer": "@/components/layout/Footer",
  },
  
  // pages/Services/index.tsx
  'pages/Services/index.tsx': {
    "@/components/common/Navbar": "@/components/layout/Navbar",
    "@/components/common/Footer": "@/components/layout/Footer",
  },
  
  // pages/Contact/index.tsx
  'pages/Contact/index.tsx': {
    "@/components/common/Navbar": "@/components/layout/Navbar",
    "@/components/common/Footer": "@/components/layout/Footer",
  },
};

// Apply import updates
for (const [file, mappings] of Object.entries(importMappings)) {
  updateImportsInFile(file, mappings);
}

console.log('\n🧹 Cleaning up empty directories...\n');

// Step 7: Remove old empty directories
function removeEmptyDir(dirPath) {
  const fullPath = path.join(srcPath, dirPath);
  if (fs.existsSync(fullPath)) {
    try {
      const files = fs.readdirSync(fullPath);
      if (files.length === 0) {
        fs.rmdirSync(fullPath);
        console.log(`✅ Removed empty directory: ${dirPath}`);
      }
    } catch (err) {
      // Directory not empty or doesn't exist
    }
  }
}

removeEmptyDir('components/common');
removeEmptyDir('components/client');
removeEmptyDir('pages/client');
removeEmptyDir('pages/employee');

console.log('\n✨ Reorganization complete!\n');
console.log('Next steps:');
console.log('1. Run: npm run dev');
console.log('2. Check that all imports work correctly');
console.log('3. If everything works, you can delete this reorganize.js file\n');