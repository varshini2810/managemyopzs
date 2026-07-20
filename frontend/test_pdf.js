const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture Browser Console
  console.log('--- BROWSER CONSOLE ---');
  page.on('console', msg => {
    console.log([Browser Console ] );
  });
  page.on('pageerror', error => {
    console.log([Browser JS Error] );
  });

  // Capture Network
  console.log('--- NETWORK CAPTURE ---');
  page.on('response', async response => {
    if (response.url().includes('/api/invoices/') && response.url().includes('download')) {
      console.log(URL: );
      console.log(METHOD: );
      console.log(STATUS: );
      console.log(HEADERS: );
      try {
        const text = await response.text();
        console.log(BODY (first 1000 chars): );
      } catch (e) {
        console.log(BODY: could not parse as text: );
      }
    }
  });

  await page.goto('http://localhost:5173');
  await page.fill('input[type="email"]', 'aaa@gmail.com');
  await page.fill('input[type="password"]', 'User@123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  
  // Navigate to invoices
  await page.goto('http://localhost:5173/invoices');
  await page.waitForTimeout(2000);
  
  // Click first invoice
  await page.click('tbody tr');
  await page.waitForTimeout(2000);
  
  // Click PDF download button
  console.log('Clicking PDF Download button...');
  await page.click('button[title="Download Invoice as PDF"]');
  await page.waitForTimeout(3000);
  
  await browser.close();
})();
