import { chromium } from 'playwright';
import { isAutoSubmitEnabled } from './lib/config.mjs';

const AUTO_SUBMIT = isAutoSubmitEnabled();

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

console.log('=== CARTESIAN FORM FILL ===');
console.log(`Auto-submit: ${AUTO_SUBMIT ? 'ENABLED' : 'DISABLED'}`);

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

// Upload resume (id=resume)
await page.locator('#resume').setInputFiles('/Users/rohan/career-ops/output/cv-candidate-cartesian-systems-TAILORED-2026-04-06.pdf');
console.log('Resume uploaded');
await page.waitForTimeout(1000);

// Upload cover letter (id=cover_letter)
await page.locator('#cover_letter').setInputFiles('/Users/rohan/career-ops/output/cover-letter-cartesian.pdf');
console.log('Cover letter uploaded');
await page.waitForTimeout(1000);

// Fill LinkedIn
await page.fill('#question_5728332009', 'linkedin.com/in/rohan-nagpure');

// Work authorization - click and type to select
await page.click('#question_5728333009');
await page.waitForTimeout(500);
await page.fill('#question_5728333009', 'Yes');
await page.keyboard.press('Enter');
console.log('Work authorization selected');

// Sponsorship - click and type to select
await page.click('#question_5728334009');
await page.waitForTimeout(500);
await page.fill('#question_5728334009', 'No');
await page.keyboard.press('Enter');
console.log('Sponsorship selected');

// Location - click and type to select
await page.click('#question_5728335009');
await page.waitForTimeout(500);
await page.fill('#question_5728335009', 'Yes');
await page.keyboard.press('Enter');
console.log('Location question selected');

// Check availability checkboxes
const checkboxes = await page.locator('input[type=checkbox]').all();
console.log('Checkboxes found:', checkboxes.length);
if (checkboxes.length > 0) {
  await checkboxes[0].check();
  console.log('First checkbox checked');
}

// Fill the essay question
const essayAnswer = "Your spatial intelligence platform for indoor retail is a problem I haven't seen tackled at this level before — combining RFID, computer vision, and ML for real-time product location at scale is exactly the kind of hard, real-world problem I want to work on. My experience building production microservices on Kubernetes and integrating ML models into real workflows gives me the foundation to contribute from day one.";
await page.fill('#question_5728336009', essayAnswer);
console.log('Essay answer filled');

await page.waitForTimeout(2000);

// Get form state
const bodyText = await page.innerText('body');
console.log('\nForm state (first 4000):');
console.log(bodyText.substring(0, 4000));

// Submit logic
const submitBtn = page.locator('button[type="submit"]');
if (await submitBtn.isVisible()) {
  if (AUTO_SUBMIT) {
    console.log('\n=== AUTO-SUBMIT ENABLED - CLICKING SUBMIT ===');
    await submitBtn.click();
    await page.waitForTimeout(5000);
    console.log('After submit URL:', page.url());
    const resultText = await page.innerText('body');
    console.log('Result (first 3000):', resultText.substring(0, 3000));
  } else {
    console.log('\n=== FORM READY TO SUBMIT (auto_submit disabled) ===');
    console.log('Set auto_submit: true in config/profile.yml to enable auto-submit');
    await page.screenshot('/tmp/cartesian-form-ready.png');
    console.log('Screenshot saved to /tmp/cartesian-form-ready.png');
  }
} else {
  console.log('Submit button not visible');
}

await browser.close();