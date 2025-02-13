/* Author nq222af */

const nameForm = document.getElementById('name-form')

/**
 * Displays the warning when the user tries to start game without entren Name.
 */
function displayWarningSign () {
  const warningSign = document.createElement('span')
  warningSign.textContent = '⚠️ Please enter your name to start the quiz'
  warningSign.classList.add('warning-sign')
  nameForm.appendChild(warningSign)
}

/**
 * To remove existing warning.
 */
function removeWarningSign () {
  const existingWarningSign = document.querySelector('.warning-sign')
  if (existingWarningSign) {
    existingWarningSign.remove()
  }
}

/**
 * hide or shows elements in the page.
 * @param {string} action is to hide or show an element.
 * @param {element} element is swhich element to applay the action on.
 */
function hideShow (action, element) {
  (action === 'hide') ? element.style.display = 'none' : element.style.display = 'block'
}

/**
 * Function that show the rule for 6 seonds.
 */
function hideRule () {
  const rulDiv = document.getElementById('rule')
  setTimeout(function () {
    hideShow('hide', rulDiv)
  }, 6000) // hides rules after 6 seconds.
}

const timeH2 = document.getElementById('time') // the element where to show the thime in the page

/**
 * Function showing back the other elemenst fucntions.
 */
function hideRest () {
  const elementsToHide = [nameForm, timeH2]
  elementsToHide.forEach(element => hideShow('show', element))
}

export { displayWarningSign, removeWarningSign, hideShow, hideRest, hideRule }
