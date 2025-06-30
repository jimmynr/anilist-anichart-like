
import { useEffect, useState } from "react"

import { Link } from "react-router-dom"

import { fetchMediaByActualTrending, fetchMediaPopularThisSeason, fetchMediaAllTimePopular, fetchMediaTop100 } from "../../anilist-api/helpers"

import { media_genre_colors, getRandomInt, getCurrentSeason, getNextSeason, formatLabels, anime_season_en_fr, media_status_fr } from "../../anilist-api/constants"

import Loader from "../commonComponents/loader"
import Title from "../commonComponents/title"

import { PiSmileyLight } from "react-icons/pi"
import { PiSmileySadLight } from "react-icons/pi"
import { PiSmileyMehLight } from "react-icons/pi"

const Search = () => {

    const [trendingNow, setTrendingNow] = useState([])
    const [popularThisSeason, setPopularThisSeason] = useState([])
    const [upcoming, setUpcoming] = useState([])
    const [allTimePopular, setAllTimePopular] = useState([])
    const [top100, setTop100] = useState([])
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAll = async () => {
        
            try {
              const [
                trendingNowData,
                popularThisSeasonData,
                upcomingData,
                allTimePopularData,
                top100Data
              ] = await Promise.all([
                fetchMediaByActualTrending(1, 5),
                fetchMediaPopularThisSeason(1, 5, getCurrentSeason().season, getCurrentSeason().year),
                fetchMediaPopularThisSeason(1, 5, getNextSeason().season, getNextSeason().year),
                fetchMediaAllTimePopular(1, 5),
                fetchMediaTop100(1, 10)
              ])
        
              setTrendingNow(trendingNowData.medias)
              setPopularThisSeason(popularThisSeasonData)
              setUpcoming(upcomingData)
              setAllTimePopular(allTimePopularData)
              setTop100(top100Data)
              setIsLoading(false)
            } catch (err) {
              console.error("Erreur lors de la récupération des animes :", err.message)
              setError(true)
              setIsLoading(false)
            }
          }
        
        fetchAll()

        // fetchMediaByActualTrending(1, 5)
        // .then(setTrendingNow)
        // .catch(err => console.log(err.message))

        // fetchMediaPopularThisSeason(1, 5, getCurrentSeason().season, getCurrentSeason().year)
        // .then(setPopularThisSeason)
        // .catch(err => console.log(err.message))

        // fetchMediaPopularThisSeason(1, 5, getNextSeason().season, getNextSeason().year)
        // .then(setUpcoming)
        // .catch(err => console.log(err.message))

        // fetchMediaAllTimePopular(1, 5)
        // .then(setAllTimePopular)
        // .catch(err => console.log(err.message))
    }, [])

    useEffect(() => {
        if (trendingNow && trendingNow.length > 0 
            && popularThisSeason && popularThisSeason.length > 0
            && upcoming && upcoming.length > 0
            && allTimePopular && allTimePopular.length > 0
            && top100 && top100.length > 0) {
            setIsLoading(false)
        } else {
            setIsLoading(true)
        }
    }, [trendingNow, popularThisSeason, upcoming, allTimePopular, top100])

    const displayMedias = medias => {
        return medias.map((anime, index) => {
            const color = media_genre_colors[getRandomInt(media_genre_colors.length - 1)]
            return <Link
                    to={`/media/${ anime.id }/${anime.title.romaji}`}
                    key={index}
                    className='w-1 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 my-4'
                >
                    <div className='w-48 h-60'>
                        <img
                            src={anime.coverImage.large}
                            alt="Image de couverture"
                            width={185}
                            className='rounded-md max-h-60'
                        />
                    </div>
                    <div
                        className='text-sm w-48 font-semibold'
                        onMouseEnter={e => e.target.style.color = color}
                        onMouseLeave={e => e.target.style.color = '#6e859e'}
                    >{ anime.title.romaji }</div>
                </Link>
        })
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
                isLoading ? <Loader header='des informations' />
                : <>
                    <div className='p-10 md:p-20 lg:p-4 xl:p-10 flex flex-col gap-5 md:gap-5 lg:gap-3 xl:gap-5'>
                        <div className="flex justify-between">
                            <Title title='Tendances actuelles' isLink={true} path='/search/trending-now' />
                            <Link to='/search/trending-now' className="mr-30">Voir tout</Link>
                        </div>
                        <div className='flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row
                                    sm:flex-wrap md:flex-wrap lg:flex-wrap xl:flex-wrap p-4'>
                            { displayMedias(trendingNow) }
                        </div>
                    </div>

                    <div className='p-10 md:p-20 lg:p-4 xl:p-10 flex flex-col gap-5 md:gap-5 lg:gap-3 xl:gap-5'>
                        <div className="flex justify-between">
                            <Title title='Populaires cette saison' isLink={true} path='/search/popular-this-season' />
                            <Link to='/search/popular-this-season' className="mr-30">Voir tout</Link>
                        </div>
                        <div className='flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row
                                    sm:flex-wrap md:flex-wrap lg:flex-wrap xl:flex-wrap p-4'>
                            { displayMedias(popularThisSeason) }
                        </div>
                    </div>

                    <div className='p-10 md:p-20 lg:p-4 xl:p-10 flex flex-col gap-5 md:gap-5 lg:gap-3 xl:gap-5'>
                        <div className="flex justify-between">
                            <Title title='Tendances à venir' isLink={true} path='/search/upcoming' />
                            <Link to='/search/upcoming' className="mr-30">Voir tout</Link>
                        </div>
                        <div className='flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row
                                    sm:flex-wrap md:flex-wrap lg:flex-wrap xl:flex-wrap p-4'>
                            { displayMedias(upcoming) }
                        </div>
                    </div>

                    <div className='p-10 md:p-20 lg:p-4 xl:p-10 flex flex-col gap-5 md:gap-5 lg:gap-3 xl:gap-5'>
                        <div className="flex justify-between">
                            <Title title='Top populaire - Tous les temps' isLink={true} path='/search/all-time-popular' />
                            <Link to='/search/all-time-popular' className="mr-30">Voir tout</Link>
                        </div>
                        <div className='flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row
                                    sm:flex-wrap md:flex-wrap lg:flex-wrap xl:flex-wrap p-4'>
                            { displayMedias(allTimePopular) }
                        </div>
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