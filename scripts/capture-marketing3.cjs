const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // High resolution for marketing
  });
  
  // Prevent onboarding chat popup
  await context.addInitScript(() => {
    window.localStorage.setItem('zen_onboarding_answered', 'true');
  });
  
  const page = await context.newPage();

  const baseUrl = 'http://localhost:3000';
  const outDir = path.join(__dirname, '../public/marketing_assets');
  
  if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
  }

  const routes = [
    { name: '01_hub_overview_highres', path: '/hub', wait: 3500 },
    { name: '02_dashboard_analytics_highres', path: '/dashboard', wait: 3500 },
    { name: '03_profile_pioneer_highres', path: '/profile', wait: 2000 },
    { name: '04_module1_execution_highres', path: '/module/1/overview', wait: 3500 },
    { name: '05_module2_workspace_highres', path: '/module/2/overview', wait: 3500 },
    { name: '06_module3_sandbox_highres', path: '/module/3/overview', wait: 3500 },
    { name: '07_module4_deployment_highres', path: '/module/4/overview', wait: 3500 },
    { name: '08_docs_library_highres', path: '/docs', wait: 2000 },
    { name: '09_starter_guide_highres', path: '/guide', wait: 2000 },
  ];

  for (const route of routes) {
    console.log(`Navigating to ${route.path}...`);
    try {
      await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      if (route.wait) {
        await page.waitForTimeout(route.wait);
      }
      const outPath = path.join(outDir, `${route.name}.png`);
      
      const cdpSession = await page.context().newCDPSession(page);
      const { data } = await cdpSession.send('Page.captureScreenshot');
      fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
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
  
  // Prevent onboarding chat popup mobile
  await mobileContext.addInitScript(() => {
    window.localStorage.setItem('zen_onboarding_answered', 'true');
  });
  
  const mobilePage = await mobileContext.newPage();
  
  const mobileRoutes = [
    { name: '10_mobile_hub_highres', path: '/hub', wait: 2000 },
    { name: '11_mobile_dashboard_highres', path: '/dashboard', wait: 2000 },
    { name: '12_mobile_module1_highres', path: '/module/1/overview', wait: 3000 },
    { name: '13_mobile_module2_highres', path: '/module/2/overview', wait: 3000 },
  ];

  for (const route of mobileRoutes) {
    console.log(`Navigating to ${route.path} (Mobile)...`);
    try {
      await mobilePage.goto(`${baseUrl}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      if (route.wait) {
        await mobilePage.waitForTimeout(route.wait);
      }
      const outPath = path.join(outDir, `${route.name}.png`);
      
      const cdpSession = await mobilePage.context().newCDPSession(mobilePage);
      const { data } = await cdpSession.send('Page.captureScreenshot');
      fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
      
      console.log(`Saved mobile screenshot: ${outPath}`);
    } catch (e) {
      console.log(`Failed to screenshot mobile ${route.path}: ${e.message}`);
    }
  }

  await browser.close();
  console.log('Done!');
}

captureScreenshots().catch(console.error);
