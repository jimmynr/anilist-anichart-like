export const fetchMedias = async (page, perPage, mediaId, name, genres, year, season, status, formats, sort, getAllPages = true) => {
    // const url = 'https://graphql.anilist.co'
    const fetchedAnimes = []

    let lastPage = 1
  
    do {
        const body = {
            query: `
                query (
                    $page: Int, 
                    $perPage: Int, 
                    $id: Int,
                    $search: String, 
                    $genre_in: [String], 
                    $seasonYear: Int, 
                    $season: MediaSeason, 
                    $status_in: [MediaStatus], 
                    $format_in: [MediaFormat]
                    $sort: [MediaSort]
                ){
                    Page(page: $page, perPage: $perPage) {
                        pageInfo {
                            currentPage
                            lastPage
                            hasNextPage
                        }
                        media(
                            type: ANIME,
                            isAdult: false,
                            id: $id,
                            search: $search,
                            genre_in: $genre_in,
                            seasonYear: $seasonYear,
                            season: $season,
                            status_in: $status_in,
                            format_in: $format_in,
                            sort: $sort
                        ) {
                            id
                            title { romaji english native }
                            format
                            status
                            description(asHtml: false)
                            startDate { year month day }
                            endDate { year month day }
                            season
                            seasonYear
                            episodes
                            trailer { id site thumbnail }
                            coverImage { medium large extraLarge }
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
                            duration
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
                }
            `,
            variables: { 
                page, 
                perPage, 
                id: mediaId || undefined,
                search: name || undefined,             
                genre_in: genres?.length ? genres : undefined,
                seasonYear: year || undefined,
                season: season || undefined,
                status_in: status?.length ? status : undefined,
                format_in: formats?.length ? formats : undefined,
                sort: sort
            }
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

        lastPage = getAllPages ? pInfo.lastPage : page
        page++

    } while (page <= lastPage)

    return fetchedAnimes
}

export const fetchMediasWithPageInfo = async (page, perPage, mediaId, name, genres, year, season, status, formats, sort, getAllPages = true) => {
    // const url = 'https://graphql.anilist.co'
    const fetchedAnimes = {
        pageInfo: {},
        medias: []
    }

    let lastPage = 1
  
    do {
        const body = {
            query: `
                query (
                    $page: Int, 
                    $perPage: Int, 
                    $id: Int,
                    $search: String, 
                    $genre_in: [String], 
                    $seasonYear: Int, 
                    $season: MediaSeason, 
                    $status_in: [MediaStatus], 
                    $format_in: [MediaFormat]
                    $sort: [MediaSort]
                ){
                    Page(page: $page, perPage: $perPage) {
                        pageInfo {
                            currentPage
                            lastPage
                            hasNextPage
                        }
                        media(
                            type: ANIME,
                            isAdult: false,
                            id: $id,
                            search: $search,
                            genre_in: $genre_in,
                            seasonYear: $seasonYear,
                            season: $season,
                            status_in: $status_in,
                            format_in: $format_in,
                            sort: $sort
                        ) {
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
                            coverImage { medium large extraLarge }
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
                            duration
                        }
                    }
                }
            `,
            variables: { 
                page, 
                perPage, 
                id: mediaId || undefined,
                search: name || undefined,             
                genre_in: genres?.length ? genres : undefined,
                seasonYear: year || undefined,
                season: season || undefined,
                status_in: status?.length ? status : undefined,
                format_in: formats?.length ? formats : undefined,
                sort: sort
            }
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
    
        fetchedAnimes.medias.push(...data.data.Page.media)
        fetchedAnimes.pageInfo = {
            ...data.data.Page.pageInfo
        }

        lastPage = getAllPages ? pInfo.lastPage : page
        page++

    } while (page <= lastPage)

    
    return fetchedAnimes
}

/* Airing page */
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
              coverImage { medium large extraLarge }
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
  /* Airing page */