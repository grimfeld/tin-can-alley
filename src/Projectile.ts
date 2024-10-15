export class Projectile extends Phaser.Physics.Arcade.Sprite {
  isDragging: boolean = false
  isThrown: boolean = false
  throwStartTime: number = 0
  throwDuration: number = 1000
  canPopBalloons: boolean = false
  isDestroyed: boolean = false
  private initialPosition: Phaser.Math.Vector2 = new Phaser.Math.Vector2(150, 450)

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)
    this.scene = scene
  }

  create() {
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)

    this.setPosition(this.initialPosition.x, this.initialPosition.y)
    this.setCollideWorldBounds(true)
    this.setDisplaySize(40, 52)
    this.setDepth(3)
    this.setInteractive()

    this.body?.setSize(this.width * 0.25, this.height * 0.25)
    this.body?.setOffset(this.width / 2 - this.width * 0.125, 0)

    this.scene.input.on('pointerdown', this.startDrag, this)
    this.scene.input.on('pointermove', this.doDrag, this)
    this.scene.input.on('pointerup', this.endDrag, this)
  }

  startDrag(pointer: Phaser.Input.Pointer) {
    if (this.isThrown) return
    this.isDragging = true
    this.setImmovable(false)
    this.setGravityY(0)
  }

  doDrag(pointer: Phaser.Input.Pointer) {
    if (this.isDragging) {
      this.x = pointer.x
      this.y = pointer.y
    }
  }

  endDrag() {
    if (this.isDragging) {
      this.isDragging = false
      this.throwDart()
    }
  }

  throwDart() {
    this.setGravity(0, 300)
    this.setVelocity(0, -150)
    this.isThrown = true
    this.throwStartTime = this.scene.time.now
    this.canPopBalloons = false
    this.scene.time.delayedCall(this.throwDuration * 0.95, () => {
      this.canPopBalloons = true
    })
  }

  update(time: number) {
    if (this.isThrown && this.active) {
      const elapsedTime = time - this.throwStartTime
      const progress = elapsedTime / this.throwDuration

      const newScale = Phaser.Math.Linear(1, 0.5, progress)
      this.setScale(newScale)

      const newGravityY = Phaser.Math.Linear(300, 100, progress)
      this.setGravityY(newGravityY)

      if (elapsedTime >= this.throwDuration) {
        this.destroyProjectile()
      }
      if (elapsedTime >= 2000) {
        this.destroy()
      }
    }
  }

  destroyProjectile() {
    this.scene.input.off('pointerdown', this.startDrag, this)
    this.scene.input.off('pointermove', this.doDrag, this)
    this.scene.input.off('pointerup', this.endDrag, this)
    this.isDestroyed = true
    this.setDepth(1)
    this.canPopBalloons = false
  }
}
