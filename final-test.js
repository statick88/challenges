import puppeteer from 'puppeteer';

async function finalThemeTest() {
  const browser = await puppeteer.launch();
  
  try {
    console.log('🎯 FINAL THEME VERIFICATION TEST\n');
    
    const page = await browser.newPage();
    
    // Test production site
    await page.goto('https://statick88.github.io/challenges/', { waitUntil: 'networkidle2' });
    
    // Monitor CSS loading
    const cssResponses = [];
    page.on('response', response => {
      if (response.url().includes('.css')) {
        cssResponses.push({
          url: response.url(),
          status: response.status()
        });
      }
    });
    
    const styles = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      
      return {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        fontFamily: computedStyle.fontFamily,
        cssClasses: body.className,
        customProperties: {
          primary: getComputedStyle(document.documentElement).getPropertyValue('--color-primary'),
          secondary: getComputedStyle(document.documentElement).getPropertyValue('--color-secondary'),
          accent: getComputedStyle(document.documentElement).getPropertyValue('--color-accent'),
          text: getComputedStyle(document.documentElement).getPropertyValue('--color-text'),
          muted: getComputedStyle(document.documentElement).getPropertyValue('--color-muted')
        },
        themeLoaded: {
          hasPrimary: !!getComputedStyle(document.documentElement).getPropertyValue('--color-primary'),
          hasText: !!getComputedStyle(document.documentElement).getPropertyValue('--color-text'),
          hasAccent: !!getComputedStyle(document.documentElement).getPropertyValue('--color-accent')
        }
      };
    });
    
    console.log('📊 CSS Loading Status:');
    cssResponses.forEach(resp => {
      console.log(`${resp.url}: ${resp.status === 200 ? '✅' : '❌'} (${resp.status})`);
    });
    
    console.log('\n🎨 Computed Styles:');
    console.log(`Background: ${styles.backgroundColor}`);
    console.log(`Text Color: ${styles.color}`);
    console.log(`Font: ${styles.fontFamily}`);
    
    console.log('\n🔧 CSS Classes:');
    console.log(`Body Classes: ${styles.cssClasses}`);
    
    console.log('\n🎯 Custom Properties:');
    Object.entries(styles.customProperties).forEach(([key, value]) => {
      console.log(`${key}: "${value.trim()}" ${value.trim() ? '✅' : '❌'}`);
    });
    
    console.log('\n🎭 Theme Status:');
    console.log(`Dark theme active: ${styles.themeLoaded.hasPrimary && styles.themeLoaded.hasText ? '✅' : '❌'}`);
    
    // Final verification
    const expectedBg = 'rgb(15, 23, 42)';
    const expectedText = 'rgb(248, 250, 252)';
    const isDarkTheme = styles.backgroundColor === expectedBg && styles.color === expectedText;
    
    console.log('\n🏁 FINAL RESULT:');
    console.log(`Dark theme working: ${isDarkTheme ? '✅ SUCCESS' : '❌ FAILED'}`);
    
    if (isDarkTheme) {
      console.log('🎉 The dark theme issue has been resolved!');
    } else {
      console.log('🔧 Further investigation needed.');
      console.log(`Expected: bg=${expectedBg}, text=${expectedText}`);
      console.log(`Actual: bg=${styles.backgroundColor}, text=${styles.color}`);
    }
    
    // Take screenshot for visual confirmation
    await page.screenshot({ path: 'final-production-test.png', fullPage: true });
    console.log('\n📸 Screenshot saved: final-production-test.png');
    
  } catch (error) {
    console.error('❌ Error during final test:', error.message);
  } finally {
    await browser.close();
  }
}

finalThemeTest();