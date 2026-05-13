<script setup lang="ts">
type Point2 = readonly [number, number]
type Point3 = readonly [number, number, number]

type Glyph = {
  character: string
  vector: number[]
}

const canvas = ref<HTMLCanvasElement | null>(null)

const CELL_WIDTH = 6
const CELL_HEIGHT = 12
const FONT_SIZE = 12
const GLYPH_SCALE = 4
const CONTRAST_EXPONENT = 1.55
const CACHE_BITS = 4
const CACHE_RANGE = 1 << CACHE_BITS
const MAX_DEVICE_PIXEL_RATIO = 2

const ASCII_CHARACTERS = [
  ' ',
  '.',
  '`',
  "'",
  '"',
  ':',
  ';',
  ',',
  '_',
  '-',
  '~',
  '^',
  '=',
  '+',
  '<',
  '>',
  'i',
  '!',
  'l',
  'I',
  '?',
  '/',
  '\\',
  '|',
  '(',
  ')',
  '[',
  ']',
  '{',
  '}',
  't',
  'f',
  'j',
  'r',
  'x',
  'n',
  'u',
  'v',
  'c',
  'z',
  'X',
  'Y',
  'U',
  'J',
  'C',
  'L',
  'Q',
  '0',
  'O',
  'Z',
  'm',
  'w',
  'q',
  'p',
  'd',
  'b',
  'k',
  'h',
  'a',
  'o',
  '*',
  '#',
  'M',
  'W',
  '&',
  '8',
  '%',
  'B',
  '@',
  '$',
]

const SAMPLE_POINTS: Point2[] = [
  [0.32, 0.2],
  [0.68, 0.16],
  [0.32, 0.52],
  [0.68, 0.48],
  [0.32, 0.84],
  [0.68, 0.8],
]

const SAMPLE_OFFSETS: Point2[] = [
  [0, 0],
  [0.7, 0],
  [-0.7, 0],
  [0, 0.7],
  [0, -0.7],
  [0.5, 0.5],
  [-0.5, 0.5],
  [0.5, -0.5],
  [-0.5, -0.5],
]

const VERTICES: Point3[] = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
]

const FACES = [
  { indices: [0, 3, 2, 1], normal: [0, 0, -1] as Point3 },
  { indices: [4, 5, 6, 7], normal: [0, 0, 1] as Point3 },
  { indices: [0, 4, 7, 3], normal: [-1, 0, 0] as Point3 },
  { indices: [1, 2, 6, 5], normal: [1, 0, 0] as Point3 },
  { indices: [0, 1, 5, 4], normal: [0, -1, 0] as Point3 },
  { indices: [3, 7, 6, 2], normal: [0, 1, 0] as Point3 },
]

const LIGHT_DIRECTION = normalize([-0.32, -0.58, 0.75])

let outputContext: CanvasRenderingContext2D | null = null
let sceneCanvas: HTMLCanvasElement | null = null
let sceneContext: CanvasRenderingContext2D | null = null
let resizeObserver: ResizeObserver | null = null
let motionQuery: MediaQueryList | null = null
let animationFrame = 0
let width = 0
let height = 0
let columns = 0
let rows = 0
let fontFamily = 'monospace'
let foreground = '#000'
let glyphs: Glyph[] = []
let lookupCache = new Map<number, string>()

onMounted(() => {
  const element = canvas.value

  if (!element) {
    return
  }

  outputContext = element.getContext('2d')
  sceneCanvas = document.createElement('canvas')
  sceneContext = sceneCanvas.getContext('2d', { willReadFrequently: true })

  if (!outputContext || !sceneContext) {
    return
  }

  readCanvasStyles(element)
  glyphs = createGlyphAtlas(fontFamily)

  resizeObserver = new ResizeObserver(() => resizeCanvas())
  resizeObserver.observe(element)

  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionQuery.addEventListener('change', handleMotionPreferenceChange)

  void document.fonts?.ready.then(() => {
    readCanvasStyles(element)
    glyphs = createGlyphAtlas(fontFamily)
    lookupCache = new Map()
    drawFrame(performance.now())
  })

  resizeCanvas()
  startAnimation()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame)
  resizeObserver?.disconnect()
  motionQuery?.removeEventListener('change', handleMotionPreferenceChange)
})

function handleMotionPreferenceChange() {
  startAnimation()
}

function startAnimation() {
  cancelAnimationFrame(animationFrame)

  if (motionQuery?.matches) {
    drawFrame(1400)
    return
  }

  const tick = (time: number) => {
    drawFrame(time)
    animationFrame = requestAnimationFrame(tick)
  }

  animationFrame = requestAnimationFrame(tick)
}

function readCanvasStyles(element: HTMLCanvasElement) {
  const styles = getComputedStyle(element)

  fontFamily = styles.fontFamily || 'monospace'
  foreground = styles.color || '#000'
}

function resizeCanvas() {
  const element = canvas.value

  if (!element || !outputContext || !sceneCanvas) {
    return
  }

  const rect = element.getBoundingClientRect()
  const nextWidth = Math.max(160, Math.floor(rect.width))
  const nextHeight = Math.max(120, Math.floor(rect.height))
  const pixelRatio = Math.min(
    window.devicePixelRatio || 1,
    MAX_DEVICE_PIXEL_RATIO,
  )

  width = nextWidth
  height = nextHeight
  columns = Math.max(1, Math.floor(width / CELL_WIDTH))
  rows = Math.max(1, Math.floor(height / CELL_HEIGHT))

  element.width = Math.floor(width * pixelRatio)
  element.height = Math.floor(height * pixelRatio)
  outputContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  outputContext.imageSmoothingEnabled = false

  sceneCanvas.width = width
  sceneCanvas.height = height
  lookupCache = new Map()

  drawFrame(performance.now())
}

function drawFrame(time: number) {
  if (!outputContext || !sceneContext || !width || !height || !glyphs.length) {
    return
  }

  drawSourceCube(time)

  const scene = sceneContext.getImageData(0, 0, width, height).data
  const gridWidth = columns * CELL_WIDTH
  const gridHeight = rows * CELL_HEIGHT
  const offsetX = (width - gridWidth) / 2
  const offsetY = (height - gridHeight) / 2

  outputContext.clearRect(0, 0, width, height)
  outputContext.font = `${FONT_SIZE}px ${fontFamily}`
  outputContext.fillStyle = foreground
  outputContext.textAlign = 'center'
  outputContext.textBaseline = 'middle'

  for (let row = 0; row < rows; row++) {
    const y = offsetY + row * CELL_HEIGHT

    for (let column = 0; column < columns; column++) {
      const x = offsetX + column * CELL_WIDTH
      const vector = enhanceContrast(sampleSceneVector(scene, x, y))
      const character = findBestCharacter(vector)

      if (character !== ' ') {
        outputContext.fillText(
          character,
          x + CELL_WIDTH / 2,
          y + CELL_HEIGHT / 2,
        )
      }
    }
  }
}

function drawSourceCube(time: number) {
  if (!sceneContext) {
    return
  }

  const seconds = time / 1000
  const angleX = seconds * 0.58 + 0.28
  const angleY = seconds * 0.78 + 0.54
  const angleZ = seconds * 0.24
  const cubeSize = Math.min(width, height) * 0.78
  const cameraDistance = 4.4
  const centerX = width / 2
  const centerY = height / 2

  const rotated = VERTICES.map((vertex) =>
    rotate(vertex, angleX, angleY, angleZ),
  )
  const projected = rotated.map(([x, y, z]) => {
    const scale = cubeSize / (cameraDistance - z)

    return {
      x: centerX + x * scale,
      y: centerY + y * scale,
      z,
    }
  })

  const faces = FACES.map((face) => {
    const points = face.indices.map((index) => projected[index]!)
    const normal = rotate(face.normal, angleX, angleY, angleZ)
    const light = Math.max(0, dot(normal, LIGHT_DIRECTION))
    const shade = Math.round((0.2 + light * 0.74) * 255)
    const depth = face.indices.reduce(
      (sum, index) => sum + rotated[index]![2],
      0,
    )

    return {
      points,
      shade,
      depth,
    }
  }).sort((a, b) => a.depth - b.depth)

  sceneContext.fillStyle = 'black'
  sceneContext.fillRect(0, 0, width, height)
  sceneContext.lineWidth = 1.25
  sceneContext.lineJoin = 'round'

  for (const face of faces) {
    sceneContext.beginPath()
    const [firstPoint] = face.points

    if (!firstPoint) {
      continue
    }

    sceneContext.moveTo(firstPoint.x, firstPoint.y)

    for (let index = 1; index < face.points.length; index++) {
      const point = face.points[index]

      if (point) {
        sceneContext.lineTo(point.x, point.y)
      }
    }

    sceneContext.closePath()
    sceneContext.fillStyle = `rgb(${face.shade} ${face.shade} ${face.shade})`
    sceneContext.strokeStyle = 'rgb(255 255 255)'
    sceneContext.fill()
    sceneContext.stroke()
  }
}

function createGlyphAtlas(family: string): Glyph[] {
  const glyphWidth = CELL_WIDTH * GLYPH_SCALE
  const glyphHeight = CELL_HEIGHT * GLYPH_SCALE
  const glyphCanvas = document.createElement('canvas')
  const glyphContext = glyphCanvas.getContext('2d', {
    willReadFrequently: true,
  })

  glyphCanvas.width = glyphWidth
  glyphCanvas.height = glyphHeight

  if (!glyphContext) {
    return [{ character: ' ', vector: SAMPLE_POINTS.map(() => 0) }]
  }

  const rawGlyphs = ASCII_CHARACTERS.map((character) => {
    glyphContext.clearRect(0, 0, glyphWidth, glyphHeight)
    glyphContext.font = `${FONT_SIZE * GLYPH_SCALE}px ${family}`
    glyphContext.fillStyle = 'white'
    glyphContext.textAlign = 'center'
    glyphContext.textBaseline = 'middle'
    glyphContext.fillText(character, glyphWidth / 2, glyphHeight / 2)

    const data = glyphContext.getImageData(0, 0, glyphWidth, glyphHeight).data
    const vector = SAMPLE_POINTS.map(([x, y]) =>
      sampleBuffer(
        data,
        glyphWidth,
        glyphHeight,
        x * glyphWidth,
        y * glyphHeight,
        3.1,
        true,
      ),
    )

    return {
      character,
      vector,
    }
  })

  const maximums = SAMPLE_POINTS.map((_, index) =>
    Math.max(...rawGlyphs.map((glyph) => glyph.vector[index] ?? 0), 0.001),
  )

  return rawGlyphs.map((glyph) => ({
    character: glyph.character,
    vector: glyph.vector.map((value, index) => value / (maximums[index] ?? 1)),
  }))
}

function sampleSceneVector(
  scene: Uint8ClampedArray,
  x: number,
  y: number,
): number[] {
  const radius = Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.25

  return SAMPLE_POINTS.map(([pointX, pointY]) =>
    sampleBuffer(
      scene,
      width,
      height,
      x + pointX * CELL_WIDTH,
      y + pointY * CELL_HEIGHT,
      radius,
      false,
    ),
  )
}

function sampleBuffer(
  data: Uint8ClampedArray,
  bufferWidth: number,
  bufferHeight: number,
  x: number,
  y: number,
  radius: number,
  sampleAlpha: boolean,
): number {
  let total = 0
  let count = 0

  for (const [offsetX, offsetY] of SAMPLE_OFFSETS) {
    const px = Math.round(x + offsetX * radius)
    const py = Math.round(y + offsetY * radius)

    if (px < 0 || px >= bufferWidth || py < 0 || py >= bufferHeight) {
      continue
    }

    const index = (py * bufferWidth + px) * 4

    total += sampleAlpha
      ? (data[index + 3] ?? 0) / 255
      : getRelativeLuminance(
          data[index] ?? 0,
          data[index + 1] ?? 0,
          data[index + 2] ?? 0,
        )
    count++
  }

  return count > 0 ? total / count : 0
}

function enhanceContrast(vector: number[]): number[] {
  const maximum = Math.max(...vector)

  if (maximum < 0.001) {
    return vector
  }

  return vector.map(
    (value) => Math.pow(value / maximum, CONTRAST_EXPONENT) * maximum,
  )
}

function findBestCharacter(vector: number[]): string {
  const cacheKey = getCacheKey(vector)
  const cachedCharacter = lookupCache.get(cacheKey)

  if (cachedCharacter) {
    return cachedCharacter
  }

  let bestCharacter = ' '
  let bestDistance = Infinity

  for (const glyph of glyphs) {
    let distance = 0

    for (let index = 0; index < vector.length; index++) {
      const diff = (vector[index] ?? 0) - (glyph.vector[index] ?? 0)
      distance += diff * diff

      if (distance >= bestDistance) {
        break
      }
    }

    if (distance < bestDistance) {
      bestDistance = distance
      bestCharacter = glyph.character
    }
  }

  lookupCache.set(cacheKey, bestCharacter)

  return bestCharacter
}

function getCacheKey(vector: number[]): number {
  let key = 0

  for (const value of vector) {
    const quantized = Math.max(
      0,
      Math.min(CACHE_RANGE - 1, Math.floor(value * CACHE_RANGE)),
    )

    key = (key << CACHE_BITS) | quantized
  }

  return key
}

function rotate(
  [x, y, z]: Point3,
  angleX: number,
  angleY: number,
  angleZ: number,
): Point3 {
  const cosX = Math.cos(angleX)
  const sinX = Math.sin(angleX)
  const cosY = Math.cos(angleY)
  const sinY = Math.sin(angleY)
  const cosZ = Math.cos(angleZ)
  const sinZ = Math.sin(angleZ)

  const y1 = y * cosX - z * sinX
  const z1 = y * sinX + z * cosX
  const x2 = x * cosY + z1 * sinY
  const z2 = -x * sinY + z1 * cosY
  const x3 = x2 * cosZ - y1 * sinZ
  const y3 = x2 * sinZ + y1 * cosZ

  return [x3, y3, z2]
}

function normalize([x, y, z]: Point3): Point3 {
  const length = Math.hypot(x, y, z) || 1

  return [x / length, y / length, z / length]
}

function dot(a: Point3, b: Point3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

function getRelativeLuminance(
  red: number,
  green: number,
  blue: number,
): number {
  return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255
}
</script>

<template>
  <canvas ref="canvas" aria-label="spinning ASCII cube" role="img" />
</template>
