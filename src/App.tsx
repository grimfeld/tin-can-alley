import React, { useState } from 'react'
import Game from './Game'
import Score from './Score'

const App: React.FC = () => {
  const [score, setScore] = useState(0)

  // Logic to update score based on game events

  return (
    <div>
      <Score score={score} />
      <Game onScoreUpdate={setScore} />
    </div>
  )
}

export default App
