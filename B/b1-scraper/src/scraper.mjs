import fetch from 'node-fetch'
import {parse as parser} from 'node-html-parser'
import {reservationTimeFormat, findReservations}  from './eventhandler.mjs'
import {extract, fetchHtml} from './linkScraper.mjs'

/**
 * Data scraper class for gathering information.
 */
class dataScraper {
  
  /**
   * To create an intance of scraper.
   * @param {string} startUrl for the scraping.
   */
  constructor(startUrl) {
    this.startUrl = startUrl
  }

  /**
   * Strat the process of scraping.
   * Through extracting the links and names.
   * @returns {Promise<object>} containing the objects scraping data.
   */
  async startScrape() {
    try {
    const extracted = await extract(this.startUrl, 'links')
    const links = extracted[0]
    const names = extracted[1]

    console.log('OK!')

    const data = {}

    for (let i = 0; i < links.length; i++) {
      const switchCase = names[i].toLowerCase()
      switch (switchCase) {
        case 'calendar':
          data.calendar = await this.scrapCalendar(links[i], 'available days')
          break
        case 'thecinema!':
          data.movies = await this.scrapCinema(links[i], 'showtimes')
          break
        case "zeke'sbar!":
          data.dinner = await this.scrapBar(links[i], names[i])
          break
        default:
          console.log(switchCase)
          break
      }
    }
    return data
  } catch (error) {
    console.log('An error has occured during scraping: ', error)
  }
}

  /**
   * Handles the calender scraping part.
   * @param {string} url to scrape the calender
   * @param {string} name name associated with the calender
   * @returns {Promise<object>} objects which representing the calender data.
   */
  async scrapCalendar(url, name) {
    try {
      const extracted = await extract(url, name)
      const links = extracted[0]
      const names = extracted[1]
      console.log('OK!')
    
      const calendar = {}
    
      for (let i = 0; i < links.length; i++) {
        const fullUrl = url + links[i]
        calendar[names[i]] = await this.getIndevidualCalendar(fullUrl, names[i])
      }
      return calendar
    } catch (error) {
      console.error('Error scraping calendar: ', error)
      return {}
    }
  }
  

  /**
   * feteches and parse teh calenders page to extract the availability.
   * @param {string} url each calender page.
   * @returns {Promise<object>} object mapping days and the status of thier availability.
   */
  async getIndevidualCalendar(url) {
    const response = await fetch(url)
    const text = await response.text()
    const root = parser.parse(text)
    const table = root.querySelector('table')
    const heads = table.querySelectorAll('th')
    const days = heads.map((element) => element.textContent)
    const columns = table.querySelectorAll('td').map((element) => element.textContent)

    const calendar = {}
    const regex = /[^a-zA-Z0-9]/g
    for (let i = 0; i < days.length; i++) {
      if (regex.test(columns[i])) { continue }
      calendar[days[i]] = columns[i].toLowerCase()
    }
  
    return calendar
  }

  /**
   * To scrape the cinema data, showtimes and for pllaing purposes.
   * @param {string} url cinema part to scrape.
   * @returns {Promise<object>} object containig the movie and showtimes of day.
   */
  async scrapCinema(url) {
    const data = {}
    const document = await fetchHtml(url)
    process.stdout.write('Scraping: ' + 'showtimes... ')
  
    const selects = document.querySelectorAll('select')
  
    const names = {}
    const ids = {}
  
    for (let i = 0; i < selects.length; i++) {
      let options = selects[i].querySelectorAll('option')
      options = options.slice(1, options.length)
      names[selects[i].attributes.name] = options.map((element) => element.textContent)
      ids[selects[i].attributes.name] = options.map((element) => element.attributes.value)
    }
  
    for (let i = 0; i < names.movie.length; i++) {
      for (const j of names.day) {
        const time = await this.getMovieTime(url, ids.day[names.day.indexOf(j)], ids.movie[i])
        if (time.length === 0) { continue } else {
          if (!data[j]) {
            data[j] = {}
          }
          if (!data[j][names.movie[i]]) {
            data[j][names.movie[i]] = time
          }
        }
      }
    }
    console.log('OK!')
  
    return data
  }

  /**
   * Fetches showtimes for a specific movie on a specific day cinema site.
   * @param {string} url  cinema site to append query parameters to.
   * @param {string} day day of which to fetch movie times.
   * @param {string} movie The identifier of the movie for fecthing.
   * @returns {Promise<Array<string>>} resolving to an array of strings representing showtimes.
   */
  async getMovieTime(url, day, movie) {
    const res = await fetch(url + '/check?day=' + day + '&movie=' + movie)
    const data = await res.json()
    
    const retData = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].status === 1) {
      retData.push(data[i].time)
      }
    }
    return retData
  }

  /**
   * Scrapes the site for available reservation times. 
   * Requires login to access.
   * @param {string} url the restaurant's reservation page.
   * @returns {Promise<Object>} an object containing available reservation times.
   */
  async scrapBar(url) {
    console.log('Scraping: possible reservations...')
    try {
      const document = await fetchHtml(url);
      let action = new URL(document.querySelector('form').attributes.action, url).href

      const username = 'zeke'
      const password = 'coys'
      const options = {
        method: 'POST',
        redirect: 'manual',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${username}&password=${password}&submit=login`
      }

      const res = await fetch(action, options)
      if (!res.headers.get('location')) {
        throw new Error('Login failed or no redirect location provided.')
      }
      
      const link = res.headers.get('location')
      const cookie = res.headers.get('set-cookie')
      const reservationsPage = await this.fetchReservationsPage(new URL(link, url).toString(), cookie)
      const values = this.extractReservationTimes(reservationsPage)

      console.log('OK!');
      return reservationTimeFormat(values)
    } catch (error) {
      console.error('Error scraping bar: ', error)
      return {}
    }
  }

  /**
   * Fetches the reserv using links and cookies.
   * Handles the get request for a given link.
   * Ensures of gettiing the response.
   * @param {string} link url reserv page to fetch from.
   * @param {string} cookie string which includets in the header.
   * @returns the content of page.
   */
  async fetchReservationsPage(link, cookie) {
    const response = await fetch(link, { headers: { 'Cookie': cookie } })
    if (!response.ok) throw new Error("Failed to fetch reservations page")
    return await response.text()
  }

  /**
   * Extracts thge values from radio input in the html contetn.
   * @param {string} html html content to parse.
   * @returns list of values.
   */
  extractReservationTimes(html) {
    const root = parser.parse(html)
    const inputs = root.querySelectorAll('input[type="radio"]')
    return inputs.map(element => element.attributes.value)
  }

  /**
   * runs and executes the scraping process.
   */
  async run() {
    const data = await this.startScrape(this.startUrl)
    findReservations(data)
  }
  
}

export default dataScraper