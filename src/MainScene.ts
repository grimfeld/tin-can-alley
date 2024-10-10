import Phaser from 'phaser'

interface MainSceneConfig {
  onScoreUpdate: (score: number) => void
}

export class MainScene extends Phaser.Scene {
  private onScoreUpdate: (score: number) => void
  private score: number = 0

  constructor(config: MainSceneConfig) {
    super({ key: 'MainScene' })
    this.onScoreUpdate = config.onScoreUpdate
  }

  preload() {
    // Load assets here
    this.load.image('can', 'assets/can.png')
    this.load.image('ball', 'assets/ball.png')
  }

  create() {
    // Create cans
    const cans = this.physics.add.staticGroup()
    cans.create(400, 300, 'can')
    // Stack more cans as needed

    // Create ball
    const ball = this.physics.add.image(400, 550, 'ball').setInteractive()

    // Enable dragging the ball
    this.input.setDraggable(ball)

    // Drag events
    ball.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      ball.x = dragX
      ball.y = dragY
    })

    ball.on('dragend', (pointer: Phaser.Input.Pointer) => {
      // Calculate velocity based on drag distance and time
      const velocityX = (ball.x - pointer.downX) * -2
      const velocityY = (ball.y - pointer.downY) * -2
      ball.body.setVelocity(velocityX, velocityY)
    })

    // Collision between ball and cans
    this.physics.add.collider(ball, cans, (ball, can) => {
      can.destroy() // Remove the can when hit
      this.score += 10
      this.onScoreUpdate(this.score)
    })
  }
}

export default MainScene
