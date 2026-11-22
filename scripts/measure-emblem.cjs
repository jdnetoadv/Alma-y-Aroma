/*
 * Medição de pixels do banner do hero: encontra o centróide horizontal da
 * marca dourada (emblema + wordmark ALMA Y AROMA) gravada na arte.
 *
 * Sem dependências — decodifica o PNG com zlib (deflate) e percorre os
 * pixels filtrando o dourado do emblema (alto R, G médio, B médio-baixo).
 * Identifica REGIÕES contíguas douradas e escolhe a maior (a marca — não o
 * brilho do Buda nem chamas/reflexos). Roda standalone:
 *   node scripts/measure-emblem.cjs
 * e grava scripts/emblem-measurement.json com o f medido.
 */
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const BANNER_PATH = path.resolve(__dirname, '..', 'src/assets/luxo-e-aroma-no-spa-3896d.png')

// ---------- decodificador PNG mínimo ----------
function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('Não é um PNG')
  let pos = 8
  let width = 0
  let height = 0
  let bitDepth = 0
  let colorType = 0
  const idat = []
  const palette = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString('ascii', pos + 4, pos + 8)
    const data = buf.subarray(pos + 8, pos + 8 + len)
    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
    } else if (type === 'PLTE') {
      for (let i = 0; i < data.length; i += 3) {
        palette.push([data[i], data[i + 1], data[i + 2]])
      }
    } else if (type === 'IDAT') {
      idat.push(data)
    } else if (type === 'IEND') {
      break
    }
    pos += 12 + len
  }
  if (bitDepth !== 8) throw new Error(`bitDepth ${bitDepth} não suportado (só 8)`)
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType]
  if (channels === undefined) throw new Error(`colorType ${colorType} não suportado`)
  const raw = zlib.inflateSync(Buffer.concat(idat))
  const bpp = channels
  const stride = width * bpp
  const out = Buffer.alloc(height * stride)
  // desfiltro por linha (filtros 0-4 do PNG)
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]
    const rowStart = y * (stride + 1) + 1
    const prevStart = (y - 1) * (stride + 1) + 1
    for (let x = 0; x < stride; x++) {
      const rawByte = raw[rowStart + x]
      const left = x >= bpp ? out[y * stride + x - bpp] : 0
      const up = y > 0 ? out[(y - 1) * stride + x] : 0
      const upLeft = y > 0 && x >= bpp ? out[(y - 1) * stride + x - bpp] : 0
      let val
      if (filter === 0) val = rawByte
      else if (filter === 1) val = rawByte + left
      else if (filter === 2) val = rawByte + up
      else if (filter === 3) val = rawByte + ((left + up) >> 1)
      else if (filter === 4) {
        const p = left + up - upLeft
        const pa = Math.abs(p - left)
        const pb = Math.abs(p - up)
        const pc = Math.abs(p - upLeft)
        val = rawByte + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft)
      } else throw new Error(`filtro PNG ${filter} desconhecido`)
      out[y * stride + x] = val & 0xff
    }
  }
  return { width, height, colorType, bpp, palette, data: out }
}

function measureEmblem(bannerPath) {
  const file = bannerPath || BANNER_PATH
  const png = decodePng(fs.readFileSync(file))
  const { width, height } = png

  const px = (x, y) => {
    const i = y * width * png.bpp + x * png.bpp
    if (png.colorType === 3) return png.palette[png.data[i]]
    return [png.data[i], png.data[i + 1], png.data[i + 2]]
  }

  // ---------- detecção do dourado ----------
  // Busca em TODA a metade superior (y < 55%): o emblema/wordmark está lá.
  // Ouro do emblema: R alto, G médio-alto, B MÉDIO (~0,5–0,85·R) e G ~0,65–0,85·R
  // — distinto do céu do entardecer (laranja saturado: G e B BAIXOS).
  const isGold = (r, g, b) =>
    r >= 150 &&
    r <= 235 &&
    g >= 110 &&
    g <= 200 &&
    b <= 160 &&
    b >= 0.45 * r &&
    b <= 0.9 * r &&
    g >= 0.55 * r &&
    g <= 0.9 * r

  const all = []
  for (let y = 0; y < Math.floor(height * 0.55); y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = px(x, y)
      if (isGold(r, g, b)) all.push({ x, y })
    }
  }
  if (all.length === 0) throw new Error('nenhum pixel dourado na metade superior')

  // Densidade por coluna (o emblema/wordmark é um blob compacto e denso;
  // o halo do céu do entardecer é difuso e raso por coluna).
  const colCount = new Array(width).fill(0)
  for (const p of all) colCount[p.x]++

  // Suavização com janela de 15 px para unir traços do wordmark.
  const smooth = new Array(width).fill(0)
  for (let x = 0; x < width; x++) {
    let s = 0
    let n = 0
    for (let d = -7; d <= 7; d++) {
      const xx = x + d
      if (xx >= 0 && xx < width) {
        s += colCount[xx]
        n++
      }
    }
    smooth[x] = s / n
  }

  // Regiões contíguas acima do limiar (2% do pico suavizado).
  const peak = Math.max(...smooth)
  const thr = Math.max(1, peak * 0.02)
  const regions = []
  let start = -1
  for (let x = 0; x <= width; x++) {
    const on = x < width && smooth[x] >= thr
    if (on && start === -1) start = x
    if (!on && start !== -1) {
      regions.push({ minX: start, maxX: x - 1 })
      start = -1
    }
  }

  const regionStats = regions
    .map((rg) => {
      const pts = all.filter((p) => p.x >= rg.minX && p.x <= rg.maxX)
      const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length
      const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length
      const w = rg.maxX - rg.minX + 1
      return {
        minX: rg.minX,
        maxX: rg.maxX,
        widthPct: Number(((w / width) * 100).toFixed(1)),
        pixels: pts.length,
        density: Number((pts.length / w).toFixed(2)),
        centroidX: Math.round(cx),
        centroidYPct: Number(((cy / height) * 100).toFixed(1)),
        f: Number((cx / width).toFixed(4)),
      }
    })
    .sort((a, b) => b.pixels - a.pixels)

  // O emblema/wordmark = a MAIOR região significativa (mais pixels), não a
  // mais densa: na arte atual o brilho dourado do Buda (f≈0,04) é mais denso
  // por coluna, porém estreito; a marca (emblema + wordmark) é o blob de
  // maior área (~18% da largura, ~1650 px). Medição de 2026-11-21:
  // região 1 = minX 940–1261, f = 0,6419 — é ela que o hero usa.
  const candidates = regionStats.filter((rg) => rg.pixels >= 400)
  if (candidates.length === 0) throw new Error('nenhuma região dourada densa encontrada')
  const emblem = candidates.reduce((a, b) => (b.pixels > a.pixels ? b : a))

  // Histograma coarse de densidade (24 faixas) para validação manual.
  const bins = 24
  const histogram = []
  for (let i = 0; i < bins; i++) {
    const a = Math.floor((i * width) / bins)
    const b2 = Math.floor(((i + 1) * width) / bins)
    let s = 0
    for (let x = a; x < b2; x++) s += colCount[x]
    histogram.push(Number((s / (b2 - a)).toFixed(1)))
  }

  return {
    image: path.basename(file),
    width,
    height,
    goldPixelsTopHalf: all.length,
    regions: regionStats.slice(0, 8),
    emblem,
    histogram,
    f: emblem.f,
  }
}
// ---- Pós-processamento (segunda execução, com json válido) ----
function computePositions(f) {
  // Regra invariante: left + f·width = 50% da viewport.
  const left = 50 - f * 125 // em %
  const position = (50 - left) / 125 // = f
  return { leftPct: Number(left.toFixed(2)), positionPct: Number((position * 100).toFixed(2)) }
}

module.exports = { measureEmblem, computePositions }

if (require.main === module) {
  const result = measureEmblem()
  const positions = computePositions(result.f)
  console.log(JSON.stringify({ ...result, positions }, null, 2))
  fs.writeFileSync(
    path.resolve(__dirname, 'emblem-measurement.json'),
    JSON.stringify({ ...result, positions }, null, 2),
  )
}
