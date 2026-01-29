import puppeteer from 'puppeteer';

async function compareTheme() {
  const browser = await puppeteer.launch();
  
  try {
    console.log('🔍 Comparing dark theme between local and production...\n');
    
    // Test local development
    console.log('📱 Testing Local Development (http://localhost:4322/)');
    const localPage = await browser.newPage();
    await localPage.goto('http://localhost:4322/');
    
    const localStyles = await localPage.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      return {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        background: computedStyle.background,
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
    
    // Test production
    console.log('🌐 Testing Production (https://statick88.github.io/challenges/)');
    const prodPage = await browser.newPage();
    await prodPage.goto('https://statick88.github.io/challenges/');
    
    const prodStyles = await prodPage.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      return {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        background: computedStyle.background,
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
    
    // Compare results
    console.log('\n🎨 COMPARISON RESULTS:');
    console.log('='.repeat(50));
    
    console.log('\n📊 Computed Styles:');
    console.log('Local Background:', localStyles.backgroundColor);
    console.log('Production Background:', prodStyles.backgroundColor);
    console.log('Backgrounds Match:', localStyles.backgroundColor === prodStyles.backgroundColor ? '✅' : '❌');
    
    console.log('\nLocal Text Color:', localStyles.color);
    console.log('Production Text Color:', prodStyles.color);
    console.log('Text Colors Match:', localStyles.color === prodStyles.color ? '✅' : '❌');
    
    console.log('\n🔧 CSS Classes:');
    console.log('Local Classes:', localStyles.cssClasses);
    console.log('Production Classes:', prodStyles.cssClasses);
    console.log('Classes Match:', localStyles.cssClasses === prodStyles.cssClasses ? '✅' : '❌');
    
    console.log('\n🎯 Custom Properties:');
    Object.keys(localStyles.customProperties).forEach(prop => {
      const localVal = localStyles.customProperties[prop].trim();
      const prodVal = prodStyles.customProperties[prop].trim();
      const match = localVal === prodVal;
      console.log(`${prop}: Local="${localVal}" | Prod="${prodVal}" ${match ? '✅' : '❌'}`);
    });
    
    // Check if dark theme is actually applied
    const expectedBg = 'rgb(15, 23, 42)';
    const expectedText = 'rgb(248, 250, 252)';
    
    console.log('\n🎭 THEME VERIFICATION:');
    console.log(`Local has correct dark background: ${localStyles.backgroundColor === expectedBg ? '✅' : '❌'}`);
    console.log(`Production has correct dark background: ${prodStyles.backgroundColor === expectedBg ? '✅' : '❌'}`);
    console.log(`Local has correct text color: ${localStyles.color === expectedText ? '✅' : '❌'}`);
    console.log(`Production has correct text color: ${prodStyles.color === expectedText ? '✅' : '❌'}`);
    
    // Screenshot comparison
    console.log('\n📸 Taking screenshots for visual comparison...');
    await localPage.screenshot({ path: 'local-dark-theme.png', fullPage: true });
    await prodPage.screenshot({ path: 'production-dark-theme.png', fullPage: true });
    console.log('Screenshots saved: local-dark-theme.png, production-dark-theme.png');
    
  } catch (error) {
    console.error('❌ Error during comparison:', error.message);
  } finally {
    await browser.close();
  }
}

compareTheme();