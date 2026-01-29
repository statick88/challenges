import puppeteer from 'puppeteer';

async function finalProductionTest() {
  const browser = await puppeteer.launch();
  
  try {
    console.log('🎯 FINAL PRODUCTION TEST AFTER DEPLOYMENT\n');
    
    const page = await browser.newPage();
    
    // Monitor CSS loading
    const cssResponses = [];
    page.on('response', response => {
      if (response.url().includes('.css')) {
        cssResponses.push({
          url: response.url(),
          status: response.status()
        });
        console.log(`📡 CSS: ${response.url().split('/').pop()} - ${response.status() === 200 ? '✅' : '❌'}`);
      }
    });
    
    await page.goto('https://statick88.github.io/challenges/', { waitUntil: 'networkidle2' });
    
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
        }
      };
    });
    
    console.log('\n🎨 THEME ANALYSIS:');
    console.log(`Background: ${styles.backgroundColor}`);
    console.log(`Text Color: ${styles.color}`);
    console.log(`Font: ${styles.fontFamily}`);
    
    console.log('\n🔧 CSS Custom Properties:');
    Object.entries(styles.customProperties).forEach(([key, value]) => {
      const status = value.trim() ? '✅' : '❌';
      console.log(`${key}: "${value.trim()}" ${status}`);
    });
    
    // Final verification
    const expectedBg = 'rgb(15, 23, 42)';
    const expectedText = 'rgb(248, 250, 252)';
    const isDarkTheme = styles.backgroundColor === expectedBg && styles.color === expectedText;
    const hasCustomProps = Object.values(styles.customProperties).some(v => v.trim());
    
    console.log('\n🏁 FINAL RESULT:');
    console.log(`✅ CSS files loaded: ${cssResponses.every(r => r.status === 200) ? 'YES' : 'NO'}`);
    console.log(`✅ Custom properties defined: ${hasCustomProps ? 'YES' : 'NO'}`);
    console.log(`✅ Dark theme active: ${isDarkTheme ? 'YES' : 'NO'}`);
    
    console.log('\n🎉 OVERALL STATUS:');
    if (cssResponses.every(r => r.status === 200) && hasCustomProps && isDarkTheme) {
      console.log('🎊 SUCCESS: Dark theme is fully functional on production!');
    } else {
      console.log('❌ ISSUE: Dark theme still not working properly');
      console.log(`Expected: bg=${expectedBg}, text=${expectedText}`);
      console.log(`Actual: bg=${styles.backgroundColor}, text=${styles.color}`);
    }
    
  } catch (error) {
    console.error('❌ Error during final test:', error.message);
  } finally {
    await browser.close();
  }
}

finalProductionTest();