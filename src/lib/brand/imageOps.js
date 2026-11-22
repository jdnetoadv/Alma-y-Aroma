/**
 * Gera as artes da marca ALMA Y AROMA a partir do PNG oficial da cliente
 * (src/assets/logotipo-dourado-alma-y-aroma-3d704.png), com remoção de
 * fundo por chave de luminância. Roda UMA VEZ por processo (build ou dev)
 * via buildStart do Vite — instanciado por src/lib/brand/artGeneration.ts.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'
import { PNG } from 'pngjs'

const here = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(here, '..')
const SRC = resolve(ROOT, 'src/assets/logotipo-dourado-alma-y-aroma-3d704.png')
const OUT_DIR = resolve(ROOT, 'public/brand')
const STAMP = resolve(OUT_DIR, '.generated-stamp')

// ── PNG encode (RGBA 8-bit) ───────────────────────────────────────────────
function crc32(buf) {
  let c = ~0
  for (let n = 0; n < buf.length; n++) {
    c ^= buf[n]
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return ~c
}
function chunk(type, dataBytes) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(dataBytes.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, Buffer.from(dataBytes)])) >>> 0)
  return Buffer.concat([len, typeBuf, Buffer.from(dataBytes), crc])
}
function encodePNG(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0
    for (let x = 0; x < w * 4; x++) raw[y * (w * 4 + 1) + 1 + x] = rgba[y * w * 4 + x]
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ── Processamento ─────────────────────────────────────────────────────────
function generate() {
  mkdirSync(OUT_DIR, { recursive: true })
  const png = PNG.sync.read(readFileSync(SRC))
  const W = png.width
  const H = png.height
  const data = png.data
  const report = {
    source: 'src/assets/logotipo-dourado-alma-y-aroma-3d704.png',
    width: W,
    height: H,
    outputs: [],
    emblemBox: null,
    lockupBox: null,
  }

  // Chave de luminância: alpha = rampa suave de maxRGB. Fundo preto → 0,
  // glow amarelado → alpha baixo (transparência suave), dourado → 1.
  const LO = 0.045
  const HI = 0.5
  const alphaRaw = new Float32Array(W * H)
  for (let i = 0; i < W * H; i++) {
    const max = Math.max(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]) / 255
    let a
    if (max <= LO) a = 0
    else if (max >= HI) a = 1
    else {
      const t = (max - LO) / (HI - LO)
      a = t * t * (3 - 2 * t) * 0.85 + t * 0.15
    }
    alphaRaw[i] = a
  }

  // Caixas: linhas com arte (alpha > limiar); maior intervalo vazio separa
  // emblema (topo) do wordmark (base).
  const THR = 0.16
  const rowCounts = new Array(H).fill(0)
  const colMin = new Array(H).fill(W)
  const colMax = new Array(H).fill(-1)
  for (let y = 0; y < H; y++) {
    let c = 0
    for (let x = 0; x < W; x++) {
      if (alphaRaw[y * W + x] > THR) {
        c++
        if (x < colMin[y]) colMin[y] = x
        if (x > colMax[y]) colMax[y] = x
      }
    }
    rowCounts[y] = c
  }
  let top = -1
  let bottom = -1
  for (let y = 0; y < H; y++) {
    if (rowCounts[y] > 0) {
      if (top < 0) top = y
      bottom = y
    }
  }
  let gapStart = -1
  let gapLen = 0
  let bestGapStart = -1
  let bestGapLen = 0
  for (let y = top; y <= bottom; y++) {
    if (rowCounts[y] === 0) {
      if (gapStart < 0) gapStart = y
      gapLen++
    } else {
      if (gapLen > bestGapLen) {
        bestGapLen = gapLen
        bestGapStart = gapStart
      }
      gapLen = 0
      gapStart = -1
    }
  }
  if (gapLen > bestGapLen) {
    bestGapLen = gapLen
    bestGapStart = gapStart
  }
  if (bestGapLen <= 0) throw new Error('nao encontrei separacao entre emblema e wordmark')

  function bandBox(y0, y1) {
    let minX = W
    let maxX = -1
    for (let y = y0; y < y1; y++) {
      if (rowCounts[y] === 0) continue
      if (colMin[y] < minX) minX = colMin[y]
      if (colMax[y] > maxX) maxX = colMax[y]
    }
    if (maxX < 0) return null
    return { x: minX, y: y0, w: maxX - minX + 1, h: y1 - y0 }
  }

  const emblemBoxRaw = bandBox(top, bestGapStart)
  const lockupBox = bandBox(top, bottom + 1)
  if (!emblemBoxRaw || !lockupBox) throw new Error('caixas vazias')
  const GLOW_PAD = Math.round(Math.min(W, H) * 0.02)
  const ebx = Math.max(0, emblemBoxRaw.x - GLOW_PAD)
  const eby = Math.max(0, emblemBoxRaw.y - GLOW_PAD)
  const ebx2 = Math.min(W, emblemBoxRaw.x + emblemBoxRaw.w + GLOW_PAD)
  const eby2 = Math.min(H, emblemBoxRaw.y + emblemBoxRaw.h + GLOW_PAD)
  const emblemBox = { x: ebx, y: eby, w: ebx2 - ebx, h: eby2 - eby }
  report.emblemBox = emblemBox
  report.lockupBox = lockupBox

  function cropRGBA(box) {
    const out = new Uint8ClampedArray(box.w * box.h * 4)
    for (let y = 0; y < box.h; y++) {
      for (let x = 0; x < box.w; x++) {
        const si = ((box.y + y) * W + (box.x + x)) * 4
        const di = (y * box.w + x) * 4
        out[di] = data[si]
        out[di + 1] = data[si + 1]
        out[di + 2] = data[si + 2]
        out[di + 3] = Math.round(alphaRaw[(box.y + y) * W + (box.x + x)] * 255)
      }
    }
    return out
  }
  function resizeBilinear(src, sw, sh, dw, dh) {
    const out = new Uint8ClampedArray(dw * dh * 4)
    for (let y = 0; y < dh; y++) {
      const fy = ((y + 0.5) * sh) / dh - 0.5
      const y0 = Math.max(0, Math.min(sh - 1, Math.floor(fy)))
      const y1 = Math.min(sh - 1, y0 + 1)
      const wy = Math.max(0, Math.min(1, fy - y0))
      for (let x = 0; x < dw; x++) {
        const fx = ((x + 0.5) * sw) / dw - 0.5
        const x0 = Math.max(0, Math.min(sw - 1, Math.floor(fx)))
        const x1 = Math.min(sw - 1, x0 + 1)
        const wx = Math.max(0, Math.min(1, fx - x0))
        for (let c = 0; c < 4; c++) {
          const v00 = src[(y0 * sw + x0) * 4 + c]
          const v10 = src[(y0 * sw + x1) * 4 + c]
          const v01 = src[(y1 * sw + x0) * 4 + c]
          const v11 = src[(y1 * sw + x1) * 4 + c]
          out[(y * dw + x) * 4 + c] =
            v00 * (1 - wx) * (1 - wy) + v10 * wx * (1 - wy) + v01 * (1 - wx) * wy + v11 * wx * wy
        }
      }
    }
    return out
  }
  function canvasRGBA(w, h, fill) {
    const out = new Uint8ClampedArray(w * h * 4)
    for (let i = 0; i < w * h; i++) {
      out[i * 4] = fill[0]
      out[i * 4 + 1] = fill[1]
      out[i * 4 + 2] = fill[2]
      out[i * 4 + 3] = fill[3]
    }
    return out
  }
  function composite(dst, dw, dh, src, sw, sh, ox, oy) {
    for (let y = 0; y < dh; y++) {
      const sy = y - oy
      if (sy < 0 || sy >= sh) continue
      for (let x = 0; x < dw; x++) {
        const sx = x - ox
        if (sx < 0 || sx >= sw) continue
        const si = (sy * sw + sx) * 4
        const di = (y * dw + x) * 4
        const a = src[si + 3] / 255
        if (a === 0) continue
        dst[di] = src[si] * a + dst[di] * (1 - a)
        dst[di + 1] = src[si + 1] * a + dst[di + 1] * (1 - a)
        dst[di + 2] = src[si + 2] * a + dst[di + 2] * (1 - a)
        dst[di + 3] = Math.max(dst[di + 3], src[si + 3])
      }
    }
  }

  // lockup completa, transparente
  const lockupRGBA = cropRGBA(lockupBox)
  writeFileSync(resolve(OUT_DIR, 'lockup.png'), encodePNG(lockupBox.w, lockupBox.h, lockupRGBA))
  report.outputs.push('public/brand/lockup.png')

  // emblema recortado, transparente (centralizado num quadrado pela maior lado)
  const sq = Math.max(emblemBox.w, emblemBox.h)
  const emblemRGBA = cropRGBA(emblemBox)
  const emblemSq = canvasRGBA(sq, sq, [0, 0, 0, 0])
  composite(
    emblemSq,
    sq,
    sq,
    emblemRGBA,
    emblemBox.w,
    emblemBox.h,
    Math.floor((sq - emblemBox.w) / 2),
    Math.floor((sq - emblemBox.h) / 2),
  )
  writeFileSync(resolve(OUT_DIR, 'emblem.png'), encodePNG(sq, sq, emblemSq))
  report.outputs.push('public/brand/emblem.png')

  // emblema 512×512
  const emblem512 = resizeBilinear(emblemSq, sq, sq, 512, 512)
  writeFileSync(resolve(OUT_DIR, 'emblem-512.png'), encodePNG(512, 512, emblem512))
  report.outputs.push('public/brand/emblem-512.png')

  // favicon-64: emblema sobre vinho arredondado (raio 12, como antes)
  const wine = [0x3b, 0x17, 0x15, 255]
  const favSize = 64
  const favBg = canvasRGBA(favSize, favSize, wine)
  const favEmblem = resizeBilinear(emblemSq, sq, sq, 56, 56)
  composite(favBg, favSize, favSize, favEmblem, 56, 56, 4, 4)
  const RAD = 12
  for (let y = 0; y < favSize; y++) {
    for (let x = 0; x < favSize; x++) {
      const dx = Math.max(RAD - x, x - (favSize - 1 - RAD), 0)
      const dy = Math.max(RAD - y, y - (favSize - 1 - RAD), 0)
      if (dx * dx + dy * dy > RAD * RAD) favBg[(y * favSize + x) * 4 + 3] = 0
    }
  }
  writeFileSync(resolve(OUT_DIR, 'favicon-64.png'), encodePNG(favSize, favSize, favBg))
  report.outputs.push('public/brand/favicon-64.png')

  // favicon.svg: PNG do emblema embutido (mantém o link /favicon.svg do index)
  const favB64 = readFileSync(resolve(OUT_DIR, 'favicon-64.png')).toString('base64')
  const faviconSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64">\n' +
    `  <image href="data:image/png;base64,${favB64}" xlink:href="data:image/png;base64,${favB64}" x="0" y="0" width="64" height="64"/>\n` +
    '</svg>\n'
  writeFileSync(resolve(ROOT, 'public/favicon.svg'), faviconSvg)
  report.outputs.push('public/favicon.svg')

  writeFileSync(resolve(ROOT, 'scripts/logo-report.json'), JSON.stringify(report, null, 2))
  return report
}

export default function almaAromaLogoPlugin() {
  let ran = false
  return {
    name: 'alma-aroma-logo-plugin',
    buildStart() {
      if (ran) return
      ran = true
      try {
        const pngBuf = readFileSync(SRC)
        const stampOk =
          existsSync(STAMP) &&
          existsSync(resolve(OUT_DIR, 'lockup.png')) &&
          existsSync(resolve(OUT_DIR, 'emblem.png')) &&
          existsSync(resolve(OUT_DIR, 'favicon-64.png'))
        if (
          stampOk &&
          readFileSync(STAMP).toString('base64').slice(0, 800) ===
            pngBuf.toString('base64').slice(0, 800)
        ) {
          return
        }
      } catch {
        // roda a geração abaixo
      }
      const report = generate()
      writeFileSync(STAMP, readFileSync(SRC))
      console.log('[alma-aroma-logo] gerado:', report.outputs.join(', '))
    },
  }
}
