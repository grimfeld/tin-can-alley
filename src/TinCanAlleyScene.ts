import Phaser from 'phaser'

export class TinCanAlleyScene extends Phaser.Scene {
  private cans!: Phaser.Physics.Arcade.StaticGroup
  private ball!: Phaser.Physics.Arcade.Image
  private scoreText!: Phaser.GameObjects.Text
  private score: number = 0
  private canThrow: boolean = true
  private throwPower: number = 0
  private maxThrowPower: number = 1000
  private powerBar!: Phaser.GameObjects.Rectangle
  private ballShadow!: Phaser.GameObjects.Ellipse

  constructor() {
    super({ key: 'TinCanAlleyScene' })
  }

  preload() {
    this.load.image('can', `${process.env.PUBLIC_URL}/assets/can.png`)
    this.load.image('ball', `${process.env.PUBLIC_URL}/assets/ball.png`)
  }

  create() {
    // Set up cans in a pyramid formation
    this.cans = this.physics.add.staticGroup()
    this.setupPyramid()

    // Set up ball
    const gameWidth = this.sys.game.config.width as number
    const gameHeight = this.sys.game.config.height as number
    this.ball = this.physics.add.image(gameWidth / 2, gameHeight - 100, 'ball')
    this.ball.setDisplaySize(50, 50)
    this.ball.setCollideWorldBounds(true)
    this.ball.setBounce(0.2)

    // Set up ball shadow
    this.ballShadow = this.add.ellipse(this.ball.x, gameHeight - 20, 20, 10, 0x000000, 0.3)

    // Set up score
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', color: '#000' })

    // Set up collision
    // @ts-ignore
    this.physics.add.collider(this.ball, this.cans, this.hitCan, undefined, this)

    // Set up input
    this.input.on('pointerdown', this.startThrow, this)
    this.input.on('pointerup', this.releaseThrow, this)

    // Set up power bar
    this.powerBar = this.add.rectangle(gameWidth / 2 - 100, gameHeight - 50, 200, 20, 0xff0000)
    this.powerBar.setOrigin(0, 0.5)
    this.powerBar.setScale(0, 1)
  }

  setupPyramid() {
    const canWidth = 50 // Adjust based on your can image size
    const canHeight = 80 // Adjust based on your can image size
    const startX = (this.sys.game.config.width as number) / 2 // Center of the screen
    const startY = 100 // Top of the screen
    const rows = 3 // Number of rows in the pyramid

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col <= row; col++) {
        const x = startX + (col - row / 2) * canWidth
        const y = startY + row * canHeight
        this.cans.create(x, y, 'can')
      }
    }
    // @ts-ignore
    this.cans.getChildren().forEach((can: Phaser.Physics.Arcade.Image) => {
      can.setDisplaySize(canWidth, canHeight)
      can.setImmovable(true)
    })
  }

  hitCan(ball: Phaser.GameObjects.GameObject, can: Phaser.GameObjects.GameObject) {
    if (can instanceof Phaser.Physics.Arcade.Image) {
      can.disableBody(true, true)
      this.score += 10
      this.scoreText.setText('Score: ' + this.score)
    }
  }

  startThrow() {
    if (this.canThrow) {
      this.throwPower = 0
    }
  }

  releaseThrow() {
    if (this.canThrow) {
      const targetY = this.input.activePointer.y
      const angle = Phaser.Math.Angle.Between(this.ball.x, this.ball.y, this.ball.x, targetY)
      const velocity = new Phaser.Math.Vector2()
      this.physics.velocityFromRotation(angle, this.throwPower, velocity)
      this.ball.setVelocity(velocity.x, velocity.y)
      this.canThrow = false
      this.powerBar.setScale(0, 1)
    }
  }

  update(time: number, delta: number) {
    const gameHeight = this.sys.game.config.height as number

    if (this.canThrow && this.input.activePointer.isDown) {
      this.throwPower += delta * 0.5
      if (this.throwPower > this.maxThrowPower) {
        this.throwPower = this.maxThrowPower
      }
      this.powerBar.setScale(this.throwPower / this.maxThrowPower, 1)
    }

    if (this.ball.body) {
      // Update ball shadow position and scale
      const shadowScale = 1 - this.ball.y / gameHeight
      this.ballShadow.setPosition(this.ball.x, gameHeight - 20)
      this.ballShadow.setScale(shadowScale)

      // Check if ball has stopped
      if (!this.canThrow && this.ball.body.velocity.length() < 10) {
        this.resetBall()
      }
    }
  }

  resetBall() {
    this.ball.setVelocity(0, 0)
    const gameWidth = this.sys.game.config.width as number
    const gameHeight = this.sys.game.config.height as number
    this.ball.setPosition(gameWidth / 2, gameHeight - 100)
    this.ballShadow.setPosition(this.ball.x, gameHeight - 20)
    this.ballShadow.setScale(1)
    this.canThrow = true
  }
}
