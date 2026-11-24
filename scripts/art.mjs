// Converts the source illustrations in art-src/ (PNG, generated from art-src/PROMPTS.md) to WebP.
//   hero-*.png        -> site/art/hero-*.webp           (hub artwork)
//   cover-<slug>.png  -> ../<slug>/cover.webp           (each game repo owns its cover; needs the game checked out next to this repo)
// Also renders the hub's social card (site/og-image.png) and icons from the hero art and the mark. Run with `npm run art`.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.resolve(here, '../art-src')
const SITE = path.resolve(here, '../site')
fs.mkdirSync(path.join(SITE, 'art'), { recursive: true })

for (const f of fs.readdirSync(SRC).filter((x) => x.endsWith('.png'))) {
  const cover = f.match(/^cover-(.+)\.png$/)
  let out
  if (cover) {
    const gameDir = path.resolve(here, '../..', cover[1])
    if (!fs.existsSync(gameDir)) { console.log(`${f}: skipped, no ../${cover[1]} checkout`); continue }
    out = path.join(gameDir, 'cover.webp')
  } else out = path.join(SITE, 'art', f.replace(/\.png$/, '.webp'))
  const info = await sharp(path.join(SRC, f)).resize({ width: 1536, withoutEnlargement: true }).webp({ quality: 82 }).toFile(out)
  console.log(`${f} -> ${path.relative(path.resolve(here, '../..'), out)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`)
}

// Social card: hero art cropped to 1200x630.
const hero = path.join(SRC, 'hero-arcade.png')
if (fs.existsSync(hero)) {
  await sharp(hero).resize(1200, 630, { fit: 'cover', position: 'centre' }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(path.join(SITE, 'og-image.png'))
  console.log('og-image.png 1200x630')
}
// Icons from the favicon (rounded ink tile with the odd face).
const fav = fs.readFileSync(path.resolve(here, '../kit/favicon.svg'))
for (const [name, size] of [['icon-512.png', 512], ['icon-192.png', 192], ['apple-touch-icon.png', 180], ['favicon-32.png', 32]]) {
  await sharp(fav, { density: 300 }).resize(size, size).png().toFile(path.join(SITE, name))
}
console.log('icons rendered')
