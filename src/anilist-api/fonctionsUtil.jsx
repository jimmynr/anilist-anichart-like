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