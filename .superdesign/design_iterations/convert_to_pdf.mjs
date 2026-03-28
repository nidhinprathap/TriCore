import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, 'tricore_logo_1.html');
const pdfPath = path.resolve(__dirname, 'tricore_logo_1.pdf');

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });

// Wait for animations to complete
await new Promise(r => setTimeout(r, 4000));

await page.pdf({
  path: pdfPath,
  format: 'A3',
  printBackground: true,
  margin: { top: 0, bottom: 0, left: 0, right: 0 },
  preferCSSPageSize: false
});

await browser.close();
console.log('PDF saved to:', pdfPath);
