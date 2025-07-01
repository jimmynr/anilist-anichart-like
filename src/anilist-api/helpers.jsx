

export const fetchMediaPerSeasonPerYear = async (perPage, season, seasonYear) => {
    // const url = 'https://graphql.anilist.co'
    const fetchedAnimes = []
    let page = 1
    let lastPage = 1
  
    do {
      const body = {
        query: `
            query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
                Page(page: $page, perPage: $perPage) {
                    pageInfo {
                        currentPage
                        lastPage
                        hasNextPage
                    }
                    media(season: $season, seasonYear: $seasonYear, type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
                        id
                        title { romaji english native }
                        format
                        status
                        description(asHtml: false)
                        startDate { year month day }
                        season
                        seasonYear
                        episodes
                        trailer { id site thumbnail }
                        coverImage { large extraLarge }
                        bannerImage
                        genres
                        averageScore
                        popularity
                        studios {
                          edges {
                            isMain
                            node {
                              id
                              name
                              isAnimationStudio
                            }
                          }
                        }
                        nextAiringEpisode { airingAt timeUntilAiring episode }
                    }
                }
            }
        `,
        variables: { page, perPage, season, seasonYear }
      }
  
      // const res = await fetch(url, {
      // use of proxy from the file vite.config
      const res = await fetch('/anilist', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      const pInfo = data.data.Page.pageInfo
  
      fetchedAnimes.push(...data.data.Page.media)
  
      console.log(`Page ${pInfo.currentPage}/${pInfo.lastPage} fetched`)
      lastPage = pInfo.lastPage
      page++
    } while (page <= lastPage)
  
    console.log(`✅ Fetched complete list: ${fetchedAnimes.length} items across ${lastPage} pages`)
    return fetchedAnimes
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
  
export const fetchMediaPerMediaId = async (mediaId) => {
  // const url = 'https://graphql.anilist.co'

  const body = {
    query: `
        query ($id: Int) {
          Media(id: $id) {
            id
            title { romaji english native }
            source
            format
            status
            description(asHtml: false)
            startDate { year month day }
            endDate { year month day }
            season
            seasonYear
            episodes
            duration
            trailer { id site thumbnail }
            coverImage { medium large extraLarge }
            bannerImage
            genres
            popularity
            studios(isMain: true) {
              edges {
                isMain
                node {
                  id
                  name
                  isAnimationStudio
                }
              }
            }
            nextAiringEpisode { airingAt timeUntilAiring episode }
            averageScore
            streamingEpisodes { title url site thumbnail }
            characters(sort: [ROLE, RELEVANCE]) {
              edges {
                role 
                node {
                  id
                  name {
                    full
                    native
                  }
                  image {
                    large
                    medium
                  }
                  description
                }
                voiceActors(language: JAPANESE) {
                  id
                  name {
                    full
                    native
                  }
                  image {
                    large
                    medium
                  }
                }
              }
            }
            rankings {
              id
              rank
              type         
              format       
              year         
              season       
              allTime      
              context      
            }
        }
      }
    `,
    variables: { id: mediaId }
  }

  // const res = await fetch(url, {
  // use of proxy from the file vite.config
  const res = await fetch('/anilist', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  })
  const data = await res.json()
  return data
}

export const fetchMediaPerMediaTitle = async (MediaTitle) => {
  // const url = 'https://graphql.anilist.co'

  const body = {
    query: `
        query ($title: String) {
          Media(search: $title) {
            id
            title { romaji english native }
            source
            format
            status
            description(asHtml: false)
            startDate { year month day }
            endDate { year month day }
            season
            seasonYear
            episodes
            duration
            trailer { id site thumbnail }
            coverImage { medium large extraLarge }
            bannerImage
            genres
            popularity
            studios(isMain: true) {
              edges {
                isMain
                node {
                  id
                  name
                  isAnimationStudio
                }
              }
            }
            nextAiringEpisode { airingAt timeUntilAiring episode }
            averageScore
            streamingEpisodes { title url site thumbnail }
            characters(sort: [ROLE, RELEVANCE]) {
              edges {
                role 
                node {
                  id
                  name {
                    full
                    native
                  }
                  image {
                    large
                    medium
                  }
                  description
                }
                voiceActors(language: JAPANESE) {
                  id
                  name {
                    full
                    native
                  }
                  image {
                    large
                    medium
                  }
                }
              }
            }
            rankings {
              id
              rank
              type         
              format       
              year         
              season       
              allTime      
              context      
            }
        }
      }
    `,
    variables: { title: MediaTitle }
  }

  try{
      // const res = await fetch(url, {
      // use of proxy from the file vite.config
      const res = await fetch('/anilist', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      return data
  } catch(e) {
    console.warn('Depuis l\'API :', e.message)
    return null
  }

  // return fetch(url, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json'
  //   },
  //   body: JSON.stringify(body)
  // })
  // .then((res) => {
  //   return res.json()
  // })
  // .then((data) => {
  //   return data
  // })
  // .catch((error) => {
  //   console.log('Erreur lors de la requête GraphQL:', error)
  //   return null
  // })
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchMediaByStudioId = async (studioId, perPage = 50) => {
  // const url = 'https://graphql.anilist.co'
  let page = 1
  let lastPage = 1
  const fetchedMedia = []

  do {
    const body = {
      query: `
        query ($studioId: Int, $page: Int, $perPage: Int) {
          Studio(id: $studioId) {
            id
            name
            siteUrl
            media(page: $page, perPage: $perPage, sort: POPULARITY_DESC) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
              }
              nodes {
                  id
                  title {
                    romaji
                    english
                  }
                  format
                  season
                  seasonYear
                  coverImage {
                      large
                      medium
                  }
                  genres
                  popularity
                  isAdult
                  type
              }
            }
          }
        }
      `,
      variables: { studioId, page, perPage }
    }

    let data
    try {
      // const res = await fetch(url, {
      // use of proxy from the file vite.config
      const res = await fetch('/anilist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      })

      data = await res.json()
      console.log(data)

      if (!data || data.errors || !data.data || !data.data.Studio) {
        console.error(`❌ Erreur dans la réponse API pour studio ${studioId}, page ${page}:`, JSON.stringify(data, null, 2))
        return fetchedMedia
      }

      const mediaData = data.data.Studio.media

      if (!mediaData || !mediaData.nodes) {
        console.warn(`⚠️ Aucun média trouvé pour le studio ${studioId}, page ${page}`)
        return fetchedMedia
      }

      fetchedMedia.push(...mediaData.nodes)

      console.log(`✅ Médias du studio ${studioId}, page ${page} récupérée.`)

      page++
      lastPage = mediaData.pageInfo.lastPage
    } catch (err) {
      console.error(`❌ Erreur réseau pour studio ${studioId}, page ${page} : ${err.message}`)
      return fetchedMedia
    }
    if ((page - 1) % 10 === 0) {
      console.log('⏳ Pause courte toutes les 10 pages (10s)...')
      await sleep(10000)
    } 
    else {
      await sleep(700)
    }
  } while (page <= lastPage)

  console.log(`🎬 Total médias récupérés pour le studio ${studioId} : ${fetchedMedia.length}`)
  return fetchedMedia
}

export const fetchAiringNextWeek = async (perPage = 50) => {
  const query = `
    query ($page: Int = 1, $perPage: Int = 50, $start: Int!, $end: Int!) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          currentPage
          hasNextPage
        }
        airingSchedules(airingAt_greater: $start, airingAt_lesser: $end) {
          airingAt
          timeUntilAiring
          episode
          media {
            id
            title { romaji english native }
            type
            isAdult
            format
            status
            description(asHtml: false)
            startDate { year month day }
            season
            seasonYear
            episodes
            trailer { id site thumbnail }
            coverImage { large extraLarge }
            bannerImage
            genres
            averageScore
            popularity
            studios {
              edges {
                isMain
                node {
                  id
                  name
                  isAnimationStudio
                }
              }
            }
          }
        }
      }
    }
  `

  // from today
  // const start = Math.floor(Date.now() / 1000)
  const now = new Date()
  now.setHours(0, 0, 0, 0) 
  const start = Math.floor(now.getTime() / 1000) 
  const end = start + 7 * 24 * 60 * 60

  //from tomorrow
  // const now = new Date()
  // now.setHours(0, 0, 0, 0) 
  // const start = Math.floor(now.getTime() / 1000) + 86400 
  
  // const end = start + 7 * 86400

  let page = 1
  let hasNextPage = true
  let allSchedules = []

  while (hasNextPage) {
    const variables = {
      page,
      perPage,
      start,
      end
    }

    // const response = await fetch('https://graphql.anilist.co', {
    // use of proxy from the file vite.config
    const response = await fetch('/anilist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    })

    const json = await response.json()

    if (json.errors) {
      console.error('Erreur GraphQL :', json.errors)
      break
    }

    const data = json.data.Page
    allSchedules.push(...data.airingSchedules)
    hasNextPage = data.pageInfo.hasNextPage
    page++
  }

  return allSchedules
}

export const fetchMediaByActualTrending = async (page, perPage) => {
  // const url = 'https://graphql.anilist.co'
  
  const fetchedAnimes = {
    pageInfo: {},
    medias: []
  }

  const body = {
    query: `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          
          pageInfo {
            currentPage
            lastPage
            hasNextPage
            total
            perPage
          }

          media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
            }
            season
            seasonYear
            averageScore
            format
            episodes
            studios {
              edges {
                isMain
                node {
                  id
                  name
                  isAnimationStudio
                }
              }
            }
            genres
          }
        }
      }
    `,
    variables: { page, perPage }
  }

  // const res = await fetch(url, {
  // use of proxy from the file vite.config
  const res = await fetch('/anilist', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const data = await res.json()

  fetchedAnimes.medias.push(...data.data.Page.media)
  fetchedAnimes.pageInfo = {
    ...data.data.Page.pageInfo
  }
  return fetchedAnimes
}

export const fetchMediaAllTimePopular = async (page, perPage) => {
  // const url = 'https://graphql.anilist.co'
  const fetchedAnimes = {
    pageInfo: {},
    medias: []
  }

  const body = {
    query: `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
            }
            season
            seasonYear
            averageScore
            format
            episodes
            studios {
              edges {
                isMain
                node {
                  id
                  name
                  isAnimationStudio
                }
              }
            }
            genres
          }
        }
      }
    `,
    variables: { page, perPage }
  }

  // const res = await fetch(url, {
  // use of proxy from the file vite.config
  const res = await fetch('/anilist', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const data = await res.json()

  fetchedAnimes.medias.push(...data.data.Page.media)
  fetchedAnimes.pageInfo = {
    ...data.data.Page.pageInfo
  }
  return fetchedAnimes
}

export const fetchMediaTop100 = async (page, perPage) => {
  // const url = 'https://graphql.anilist.co'
  const fetchedAnimes = {
    pageInfo: {},
    medias: []
  }

  const body = {
    query: `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(sort: SCORE_DESC, type: ANIME, isAdult: false) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              medium
            }
            season
            seasonYear
            averageScore
            format
            status
            duration
            episodes
            studios {
              edges {
                isMain
                node {
                  id
                  name
                  isAnimationStudio
                }
              }
            }
            genres
          }
        }
      }
    `,
    variables: { page, perPage }
  }

  // const res = await fetch(url, {
  // use of proxy from the file vite.config
  const res = await fetch('/anilist', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const data = await res.json()

  fetchedAnimes.medias.push(...data.data.Page.media)
  fetchedAnimes.pageInfo = {
    ...data.data.Page.pageInfo
  }
  return fetchedAnimes
}

export const fetchMediaPopularThisSeason = async (page, perPage, season, seasonYear) => {
  // const url = 'https://graphql.anilist.co'
  const fetchedAnimes = {
    pageInfo: {},
    medias: []
  }

  const body = {
    query: `
      query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
        Page(page: $page, perPage: $perPage) {
          media(season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
            }
            season
            seasonYear
            averageScore
            format
            episodes
            studios {
              edges {
                isMain
                node {
                  id
                  name
                  isAnimationStudio
                }
              }
            }
            genres
          }
        }
      }
    `,
    variables: { page, perPage, season, seasonYear }
  }

  // const res = await fetch(url, {
  // use of proxy from the file vite.config
  const res = await fetch('/anilist', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const data = await res.json()

  fetchedAnimes.medias.push(...data.data.Page.media)
  fetchedAnimes.pageInfo = {
    ...data.data.Page.pageInfo
  }
  return fetchedAnimes
}







