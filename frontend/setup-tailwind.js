import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

function log(message, color = 'blue') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkInstalled(packageName) {
  try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.devDependencies?.[packageName] || packageJson.dependencies?.[packageName];
  } catch (error) {
    return false;
  }
}

// Step 1-4: Check if packages are installed
log('\n📦 Step 1-4: Checking Tailwind CSS dependencies...', 'blue');
const packages = ['tailwindcss', 'postcss', 'autoprefixer'];
const missingPackages = packages.filter(pkg => !checkInstalled(pkg));

if (missingPackages.length > 0) {
  log(`Installing missing packages: ${missingPackages.join(', ')}`, 'yellow');
  try {
    execSync(`npm install -D ${missingPackages.join(' ')}`, { stdio: 'inherit' });
    log('✅ Packages installed successfully', 'green');
  } catch (error) {
    log('❌ Failed to install packages', 'yellow');
    process.exit(1);
  }
} else {
  log('✅ All required packages are already installed', 'green');
}

// Step 5: Create src/index.css with Tailwind directives
log('\n📝 Step 5: Creating/updating src/index.css...', 'blue');
const indexCssPath = path.join(__dirname, 'src', 'index.css');
const tailwindDirectives = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  font-weight: 400;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background-color: #ffffff;
  color: #1a1a1a;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

button {
  font-family: inherit;
  cursor: pointer;
}
`;

try {
  fs.writeFileSync(indexCssPath, tailwindDirectives, 'utf8');
  log('✅ src/index.css created/updated with Tailwind directives', 'green');
} catch (error) {
  log(`❌ Failed to create src/index.css: ${error.message}`, 'yellow');
}

// Step 6a: Create tailwind.config.js
log('\n⚙️  Step 6a: Creating tailwind.config.js...', 'blue');
const tailwindConfigPath = path.join(__dirname, 'tailwind.config.js');
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}
`;

try {
  fs.writeFileSync(tailwindConfigPath, tailwindConfig, 'utf8');
  log('✅ tailwind.config.js created', 'green');
} catch (error) {
  log(`❌ Failed to create tailwind.config.js: ${error.message}`, 'yellow');
}

// Step 6b: Create postcss.config.js
log('\n⚙️  Step 6b: Creating postcss.config.js...', 'blue');
const postcssConfigPath = path.join(__dirname, 'postcss.config.js');
const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

try {
  fs.writeFileSync(postcssConfigPath, postcssConfig, 'utf8');
  log('✅ postcss.config.js created', 'green');
} catch (error) {
  log(`❌ Failed to create postcss.config.js: ${error.message}`, 'yellow');
}

// Final message
log('\n🎉 Tailwind CSS setup complete!', 'green');
log('\n📋 Next steps:', 'blue');
log('   1. Make sure src/index.css is imported in your main.tsx', 'reset');
log('   2. Run: npm run dev', 'reset');
log('   3. Start using Tailwind classes in your components!\n', 'reset');