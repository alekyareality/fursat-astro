import sharp from 'sharp';
import fs from 'fs';

async function generate() {
  const src = 'public/assets/interior/fursat_space_18.webp';
  
  // 1. Mobile 480w (4:5 aspect ratio -> 480x600)
  const m480 = 'public/assets/interior/fursat_space_18-m480.webp';
  await sharp(src)
    .resize(480, 600, { fit: 'cover', position: 'centre' })
    .webp({ quality: 80, effort: 6 })
    .toFile(m480);
  console.log(`Created ${m480}: ${(fs.statSync(m480).size / 1024).toFixed(2)} KB`);

  // 2. Mobile 720w (4:5 aspect ratio -> 720x900)
  const m720 = 'public/assets/interior/fursat_space_18-m720.webp';
  await sharp(src)
    .resize(720, 900, { fit: 'cover', position: 'centre' })
    .webp({ quality: 80, effort: 6 })
    .toFile(m720);
  console.log(`Created ${m720}: ${(fs.statSync(m720).size / 1024).toFixed(2)} KB`);

  // 3. Desktop 1200w (1200x900 or 1200x1500)
  const d1200 = 'public/assets/interior/fursat_space_18-1200.webp';
  await sharp(src)
    .resize(1200, 1500, { fit: 'cover', position: 'centre' })
    .webp({ quality: 78, effort: 6 })
    .toFile(d1200);
  console.log(`Created ${d1200}: ${(fs.statSync(d1200).size / 1024).toFixed(2)} KB`);
}

generate().catch(console.error);
