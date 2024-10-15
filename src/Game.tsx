import React, { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { DartScene } from './DartScene'

const Game: React.FC = ({}) => {
  const gameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 300,
      height: 600,
      parent: gameRef.current!,
      scene: [DartScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0, x: 0 },
          debug: false
        }
      }
    }

    const game = new Phaser.Game(config)

    return () => {
      game.destroy(true)
    }
  }, [])

  return <div ref={gameRef} />
}

export default Game
