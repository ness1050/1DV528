/* Nq222af */

import Memory from "./memory.mjs"
import chat from "./chat.mjs"
import tictac from "./tictac.mjs"

export default class WindowBar {
  window = document.createElement('div')
  topBar = new topBar(this)
  moving = false
  initialMousePos = { x: 0, y: 0 }
  container = document.createElement('div')
  Index = 0
  title = ''

  downBound = (e) => { this.mouseDown(e) }
  upBound = () => { this.mouseUp() }
  moveBound = (e) => { this.moveWindow(e) }

  constructor (app) {
    this.title = app
    this.window.classList.add('window')
    this.window.appendChild(this.topBar.getDiv())
    this.addListeners()
    this.topBar.addListeners()

    this.container.classList.add('container')
    this.window.appendChild(this.container)
    this.topBar.assingContainer(this.container)
    

    switch (app) {
      case 'memory':
        this.container.appendChild(new Memory().getDiv())
        this.topBar.elementbar.innerHTML = 'Memory'
        break
      case 'chat':
        this.container.appendChild(new chat().getDiv())
        this.topBar.elementbar.innerHTML = 'Chatt'
        break
      case 'tictac':
        const tictacGame = new tictac()
        console.log(tictacGame)
        this.container.appendChild(tictacGame.getDiv())
        this.topBar.elementbar.innerHTML = 'tic-tac-toe'
        break
      default:
        break
    }
  }

  /**
   * @description adds the event listeners
   */
  addListeners () {
    this.topBar.elementbar.addEventListener('mouseout', () => {
      this.moving = false
      this.window.style.cursor = 'default'
    })

    this.topBar.elementbar.addEventListener('mousedown', this.downBound)

    this.topBar.elementbar.addEventListener('mouseup', this.upBound)

    this.topBar.elementbar.addEventListener('mousemove', this.moveBound)
  }

  /**
   * @description returns the window div
   * @returns {HTMLElement} the window div
   */
  getDiv () {
    return this.window
  }

  /**
   * @description sets the moving to true when mouse clicked
   * @param {event} e the event
   */
  mouseDown (e) {
    e.preventDefault()
    this.window.style.cursor = 'move'
    this.moving = true
    this.initialMousePos = {
      x: this.window.offsetLeft - e.clientX,
      y: this.window.offsetTop - e.clientY
    }
  }

  /**
   * @description sets the moving to false when mous no longer clicked
   */
  mouseUp () {
    this.window.style.cursor = 'default'
    this.moving = false
  }

  /**
   * @description moves the window
   * @param {event} e the event
   */
  moveWindow (e) {
    e.preventDefault()
    if (this.moving) {
      this.window.style.left = (e.clientX + this.initialMousePos.x) + 'px'
      this.window.style.top = (e.clientY + this.initialMousePos.y) + 'px'
    }
  }

  /**
   * @description sets the z-index of the window and also updates the styling.
   * @param {number} Index the index to be set for the window
   */
  setIndex (Index) {
    this.Index = Index
    this.window.style.Index = Index
  }
  


  /**
   * @description removes all the event listeners from the window
   */
  removeListeners () {
    this.topBar.elementbar.removeEventListener('mousedown', this.downBound)
    this.topBar.elementbar.removeEventListener('mouseup', this.upBound)
    this.topBar.elementbar.removeEventListener('mousemove', this.moveBound)
  }
}

/**
 * topBar class.
 */
class topBar {
  element = document.createElement('div')
  elementbar = document.createElement('div')
  window = null

  //index = 0
  max = false
  windowPlacesMinimaized = { left: 0, top: 0 }

  close = document.createElement('button')
  maximizeWindow = document.createElement('button')
  minimizeWindow = document.createElement('button')
  hideWindow = document.createElement('button')

  closeWindow = null

  maxWindow = new Event('max')
  minWindow = new Event('min')
  windowContainer = null

  closeSocket = new Event('closeSocket')

  constructor (window) {
    this.window = window

    this.closeWindow = new CustomEvent('closewindow', {
      detail: { win: this.window },
      bubbles: true
    })

    this.element.classList.add('topBar')
    this.elementbar.classList.add('elementbar')
    this.element.appendChild(this.elementbar)

    const operationDiv = document.createElement('operationDiv')
    operationDiv.classList.add('operationDiv')

    this.close.classList.add('close')
    operationDiv.appendChild(this.close)
    this.close.tabIndex = -1 

    this.maximizeWindow.classList.add('maximize')
    operationDiv.appendChild(this.maximizeWindow)
    this.maximizeWindow.tabIndex = -1 

    this.minimizeWindow.classList.add('minimize')
    operationDiv.appendChild(this.minimizeWindow)
    this.minimizeWindow.tabIndex = -1 

    this.hideWindow.classList.add('hide')
    operationDiv.appendChild(this.hideWindow)
    this.hideWindow.tabIndex = -1 

    this.element.appendChild(operationDiv)
  }

  /**
   * Returns the div of the top bar
   * @returns {HTMLDivElement} the div of the top bar
   */
  getDiv () {
    return this.element
  }

  /**
   * @description Adds the listeners for mouse navigeting.
   */
  addListeners () {
    this.close.addEventListener('click', () => {
      this.close.dispatchEvent(this.closeWindow)
      this.windowContainer.childNodes[0].dispatchEvent(this.closeSocket)
      this.element.parentNode.remove()
      console.log("closed")
    })

    this.maximizeWindow.addEventListener('click', () => this.maximizeFunction())
    this.minimizeWindow.addEventListener('click', () => this.minimizeFunction())
    this.hideWindow.addEventListener('click', () => this.hideWindowFunction())


    this.element.parentNode.addEventListener('keyup', e => {
      switch (e.key) {
        case 'Escape': 
          this.close.dispatchEvent(this.closeWindow)
          this.windowContainer.childNodes[0].dispatchEvent(this.closeSocket)
          this.element.parentNode.remove()
          break
        case 'PageUp': 
          this.maximizeFunction()
          break
        case 'PageDown': 
          this.minimizeFunction()
          break
        case 'End':
          this.hideWindowFunction()
        default:
      }
    })
  }

  /**
   * @description replaces the element bar.
   */
  replaceElementBar () {
    this.elementbar = document.createElement('div')
    this.element.replaceChild(this.elementbar, this.element.childNodes[0])
    this.elementbar.classList.add('elementbar')
  }

  /**
   * @descreption Maximizes the window and flips with minimizing button.
   */
  maximizeFunction () {
    this.windowContainer.childNodes[0].dispatchEvent(this.maxWindow)
    this.max = true
    this.window.getDiv().classList.add('maxed')
    this.window.removeListeners()

    this.windowPlacesMinimaized.left = this.window.getDiv().offsetLeft
    this.windowPlacesMinimaized.top = this.window.getDiv().offsetTop

    const sp = document.getElementById('space')
    this.window.getDiv().style.top = 0 + 'px'
    this.window.getDiv().style.left = 90 + 'px'
    this.window.getDiv().style.height = sp.offsetHeight + 'px'
    this.window.getDiv().style.width = (sp.offsetWidth - 105) + 'px'
    this.maximizeWindow.style.display = 'none'
    this.minimizeWindow.style.display = 'block'

    

  }

  /**
   * @description Minimizes the window and or smaller when it maximized.
   */
  minimizeFunction () {
    this.windowContainer.childNodes[0].dispatchEvent(this.minWindow)

    if (this.max === false) return
    this.window.getDiv().classList.remove('maxed')

    this.max = false
    this.window.addListeners()

    this.window.getDiv().style.top = this.windowPlacesMinimaized.top + 'px'
    this.window.getDiv().style.left = this.windowPlacesMinimaized.left + 'px'

    this.window.getDiv().style.height = 'auto'
    this.window.getDiv().style.width =  'auto'

    this.maximizeWindow.style.display = 'block'
    this.minimizeWindow.style.display = 'none'
  }

  /**
   * @description Hides the window from view wihtout closing the app.
   */
  hideWindowFunction () {
    this.window.getDiv().classList.add('hidden')
  }

  /**
   * @description Sets and assigns the provided container for the window.
   * @param {HTMLDivElement} container the window container element which the window will be assignd to.
   */
  assingContainer (container) {
    this.windowContainer = container
  }
} 
