import { SoundsManager } from './Sounds'
import { ProjectileManager } from './ProjectileManager'
import { TargetVariant } from './commons'
import Phaser from 'phaser'
import { TargetManager } from './TargetManager'
import { Projectile } from './Projectile'
import { Target } from './Target'
import { events } from './Events'

export class DartScene extends Phaser.Scene {
  private targetManager: TargetManager
  private projectileManager!: ProjectileManager
  private emitter!: Phaser.GameObjects.Particles.ParticleEmitter
  private soundsManager: SoundsManager

  constructor() {
    super({ key: 'DartScene' })
    this.soundsManager = new SoundsManager(this)
    this.targetManager = new TargetManager(this, {
      variant: TargetVariant.Vertical,
      limit: 6
    })
  }

  preload() {
    this.load.image('dart', `${process.env.PUBLIC_URL}/assets/dart.png`)

    this.load.spritesheet(
      'green-particles',
      `${process.env.PUBLIC_URL}/assets/green-particles.png`,
      { frameWidth: 50 }
    )
    this.soundsManager.preload()
    this.targetManager.preload()
  }

  create() {
    this.physics.world.setBounds(0, 0, 300, 600)

    this.soundsManager.create()

    this.emitter = this.add.particles(0, 0, 'green-particles', {
      frame: [0, 1, 2, 3],
      lifespan: 4000,
      speed: { min: 150, max: 250 },
      scale: { start: 0.2, end: 0 },
      gravityY: 150,
      blendMode: 'ADD',
      emitting: false
    })
    this.targetManager.create()

    this.projectileManager = new ProjectileManager(this, {
      limit: 10
    })
    this.projectileManager.create()

    // Event listener for stopping the scene
    events.on('projectiles-limit-reached', this.stopScene, this)
  }

  stopScene() {
    // Stop the scene and clean up the event listener
    events.off('projectiles-limit-reached', this.stopScene, this)
    this.scene.stop()
  }

  shutdown() {
    events.off('projectiles-limit-reached', this.stopScene, this)
  }

  update(time: number, delta: number) {
    this.targetManager.update(time)
    this.projectileManager.update(time)

    this.physics.add.overlap(
      this.projectileManager.projectiles,
      this.targetManager.targets,
      (obj1, obj2) => {
        if ((obj1 as Projectile).canPopBalloons) {
          // @ts-ignore
          this.emitter.explode(16, obj2.x, obj2.y)
          this.soundsManager.playPop()
          ;(obj2 as Target).destroy()
          ;(obj1 as Projectile).destroyProjectile()
          ;(obj1 as Projectile).destroy()
        }
      },
      undefined,
      this
    )
  }
}
