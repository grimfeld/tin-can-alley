import { ProjectileManager } from './ProjectileManager'
import { TargetVariant } from './commons'
import Phaser from 'phaser'
import { TargetManager } from './TargetManager'
import { Projectile } from './Projectile'
import { Target } from './Target'

export class DartScene extends Phaser.Scene {
  private targetManager!: TargetManager
  private projectileManager!: ProjectileManager

  constructor() {
    super({ key: 'DartScene' })
  }

  preload() {
    this.load.image('dart', `${process.env.PUBLIC_URL}/assets/dart.png`)
    this.load.image('balloon', `${process.env.PUBLIC_URL}/assets/green-balloon.png`)
  }

  create() {
    this.physics.world.setBounds(0, 0, 300, 600)

    this.targetManager = new TargetManager(this, {
      variant: TargetVariant.Vertical,
      limit: 6
    })
    this.targetManager.create()
    this.projectileManager = new ProjectileManager(this, {
      limit: 1
    })
    this.projectileManager.create()
  }

  update(time: number, delta: number) {
    this.targetManager.update(time)
    this.projectileManager.update(time)

    this.physics.add.overlap(
      this.projectileManager.projectiles,
      this.targetManager.targets,
      (obj1, obj2) => {
        if ((obj1 as Projectile).canPopBalloons) {
          ;(obj2 as Target).destroy()
        }
      },
      undefined,
      this
    )
  }
}
