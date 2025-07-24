export const fetchMedias = async (page, perPage, mediaId, name, genres, year, season, status, formats, getAllPages = true) => {
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
                            sort: POPULARITY_DESC
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
            variables: { 
                page, 
                perPage, 
                id: mediaId || undefined,
                search: name || undefined,             
                genre_in: genres?.length ? genres : undefined,
                seasonYear: year || undefined,
                season: season || undefined,
                status_in: status?.length ? status : undefined,
                format_in: formats?.length ? formats : undefined
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