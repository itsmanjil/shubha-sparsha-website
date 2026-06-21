// Compresses an image in the browser before upload: resizes to a max dimension
// and re-encodes as JPEG. A 16 MB camera photo typically drops to a few hundred KB
// with no visible quality loss in the gallery. Keeps Supabase storage small and the
// site fast, and avoids the bucket's per-file size limit.
//
// GIFs and SVGs are returned untouched (compressing them would break animation /
// vector quality). If compression doesn't actually shrink the file, the original
// is returned.
export async function compressImage(file, { maxDim = 1600, quality = 0.82 } = {}) {
  if (!file || !file.type.startsWith('image/')) return file
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file

  try {
    const dataUrl = await readAsDataURL(file)
    const img = await loadImage(dataUrl)

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

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    )
    if (!blob || blob.size >= file.size) return file

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([blob], newName, { type: 'image/jpeg', lastModified: Date.now() })
  } catch {
    // If anything goes wrong, fall back to the original file
    return file
  }
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
