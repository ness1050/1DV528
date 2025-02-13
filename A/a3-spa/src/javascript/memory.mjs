/*nq222af */

/**
 * Represents a Memory game and its functionality to handle game setup.
 * Game logic and userinteraction.
 */
export default class Memory {

  game_division = document.createElement('div')
  game = document.createElement('div')
  startDivision = document.createElement('div')
  userAttemps = document.createElement('div')
  attemps = document.createElement('p')

  images = ['1.png','2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png']
  imgId = [0, 1, 2, 3, 4, 5, 6, 7]
  path = './img/'

  count = 0
  size = 0
  flipped = 0
  index = 0

  flipedCard = true
  startButtons = []
  currentCard = null
  openCard = null

  /**
   * Constructs a new Memory game instance.
   */
  constructor () {
    this.game_division.classList.add('game_division')
    this.game.classList.add('memoryGame')
    this.userAttemps.classList.add('Attemps')
    this.attemps.style.color = 'white'
    this.attemps.innerHTML = `User attemps: ${this.count}`
    this.userAttemps.appendChild(this.attemps)
    this.startDivision.classList.add('startDiv')
    this.createStartdiv()
  }

  /**
   * Creates the start division of the game with options of game levels.
   */
  createStartdiv() {

    this.game_division.replaceChildren()
    this.startDivision.replaceChildren()

    const logo = document.createElement('img')
    logo.classList.add('logo')
    logo.src = './img/memory.png'
    this.startDivision.appendChild(logo)

    const sizeSelection = document.createElement('select')
    sizeSelection.classList.add('grid')

    const opitions = [
      { text: 'Easy', value: '2' },
      { text: 'Medium', value: '3' },
      { text: 'Challenging', value: '4' }
    ]

    opitions.forEach(opt => {
      const optionElement = document.createElement('option')
      optionElement.value = opt.value
      optionElement.textContent = opt.text
      sizeSelection.appendChild(optionElement)
    })

    this.startDivision.appendChild(sizeSelection)

    const startGameButton = document.createElement('button')
    startGameButton.textContent = 'Start Game'
    startGameButton.onclick = () => this.startGame(sizeSelection.value)
    this.startDivision.appendChild(startGameButton)
    this.game_division.appendChild(this.startDivision)
  }

  /**
   * Starts the game with the selected difficulty level.
   * @param {string} selectedSize - The selected size of grid.
   */
  startGame(selectedSize) {
    this.game_division.replaceChildren()
    this.game.replaceChildren()
    this.game.style.display = 'grid'
  
    if (selectedSize === '2') {
      this.size = 2;
      this.game.style.gridTemplateColumns = 'repeat(2, 1fr)'
    } else if (selectedSize === '3') {
  
      this.size = Math.floor(3) * 2;
      this.game.style.gridTemplateColumns = 'repeat(3, 1fr)'
    } else if (selectedSize === '4') {
      this.size = 7 * 2 
      this.game.style.gridTemplateColumns = 'repeat(4, 1fr)'
    }

    this.creatGame()
  }
  
  /**
   * Creates a start button for the game.
   * @param {string} name - The name of the button.
   * @param {number} size - The size related to button.
   */
  createBtn (name, size) {
    const startBtn = document.createElement('button')
    startBtn.classList.add('startBtn')
    startBtn.innerText = name
    startBtn.onclick = this.buttonListner(size)
    this.startDivision.appendChild(startBtn)
    this.game_division.append(this.startDivision)
    this.startButtons.push(startBtn)
  }

  /**
   * Game division element.
   * @returns {HTMLElement} returns the game division element.
   */
  getDiv() {
    return this.game_division
  }

  /**
   * Sets up the game by creating cards.
   */
  creatGame () {

    this.game.replaceChildren();
    const topOfGame = document.createElement('div')

    const hintButton = document.createElement('button')
    hintButton.classList.add('hintButton')
    hintButton.innerText = 'Hints'

    topOfGame.classList.add('topOfGame')
   

    topOfGame.appendChild(hintButton)
    topOfGame.appendChild(this.attemps)

    this.currentCard = null
    this.openCard = null
    this.index = 0
    this.count = 0
    this.flipped = 0
    this.attemps.innerHTML = `Attempes: ${this.count}`
    this.game_division.appendChild(topOfGame)
    this.game_division.appendChild(this.game)

    const cards = []
    const clonned = []

    this.imgId.sort(() => Math.random() - 0.5)
   
    let i = 0 
    for (const n of this.imgId) {
      if (i === this.size) break
      const CardDivision = document.createElement('div')
      CardDivision.classList.add('CardDivision')

      const backOfCard = document.createElement('img')
      backOfCard.classList.add('backside')
      
    
      CardDivision.appendChild(backOfCard)

      const card = document.createElement('img')
      card.classList.add('card')
      card.src = `${this.path}${this.images[n]}`
      card.id = n

      CardDivision.appendChild(card)
      this.game.appendChild(CardDivision)
      clonned.push(CardDivision.cloneNode(true))
      cards.push(CardDivision)
      i++
    }

    clonned.sort(() => Math.random() -0.5)
    clonned.forEach(card => {
      cards.push(card)
      this.game.appendChild(card)
    })

    cards.forEach(card => {
      card.classList.toggle('flipped')
    })

    setTimeout(() => {
      cards.forEach(card => {
        card.classList.toggle('flipped')
        this.addCardListener(card)
      })
    }, 2000)

    this.game_division.parentElement.parentElement.addEventListener('keydown', this.keyBound)
    this.game_division.parentElement.parentElement.tabIndex = 0
    this.game_division.parentElement.parentElement.focus()
    this.game_division.addEventListener('mouseover', (e) => {
      if (this.currentCard !== null) {
        this.currentCard.classList.remove('currentCard')
      }
    })

    let hints = 3
    setTimeout(() => {
      hintButton.addEventListener('click', () => {
        if (hints === 0) {
          hintButton.innerHTML = 'Amount of hints 0 left'
          return
        }

        this.flipedCard = false
        let card = cards[Math.random() * cards.length | 0]
        if (card.classList.contains('flipped')) {
          cards.forEach(c => {
            if(!c.classList.contains('flipped')) {
              card = c
              return
            }
          })
        }
        card.classList.toggle('flipped')
        setTimeout(() => {
          card.classList.toggle('flipped')
          this.flipedCard = true
        }, 500)
        hints--
      })
    }, 2000)
  }
  
  /**
   * Handles the flip action of a card.
   * @param {Event} e - The event object associated with the card flip.
   */
  async flip (e) {

    if(!this.flipedCard) return 
    
    let CardDivision = e.target.parentElement
    if(!CardDivision.classList.contains('CardDivision')) {CardDivision = e.target}
    if(!CardDivision.classList.contains('CardDivision')) {
      CardDivision = this.currentCard
    }
    if(this.openCard === null) {
      CardDivision.classList.toggle('flipped')
      this.openCard = CardDivision
      this.removeCardListener(this.openCard)
    } else {
      if (this.openCard.childNodes[1].id === CardDivision.childNodes[1].id) {
        CardDivision.classList.toggle('flipped')
        this.flipedCard = false

        await new Promise(() => setTimeout(async() => {
          this.openCard.childNodes[1].classList.add('correct')
          CardDivision.childNodes[1].classList.add('correct')

          await new Promise(() => setTimeout(() => {
            this.openCard.childNodes[1].classList.remove('correct')
            CardDivision.childNodes[1].classList.remove('correct')

            this.openCard = null
            this.removeCardListener(CardDivision)
            this.flipedCard = true

            this.count++
            this.attemps.innerHTML = `Attemps: ${this.count}`
            this.flipped++
            this.checkForWin()
          }, 750))
        }, 200))
      } else {
        this.flipedCard = false
        CardDivision.classList.toggle('flipped')
        await new Promise(() => setTimeout(async () => {
          this.openCard.childNodes[1].classList.add('wrong')
          CardDivision.childNodes[1].classList.add('wrong')
          await new Promise(() => setTimeout(() => {
            this.openCard.childNodes[1].classList.remove('wrong')
            CardDivision.childNodes[1].classList.remove('wrong')
            CardDivision.classList.toggle('flipped')
            this.openCard.classList.toggle('flipped')
            this.addCardListener(this.openCard)
            this.openCard = null
            this.flipedCard = true
            this.count++
            this.attemps.innerHTML = `Attemps: ${this.count}`
          }, 750))
        }, 200))
      }
    }
  }

  flipBound = (e) => { this.flip(e) }
  keyBound = (e) => { this.keys(e) }

  /**
   * Checks if all pairs have been found and handles the game win.
   */
  checkForWin () {
    if (this.flipped === this.size) {
      const win = document.createElement('p')
      win.innerText = `You won in ${this.count} attemps!`
      win.classList.add('win')

      const playAgain= document.createElement('button')
      playAgain.innerText = 'Play Again'
      playAgain.classList.add('playagain-button')
      playAgain.addEventListener('click', () => {
        this.game_division.replaceChildren()
        this.createStartdiv()
      })

      this.game_division.replaceChildren()
      this.game_division.appendChild(win)
      this.game_division.appendChild(playAgain)
    }
  }

  /**
   * Adds eventlistener for card flipping.
   * @param {HTMLElement} CardDivision - adding listener to card division element.
   */
  addCardListener (CardDivision) {
    CardDivision.addEventListener('click', this.flipBound)
  }

   /**
   * Removes the event listener for card flipping.
   * @param {HTMLElement} CardDivision - to remove the listener from The card division element.
   */
  removeCardListener (CardDivision) {
    CardDivision.removeEventListener('click', this.flipBound)
  }

  /**
   * Handles keyevents for navigation and interaction inside the game.
   * @param {Event} e - The event object associated with the key event.
   */
  keys (e) {
    if (this.currentCard == null) {
      this.currentCard = this.game.childNodes[0]
      this.currentCard.classList.add('currentCard')
      this.index = 0
    } else {
      if (e.key === 'ArrowRight') {
        this.index ++
        if (this.index >= this.game.childNodes.length) {
          this.index = 0
        }
        this.currentCard.classList.remove('currentCard')
        this.currentCard = this.game.childNodes[this.index]
        this.currentCard.classList.add('currentCard')
      }

      if (e.key === 'ArrowUp') {
        const s = this.size == 2 ? 4 : this.size

        if (!(this.index < (s/2))) {
          this.index -= s / 2
          this.currentCard.classList.remove('currentCard')
          this.currentCard = this.game.childNodes[this.index]
          this.currentCard.classList.add('currentCard')
        }
      }

      if (e.key === 'ArrowLeft') {
        this.index --

        if (this.index < 0) {
          this.index = this.game.childNodes.length - 1
        }
        this.currentCard.classList.remove('currentCard')
        this.currentCard = this.game.childNodes[this.index]
        this.currentCard.classList.add('currentCard')
      }

      if (e.key === 'ArrowDown') {
        const s = this.size == 2 ? 4 : this.size
        if (!(this.index >= this.game.childNodes.length - (s / 2))) {
          this.index += s/2
          this.currentCard.classList.remove('currentCard')
          this.currentCard = this.game.childNodes[this.index]
          this.currentCard.classList.add('currentCard')
        }
      }

      if (e.key === 'Enter' || e.key === ' ') {
        if(this.currentCard.classList.contains('flipped')) return
        this.flip(e)
      }
    }
  }
  

}