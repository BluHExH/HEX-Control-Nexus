const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Ensure screenshots directory exists
async function ensureScreenshotsDir() {
  const screenshotsDir = path.join(__dirname, '..', '..', 'logs', 'screenshots');
  try {
    await fs.access(screenshotsDir);
  } catch {
    await fs.mkdir(screenshotsDir, { recursive: true });
  }
  return screenshotsDir;
}

async function triggerPuppeteerTask(target, options = {}) {
  let browser;
  let page;
  
  try {
    // Ensure screenshots directory exists
    const screenshotsDir = await ensureScreenshotsDir();
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: options.headless !== false, // Default to headless
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    // Create a new page
    page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ 
      width: 1920, 
      height: 1080,
      deviceScaleFactor: 1
    });
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (compatible; HEX/1.0; +http://example.com/bot)');
    
    // Navigate to target
    console.log(`Navigating to: ${target}`);
    await page.goto(target, { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for specific selector if provided
    if (options.waitForSelector) {
      await page.waitForSelector(options.waitForSelector, { timeout: 10000 });
    }
    
    // Take screenshot if requested
    let screenshotPath = null;
    if (options.screenshot !== false) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      screenshotPath = path.join(screenshotsDir, `screenshot_${timestamp}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
    }
    
    // Extract data if selectors provided
    let extractedData = {};
    if (options.selectors) {
      extractedData = await page.evaluate((selectors) => {
        const result = {};
        for (const [key, selector] of Object.entries(selectors)) {
          try {
            const element = document.querySelector(selector);
            if (element) {
              result[key] = element.textContent.trim();
            }
          } catch (error) {
            result[key] = `Error: ${error.message}`;
          }
        }
        return result;
      }, options.selectors);
    }
    
    // Close browser
    await browser.close();
    
    return {
      success: true,
      message: 'Puppeteer task completed successfully',
      url: target,
      title: await page.title(),
      screenshot: screenshotPath,
      data: extractedData
    };
    
  } catch (error) {
    // Take screenshot on error if possible
    if (browser && page) {
      try {
        const screenshotsDir = await ensureScreenshotsDir();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const errorScreenshotPath = path.join(screenshotsDir, `error_${timestamp}.png`);
        await page.screenshot({ path: errorScreenshotPath, fullPage: true });
        console.log(`Error screenshot saved to: ${errorScreenshotPath}`);
      } catch (screenshotError) {
        console.error('Failed to take error screenshot:', screenshotError);
      }
    }
    
    // Close browser if it's still open
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Failed to close browser:', closeError);
      }
    }
    
    throw new Error(`Puppeteer task failed: ${error.message}`);
  }
}

// Example usage function
async function runExampleTask() {
  try {
    const result = await triggerPuppeteerTask('https://example.com', {
      headless: true,
      waitForSelector: 'h1',
      selectors: {
        title: 'h1',
        paragraph: 'p'
      },
      screenshot: true
    });
    
    console.log('Task result:', result);
    return result;
  } catch (error) {
    console.error('Example task failed:', error);
    throw error;
  }
}

module.exports = { triggerPuppeteerTask, runExampleTask };