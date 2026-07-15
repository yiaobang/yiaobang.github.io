import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, 'public', 'images');
const photosData = {};

async function convertToWebP(filePath) {
  const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  if (fs.existsSync(webpPath)) {
    console.log(`跳过已存在: ${path.basename(webpPath)}`);
    return webpPath;
  }
  
  try {
    await sharp(filePath)
      .rotate()
      .webp({ quality: 85 })
      .toFile(webpPath);
    console.log(`✓ 转换: ${path.basename(filePath)} -> ${path.basename(webpPath)}`);
    return webpPath;
  } catch (error) {
    console.error(`✗ 失败: ${path.basename(filePath)}`, error.message);
    return null;
  }
}

async function processDirectory(dir) {
  const folders = fs.readdirSync(dir).filter(f => {
    const fullPath = path.join(dir, f);
    return fs.statSync(fullPath).isDirectory();
  });

  for (const folder of folders) {
    const folderPath = path.join(dir, folder);
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    
    console.log(`\n处理文件夹: ${folder} (${imageFiles.length} 张图片)`);
    
    const webpPaths = [];
    for (const file of imageFiles) {
      const filePath = path.join(folderPath, file);
      if (file.toLowerCase().endsWith('.webp')) {
        const relativePath = filePath.replace(/\\/g, '/').split('public')[1];
        webpPaths.push(relativePath);
      } else {
        const webpPath = await convertToWebP(filePath);
        if (webpPath) {
          const relativePath = webpPath.replace(/\\/g, '/').split('public')[1];
          webpPaths.push(relativePath);
        }
      }
    }
    
    const id = folder.match(/^\d+/)?.[0];
    if (id && webpPaths.length > 0) {
      photosData[id] = webpPaths.sort();
    }
  }
}

async function main() {
  console.log('开始转换图片为WebP格式...\n');
  
  await processDirectory(imagesDir);
  
  const photosJsonPath = path.join(__dirname, 'public', 'data', 'photos.json');
  fs.writeFileSync(photosJsonPath, JSON.stringify(photosData, null, 2));
  
  console.log('\n✓ 完成！photos.json 已更新');
  console.log(`共处理 ${Object.keys(photosData).length} 个文件夹`);
}

main().catch(console.error);