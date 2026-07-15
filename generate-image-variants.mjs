import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const photosJsonPath = path.join(publicDir, 'data', 'photos.json');

const variants = [
  {
    name: 'display',
    root: 'images-display',
    resize: { width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true },
    webp: { quality: 76, effort: 4 },
  },
  {
    name: 'thumb',
    root: 'images-thumb',
    resize: { width: 360, height: 260, fit: 'cover', position: 'attention' },
    webp: { quality: 62, effort: 4 },
  },
];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function createVariant(inputPath, outputPath, variant) {
  if (await exists(outputPath)) {
    return false;
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await sharp(inputPath)
    .rotate()
    .resize(variant.resize)
    .webp(variant.webp)
    .toFile(outputPath);

  return true;
}

async function main() {
  const photosData = JSON.parse(await fs.readFile(photosJsonPath, 'utf8'));
  const photoPaths = Object.values(photosData).flat();
  let created = 0;
  let skipped = 0;

  for (const publicPath of photoPaths) {
    const normalizedPath = publicPath.replace(/^\//, '');
    const inputPath = path.join(publicDir, normalizedPath);

    for (const variant of variants) {
      const outputPublicPath = normalizedPath.replace(/^images\//, `${variant.root}/`);
      const outputPath = path.join(publicDir, outputPublicPath);
      const didCreate = await createVariant(inputPath, outputPath, variant);

      if (didCreate) {
        created += 1;
        console.log(`created ${variant.name}: ${outputPublicPath}`);
      } else {
        skipped += 1;
      }
    }
  }

  console.log(`\nDone. Created ${created} files, skipped ${skipped} existing files.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
