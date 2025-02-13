import WindowBar from './windowsBar&topBar.mjs'

const space = document.getElementById('space')
const openApps = document.getElementById('active')
const btns = []
const memory = document.getElementById('memory')
const chat = document.getElementById('chat')
const tictac = document.getElementById('tictac')
const bar = document.getElementById('navbar')
bar.style.zIndex = 1000

let n = 0
const windows = []
const position = { left: 90, top: 10 }

/**
 * Handles the button for creating the events for a specific appliction.
 * Calls for the create function.
 * @param {Event} e - event object asssocitied with the clicks.
 * @param {string} appName - the name of appliction to create when clicked.
 */
function buttonClicked (e, appName) {
  e.preventDefault()
  create(appName)
}

memory.addEventListener('click', (e) => {
  buttonClicked(e, 'memory')
})

chat.addEventListener('click', (e) => {
  buttonClicked(e, 'chat')
})

tictac.addEventListener('click', (e) => {
  buttonClicked(e, 'tictac')
})

/**
 * Resets and re-asigns the index for each window.
 * ensuring the order of windows are sequential.
 * to make sure when the maximum windows index has reached.
 */
function resetIndex () {
  n = 0
  windows.sort((a, b) => a.getIndex() < b.getIndex())
  for (let i = 0; i < windows.length; i++) {
    windows[i].setIndex(n)
    n++
  }
}

/**
 * Creates new windows for a specific app.
 * sets the index of window and adds the event listeners for managing the windows.
 * @param {string} app -takes apppname to create the window for.
 */
function create (app) {
  const winDow = new WindowBar(app)
  windows.push(winDow)
  n += 1
  winDow.setIndex(n)

  winDow.getDiv().addEventListener('mousedown', () => {
    n += 1
    if (n === 900) {
      resetIndex()
    }
    winDow.setIndex(n)
  })
  space.appendChild(winDow.getDiv())

  winDow.getDiv().style.left = position.left + 'px'
  winDow.getDiv().style.top = position.top + 'px'
  position.left += 10
  position.top += 10
  winDow.getDiv().focus()

  addButtons(winDow, app + 'App')
}

/**
 * Adds button for managing and create ficus when buttons are clicked.
 * ensuring the window index is updated.
 * @param {WindowBar} win - window which the buttons is connected to.
 * @param {string} app - the name of app for styling.
 */
function addButtons (win, app) {
  const appBtn = document.createElement('button')
  appBtn.classList.add(app)
  appBtn.addEventListener('click', () => {
    if (win.getDiv().classList.contains('hidden')) {
      win.getDiv().classList.remove('hidden')
    }
    win.getDiv().focus()
    n += 1
    if (n === 900) {
      resetIndex()
    }
    win.setIndex(n)
  })
  openApps.appendChild(appBtn)
  btns.push(appBtn)
}

document.addEventListener('closewindow', function (e) {
  console.log('Close event received for:', e.detail.win)
  if (windows.includes(e.detail.win)) {
    const index = windows.indexOf(e.detail.win)
    console.log('Closing window at index:', index)
    openApps.removeChild(btns[index])
    space.removeChild(windows[index].getDiv())
    windows.splice(index, 1)
    btns.splice(index, 1)
  }
})

const dateDiv = document.createElement('div')
dateDiv.classList.add('dateDiv')

/**
 * Formats the number ensuring two digit format.
 * @param {WindowBar} n - number formet.
 * @returns {string} A string which represent he two.digit number.
 */
function twoDigits (n) {
  return n < 10 ? '0' + n : n
}

/**
 * Updates the contet of date division with current time and date.
 * which formet the current date into a readable format
 * and uses the update to display the information.
 */
function updateDateTime () {
  const date = new Date()
  const day = date.getDay()
  const month = date.getMonth()
  const year = date.getFullYear()
  const hours = twoDigits(date.getHours())
  const minutes = twoDigits(date.getMinutes())
  const seconds = twoDigits(date.getSeconds())
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  dateDiv.innerHTML = `${days[day]}<br>${months[month]} ${date.getDate()}, ${year}<br>${hours}:${minutes}:${seconds}`
}

space.appendChild(dateDiv)
console.log('date is done', dateDiv)
setInterval(updateDateTime, 1000)

updateDateTime()
