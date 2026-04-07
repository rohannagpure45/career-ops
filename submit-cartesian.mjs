import { chromium } from 'playwright';
import { isAutoSubmitEnabled } from './lib/config.mjs';

const AUTO_SUBMIT = isAutoSubmitEnabled();

if (!AUTO_SUBMIT) {
  console.log('=== AUTO-SUBMIT DISABLED ===');
  console.log('Set auto_submit: true in config/profile.yml to enable auto-submit');
  console.log('Use fill-cartesian.mjs to fill and preview the form without submitting.');
  process.exit(0);
}

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

console.log('=== FILL AND SUBMIT CARTESIAN FORM (AUTO-SUBMIT ENABLED) ===');
await page.goto('https://job-boards.greenhouse.io/cartesiansystems/jobs/4201825009', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);

// Click Apply
await page.locator('text=Apply').first().click();
await page.waitForLoadState('networkidle');
await page.waitForTimeout(3000);

console.log('URL:', page.url());

// Fill basic info
await page.fill('#first_name', 'Rohan');
await page.fill('#last_name', 'Nagpure');
await page.fill('#preferred_name', 'Rohan');
await page.fill('#email', 'nagpure.r@northeastern.edu');
await page.fill('#phone', '609-375-6850');
await page.fill('#country', 'United States');
console.log('Filled basic fields');

// Upload resume
await page.locator('#resume').setInputFiles('/Users/rohan/career-ops/output/cv-candidate-cartesian-systems-TAILORED-2026-04-06.pdf');
console.log('Resume uploaded');
await page.waitForTimeout(500);

// Upload cover letter
await page.locator('#cover_letter').setInputFiles('/Users/rohan/career-ops/output/cover-letter-cartesian.pdf');
console.log('Cover letter uploaded');
await page.waitForTimeout(500);

// Fill LinkedIn
await page.fill('#question_5728332009', 'linkedin.com/in/rohan-nagpure');

// Work authorization
await page.click('#question_5728333009');
await page.waitForTimeout(300);
await page.fill('#question_5728333009', 'Yes');
await page.keyboard.press('Enter');

// Sponsorship
await page.click('#question_5728334009');
await page.waitForTimeout(300);
await page.fill('#question_5728334009', 'No');
await page.keyboard.press('Enter');

// Location
await page.click('#question_5728335009');
await page.waitForTimeout(300);
await page.fill('#question_5728335009', 'Yes');
await page.keyboard.press('Enter');

// Check availability
const checkboxes = await page.locator('input[type=checkbox]').all();
if (checkboxes.length > 0) {
  await checkboxes[0].check();
}

// Essay
const essayAnswer = "Your spatial intelligence platform for indoor retail is a problem I haven't seen tackled at this level before — combining RFID, computer vision, and ML for real-time product location at scale is exactly the kind of hard, real-world problem I want to work on. My experience building production microservices on Kubernetes and integrating ML models into real workflows gives me the foundation to contribute from day one.";
await page.fill('#question_5728336009', essayAnswer);

await page.waitForTimeout(1000);

// Find and click Submit
const submitBtn = page.locator('button[type="submit"]');
if (await submitBtn.isVisible()) {
  console.log('\n=== CLICKING SUBMIT ===');
  await submitBtn.click();
  await page.waitForTimeout(5000);
  console.log('After submit URL:', page.url());
  const resultText = await page.innerText('body');
  console.log('Result (first 3000):', resultText.substring(0, 3000));
} else {
  console.log('Submit button not visible');
}

await browser.close();