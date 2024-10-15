export class SoundsManager {
  private readonly scene: Phaser.Scene
  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  preload() {
    this.scene.load.audio('pop', `${process.env.PUBLIC_URL}/assets/pop.wav`)
  }

  create() {
    this.scene.sound.add('pop')
  }

  playPop() {
    this.scene.sound.play('pop')
  }
}
