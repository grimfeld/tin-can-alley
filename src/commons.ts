export async function createCanvasFromSVG(svgCode: string): Promise<HTMLCanvasElement> {
  // Create an image and set the SVG data as its source
  const img = new Image()
  const svgBlob = new Blob([svgCode], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(svgBlob)

  // Create a canvas element to render the SVG
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  return new Promise((resolve) => {
    img.onload = () => {
      // Set canvas size to match the SVG dimensions
      canvas.width = img.width
      canvas.height = img.height

      // Draw the SVG image onto the canvas
      ctx?.drawImage(img, 0, 0)

      // Release the object URL
      URL.revokeObjectURL(url)

      resolve(canvas)
    }

    img.src = url
  })
}

export enum TargetVariant {
  Fixed = 'fixed',
  Vertical = 'vertical',
  Horizontal = 'horizontal'
}
