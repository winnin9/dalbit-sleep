import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';

const BASE = 'http://localhost:5173';
const OUT = 'public/assets';
const wait = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();

// ── 1. 로고 (600×600) ──────────────────────────────────────────
await page.setViewport({ width: 600, height: 600, deviceScaleFactor: 2 });
await page.goto(`${BASE}/assets/logo-600.html`, { waitUntil: 'networkidle0' });
await wait(1200);
await page.screenshot({ path: `${OUT}/logo-600x600.png`, clip: { x: 0, y: 0, width: 600, height: 600 } });
console.log('✓ logo-600x600.png');

// ── 2. 썸네일 (1932×828) ───────────────────────────────────────
await page.setViewport({ width: 1932, height: 828, deviceScaleFactor: 2 });
await page.goto(`${BASE}/assets/thumbnail-1932.html`, { waitUntil: 'networkidle0' });
await wait(1200);
await page.screenshot({ path: `${OUT}/thumbnail-1932x828.png`, clip: { x: 0, y: 0, width: 1932, height: 828 } });
console.log('✓ thumbnail-1932x828.png');

// ── 3. 스크린샷: 메인 화면 (기록 완료 상태) ─────────────────────────
await page.setViewport({ width: 318, height: 524, deviceScaleFactor: 2 });
await page.goto(BASE, { waitUntil: 'networkidle0' });
await page.evaluate(() => {
  const settings = { onboardingDone: true, notificationEnabled: true, notificationHour: 8 };
  localStorage.setItem('dalbit_settings', JSON.stringify(settings));
  const moonState = { currentPieces: 10, totalCompleted: 1, totalPoints: 100, pendingReward: false, tutorialDone: true };
  localStorage.setItem('dalbit_moon_state', JSON.stringify(moonState));
  const today = new Date().toISOString().slice(0, 10);
  const records = [
    { id: '1', date: today, stars: 5, moonPieces: 1, memo: '푹 잠들었어요' },
    { id: '2', date: '2025-04-18', stars: 4, moonPieces: 1, memo: '어제 기록' },
    { id: '3', date: '2025-04-17', stars: 3, moonPieces: 1, memo: '' },
    { id: '4', date: '2025-04-16', stars: 5, moonPieces: 1, memo: '' },
    { id: '5', date: '2025-04-15', stars: 2, moonPieces: 1, memo: '' },
  ];
  localStorage.setItem('dalbit_sleep_records', JSON.stringify(records));
});
await page.reload({ waitUntil: 'networkidle0' });
await wait(1000);
await page.screenshot({ path: `${OUT}/screenshot-1-main.png`, clip: { x: 0, y: 0, width: 318, height: 524 } });
console.log('✓ screenshot-1-main.png');

// ── 4. 스크린샷: 수면 통계 화면 ──────────────────────────────
await page.evaluate(() => {
  const btns = document.querySelectorAll('button');
  for (const btn of btns) {
    if (btn.textContent?.includes('통계')) { btn.click(); return; }
  }
});
await wait(800);
await page.screenshot({ path: `${OUT}/screenshot-3-stats.png`, clip: { x: 0, y: 0, width: 318, height: 524 } });
console.log('✓ screenshot-3-stats.png');

// ── 5. 스크린샷: 수면 기록 화면 (메인으로 돌아간 뒤 오늘 기록 삭제 후) ──────────
await page.evaluate(() => {
  // 메인으로 돌아가기
  const btns = document.querySelectorAll('button');
  for (const btn of btns) {
    if (btn.textContent?.includes('홈')) btn.click();
  }
  // 오늘 기록 삭제
  const recordsStr = localStorage.getItem('dalbit_sleep_records') || '[]';
  const records = JSON.parse(recordsStr);
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem('dalbit_sleep_records', JSON.stringify(records.filter(r => r.date !== today)));
});
await page.reload({ waitUntil: 'networkidle0' });
await wait(1000);
await page.evaluate(() => {
  const btns = document.querySelectorAll('button');
  for (const btn of btns) {
    if (btn.textContent?.includes('수면 기록')) { btn.click(); return; }
  }
});
await wait(800);
await page.screenshot({ path: `${OUT}/screenshot-2-record.png`, clip: { x: 0, y: 0, width: 318, height: 524 } });
console.log('✓ screenshot-2-record.png');

await browser.close();
console.log('\n완료! public/assets/ 폴더를 확인하세요.');
