import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function buildZip() {
  const zip = new JSZip();
  const phpDir = path.resolve('./php');

  function addDir(dirPath, zipFolder) {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subFolder = zipFolder.folder(item);
        addDir(fullPath, subFolder);
      } else {
        const content = fs.readFileSync(fullPath);
        zipFolder.file(item, content);
      }
    }
  }

  addDir(phpDir, zip);

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const outPath = path.resolve('./public/sanjai-b-portfolio-php-mysql.zip');
  fs.writeFileSync(outPath, zipBuffer);
  console.log(`Generated ZIP at ${outPath} (${(zipBuffer.length / 1024).toFixed(1)} KB)`);
}

buildZip().catch(console.error);
