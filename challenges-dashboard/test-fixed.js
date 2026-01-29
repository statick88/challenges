import puppeteer from 'puppeteer';

async function testFixedProduction() {
  const browser = await puppeteer.launch();
  
  try {
    console.log('🔍 Testing Fixed Production CSS Loading...\n');
    
    const page = await browser.newPage();
    
    // Monitor network requests
    const responses = [];
    page.on('response', response => {
      if (response.url().includes('.css')) {
        responses.push({
          url: response.url(),
          status: response.status()
        });
        console.log(`CSS Response: ${response.url()} - Status: ${response.status()}`);
      }
    });
    
    // Test the local fixed version first
    await page.goto('http://localhost:4322/', { waitUntil: 'networkidle2' });
    
    const localStyles = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      return {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        customProps: {
          primary: getComputedStyle(document.documentElement).getPropertyValue('--color-primary'),
          secondary: getComputedStyle(document.documentElement).getPropertyValue('--color-secondary'),
          accent: getComputedStyle(document.documentElement).getPropertyValue('--color-accent'),
          text: getComputedStyle(document.documentElement).getPropertyValue('--color-text'),
          muted: getComputedStyle(document.documentElement).getPropertyValue('--color-muted')
        }
      };
    });
    
    console.log('\n📱 Local Results:');
    console.log('Background:', localStyles.backgroundColor);
    console.log('Text:', localStyles.color);
    console.log('CSS Custom Properties loaded:', Object.values(localStyles.customProps).some(v => v.trim()));
    
    // Test production
    await page.goto('https://statick88.github.io/challenges/', { waitUntil: 'networkidle2' });
    
    const prodStyles = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      return {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        customProps: {
          primary: getComputedStyle(document.documentElement).getPropertyValue('--color-primary'),
          secondary: getComputedStyle(document.documentElement).getPropertyValue('--color-secondary'),
          accent: getComputedStyle(document.documentElement).getPropertyValue('--color-accent'),
          text: getComputedStyle(document.documentElement).getPropertyValue('--color-text'),
          muted: getComputedStyle(document.documentElement).getPropertyValue('--color-muted')
        }
      };
    });
    
    console.log('\n🌐 Production Results:');
    console.log('Background:', prodStyles.backgroundColor);
    console.log('Text:', prodStyles.color);
    console.log('CSS Custom Properties loaded:', Object.values(prodStyles.customProps).some(v => v.trim()));
    
    // Final comparison
    const expectedBg = 'rgb(15, 23, 42)';
    const expectedText = 'rgb(248, 250, 252)';
    
    console.log('\n🎭 FINAL VERIFICATION:');
    console.log(`Local has dark theme: ${localStyles.backgroundColor === expectedBg ? '✅' : '❌'}`);
    console.log(`Production has dark theme: ${prodStyles.backgroundColor === expectedBg ? '✅' : '❌'}`);
    console.log(`Themes match: ${localStyles.backgroundColor === prodStyles.backgroundColor ? '✅' : '❌'}`);
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
}

testFixedProduction();