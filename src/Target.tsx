import { createCanvasFromSVG, TargetVariant } from './commons'

export class Target extends Phaser.Physics.Arcade.Sprite {
  private color1: string
  private color2: string
  private isBobbing: boolean = false
  private isMoving: boolean = false
  private variant: TargetVariant = TargetVariant.Fixed

  private movementTween: Phaser.Tweens.Tween | null = null

  private bobbingSpeed: number
  private bobbingAmplitude: number
  private bobbingOffset: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    color1?: string,
    color2?: string,
    variant?: TargetVariant
  ) {
    super(scene, x, y, texture)

    this.color1 = color1 ?? 'red'
    this.color2 = color2 ?? 'orange'
    this.variant = variant ?? TargetVariant.Fixed

    // Initialize random bobbing parameters
    this.bobbingSpeed = Phaser.Math.FloatBetween(0.001, 0.003)
    this.bobbingAmplitude = Phaser.Math.FloatBetween(0.1, 0.2)
    this.bobbingOffset = Phaser.Math.FloatBetween(0, Math.PI * 2)
  }

  async create() {
    const code = this.getSvgCode()

    // Wait for the canvas to be created from the SVG
    const canvas = await createCanvasFromSVG(code)

    // Generate a unique texture key for the canvas
    const textureKey = 'targetTexture_' + Phaser.Math.RND.uuid()

    // Check if the texture already exists, if not, add the canvas as a texture
    if (!this.scene.textures.exists(textureKey)) {
      this.scene.textures.addCanvas(textureKey, canvas)
    }

    // Set the texture of this sprite to the newly created texture
    this.setTexture(textureKey)

    // Add the sprite to the scene so it is displayed
    this.scene.add.existing(this)

    // Enable physics for this sprite
    this.scene.physics.add.existing(this)
    this.body?.setSize(this.width, this.height * 0.5)
    this.body?.setOffset(0, 0)
    this.setScale(Phaser.Math.FloatBetween(0.9, 1.1))
  }

  setVerticalMovement(duration: number) {
    if (this.movementTween) {
      this.movementTween.stop()
    }

    this.movementTween = this.scene.tweens.add({
      targets: this,
      y: -Phaser.Math.Between(25, 75),
      duration: duration,
      ease: 'Linear',
      onComplete: () => {
        this.destroy()
      }
    })
  }

  isDestroyed(): boolean {
    return !this.scene || this.active === false
  }

  update(time: number) {
    if (this.isBobbing) {
      const bobbingY =
        Math.sin(time * this.bobbingSpeed + this.bobbingOffset) * this.bobbingAmplitude
      this.y += bobbingY
    }
  }

  getSvgCode() {
    return `
      <svg id="Calque_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 38.99 106.99">
        <defs>
          <style>
            .cls-1 {
              fill: ${this.color1};
            }

            .cls-2 {
              fill: url(#linear-gradient);
            }

            .cls-3 {
              fill: #fff;
            }

            .cls-4 {
              fill: ${this.color2};
            }
          </style>
          <linearGradient id="linear-gradient" x1="3.47" y1="11.16" x2="15.52" y2="11.16" gradientTransform="translate(-2.37 2.49) rotate(-20.53)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#fff" stop-opacity="0"/>
            <stop offset=".08" stop-color="#fff" stop-opacity=".2"/>
            <stop offset=".17" stop-color="#fff" stop-opacity=".39"/>
            <stop offset=".26" stop-color="#fff" stop-opacity=".55"/>
            <stop offset=".36" stop-color="#fff" stop-opacity=".69"/>
            <stop offset=".46" stop-color="#fff" stop-opacity=".8"/>
            <stop offset=".57" stop-color="#fff" stop-opacity=".89"/>
            <stop offset=".68" stop-color="#fff" stop-opacity=".95"/>
            <stop offset=".81" stop-color="#fff" stop-opacity=".99"/>
            <stop offset="1" stop-color="#fff"/>
          </linearGradient>
        </defs>
        <g id="Layer_1">
          <g>
            <path class="cls-3" d="M18.97,56.18c.08,2.02.01,4.04-.35,6.03s-1.14,3.98-1.76,5.97c-.55,1.78-.91,3.66-.46,5.51.37,1.54,1.1,2.95,1.86,4.32,1.63,2.92,3.58,6.06,2.76,9.55s-3.29,5.96-5.05,8.81c-.99,1.6-1.74,3.38-1.51,5.3s1.38,3.71,2.53,5.27c.04.06.28,0,.24-.06-1.08-1.47-2.15-3.07-2.47-4.9s.24-3.52,1.13-5.08c1.67-2.91,4.14-5.41,5.18-8.66s-.29-6.25-1.86-9.04c-.81-1.44-1.66-2.86-2.22-4.42-.67-1.88-.66-3.75-.16-5.68.56-2.15,1.47-4.2,1.93-6.38s.55-4.38.46-6.58c0-.07-.25-.04-.25.03h0Z"/>
            <g>
              <polygon class="cls-1" points="19.76 53.4 21.09 57.69 15.61 57.59 17.74 52.56 19.76 53.4"/>
              <path class="cls-1" d="M0,24.79c-.27,13.9,8.18,28.18,18.94,28.39,10.76.21,19.76-13.73,20.03-27.63C39.25,11.65,30.75.21,19.99,0,9.22-.21.28,10.89,0,24.79Z"/>
              <path class="cls-4" d="M3.81,18.23c0,10.1,6.71,19.56,14.39,19.56s13.91-10.04,13.91-20.14S25.64,1.57,17.95,1.57,3.81,8.13,3.81,18.23Z"/>
              <path class="cls-2" d="M14.59,3.52c-.49.1-.98.24-1.47.42-4.66,1.75-7.31,6.67-6.8,11.88.82-4.7,3.79-9.18,8.27-12.3Z"/>
            </g>
          </g>
        </g>
      </svg>
    `
  }
}
