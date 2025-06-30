import { fetchMediaPerSeasonPerYear, filterMedias } from '../../anilist-api/helpers'

import { anime_season_en_fr, media_status_fr, media_genre_colors, getRandomInt, formatDateFr, getMainStudioName } from '../../anilist-api/constants'

import { useState, useEffect } from 'react'

import { useLocation, Link } from 'react-router-dom'

import Title from '../commonComponents/title'

import './index.css'
import Sort from '../commonComponents/sortIcon'
import Search from '../commonComponents/searchIcon'
import Loader from '../commonComponents/loader'

import { PiSmileyLight } from "react-icons/pi"
import { PiSmileySadLight } from "react-icons/pi"
import { PiSmileyMehLight } from "react-icons/pi"

const Period = ({ season, year }) => {

    const [medias, setMedias] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isEmpty, setIsEmpty] = useState(false)

    const location = useLocation()

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchMediaPerSeasonPerYear(50, season, year)

            if(result.length === 0) setIsEmpty(true)

            setMedias(result)
        }

        fetchData()
    }, [season, year])

    useEffect(() => {
        if(medias && medias.length > 0) {
            setIsLoading(false)
            setIsEmpty(false)
        } else if (medias && medias.length === 0 && isEmpty) {
            setIsLoading(false)
        }
        else {
            setIsLoading(true)
        }
    }, [medias])

    useEffect(() => {
        if (location.pathname && location.pathname.startsWith('/season')) {
            setIsLoading(true)
        }
    }, [location.pathname])

    const sortMediasBy = (criteria) => {
        let sortedMedias = []
        switch (criteria) {
            case 0:
                sortedMedias = [...medias].sort((a, b) => a.title.romaji.localeCompare(b.title.romaji))
                setMedias(sortedMedias)
                break
            case 1:
                sortedMedias = [...medias].sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                setMedias(sortedMedias)
                break
            case 2:
                sortedMedias = [...medias].sort((a, b) => {                
                    return getMainStudioName(a).join(', ').localeCompare(getMainStudioName(b).join(', '))
                  })
                
                setMedias(sortedMedias)
                break
            case 3:
                sortedMedias = [...medias].sort((a, b) =>
                    new Date(b.startDate.year, b.startDate.month || 0, b.startDate.day || 1) -
                    new Date(a.startDate.year, a.startDate.month || 0, a.startDate.day || 1)
                )
                setMedias(sortedMedias)
                break
            case 4:
                sortedMedias = [...medias].sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
                setMedias(sortedMedias)
                break
            default:
                break;
        }
    }

    const displayMedias = format => {
        return filterMedias(medias, format).map(media => {
            
            let studioName = getMainStudioName(media).join(', ')

            const desc = media.description
            ? new DOMParser().parseFromString(media.description, 'text/html').body.textContent || ''
            : ''

            const release_date = ['NOT_YET_RELEASED', 'RELEASING'].includes(media.status) && media.nextAiringEpisode 
            ? `${ Math.floor(media.nextAiringEpisode?.timeUntilAiring / 86400) }j ${ Math.floor((media.nextAiringEpisode?.timeUntilAiring % 86400) / 3600) }h 
            ${ Math.floor((media.nextAiringEpisode?.timeUntilAiring % 3600) / 60)}min`
            : media.status === 'FINISHED' ? formatDateFr(media.startDate)
            : ''

            const color = media_genre_colors[getRandomInt(media_genre_colors.length - 1)]

            const episodes = media.status === 'NOT_YET_RELEASED' && media.nextAiringEpisode ? `Ep ${ media.nextAiringEpisode?.episode || '?' } dans`
            : media.status === 'RELEASING' && media.nextAiringEpisode ? `Ep ${ media.nextAiringEpisode?.episode || '?' }/${ media.episodes || '?' } dans`
            : media.status === 'FINISHED' ? `${ media.episodes || '?' } eps`
            : ''

            return <div 
                        key={media.id} 
                        className='w-full md:w-full lg:w-1/2 xl:w-1/3 relative'
                    >
                        {
                            media.status !== 'NOT_YET_RELEASED' && <div 
                                className='text-white text-xs py-1 px-4 rounded-4xl absolute top-2 -skew-8 -rotate-20' 
                                style={{ backgroundColor: `${ media_status_fr[media.status].color }` }}
                                
                            >
                                { media_status_fr[media.status].fr }
                            </div>
                        }
                        
                        <div className='flex h-64 max-h-64 m-4 rounded-md'>
                            <div 
                                className='min-w-[185px]'
                                style={{ 
                                    backgroundImage: `url(${ media.coverImage.large })`, 
                                    backgroundRepeat: 'no-repeat', 
                                    backgroundSize: 'cover',
                                    overflow: 'hidden',
                                    borderTopLeftRadius: '6px',
                                    borderBottomLeftRadius: '6px' 
                                }}
                            >
                                <div className="h-full relative">
                                    <div className='bg-[rgba(17,22,29,0.75)] p-2 flex flex-col absolute bottom-0 w-full'>
                                        <div 
                                            className='text-white text-sm font-bold mb-2'                                            
                                        >
                                            <Link to={`/media/${ media.id }/${ media.title.romaji }`}>
                                                { media.title.romaji }
                                            </Link>
                                        </div>
                                        <div 
                                            className='text-xs mb-2'
                                            style={{ color: `${ color }` }}
                                        >{ studioName }</div>
                                    </div>
                                </div>  
                            </div>

                            <div className='relative w-full bg-white min-w-44'>
                                <div className='p-5 text-[#6e859e]'>
                                    <div className='flex flex-row justify-between items-center'>
                                        <div className='text-xs'>{ episodes }</div>

                                        {
                                            media.status === 'NOT_YET_RELEASED' ? <div 
                                                className='text-white text-xs py-1 px-4 rounded-4xl' 
                                                style={{ backgroundColor: `${ media_status_fr[media.status].color }` }}
                                                
                                            >
                                                { media_status_fr[media.status].fr }
                                            </div> : media.averageScore && <div 
                                                className='font-bold py-1 px-4 flex flex-row gap-1 items-center' 
                                            >
                                                <span className="text-2xl">{
                                                    media.averageScore >= 75 ? <PiSmileyLight color="#9CE53E" />
                                                    : media.averageScore >= 60 && media.averageScore < 75 ? <PiSmileyMehLight color="#EBB62D" />
                                                    : <PiSmileySadLight color="#EF5D5D" />
                                                }</span>
                                                <span className="text-xs">{ media.averageScore } %</span>
                                            </div>
                                        }

                                    </div>
                                    <div className='text-lg font-bold'>{ release_date }</div>
                                    <div className='text-xs overflow-y-auto max-h-20 mt-2 custom-scrollbar'>{ desc }</div>
                                </div>
                                <div 
                                    className='mt-4 p-2 bg-[#EFF7FB] absolute bottom-0 w-full flex flex-row flex-wrap justify-center gap-2'
                                >
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
                    </div>
        })
    }

    console.log(medias)

    return(
        <>
            {
                isLoading ? <Loader header={`des animes de la saison ${anime_season_en_fr[season]} ${year}`} />
                : isEmpty ? <div
                    className='text-[#6e859e] text-center font-bold mt-10'
                >Aucune information pour l'instant pour la saison: { `${anime_season_en_fr[season]} ${year}` }</div>
                : <>
                    <div className='m-2 px-10 py-2 bg-[#41B1EA] font-bold rounded-md flex justify-between items-center'>
                        <div className='flex flex-row gap-5'>
                            <Search />
                            <Sort sortMediasBy={sortMediasBy} />
                        </div>
                        <div className='text-xs text-white'>
                            { `${anime_season_en_fr[season]} ${year}` }
                        </div>
                    </div>
                    <div className='p-10 md:p-20 lg:p-4 xl:p-10 flex flex-col gap-5 md:gap-5 lg:gap-3 xl:gap-5'>
                        {
                            medias.some(media => media.format === 'TV') && (<>
                                <Title title='TV' />
                                <div className='flex flex-wrap'>
                                    { displayMedias('TV') }
                                </div>
                            </>)
                        }
                        {
                            medias.some(media => media.format === 'TV_SHORT') && (<>
                                <Title title='TV SHORT' />
                                <div className='flex flex-wrap'>
                                    { displayMedias('TV_SHORT') }
                                </div>
                            </>)
                        }
                        {
                            medias.some(media => media.format === 'MOVIE') && (<>
                                <Title title='FILM' />
                                <div className='flex flex-wrap'>
                                    { displayMedias('MOVIE') }
                                </div>
                            </>)
                        }
                        {
                            medias.some(media => media.format === 'OVA' || media.format === 'ONA' || media.format === 'SPECIAL') && (<>
                                <Title title='OVA/ONA/SPECIAL' />
                                <div className='flex flex-wrap'>
                                    { displayMedias() }
                                </div>
                            </>)
                        }
                        
                    </div>
                </>
            }             
        </>
    )
}

export default Period