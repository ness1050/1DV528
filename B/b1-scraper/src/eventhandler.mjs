/**
 * structures the time of list of reservation.
 * where each day is parsed to extract and formating, organizing them by days of the week.
 * @param {string[]} days array of strings
 * @returns {object} returns mapping  days and week,
 */
export function reservationTimeFormat(days) {
  const data = {};
  
  const dayMap = {
    'fri': 'Friday',
    'sat': 'Saturday',
    'sun': 'Sunday'
  };

  for (const i of days) {
    const dayA = i.substring(0, 3);
    const dayFullName = dayMap[dayA];
    if (dayFullName) { 
      const startTime = i.substring(3, 5) + ':00';
      const endTime = i.substring(5, 7) + ':00';
      const timeSlot = `${startTime} - ${endTime}`;

      if (!data[dayFullName]) {
        data[dayFullName] = [];
      }
      data[dayFullName].push(timeSlot);
    }
  }

  return data;
}


/**
 * Analyzis the objects which contains calenders, movies, and reservations.
 * Which throws a recommendation for possiable days for planning movie and dinner reservtion.
 * @param {Object} data object that contains calender,movies and reservation scheduales.
 */
export function findReservations(data) {

  console.log()
  console.log('Recommendations')
  console.log('================')
  const days = {}
  const calendar = data.calendar

  for (const i in calendar) {
    for (const j in calendar[i]) {
      if (days[j] === undefined) {
        days[j] = 1
      } else {
        days[j] += 1
      }
    }
  }

  const dys = []

  for (const i in days) {
    if (days[i] === 3) {
      dys.push(i)
    }
  }

  if (dys.length === 0) {
    console.log( 'No reservations found')
  } else {
    for (const day of dys) {
      let possible = true

      const movies = {}
      const dinner = []

      if (data.movies[day] === undefined) {
        possible = false
      } else {
        for (const i in data.movies[day]) {
          movies[i] = data.movies[day][i]
        }
      }

      if (data.dinner[day] === undefined) {
        possible = false
      } else {
        for (const i in data.dinner[day]) {
          dinner.push(data.dinner[day][i])
        }
      }

      const possibleReservations = []

      for (const movie in movies) {
        for (let i = 0; i < movies[movie].length; i++) {
          const movieTime = parseInt(movies[movie][i].split(':')[0])

          for (let j = 0; j < dinner.length; j++) {
            const dinnerTime = dinner[j].split(':')[0]

            if (dinnerTime - movieTime >= 2) {
              possibleReservations.push([movie, movies[movie][i], dinner[j]])
            }
          }
        }
      }

      if (possibleReservations.length === 0) {
        possible = false
      }

      if (possible === false) {
        console.log( 'No reservations found on ' + day)
      } else {
        for (let i = 0; i < possibleReservations.length; i++) {
          console.log('On ' + day +
          ' the movie ' +  '"' + possibleReservations[i][0] + '"' +
          ' starts at ' + possibleReservations[i][1] +
          ' and there is a free table between ' +
          possibleReservations[i][2].split(' ').join(''))
        }
      }
    }
  }
}

