const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // High resolution for marketing
  });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:3000';
  const outDir = path.join(__dirname, '../public/marketing_assets');
  
  if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
  }

  const routes = [
    { name: '04_module1_execution_highres', path: '/module/1/overview', wait: 3000, fullPage: false },
    { name: '05_module2_workspace_highres', path: '/module/2/overview', wait: 3000, fullPage: false },
    { name: '06_module3_sandbox_highres', path: '/module/3/overview', wait: 3000, fullPage: false },
    { name: '07_module4_deployment_highres', path: '/module/4/overview', wait: 3000, fullPage: false },
    { name: '08_docs_library_highres', path: '/docs', wait: 2000, fullPage: true },
    { name: '09_starter_guide_highres', path: '/guide', wait: 2000, fullPage: true },
  ];

  for (const route of routes) {
    console.log(`Navigating to ${route.path}...`);
    try {
      await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      if (route.wait) {
        await page.waitForTimeout(route.wait);
      }
      const outPath = path.join(outDir, `${route.name}.png`);
      await page.screenshot({ path: outPath, fullPage: route.fullPage, animations: 'disabled', timeout: 10000 });
      console.log(`Saved screenshot: ${outPath}`);
    } catch (e) {
      console.log(`Failed to screenshot ${route.path}: ${e.message}`);
    }
  }

  // Also capture some mobile views
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3, // Super high res for mobile
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  
  const mobileRoutes = [
    { name: '10_mobile_hub_highres', path: '/hub', wait: 2000 },
    { name: '11_mobile_dashboard_highres', path: '/dashboard', wait: 2000 },
    { name: '12_mobile_module1_highres', path: '/module/1/overview', wait: 3000 },
  ];

  for (const route of mobileRoutes) {
    console.log(`Navigating to ${route.path} (Mobile)...`);
    try {
      await mobilePage.goto(`${baseUrl}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      if (route.wait) {
        await mobilePage.waitForTimeout(route.wait);
      }
      const outPath = path.join(outDir, `${route.name}.png`);
      await mobilePage.screenshot({ path: outPath, fullPage: false, animations: 'disabled', timeout: 10000 });
      console.log(`Saved mobile screenshot: ${outPath}`);
    } catch (e) {
      console.log(`Failed to screenshot mobile ${route.path}: ${e.message}`);
    }
  }

  await browser.close();
  console.log('Done!');
}

captureScreenshots().catch(console.error);
