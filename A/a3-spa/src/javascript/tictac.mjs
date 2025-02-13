/*nq222af*/

/**
 * Represents a Tic-Tac-Toe game with functionality to handle game logic, user interactions, 
 * and render the game board.
 */
export default class tictac {

  game_division = document.createElement('div')
  game = document.createElement('div')
  userAttempts = document.createElement('div')
  attempts = document.createElement('p')


  board = Array(9).fill(null)
  isGameOver = false
  index = 0
  mode = 'PvP'
  playerNames = { 'X': 'Player 1', 'O': 'Player 2' };
  playerScores = { 'X': 0, 'O': 0 }

  /**
   * Constructs a new Tic-Tac-Toe game instance.
   */
  constructor () {
    this.game_division.classList.add('gameDiv')
    this.game_division.tabIndex = 0
    this.game.classList.add('game')
    this.userAttempts.classList.add('attemps')
    this.userAttempts.appendChild(this.attempts)
    this.game_division.appendChild(this.userAttempts)
    this.game_division.appendChild(this.game)
    this.createControlPanel()
    this.game_division.addEventListener('keydown', this.handleKey.bind(this))
  }

  createControlPanel() {
    const controlPanel = document.createElement('div');
    controlPanel.classList.add('control-panel');
    this.controlPanel = controlPanel; // Store reference to controlPanel

    const startButton = document.createElement('button');
    startButton.textContent = 'Start Game';
    startButton.id = 'startButton'

    const quitButton = document.createElement('button');
    quitButton.textContent = 'Quit';
    quitButton.id = 'quitButton'
    quitButton.style.display = 'none'; // Initially hide the quit button

    // Define the Start Game button click event
    startButton.addEventListener('click', () => {
        this.startGame();
        startButton.style.display = 'none'; // Hide the start button
        quitButton.style.display = 'block'; // Show the quit button
    });

    const scoreDisplay = document.createElement('p');
    scoreDisplay.textContent = `Score: ${this.playerNames['X']}: ${this.playerScores['X']} | ${this.playerNames['O']}: ${this.playerScores['O']}`;

    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart';
    restartButton.addEventListener('click', () => this.resetGame());

    quitButton.addEventListener('click', () => this.quitGame());

    controlPanel.appendChild(startButton);
    controlPanel.appendChild(scoreDisplay);
    controlPanel.appendChild(restartButton);
    controlPanel.appendChild(quitButton);

    this.gameStarted = false
    this.game_division.appendChild(controlPanel);
    this.GameBoard();
}

  
  /**
   * Sets up the game board with clickable cells.
   */
  GameBoard (){
    this.game.innerHTML = ''
    for (let i = 0; i < 9; i++) {
      const cells = document.createElement('div')
      cells.classList.add('cells')
      cells.tabIndex = 0
      cells.addEventListener('click', () => this.handleClick(i))
      cells.addEventListener('keydown', (e) => this.handleKey(e, i))
      this.game.appendChild(cells)
    }
  }

  /**
   * Handles clicked events on game cells.
   * @param {number} cellindex - index of clicked cell.
   */
  handleClick(cellindex) {
    if (!this.gameStarted || this.isGameOver || this.board[cellindex]) {
      return
    }
    this.board[cellindex] = this.currentPlayer
    this.updateBoard()
    if (this.checkWinner()) {
      this.attempts.innerHTML = `Player ${this.currentPlayer} Wins!`
      this.isGameOver = true
      return
    }
    this.swicthPlayer()
  }

  /**
   * Handles key events for game cells.
   * @param {Event} e - object associated with the key event.
   * @param {number} cellindex - index of cell related to key event.
   */
  handleKey (e, cellindex) {

    if (this.game.children[this.index]) {
     this.game.children[this.index].classList.remove('focus-cell')   
    }

    switch(e.key) {
      case 'ArrowUp':
        if (cellindex > 2) this.focusCell(cellindex - 3)
        break
      case 'ArrowDown':
        if (cellindex < 6) this.focusCell(cellindex + 3)
        break
      case 'ArrowLeft':
        if (cellindex % 3 !== 0) this.focusCell(cellindex - 1)
        break
      case 'ArrowRight':
        if ((cellindex + 1) % 3  !== 0)  this.focusCell(cellindex + 1)
        break
      case 'Enter':
        this.handleClick(cellindex)
        break
      default:
        break
    }

    this.focusCell(this.index)

  }

  /**
   * focuses on a specific cell.
   * Based on its index number.
   * @param {number} cellindex - index of cell to focus.
   */
  focusCell (cellindex) {
    this.index = cellindex
    const cell = this.game.children[cellindex]
    if (cell) {
      cell.focus()
      cell.classList.add('focus-cell')
    }
  }

  /**
   * Updates the game board with the current state of the game.
   */
  updateBoard() {
    this.board.forEach((cells, i) => {
      this.game.children[i].textContent = cells
    })
  }

  /**
   * Returns the game division.
   * @returns {HTMLElement} The game eements.
   */
  getDiv() {
    return this.game_division
  }

  /**
   * @description switching between players turn.
   */
  swicthPlayer () {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'
    this.attempts.innerHTML = `Current Player: ${this.currentPlayer}`
  }

  /**
   * Checks for the winner, through the pattern given.
   * @returns {boolean} checks if patterns matched  true or false.
   */
  checkWinner () {
    const winPatterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8]
    , [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]]

    if (winPatterns.some(pattern => pattern.every(index => this.board[index] === this.currentPlayer))) {
      this.attempts.innerHTML = `Player ${this.currentPlayer} Wins!`
      this.isGameOver = true
      
      document.getElementById('startButton').style.display = 'block'
      this.playerScores[this.currentPlayer]++
  
      //this.controlPanel.querySelector('button[text="Start Game"]').style.display = 'block';
      this.controlPanel.querySelector('p').textContent = `Score:  ${this.playerNames['X']}: ${this.playerScores['X']} | ${this.playerNames['O']}: ${this.playerScores['O']}`
  
      return true;
    }
    return false
  }

  /**
   * Resets the game.
   */
  resetGame() {
    this.board.fill(null)
    this.updateBoard()
    this.currentPlayer = 'X'
    this.isGameOver = false
    this.attempts.innerHTML = 'Current Player: X'
  }

  /**
   * Starts new, and resets the board to game state mode.
   */
  startGame() {
    this.resetBoard()
    this.isGameOver = false
    this.gameStarted = true
    this.updateBoard()
    this.attempts.innerHTML = `Current Player: ${this.currentPlayer}`
    this.focusCell(0)
  }

  /**
   * restarts and resets/updates the board of game.
   */
  restartGame() {
    this.resetBoard()
    this.updateBoard()
    this.attempts.innerHTML = 'Game restarted. Current Player: X'
  }

  /**
   * quits the game goes back to first state of game.
   */
  quitGame() {
    this.resetBoard()
    this.updateBoard()
    this.isGameOver = true
    this.playerScores = { 'X': 0, 'O': 0 }

    const scoreDisplay = this.controlPanel.querySelector('p')
    if (scoreDisplay) {
      scoreDisplay.textContent = `Score: ${this.playerNames['X']}: ${this.playerScores['X']} | ${this.playerNames['O']}: ${this.playerScores['O']}`
    }

    this.attempts.innerHTML = 'Game quit. Press Start to play again.'
    document.getElementById('startButton').style.display = 'block'
    this.controlPanel.querySelector('#startButton').style.display = 'block'
    this.controlPanel.querySelector('#quitButton').style.display = 'none'
    this.gameStarted = false
  }

  /**
   * Resets the actual board of game.
   */
  resetBoard() {
    this.board.fill(null)
    this.currentPlayer = 'X'
  }
  
}