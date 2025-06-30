import Fall from "../components/commonComponents/fallIcon";
import Spring from "../components/commonComponents/springIcon";
import Summer from "../components/commonComponents/summerIcon";
import Winter from "../components/commonComponents/winterIcon";

// seasons
const anime_seasons_en = ['WINTER', 'SPRING', 'SUMMER', 'FALL']
const anime_seasons_fr = ['Hiver', 'Printemps', 'Eté', 'Automne']

// => array[season_en] = season_fr
export const anime_season_en_fr = {}
anime_seasons_en.forEach((season_en, index) => {
    anime_season_en_fr[season_en] = anime_seasons_fr[index];
})

// => array of year from current year to 2008
export const anime_years = Array.from({ length: new Date().getFullYear() + 1 - 2008 + 1 }, (_, i) => new Date().getFullYear() + 1 - i)

export const first_year = anime_years[anime_years.length - 1]
export const last_year = anime_years[0]

// => array of combination of season and year { season, year }
export const seasonsCombinations = anime_years.flatMap(year =>
    anime_seasons_en.map(season => ({ season, year }))
)

// function to capitalize a string
const capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// => array of months_fr
export const months_fr = ["", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

// => object of media status
export const media_status_fr = {
    FINISHED: {
      fr: "Terminé",
      color: "rgb(104, 214, 57)"
    },
    RELEASING: {
      fr: "En cours",
      color: "rgb(2, 169, 255)"
    },
    NOT_YET_RELEASED: {
      fr: "Pas encore diffusé",
      color: "rgb(146, 86, 243)"
    },
    CANCELLED: {
      fr: "Annulé",
      color: "rgb(247, 121, 164)"
    },
    HIATUS: {
      fr: "En pause",
      color: "rgb(250, 204, 21)"
    }
}

// colors pack
export const media_genre_colors = ['#E34F85', '#EBB62D', '#D3E7F3', '#EF5D5D', '#6EC8F2', '#E0D59E', '#2F3689', 
'#3480EA', '#9263E9', '#194C71', '#77F3E9', '#9CE53E', '#F25226', '#01C3D5']

// => random number
export const getRandomInt = max => {
    return Math.floor(Math.random() * max);
}

// => component of season's icon
export const setIcon = (season) => {
  switch (season) {
    case 'WINTER':
      return <Winter />
    case 'SPRING':
      return <Spring />
    case 'SUMMER':
      return <Summer />
    case 'FALL':
      return <Fall />
    default:
      break;
  }
}

// => array of sort options
export const sortOptions = ['Titre', 'Popularité', 'Studio', 'Date', 'Note']

// => source of a media
export const getSourceDescriptionFR = (source) => {
  switch (source) {
    case "ORIGINAL":
      return "Une production originale, non basée sur une autre œuvre";
    case "MANGA":
      return "Bande dessinée asiatique (manga)";
    case "LIGHT_NOVEL":
      return "Œuvre écrite publiée en volumes (light novel)";
    case "VISUAL_NOVEL":
      return "Jeu vidéo basé principalement sur du texte et une narration";
    case "VIDEO_GAME":
      return "Jeu vidéo";
    case "NOVEL":
      return "Œuvre écrite (roman), non publiée en volumes";
    case "DOUJINSHI":
      return "Œuvre auto-publiée (doujinshi)";
    case "ANIME":
      return "Anime japonais";
    case "WEB_NOVEL":
      return "Œuvre écrite publiée en ligne (web novel)";
    case "LIVE_ACTION":
      return "Média en prises de vue réelles (films, séries TV)";
    case "GAME":
      return "Jeu (hors jeux vidéo)";
    case "COMIC":
      return "Bande dessinée (hors manga)";
    case "MULTIMEDIA_PROJECT":
      return "Projet multimédia (œuvre sur plusieurs supports)";
    case "PICTURE_BOOK":
      return "Livre illustré (picture book)";
    case "OTHER":
      return "Autre";
    default:
      return "Inconnu ou non spécifié";
  }
}

// object of format label in fr
export const formatLabels = {
  TV: "TV",
  TV_SHORT: "TV court",
  MOVIE: "Film",
  SPECIAL: "Épisode spécial",
  OVA: "OVA",
  ONA: "ONA",
  MUSIC: "Clip musical",
  MANGA: "Manga",
  NOVEL: "Roman",
  ONE_SHOT: "One-shot",
}

// => formatting date
export const formatDateFr = (date) => {
  return date.day && date.month
  ? `${date.day} ${months_fr[date.month]} ${date.year}`
  : date.month ? `${months_fr[date.month]} ${date.year}`
  : date.year ? `${date.year}`
  : null
}

// => array of media studio names
export const getMainStudioName = (media) => {
    return media.studios.edges
        .filter(e => e.isMain && e.node?.name)
        .map(e => e.node.name)
        .sort()
}

// => url of trailer video
export const getTrailerUrl = (trailer) => {
  if (!trailer || !trailer.id) return null

  switch (trailer.site.toLowerCase()) {
    case "youtube":
      return `https://www.youtube.com/watch?v=${trailer.id}`
    case "dailymotion":
      return `https://www.dailymotion.com/video/${trailer.id}`
    default:
      return null
  }
}

// => role_fr
export const getRoleLabel = (role) => {
  switch (role) {
    case "MAIN":
      return "Personnage principal"
    case "SUPPORTING":
      return "Personnage secondaire"
    case "BACKGROUND":
      return "Personnage de fond"
    default:
      return "Rôle inconnu"
  }
}

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
  // if(currentMonth >= 2 && currentMonth <= 4) {
  //   return {
  //     season: 'SPRING',
  //     year: currentYear
  //   }
  // } else if(currentMonth >= 5 && currentMonth <= 7) {
  //   return {
  //     season: 'SUMMER',
  //     year: currentYear
  //   }
  // } else if(currentMonth >= 8 && currentMonth <= 10) {
  //   return {
  //     season: 'FALL',
  //     year: currentYear
  //   }
  // } else {
  //   return {
  //     season: 'WINTER',
  //     year: currentYear
  //   }
  // }
}

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

// => array of all studios from anilist as file.json
export const fetchAllStudios = () => {
    return fetch('/dataFromAnilist/studios.json')
    .then(res => res.json())
    .then(studios => {
      return studios.filter(studio => studio.isAnimationStudio)
      .sort((a,b) => a.name.localeCompare(b.name))
    })
    .catch(err => {
      console.error('Erreur lors du chargement des studios :', err.message);
      return []
    })
}
















