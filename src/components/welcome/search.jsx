
import { useEffect, useState, useCallback, useRef, useContext } from "react"

import { displayContext } from "../../context/displayContext"

import useInfiniteScroll from "react-infinite-scroll-hook"

import { Link, useSearchParams } from "react-router-dom"

import { fetchMedias, fetchMediasWithPageInfo } from "../../anilist-api/api"

import { getCurrentSeason, getNextSeason, fillMissingCards } from "../../anilist-api/fonctionsUtil"

import { useMediaQuery } from 'react-responsive'

import ViewSingleCardsLoader from "../commonComponents/loaders/viewSingleCardsLoader"
import CardsLoaderView from "../commonComponents/loaders/viewCardsLoader"

import Title from "../commonComponents/headers/title"

import MinInfoCard from "../commonComponents/displays/minInfoCard"
import AvgInfoCard from "../commonComponents/displays/avgInfoCard"

import CardsInfo from "../commonComponents/displays/viewInfoCard"

import PageWrapper from "../commonComponents/displays/wrapper"

const Search = ({ filterState }) => {
    /* Context */
    const { setType } = useContext(displayContext)
    /* Context */


    /* Ref for loader */
    //state 
    const [missingCards, setMissingCards] = useState(0)

    const containerRef = useRef(null)
    const cardRef = useRef(null)
    /* Ref for loader */

    /* Screen size */
    const [filters, setFilters] = filterState

    const isMobile = useMediaQuery({ maxWidth: 640 })
    const isTablet = useMediaQuery({ maxWidth: 768 })
    const isLarge = useMediaQuery({ maxWidth: 1024 })
    const isXLarge = useMediaQuery({ minWidth: 1024 })
    /* Screen size */

    /* states */
    const [trendingNow, setTrendingNow] = useState([])
    const [popularThisSeason, setPopularThisSeason] = useState([])
    const [upcoming, setUpcoming] = useState([])
    const [allTimePopular, setAllTimePopular] = useState([])
    const [top100, setTop100] = useState([])
    const [filterMode, setFilterMode] = useState(false)
    
    const [isLoading, setIsLoading] = useState(true)
    const [filteredMedias, setFilteredMedias] = useState([])
    /* states */

    /* url */
    const [searchParam] = useSearchParams()
    /* url */

    /* infinite scroll states */
    const [page, setPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(true)
    // infinite scroll loader
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    /* infinite scroll states */  

    // const handleError = (err) => {
    //     setError(err)
    //     setLoading(false)
    // }

    const getURLParams = () => {
        const name = searchParam.get("name")

        const genresParam = searchParam.get("genres")
        const genres = genresParam && genresParam.split(",")

        const tagsParam = searchParam.get("tags")
        const tags = tagsParam && tagsParam.split(",")

        const year = searchParam.get("year")
        const season = searchParam.get("season")

        const formatsParam = searchParam.get("formats")
        const formats = formatsParam && formatsParam.split(",")

        const status = searchParam.get("status")

        return { name, genres, tags, year, season, formats, status }
    }

    // const fetchData = async (page, name, genres, year, season, status, formats) => {

    //     let data = []
    //     data = await fetchMediasWithPageInfo(page, 50, undefined, name, genres, year, season, status, formats, ["POPULARITY_DESC"], false)       
        
    //     if (page === 1) {
    //         console.log("Page 1")
    //         setFilteredMedias(data.medias)
    //     } else {
    //         console.log("Other page, page : " + page)
    //         setFilteredMedias(prev => [...prev, ...data.medias])
    //         setHasNextPage(data.pageInfo.hasNextPage)
    //         setLoading(false)
    //     }
    // }

    const loadMore = useCallback(() => {
        setMissingCards(fillMissingCards(filteredMedias, containerRef, cardRef))

        setLoading(true)
        setError(null)

        const fetchMoreData = async () => {

            const { name, genres, tags, year, season, formats, status } = getURLParams()

            let data = []
            data = await fetchMediasWithPageInfo(page, 50, undefined, name, genres, tags, year, season, status, formats, ["POPULARITY_DESC"], false)

            setFilteredMedias(prev => {
                const existingIds = new Set(prev.map(m => m.id))
                const newMedias = data.medias.filter(m => !existingIds.has(m.id))
                return [...prev, ...newMedias]
            })
              
            setHasNextPage(data.pageInfo.hasNextPage)
            setLoading(false)
            setPage(prev => prev + 1)
        }

        fetchMoreData()
        
    }, [page])

    const [infiniteRef] = useInfiniteScroll({
        loading,
        hasNextPage,
        onLoadMore: loadMore,
        // When there is an error, we stop infinite loading.
        // It can be reactivated by setting "error" state as undefined.
        disabled: Boolean(error),
        // `rootMargin` is passed to `IntersectionObserver`.
        // We can use it to trigger 'onLoadMore' when the sentry comes near to become
        // visible, instead of becoming fully visible on the screen.
        rootMargin: '0px 0px 400px 0px',
    })
    /* infinite scroll */

    useEffect(() => {

        const mode = searchParam.get("mode")

        if (mode === "filter") {
            setIsLoading(true)
            setFilterMode(true)

            setPage(1)
            setHasNextPage(true)

            setFilteredMedias([])

            const fetchData = async () => {
                const { name, genres, tags, year, season, formats, status } = getURLParams()
                setError(null)

                let data = []
                data = await fetchMediasWithPageInfo(1, 50, undefined, name, genres, tags, year, season, status, formats, ["POPULARITY_DESC"], false)

                setFilteredMedias(data.medias)
                setHasNextPage(data.pageInfo.hasNextPage)
                setLoading(false)
                setPage(2)
            }

            fetchData()
        } else {

            setFilters({
                name: "",
                genres: [],
                tags: [],
                year: "",
                season: "",
                formats: [],
                status: ""
            })

            setFilterMode(false)

            const fetchAll = async () => {
            
                try {
                  const [
                    trendingNowData,
                    popularThisSeasonData,
                    upcomingData,
                    allTimePopularData,
                    top100Data
                  ] = await Promise.all([
                    fetchMedias(1, 5, undefined, undefined, undefined, undefined, undefined
                    , undefined, undefined, ["TRENDING_DESC"], false),
                    fetchMedias(1, 5, undefined, undefined, undefined, getCurrentSeason().year , getCurrentSeason().season
                    ,undefined, undefined, ["POPULARITY_DESC"], false),
                    fetchMedias(1, 5, undefined, undefined, undefined, getNextSeason().year , getNextSeason().season
                    ,undefined, undefined, ["POPULARITY_DESC"], false),
                    fetchMedias(1, 5, undefined, undefined, undefined, undefined , undefined
                    ,undefined, undefined, ["POPULARITY_DESC"], false),
                    fetchMedias(1, 10, undefined, undefined, undefined, undefined , undefined
                    ,undefined, undefined, ["SCORE_DESC"], false)
                  ])
    
            
                  setTrendingNow(trendingNowData)
                  setPopularThisSeason(popularThisSeasonData)
                  setUpcoming(upcomingData)
                  setAllTimePopular(allTimePopularData)
                  setTop100(top100Data)

                  setIsLoading(false)
                } catch (err) {
                  console.error(err.message)
                  
                  setIsLoading(false)
                }
              }
            
            fetchAll()
        }
    }, [searchParam])

    useEffect(() => {
        if ((trendingNow && trendingNow.length > 0 
            && popularThisSeason && popularThisSeason.length > 0
            && upcoming && upcoming.length > 0
            && allTimePopular && allTimePopular.length > 0
            && top100 && top100.length > 0) ||
            filteredMedias && filteredMedias.length > 0) {
            setIsLoading(false)
        } else {
            setIsLoading(true)
        }
    }, [trendingNow, popularThisSeason, upcoming, allTimePopular, top100, filteredMedias])

    useEffect(() => {
        setType("MIN")
    }, [])

    const displayResponsiveMedias = (medias) => {
        if (isMobile || isTablet) return medias.slice(0, 3)
        else if (isLarge) return medias.slice(0, 4)
        else return medias
    }

    const displayMediasWithCriteria = medias => {

        return <div className="mt-10">
            <div className="flex flex-wrap justify-start">
                { medias.map((anime, index) => (<CardsInfo ref={cardRef} key={index} media={anime} />)) }
                {
                    loading && missingCards !== 0 && Array.from({ length: missingCards })
                    .map((_, index) => (<ViewSingleCardsLoader key={index} />))
                }
            </div>
        </div>
    }

    const displayMedias = (medias, title = "", path = "", withRanking = false) => {

        return <div className="mt-10">
            <div className="flex justify-between items-end">
                <Title title={title} isLink={true} path={path} />
                <Link to={path} className="text-xs">View All</Link>
            </div>

            <div className="flex flex-wrap justify-start">
                { medias.map((anime, index) => {

                    const rank = withRanking ? index + 1 : null
                    return <MinInfoCard ref={cardRef} key={index} media={anime} rank={rank} />
                }) }
                {/* {
                    loading && missingCards !== 0 && Array.from({ length: missingCards })
                    .map((_, index) => (<ViewSingleCardsLoader key={index} />))
                } */}
            </div>
        </div>
    }

    const displayTop100 = (withRanking = false) => {

        return <div className="mt-10">
            {
                !filterMode && <div className="flex justify-between items-end">
                    <Title title="Top 100" isLink={false} path="/search/top-100" />
                    <Link to="/search/top-100" className="text-xs">View All</Link>
                </div>
            }
            <div className="flex flex-wrap justify-start w-full">
                { top100.map((anime, index) => {

                    const rank = withRanking ? index + 1 : null
                    return <AvgInfoCard key={index} media={anime} rank={rank} />
                }) }
            </div>
        </div>
    }

    return(
        <>
            {
                isLoading ? <CardsLoaderView />
                : filterMode ? <PageWrapper 
                    ref={containerRef}>

                    { displayMediasWithCriteria(filteredMedias) }
                    {loading && <CardsLoaderView main = {false} />}
                    {error && <Alert message={error.message} />}
                    {hasNextPage && !loading && <div ref={infiniteRef}></div>}
                </PageWrapper>
                : <PageWrapper>
                    
                    { displayMedias(displayResponsiveMedias(trendingNow), "Trending now", "/search/trending-now") }

                    { displayMedias(displayResponsiveMedias(popularThisSeason), "Popular this season", "/search/popular-this-season") }

                    { displayMedias(displayResponsiveMedias(upcoming), "Upcoming next season", "/search/upcoming") }

                    { displayMedias(displayResponsiveMedias(allTimePopular), "All time popular", "/search/all-time-popular") }

                    { isXLarge ? displayTop100(true) : displayMedias(top100, "Top 100 Anime", "/search/top-100", true)  }
                    
                </PageWrapper>
            }
        </>
    )
}

export default Search