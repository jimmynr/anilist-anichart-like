import { anime_years, media_genre_colors, getRandomInt } from '../../anilist-api/constants'

import { fetchMediaByStudioId } from "../../anilist-api/helpers"

import { useParams, Link } from "react-router-dom"

import { useEffect, useRef, useState } from "react"

import Title from '../commonComponents/title'
import Loader from '../commonComponents/loader'

const MediaPerStudio = () => {

    const param = useParams()

    const [animes, setAnimes] = useState([]) 
    const [studioName, setStudioName] = useState('')
    const [mediaType, setMediaType] = useState('ALL')
    const [isLoading, setIsLoading] = useState(true)

    const resultRef = useRef(null)

    useEffect(() => {
        setStudioName(param.studioName)

        const fetchData = async () => {
            const result = await fetchMediaByStudioId(param.studioId)
            resultRef.current = result
            setAnimes(result.filter(anime => anime.type === 'ANIME' && !anime.isAdult && anime.seasonYear >= 2008))
        }

        fetchData()
    }, [])

    useEffect(() => {
        if((animes && animes.length > 0) || (resultRef.current && resultRef.current.length > 0)) {
            setIsLoading(false)
        } else {
            setIsLoading(true)
        }
    }, [animes, resultRef.current])

    const getAnimesPerYear = year => {
        let animesPerCategory = []

        switch (mediaType) {
            case 'TV':
                animesPerCategory = animes.filter(anime => anime.format === 'TV')
                break
            case 'TV_SHORT':
                animesPerCategory = animes.filter(anime => anime.format === 'TV_SHORT')
                break
            case 'MOVIE':
                animesPerCategory = animes.filter(anime => anime.format === 'MOVIE')
                break
            case 'ONA_OVA_SPECIAL':
                animesPerCategory = animes.filter(anime => 
                    anime.format === 'ONA' ||
                    anime.format === 'OVA' ||
                    anime.format === 'SPECIAL'
                )
                break
            case 'OTHER':
                animesPerCategory = animes.filter(anime => 
                    anime.format === 'MUSIC'
                )
                break
            default:
                animesPerCategory = animes
                break;
        }

        return animesPerCategory.filter(anime => anime.seasonYear === year)
    }

    return <div className="flex flex-col flex-grow px-20 py-10">

        {
            isLoading ? <Loader header={`de la liste des animes pour le studio ${param.studioName}`} />
            :
            <>
                <div
                    className='text-4xl font-bold text-[#11161D] '
                >{ studioName }</div>
                <div className='mt-5 w-full flex flex-col lg:flex-row gap-5 text-white border-b border-b-[#6e859e]'>
                    <Link
                        className='py-2 px-4 rounded-tl-sm rounded-tr-sm w-3/4 md:w-1/2 lg:w-auto'
                        style={{ backgroundColor: mediaType === 'ALL' ? '#11161D' : '#41B1EA'}}
                        onClick={() => setMediaType('ALL')}
                    >
                        Tout ({ animes.length })</Link>
                    <Link
                        className='py-2 px-4 rounded-tl-sm rounded-tr-sm w-3/4 md:w-1/2 lg:w-auto'
                        style={{ backgroundColor: mediaType === 'TV' ? '#11161D' : '#41B1EA'}}
                        onClick={() => setMediaType('TV')}
                    >
                        TV ({ animes.filter(anime => anime.format === 'TV').length })</Link>
                    <Link
                        className='py-2 px-4 rounded-tl-sm rounded-tr-sm w-3/4 md:w-1/2 lg:w-auto'
                        style={{ backgroundColor: mediaType === 'TV_SHORT' ? '#11161D' : '#41B1EA'}}
                        onClick={() => setMediaType('TV_SHORT')}
                    >
                        TV Short ({ animes.filter(anime => anime.format === 'TV_SHORT').length })</Link>
                    <Link
                        className='py-2 px-4 rounded-tl-sm rounded-tr-sm w-3/4 md:w-1/2 lg:w-auto'
                        style={{ backgroundColor: mediaType === 'MOVIE' ? '#11161D' : '#41B1EA'}}
                        onClick={() => setMediaType('MOVIE')}
                    >
                        Film ({ animes.filter(anime => anime.format === 'MOVIE').length })</Link>
                    <Link
                        className='py-2 px-4 rounded-tl-sm rounded-tr-sm w-3/4 md:w-1/2 lg:w-auto'
                        style={{ backgroundColor: mediaType === 'ONA_OVA_SPECIAL' ? '#11161D' : '#41B1EA'}}
                        onClick={() => setMediaType('ONA_OVA_SPECIAL')}
                    >
                        OVA/ONA/SPECIAL
                        ({ animes.filter(anime =>
                            anime.format === 'ONA' ||
                            anime.format === 'OVA' ||
                            anime.format === 'SPECIAL'
                        ).length
                        })
                    </Link>
                    <Link
                        className='py-2 px-4 rounded-tl-sm rounded-tr-sm w-3/4 md:w-1/2 lg:w-auto'
                        style={{ backgroundColor: mediaType === 'OTHER' ? '#11161D' : '#41B1EA'}}
                        onClick={() => setMediaType('OTHER')}
                    >
                        Autre
                        ({ animes.filter(anime =>
                            anime.format === 'MUSIC'
                        ).length
                        })
                    </Link>
                </div>
                <div className='py-10 text-[#6e859e]'>
                    {
                        anime_years.map((year, index) => {
                            const animesPerYear = getAnimesPerYear(year)
                            return animesPerYear && animesPerYear.length > 0 &&
                            <div key={index}
                                className='py-2'
                            >
                                <Title title={year} />
                                <div className='flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row
                                sm:flex-wrap md:flex-wrap lg:flex-wrap xl:flex-wrap p-4'>
                                    {
                                        animesPerYear.map((anime, index) => {
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
                                </div>
                            </div>
                        })
                    }
                </div>
            </>
        }

    </div>
}

export default MediaPerStudio