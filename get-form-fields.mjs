import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

console.log('=== GET FORM FIELDS ===');
await page.goto('https://job-boards.greenhouse.io/cartesiansystems/jobs/4201825009', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);

// Click Apply
await page.locator('text=Apply').first().click();
await page.waitForLoadState('networkidle');
await page.waitForTimeout(3000);

console.log('URL:', page.url());

// Get all input fields with their IDs and names
const inputs = await page.evaluate(() => {
  const fields = [];
  document.querySelectorAll('input, select, textarea').forEach(el => {
    fields.push({
      type: el.type,
      id: el.id,
      name: el.name,
      class: el.className,
      placeholder: el.placeholder
    });
  });
  return fields;
});

console.log('\nForm fields:');
inputs.forEach(f => console.log(JSON.stringify(f)));

// Get file inputs
const fileInputs = await page.locator('input[type=file]').all();
console.log('\nFile inputs count:', fileInputs.length);

await browser.close();