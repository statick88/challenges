import puppeteer from 'puppeteer';

async function debugProductionCSS() {
  const browser = await puppeteer.launch();
  
  try {
    console.log('🔍 Debugging Production CSS Loading...\n');
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => console.log('Browser Console:', msg.text()));
    page.on('pageerror', error => console.log('Page Error:', error.message));
    
    // Check network requests
    const responses = [];
    page.on('response', response => {
      if (response.url().includes('.css')) {
        responses.push({
          url: response.url(),
          status: response.status(),
          headers: response.headers()
        });
        console.log(`CSS Response: ${response.url()} - Status: ${response.status()}`);
      }
    });
    
    await page.goto('https://statick88.github.io/challenges/', { waitUntil: 'networkidle2' });
    
    // Check if CSS files loaded
    console.log('\n📡 CSS Network Requests:');
    responses.forEach(resp => {
      console.log(`URL: ${resp.url}`);
      console.log(`Status: ${resp.status}`);
      console.log(`Content-Type: ${resp.headers['content-type']}`);
      console.log('---');
    });
    
    // Check stylesheets in DOM
    console.log('\n📋 Stylesheets in DOM:');
    const stylesheets = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      return sheets.map((sheet, index) => ({
        index,
        href: sheet.href,
        ownerNode: sheet.ownerNode ? sheet.ownerNode.outerHTML.substring(0, 100) + '...' : 'unknown',
        rules: sheet.cssRules ? sheet.cssRules.length : 'inaccessible'
      }));
    });
    
    stylesheets.forEach(sheet => {
      console.log(`Sheet ${sheet.index}: ${sheet.href}`);
      console.log(`Rules: ${sheet.rules}`);
      console.log('---');
    });
    
    // Check if global.css content is actually applied
    console.log('\n🎨 Global CSS Content Check:');
    const globalCSSApplied = await page.evaluate(() => {
      // Check for specific styles that should be in global.css
      const testElement = document.createElement('div');
      testElement.className = 'bg-primary';
      document.body.appendChild(testElement);
      
      const computedStyle = window.getComputedStyle(testElement);
      const bgColor = computedStyle.backgroundColor;
      
      document.body.removeChild(testElement);
      
      return {
        testElementBg: bgColor,
        hasCustomProps: !!getComputedStyle(document.documentElement).getPropertyValue('--color-primary'),
        customProps: {
          primary: getComputedStyle(document.documentElement).getPropertyValue('--color-primary'),
          secondary: getComputedStyle(document.documentElement).getPropertyValue('--color-secondary'),
          accent: getComputedStyle(document.documentElement).getPropertyValue('--color-accent'),
          text: getComputedStyle(document.documentElement).getPropertyValue('--color-text'),
          muted: getComputedStyle(document.documentElement).getPropertyValue('--color-muted')
        }
      };
    });
    
    console.log('Test element background:', globalCSSApplied.testElementBg);
    console.log('Has custom properties:', globalCSSApplied.hasCustomProps);
    console.log('Custom properties:', globalCSSApplied.customProps);
    
    // Check if there's a Content Security Policy issue
    console.log('\n🔒 Security Headers Check:');
    const securityHeaders = await page.evaluate(() => {
      const metaTags = Array.from(document.querySelectorAll('meta[http-equiv]'));
      return metaTags.map(tag => ({
        httpEquiv: tag.getAttribute('http-equiv'),
        content: tag.getAttribute('content')
      }));
    });
    
    securityHeaders.forEach(header => {
      console.log(`${header.httpEquiv}: ${header.content}`);
    });
    
  } catch (error) {
    console.error('❌ Error during debugging:', error.message);
  } finally {
    await browser.close();
  }
}

debugProductionCSS();