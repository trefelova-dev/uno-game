import GameBoard from './components/GameBoard'

function App() {
  return (
    <div className="App">
      <div className="mobile-orientation-lock">
        <div className="lock-card">
          <div className="lock-icon">📱 ➔ 💻</div>
          <h2 className="lock-title">UNO требует пространства!</h2>
          <p className="lock-text">
            Пожалуйста, откройте игру с компьютера или ноутбука <br />
            <span>(или поверните экран горизонтально)</span>
          </p>
        </div>
      </div>

      <div className="game-wrapper">
        <GameBoard />
      </div>
    </div>
  )
}

export default App