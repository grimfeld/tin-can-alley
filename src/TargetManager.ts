import { TargetVariant } from './commons'
import { Target } from './Target'

export interface TargetManagerOptions {
  variant?: TargetVariant
  limit?: number
}

export class TargetManager {
  public targets: Target[] = []
  // private readonly grid: { x: number; y: number }[] = [
  //   { x: 50, y: 100 },
  //   { x: 150, y: 100 },
  //   { x: 250, y: 100 },
  //   { x: 50, y: 300 },
  //   { x: 150, y: 300 },
  //   { x: 250, y: 300 }
  // ]
  private readonly columns: { x: number; lastSpawnTime: number }[] = [
    { x: 50, lastSpawnTime: 0 },
    { x: 150, lastSpawnTime: 0 },
    { x: 250, lastSpawnTime: 0 }
  ]
  // private readonly rows: { y: number }[] = [{ y: 100 }, { y: 300 }]
  private variant: TargetVariant = TargetVariant.Fixed
  private minVerticalDistance: number = 200 // Minimum distance between balloons in the same column
  private spawnInterval: number = 3000 // Minimum time between spawns in the same column

  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene, options?: TargetManagerOptions) {
    this.variant = options?.variant ?? TargetVariant.Fixed
    this.scene = scene
  }

  preload() {}

  spawnTarget(
    scene: Phaser.Scene,
    x: number,
    y: number,
    color1: string,
    color2: string,
    variant: TargetVariant
  ) {
    const target = new Target(scene, x, y, 'balloon', color1, color2, variant)
    target.create()
    this.targets.push(target)
    return target
  }

  spawnFixed() {
    // for (let i = 0; i < count; i++) {
    //   const target = new Target(
    //     scene,
    //     this.grid[i].x,
    //     this.grid[i].y,
    //     'balloon',
    //     '#124f2e',
    //     '#1f6d3e'
    //   )
    //   target.create()
    //   this.targets.push(target)
    // }
  }

  spawnVertical() {
    const spawn = () => {
      const currentTime = this.scene.time.now
      const availableColumns = this.columns.filter((col) => {
        if (col.lastSpawnTime === 0) return true // Handles first spawn
        else return currentTime - col.lastSpawnTime >= this.spawnInterval * 2
      })

      if (availableColumns.length === 0) return

      const column = Phaser.Math.RND.pick(availableColumns)
      const lastBalloonInColumn = this.targets
        .filter((t) => t.x === column.x)
        .sort((a, b) => b.y - a.y)[0]

      let spawnY = this.scene.cameras.main.height + 100

      if (
        lastBalloonInColumn &&
        lastBalloonInColumn.y > this.scene.cameras.main.height - this.minVerticalDistance
      ) {
        spawnY = lastBalloonInColumn.y + this.minVerticalDistance
      }

      const target = this.spawnTarget(
        this.scene,
        column.x,
        spawnY,
        '#124f2e',
        '#1f6d3e',
        TargetVariant.Vertical
      )

      const baseSpeedFactor = Phaser.Math.FloatBetween(0.8, 1.2)

      const distance = spawnY - (this.scene.cameras.main.height - 100)
      const baseDuration = Phaser.Math.Linear(
        5000,
        15000,
        distance / (this.scene.cameras.main.height + 200)
      )
      const duration = baseDuration * baseSpeedFactor

      const finalDuration = Phaser.Math.RND.integerInRange(
        Math.floor(duration * 0.75),
        Math.ceil(duration * 1.25)
      )

      target.setVerticalMovement(finalDuration)

      column.lastSpawnTime = currentTime
    }

    spawn()
    this.scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: spawn
    })
  }

  spawnHorizontal() {}

  create() {
    switch (this.variant) {
      case TargetVariant.Fixed:
        this.spawnFixed()
        break
      case TargetVariant.Vertical:
        this.spawnVertical()
        break
      case TargetVariant.Horizontal:
        this.spawnHorizontal()
        break
    }
  }

  update(time: number) {
    this.targets = this.targets.filter((target) => !target.isDestroyed())
    this.targets.forEach((target) => target.update(time))
  }
}
