
import { useEffect, useState } from "react"

import { Link, useSearchParams } from "react-router-dom"

import { fetchMedias } from "../../anilist-api/api"

import { getCurrentSeason, getNextSeason } from "../../anilist-api/fonctionsUtil"

import { useMediaQuery } from 'react-responsive'

import { fetchFilteredMedias } from "../../anilist-api/helpers"

import MinCardsLoader from "../commonComponents/loaders/minCardsLoader"
import Title from "../commonComponents/headers/title"

import MinInfoCard from "../commonComponents/displays/minInfoCard"
import AvgInfoCard from "../commonComponents/displays/avgInfoCard"

const Search = () => {
    /* Screen size */
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

    useEffect(() => {

        const mode = searchParam.get("mode")

        if (mode === "filter") {
            setFilterMode(true)

            const name = searchParam.get("name")

            const genresParam = searchParam.get("genres")
            const genres = genresParam && genresParam.split(",")

            const year = searchParam.get("year")
            const season = searchParam.get("season")

            const formatsParam = searchParam.get("formats")
            const formats = formatsParam && formatsParam.split(",")

            const status = searchParam.get("status")
    
            const fetchData = async () => {
                const res = await fetchFilteredMedias(1, 10, name, genres, year, season, status, formats)
    
                setFilteredMedias(res)
            }
    
            fetchData()
        } else {
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
                  console.error("Erreur lors de la récupération des animes :", err.message)
                  
                  setIsLoading(false)
                }
              }
            
            fetchAll()
        }
    }, [])

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

    const displayResponsiveMedias = (medias) => {
        if (isMobile || isTablet) return medias.slice(0, 3)
        else if (isLarge) return medias.slice(0, 4)
        else return medias
    }

    const displayMedias = (medias, title, path, withRanking = false) => {

        return <div className="mt-10">
            {
                !filterMode && <div className="flex justify-between items-end">
                    <Title title={title} isLink={true} path={path} />
                    <Link to={path} className="text-xs">View All</Link>
                </div>
            }
            <div className="flex flex-wrap justify-start">
                { medias.map((anime, index) => {

                    const rank = withRanking ? index + 1 : null
                    return <MinInfoCard key={index} media={anime} rank={rank} />
                }) }
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
                isLoading ? <MinCardsLoader />
                : filterMode ?
                <>
                    <div className='p-10 md:p-20 lg:p-4 xl:p-10 flex flex-col gap-5 md:gap-5 lg:gap-3 xl:gap-5'>
                        <div className='flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row
                                    sm:flex-wrap md:flex-wrap lg:flex-wrap xl:flex-wrap p-4'>
                            { displayMedias(filteredMedias, "", "") }
                        </div>
                    </div>
                    {/* {loading && <p className="text-center my-5">Chargement...</p>}
                    {error && <p className="text-center my-5">Erreur : {error.message}</p>}
                    {hasNextPage && !loading && <div ref={infiniteRef}></div>} */}
                </>
                : <div className="flex flex-col mx-auto w-full sm:w-[calc(100vw-10%)] md:w-[calc(100vw-5%)] lg:w-3/4 xl:w-3/4">
                    
                    { displayMedias(displayResponsiveMedias(trendingNow), "Trending now", "/search/trending-now") }

                    { displayMedias(displayResponsiveMedias(popularThisSeason), "Popular this season", "/search/popular-this-season") }

                    { displayMedias(displayResponsiveMedias(upcoming), "Upcoming next season", "/search/upcoming") }

                    { displayMedias(displayResponsiveMedias(allTimePopular), "All time popular", "/search/all-time-popular") }

                    { isXLarge ? displayTop100(true) : displayMedias(top100, "Top 100 Anime", "/search/top-100", true)  }
                    
                </div>
            }
        </>
    )
}

export default Search