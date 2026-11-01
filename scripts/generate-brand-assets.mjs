/**
 * 生成品牌素材：iOS 桌面图标与社交分享卡。
 *
 * 输入：public/favicon.svg（矢量标记）、public/Tohru.jfif（头像原图）
 * 输出：public/apple-touch-icon.png、public/og-image.png
 *
 * 仅在需要重新生成时手动执行：node scripts/generate-brand-assets.mjs
 */
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const AVATAR_SIZE = 210;
const AVATAR_CENTER = { x: OG_WIDTH / 2, y: 246 };

const FONT_STACK = 'Segoe UI, Helvetica Neue, Helvetica, Arial, sans-serif';

/** 圆形遮罩，用于把方头像裁成圆形 */
const circleMask = (size) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
       <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/>
     </svg>`
  );

/** 分享卡底色：深色柔光 + 头像外圈细环 + 站点名 */
const ogBackdrop = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}">
     <defs>
       <radialGradient id="glow" cx="50%" cy="34%" r="58%">
         <stop offset="0%" stop-color="#22222c"/>
         <stop offset="52%" stop-color="#101014"/>
         <stop offset="100%" stop-color="#070708"/>
       </radialGradient>
     </defs>
     <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#glow)"/>
     <circle
       cx="${AVATAR_CENTER.x}" cy="${AVATAR_CENTER.y}"
       r="${AVATAR_SIZE / 2 + 20}"
       fill="none" stroke="#ffffff" stroke-opacity="0.16" stroke-width="1.5"
     />
     <circle
       cx="${AVATAR_CENTER.x}" cy="${AVATAR_CENTER.y}"
       r="${AVATAR_SIZE / 2 + 40}"
       fill="none" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1"
     />
     <text
       x="${OG_WIDTH / 2}" y="462"
       text-anchor="middle" font-family="${FONT_STACK}"
       font-size="58" font-weight="600" letter-spacing="1"
       fill="#f5f5f7"
     >yiaobang</text>
     <text
       x="${OG_WIDTH / 2}" y="517"
       text-anchor="middle" font-family="${FONT_STACK}"
       font-size="24" letter-spacing="2.5"
       fill="#8b8b96"
     >code · travel · everyday</text>
   </svg>`
);

async function buildAppleTouchIcon() {
  const svg = await sharp(path.join(publicDir, 'favicon.svg')).toBuffer();

  await sharp(svg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('✓ apple-touch-icon.png (180×180)');
}

async function buildOgImage() {
  const avatar = await sharp(path.join(publicDir, 'Tohru.jfif'))
    .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: 'cover', position: 'attention' })
    .ensureAlpha()
    .composite([{ input: circleMask(AVATAR_SIZE), blend: 'dest-in' }])
    .png()
    .toBuffer();

  await sharp(ogBackdrop)
    .composite([
      {
        input: avatar,
        top: Math.round(AVATAR_CENTER.y - AVATAR_SIZE / 2),
        left: Math.round(AVATAR_CENTER.x - AVATAR_SIZE / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log(`✓ og-image.png (${OG_WIDTH}×${OG_HEIGHT})`);
}

await buildAppleTouchIcon();
await buildOgImage();
