import { fallIcon, springIcon, winterIcon, summerIcon } from "../components/commonComponents/icons"

/* for seasons navigation configuration */
// => current season
export const getCurrentSeason = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    if(currentMonth >= 0 && currentMonth <= 2) {
        return {
            season: 'WINTER',
            year: currentYear
        }
    } else if(currentMonth >= 3 && currentMonth <= 5) {
        return {
            season: 'SPRING',
            year: currentYear
        }
    } else if(currentMonth >= 6 && currentMonth <= 8) {
        return {
            season: 'SUMMER',
            year: currentYear
        }
    } else {
        return {
            season: 'FALL',
            year: currentYear
        }
    }
}

export const setIcon = (season) => {
    switch (season) {
        case 'WINTER':
            return winterIcon
        case 'SPRING':
            return springIcon
        case 'SUMMER':
            return summerIcon
        case 'FALL':
            return fallIcon
        default:
            break;
    }
}

// => array of media studio names
export const getMainStudioName = (media) => {
    return media.studios.edges
        .filter(e => e.isMain && e.node?.name)
        .map(e => e.node.name)
        .sort()
}
/* for seasons navigation configuration */

/* Media's card */
// => formatting date
export const formatDateFr = (date) => {
    return date.day && date.month
    ? `${date.day} ${months_fr[date.month]} ${date.year}`
    : date.month ? `${months_fr[date.month]} ${date.year}`
    : date.year ? `${date.year}`
    : null
}

export const formatDateEn = (date) => {
    if (date === null) return null

    let monthName = ""
    if ('month' in date) {
      const temp = date.month && new Date(date.year, date.month)
      monthName = temp.toLocaleString('en-US', { month: 'long' });
    }

    return date.day && date.month
    ? `${monthName} ${date.day}, ${date.year}`
    : date.month ? `${monthName} ${date.year}`
    : date.year
}

// => random number
export const getRandomInt = max => {
  return Math.floor(Math.random() * max);
}

export const filterMedias = (medias, filter) => {
  switch (filter) {
    case 'TV':
      return medias.filter(media => media.format === 'TV')   
    case 'TV_SHORT':
      return medias.filter(media => media.format === 'TV_SHORT')  
    case 'MOVIE':
      return medias.filter(media => media.format === 'MOVIE') 
    default:
      return medias.filter(media => media.format === 'SPECIAL' || media.format === 'OVA' || media.format === 'ONA') 
  }
}

export const customMediaInfos = media => {
  if (media.format === "MOVIE" && media.duration !== null) {
    const hours = Math.floor(media.duration / 60);
    const mins = media.duration % 60;

    if (hours > 0 && mins > 0) {
        return ` ~ ${hours} hours, ${mins} minutes`;
    } else if (hours > 0) {
      return ` ~ ${hours} hours`;
    } else {
      return ` ~ ${mins} minutes`;
    }
  } else if (media.format !== "MOVIE" && media.episodes !== null){
    return ` ~ ${media.episodes} episodes`
  } else return null
}

export const customAiringTimeText = media => {
  const days = media.nextAiringEpisode && Math.floor(media.nextAiringEpisode.timeUntilAiring / (60 * 60 * 24))
  const hours = media.nextAiringEpisode && Math.floor((media.nextAiringEpisode.timeUntilAiring % (60 * 60 * 24)) / (60 * 60))
  const minutes = media.nextAiringEpisode && Math.floor((media.nextAiringEpisode.timeUntilAiring % (60 * 60)) / 60)

  if (days || hours || minutes) {
    if (days > 0 || hours > 0) {
        const parts = []
        if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`)
        if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`)
        return parts.join(' and ')
    } else {
        return `${minutes} minute${minutes > 1 ? 's' : ''}`
    }
  }
}
/* Media's card */

/* Fetching home's data */
// => next season
export const getNextSeason = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    if(currentMonth >= 0 && currentMonth <= 2) {
      return {
        season: 'SPRING',
        year: currentYear
      }
    } else if(currentMonth >= 3 && currentMonth <= 5) {
      return {
        season: 'SUMMER',
        year: currentYear
      }
    } else if(currentMonth >= 6 && currentMonth <= 8) {
      return {
        season: 'FALL',
        year: currentYear
      }
    } else {
      return {
        season: 'WINTER',
        year: currentYear
      }
    }
}

export const capitalize = str => {
  return str[0].toUpperCase() + str.slice(1).toLowerCase()
}
/* Fetching home's data */