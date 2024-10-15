import { events } from './Events'
import { Projectile } from './Projectile'

export interface ProjectileManagerOptions {
  limit?: number
}

export class ProjectileManager {
  public projectiles: Projectile[] = []
  private scene: Phaser.Scene
  private limit: number
  private limitText!: Phaser.GameObjects.Text
  private limitReached: boolean = false

  constructor(scene: Phaser.Scene, options: ProjectileManagerOptions) {
    this.scene = scene
    this.limit = options.limit ?? 0
  }

  create() {
    this.spawn()
    if (this.limit > 1) {
      this.setupRemainingText()
    }
  }

  setupRemainingText() {
    this.scene.add
      .image(this.scene.cameras.main.width - 60, this.scene.cameras.main.height - 25, 'dart')
      .setDisplaySize(20, 26)
      .setDepth(5)
    this.limitText = this.scene.add
      .text(
        this.scene.cameras.main.width - 40,
        this.scene.cameras.main.height - 35,
        `${this.limit}`,
        {
          fontSize: '24px',
          color: 'white'
        }
      )
      .setDepth(5)
  }

  spawn() {
    const projectile = new Projectile(this.scene, 150, 450, 'dart')
    projectile.create()
    this.projectiles.push(projectile)
  }

  shouldSpawn() {
    return (
      this.projectiles.filter((projectile) => !projectile.isDestroyed).length < 1 &&
      this.projectiles.length < this.limit
    )
  }

  update(time: number) {
    this.projectiles.forEach((projectile) => {
      projectile.update(time)
    })
    if (this.shouldSpawn()) {
      this.spawn()
    }
    if (this.limit > 1) {
      this.limitText.setText(`${this.limit - this.projectiles.length}`)
    }
    if (!this.limitReached && this.projectiles.length >= this.limit) {
      events.emit('projectiles-limit-reached')
      this.limitReached = true
    }
  }
}
