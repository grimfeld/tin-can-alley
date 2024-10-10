import { Projectile } from './Projectile'

export interface ProjectileManagerOptions {
  limit?: number
}

export class ProjectileManager {
  public projectiles: Projectile[] = []
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene, options: ProjectileManagerOptions) {
    this.scene = scene
  }

  create() {
    this.spawn()
  }

  spawn() {
    const projectile = new Projectile(this.scene, 150, 450, 'dart')
    projectile.create()
    this.projectiles.push(projectile)
  }

  shouldSpawn() {
    return this.projectiles.filter((projectile) => !projectile.isDestroyed()).length < 1
  }

  update(time: number) {
    this.projectiles.forEach((projectile) => {
      projectile.update(time)
    })
    if (this.shouldSpawn()) {
      this.spawn()
    }
  }
}
