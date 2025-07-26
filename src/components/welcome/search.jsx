
import { useEffect, useState } from "react"

import { Link, useSearchParams } from "react-router-dom"

import { fetchMedias } from "../../anilist-api/api"

import { getCurrentSeason, getNextSeason } from "../../anilist-api/fonctionsUtil"

import { useMediaQuery } from 'react-responsive'

import { fetchFilteredMedias } from "../../anilist-api/helpers"

import { media_genre_colors, getRandomInt, formatLabels, anime_season_en_fr, media_status_fr } from "../../anilist-api/constants"

import Loader from "../commonComponents/loader"
import Title from "../commonComponents/title"

import { PiSmileyLight } from "react-icons/pi"
import { PiSmileySadLight } from "react-icons/pi"
import { PiSmileyMehLight } from "react-icons/pi"
import MinInfoCard from "../commonComponents/minInfoCard"

const Search = () => {
    /* Screen size for mobile */
    const isMobile = useMediaQuery({ maxWidth: 640 })
    const isTablet = useMediaQuery({ maxWidth: 768 })
    const isLarge = useMediaQuery({ maxWidth: 1024 })
    /* Screen size for mobile */

    /* states */
    const [trendingNow, setTrendingNow] = useState([])
    const [popularThisSeason, setPopularThisSeason] = useState([])
    const [upcoming, setUpcoming] = useState([])
    const [allTimePopular, setAllTimePopular] = useState([])
    const [top100, setTop100] = useState([])
    const [filterMode, setFilterMode] = useState(false)
    
    const [isLoading, setIsLoading] = useState(true)
    /* states */
    const [filteredMedias, setFilteredMedias] = useState([])

    const [searchParam] = useSearchParams()

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
                    fetchMedias(1, 5, undefined, undefined, undefined, undefined , undefined
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

    const displayResponsiveMedias = (medias, title, path) => {
        const ref = medias
        let showMedias = []
        if (isMobile || isTablet) showMedias = ref.slice(0, 3)
        else if (isLarge) showMedias = ref.slice(0, 4)
        else showMedias = medias

        return <div className="mt-10">
            {
                !filterMode && <div className="flex justify-between items-end">
                    <Title title={title} isLink={true} path={path} />
                    <Link to={path} className="text-xs">View All</Link>
                </div>
            }
            <div className="flex justify-between gap-x-10 mt-2">
                { showMedias.map((anime, index) => (<MinInfoCard key={index} media={anime} />)) }
            </div>
        </div>
    }

    const displayTop100 = top100.map((media, index) => {

        const color = media_genre_colors[getRandomInt(media_genre_colors.length - 1)]

        return <div key={index} className='flex flex-row justify-center items-center gap-10'>
            <div className="text-2xl font-extrabold w-8">{`#${ index + 1 }`}</div>
            <Link 
                to={`/media/${ media.id }/${ media.title.romaji }`} 
                className="flex flex-row justify-between w-4/5 bg-white rounded-md p-2"
            >
                <div className="flex flex-row items-center gap-2 w-3/5">
                    <div>
                        <img src={ media.coverImage.medium } alt="Image de couverture" width={52} height={64} />
                    </div>
                    <div className="p-4 flex flex-col gap-y-2">
                        <div className="font-bold">{ media.title.romaji }</div>
                        <div className="flex flex-row gap-2 flex-wrap">
                            {
                                media.genres.map((genre, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className='text-xs text-white py-0.5 px-4 rounded-4xl'
                                            style={{ backgroundColor: `${ color }` }}
                                        >{genre.toLowerCase()}</div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-2/5">
                    {
                        media.averageScore && <div
                            className='font-bold px-4 flex flex-row gap-x-1 w-1/4'
                        >
                            <span className="text-2xl">{
                                media.averageScore >= 75 ? <PiSmileyLight color="#9CE53E" />
                                : media.averageScore >= 60 && media.averageScore < 75 ? <PiSmileyMehLight color="#EBB62D" />
                                : <PiSmileySadLight color="#EF5D5D" />
                            }</span>
                            <span className="font-bold text-sm">{ media.averageScore } %</span>
                        </div>
                    }
                    <div className="p-4 flex flex-col gap-y-2 w-2/4">
                        <div className="font-bold text-sm">{ formatLabels[media.format] }</div>
                        <div className="text-xs">{ media.format === 'MOVIE' ? `${ Math.floor(media.duration / 60) }h ${ Math.floor(media.duration % 60) }min` : `${ media.episodes } épisodes` }</div>
                    </div>
                    <div className="p-4 flex flex-col gap-y-2 w-1/4">
                        <div className="font-bold text-sm">{ anime_season_en_fr[media.season] } { media.seasonYear }</div>
                        <div 
                            className="text-xs"
                            style={{ color: `${ media_status_fr[media.status].color }` }}
                        >{ media_status_fr[media.status].fr }</div>
                    </div>
                </div>
            </Link>
        </div>
    })

    return(
        <>
            {
                isLoading ? <Loader />
                : filterMode ?
                <>
                    <div className='p-10 md:p-20 lg:p-4 xl:p-10 flex flex-col gap-5 md:gap-5 lg:gap-3 xl:gap-5'>
                        <div className='flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row
                                    sm:flex-wrap md:flex-wrap lg:flex-wrap xl:flex-wrap p-4'>
                            { displayResponsiveMedias(filteredMedias, "", "") }
                        </div>
                    </div>
                    {/* {loading && <p className="text-center my-5">Chargement...</p>}
                    {error && <p className="text-center my-5">Erreur : {error.message}</p>}
                    {hasNextPage && !loading && <div ref={infiniteRef}></div>} */}
                </>
                : <>
                    <div className="flex flex-col w-3/4">
                        { displayResponsiveMedias(trendingNow, "Trending now", "/search/trending-now") }

                        { displayResponsiveMedias(popularThisSeason, "Popular this season", "/search/popular-this-season") }

                        { displayResponsiveMedias(upcoming, "Upcoming next season", "/search/upcoming") }

                        { displayResponsiveMedias(allTimePopular, "All time popular", "/search/all-time-popular") }

                        { displayResponsiveMedias(top100, "Top 100 Anime", "/search/top-100") }
                    </div>

                    <div className='p-10 md:p-20 lg:p-4 xl:p-10 flex flex-col gap-5 md:gap-5 lg:gap-3 xl:gap-5'>
                        <div className="flex justify-between">
                            <Title title='Top 100' isLink={true} path='/search/top-100' />
                            <Link to='/search/top-100' className="mr-30">Voir tout</Link>
                        </div>
                        { displayTop100 }
                    </div>
                </>
            }
        </>
    )
}

export default Search