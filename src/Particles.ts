export class ParticlesManager {
  private readonly scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }
}

export class Particle {
  private readonly color: string
  constructor(color: string) {
    this.color = color
  }

  getSvgCode() {
    return `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#${this.color}" />
      </svg>

    `
  }
}
