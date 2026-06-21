// Compresses an image in the browser before upload: resizes and re-encodes as
// JPEG, retrying at progressively smaller dimensions/quality until the result
// is comfortably under targetBytes. A single fixed setting isn't reliable —
// a busy, detailed photo can stay several MB at 1600px/0.82 quality while a
// simpler photo compresses far smaller, so one photo would upload fine and
// the next would still trip the storage bucket's size limit. Stepping down
// guarantees every photo lands under the target regardless of content.
//
// GIFs and SVGs are returned untouched (compressing them would break animation /
// vector quality).
const STEPS = [
  { maxDim: 1600, quality: 0.82 },
  { maxDim: 1280, quality: 0.75 },
  { maxDim: 1024, quality: 0.65 },
  { maxDim: 800, quality: 0.55 },
  { maxDim: 600, quality: 0.5 },
]

export async function compressImage(file, { targetBytes = 800 * 1024 } = {}) {
  if (!file || !file.type.startsWith('image/')) return file
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file

  try {
    const dataUrl = await readAsDataURL(file)
    const img = await loadImage(dataUrl)

    let best = null
    for (const step of STEPS) {
      const blob = await renderJpeg(img, step.maxDim, step.quality)
      if (!blob) continue
      if (!best || blob.size < best.size) best = blob
      if (blob.size <= targetBytes) break
    }

    if (!best || best.size >= file.size) return file

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([best], newName, { type: 'image/jpeg', lastModified: Date.now() })
  } catch {
    // If anything goes wrong, fall back to the original file
    return file
  }
}

function renderJpeg(img, maxDim, quality) {
  let { width, height } = img
  if (width > maxDim || height > maxDim) {
    if (width >= height) {
      height = Math.round((height * maxDim) / width)
      width = maxDim
    } else {
      width = Math.round((width * maxDim) / height)
      height = maxDim
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  // White backfill so any transparency flattens cleanly to JPEG
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
