import fs from "fs";

// Este script inyecta el build timestamp en el HTML durante el build
// Se ejecuta como parte del proceso de build

const distPath = "./dist";

if (!fs.existsSync(distPath)) {
  console.log("No dist folder found, skipping version injection");
  process.exit(0);
}

const buildVersion = Date.now();
const buildTimestamp = new Date().toISOString();

function injectVersion(dir) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = `${dir}/${item}`;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      injectVersion(fullPath);
    } else if (item.endsWith(".html")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      content = content.replace(/{BUILD_TIMESTAMP}/g, buildVersion.toString());
      fs.writeFileSync(fullPath, content);
    }
  });
}

try {
  injectVersion(distPath);
  console.log(`✅ Build version injected: ${buildVersion}`);
  console.log(`   Timestamp: ${buildTimestamp}`);
} catch (error) {
  console.error("Error injecting version:", error);
}
