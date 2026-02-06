import { chromium } from 'playwright';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const VIDEO_DIR = resolve(ROOT, '.gif-frames');
const OUT_GIF = resolve(ROOT, 'demo.gif');

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 720 } },
  });

  const page = await context.newPage();
  await page.goto('http://localhost:5199', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Phase 1: Ripples on Claude icon — sweeping mouse
  console.log('Phase 1: ripple sweep...');
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const x = 200 + 480 * t;
    const y = 120 + 240 * t;
    await page.mouse.move(x, y, { steps: 2 });
    await page.waitForTimeout(25);
  }
  await page.waitForTimeout(300);

  // Curve sweep across icon
  for (let i = 0; i <= 50; i++) {
    const t = i / 50;
    const x = 640 + 280 * Math.cos(t * Math.PI * 1.8);
    const y = 300 + 150 * Math.sin(t * Math.PI * 2.2);
    await page.mouse.move(x, y, { steps: 2 });
    await page.waitForTimeout(20);
  }
  await page.waitForTimeout(800);

  // Phase 2: Switch to OpenAI
  console.log('Phase 2: OpenAI...');
  await page.getByRole('button', { name: 'OpenAI' }).click();
  await page.waitForTimeout(1200);

  // Ripple on OpenAI
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const x = 500 + 200 * Math.sin(t * Math.PI);
    const y = 280 + 100 * Math.cos(t * Math.PI * 0.7);
    await page.mouse.move(x, y, { steps: 2 });
    await page.waitForTimeout(25);
  }
  await page.waitForTimeout(600);

  // Phase 3: Switch to Gemini
  console.log('Phase 3: Gemini...');
  await page.getByRole('button', { name: 'Gemini' }).click();
  await page.waitForTimeout(1200);

  // Ripple
  for (let i = 0; i <= 25; i++) {
    const t = i / 25;
    const x = 400 + 350 * t;
    const y = 320 + 80 * Math.sin(t * Math.PI * 2);
    await page.mouse.move(x, y, { steps: 2 });
    await page.waitForTimeout(25);
  }
  await page.waitForTimeout(600);

  // Phase 4: Switch to DeepSeek
  console.log('Phase 4: DeepSeek...');
  await page.getByRole('button', { name: 'DeepSeek' }).click();
  await page.waitForTimeout(1200);

  // Phase 5: Back to Claude (seamless loop)
  console.log('Phase 5: Back to Claude...');
  await page.getByRole('button', { name: 'Claude' }).click();
  await page.waitForTimeout(800);

  // Final ripple circle
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const x = 640 + 250 * Math.cos(t * Math.PI * 2);
    const y = 320 + 130 * Math.sin(t * Math.PI * 2);
    await page.mouse.move(x, y, { steps: 2 });
    await page.waitForTimeout(20);
  }
  await page.waitForTimeout(1000);

  // Stop recording
  await context.close();
  await browser.close();

  // Find the recorded video file
  const { readdirSync } = await import('fs');
  const files = readdirSync(VIDEO_DIR).filter(f => f.endsWith('.webm'));
  if (files.length === 0) {
    console.error('No video file found!');
    process.exit(1);
  }
  const videoPath = resolve(VIDEO_DIR, files[files.length - 1]);
  console.log(`Video: ${videoPath}`);

  // Convert to GIF with ffmpeg (high quality, optimized size)
  console.log('Converting to GIF...');
  execSync(
    `ffmpeg -y -i "${videoPath}" -vf "fps=12,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" -loop 0 "${OUT_GIF}"`,
    { stdio: 'inherit' }
  );

  console.log(`\nDone! GIF saved to: ${OUT_GIF}`);

  // Also make an mp4 for README (smaller, higher quality)
  const OUT_MP4 = resolve(ROOT, 'demo.mp4');
  execSync(
    `ffmpeg -y -i "${videoPath}" -vf "fps=24,scale=960:-1" -c:v libx264 -preset slow -crf 23 -an "${OUT_MP4}"`,
    { stdio: 'inherit' }
  );
  console.log(`MP4 saved to: ${OUT_MP4}`);
}

main().catch(e => { console.error(e); process.exit(1); });
