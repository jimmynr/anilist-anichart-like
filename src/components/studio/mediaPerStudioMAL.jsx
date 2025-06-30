import { getAllMalAnimes, getAllMalStudios, anime_years, media_genre_colors, getRandomInt } from '../../anilist-api/constants'

import { useParams, Link } from "react-router-dom"

import { useEffect, useState } from "react"

import Title from '../commonComponents/title'

const MediaPerStudio = () => {

    const param = useParams()

    const [animes, setAnimes] = useState([]) 
    const [studioName, setStudioName] = useState('')
    const [mediaType, setMediaType] = useState('all')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllMalStudios()

            const currentStudio = data.find(studio => studio.id === Number(param.studioId))
            if(currentStudio) {
                setStudioName(currentStudio.name)
            }
        }

        fetchData()

        const getData = async () => {
            const data = await getAllMalAnimes()

            const studioAnimes = data
            .filter(anime => anime.node.studios.some(studio => studio.id === Number(param.studioId)))

            const uniqueStudioAnimes = Array.from(
                new Map(studioAnimes.map(anime => [anime.node.id, anime])).values()
            )

            setAnimes(uniqueStudioAnimes)
        }

        getData()
    }, [])

    useEffect(() => {
        if(animes && animes.length > 0) {
            setIsLoading(false)
        } else {
            setIsLoading(true)
        }
    }, [animes])

    const getAnimesPerYear = year => {
        let animesPerCategory = []

        switch (mediaType) {
            case 'tv':
                animesPerCategory = animes.filter(anime => anime.node.media_type === 'tv')
                break
            case 'tv_special':
                animesPerCategory = animes.filter(anime => anime.node.media_type === 'tv_special')
                break
            case 'movie':
                animesPerCategory = animes.filter(anime => anime.node.media_type === 'movie')
                break
            case 'typex3':
                animesPerCategory = animes.filter(anime => 
                    anime.node.media_type === 'ova' ||
                    anime.node.media_type === 'ona' ||
                    anime.node.media_type === 'special'
                )
                break
            case 'other':
                animesPerCategory = animes.filter(anime => 
                    anime.node.media_type === 'music' ||
                    anime.node.media_type === 'unknown' ||
                    anime.node.media_type === 'pv' ||
                    anime.node.media_type === 'cm' 
                )
                break
            default:
                animesPerCategory = animes
                break;
        }

        return animesPerCategory.filter(anime => anime.node.start_season.year === year).sort((a, b) =>
            b.node.start_date.localeCompare(a.node.start_date)
        )
    }

    // const regroupAnimesPerYear = () => {
    //     const animeForYear = {}

    //     anime_years.forEach(year => {
    //         animeForYear[year] = getAnimesPerYear(year).sort((a, b) =>
    //             b.node.start_date.localeCompare(a.node.start_date)
    //         )
    //     })

    //     return animeForYear       
    // }

    const getMalMediaType = () => {    
        let mediaTypes = []
    
        animes.forEach(anime => {
            mediaTypes.push(anime.node.media_type)
        })
    
        // remove duplicated values
        return [...new Set(mediaTypes)]
    }

    return <div className="flex flex-col flex-grow px-20 py-10">

        {
            isLoading ? <div className='flex justify-center mt-30'>
                <span className='loader'></span>
            </div>
            :
            <>
                <div
                    className='text-4xl font-bold text-[#11161D] '
                >{ studioName }</div>
                <div className='mt-5 w-full flex flex-col lg:flex-row gap-5 text-white border-b border-b-[#6e859e]'>
                    <Link
                        className='py-2 px-4 rounded-tl-sm rounded-tr-sm w-3/4 md:w-1/2 lg:w-auto'
                        style={{ backgroundColor: mediaType === 'all' ? '#11161D' : '#41B1EA'}}
                        onClick={() => setMediaType('all')}
                    >
                        Tout ({ animes.length })</Link>
                    <Link
                        className='py-2 px-4 rounded-tl-sm rounded-tr-sm w-3/4 md:w-1/2 lg:w-auto'
                        style={{ backgroundColor: mediaType === 'tv' ? '#11161D' : '#41B1EA'}}
                        onClick={() => setMediaType('tv')}
                    >
                        TV ({ animes.filter(anime => anime.node.media_type === 'tv').length })</Link>
                    <Link
                        className='py-2 px-4 rounded-tl-sm rounded-tr-sm w-3/4 md:w-1/2 lg:w-auto'
                        style={{ backgroundColor: mediaType === 'tv_special' ? '#11161D' : '#41B1EA'}}
                        onClick={() => setMediaType('tv_special')}
                    >
                        TV Short ({ animes.filter(anime => anime.node.media_type === 'tv_special').length })</Link>
                    <Link
                        className='py-2 px-4 rounded-tl-sm rounded-tr-sm w-3/4 md:w-1/2 lg:w-auto'
                        style={{ backgroundColor: mediaType === 'movie' ? '#11161D' : '#41B1EA'}}
                        onClick={() => setMediaType('movie')}
                    >
                        Film ({ animes.filter(anime => anime.node.media_type === 'movie').length })</Link>
                    <Link
                        className='py-2 px-4 rounded-tl-sm rounded-tr-sm w-3/4 md:w-1/2 lg:w-auto'
                        style={{ backgroundColor: mediaType === 'typex3' ? '#11161D' : '#41B1EA'}}
                        onClick={() => setMediaType('typex3')}
                    >
                        OVA/ONA/SPECIAL
                        ({ animes.filter(anime =>
                            anime.node.media_type === 'ova' ||
                            anime.node.media_type === 'ona' ||
                            anime.node.media_type === 'special'
                        ).length
                        })
                    </Link>
                    <Link
                        className='py-2 px-4 rounded-tl-sm rounded-tr-sm w-3/4 md:w-1/2 lg:w-auto'
                        style={{ backgroundColor: mediaType === 'other' ? '#11161D' : '#41B1EA'}}
                        onClick={() => setMediaType('other')}
                    >
                        Autre
                        ({ animes.filter(anime =>
                            anime.node.media_type === 'music' ||
                            anime.node.media_type === 'unknown' ||
                            anime.node.media_type === 'pv' ||
                            anime.node.media_type === 'cm'
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
                                        getAnimesPerYear(year).map((anime, index) => {
                                            const color = media_genre_colors[getRandomInt(media_genre_colors.length - 1)]
                                            return <Link
                                                    to={`/media/name/${ anime.node.title }`}
                                                    key={index}
                                                    className='w-1 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 my-4'
                                                >
                                                    <div className='w-48 h-60'>
                                                        <img
                                                            src={anime.node.main_picture.medium}
                                                            alt="Image de couverture"
                                                            width={185}
                                                            className='rounded-md max-h-60'
                                                        />
                                                    </div>
                                                    <div
                                                        className='text-sm w-48 font-semibold'
                                                        onMouseEnter={e => e.target.style.color = color}
                                                        onMouseLeave={e => e.target.style.color = '#6e859e'}
                                                    >{anime.node.title}</div>
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