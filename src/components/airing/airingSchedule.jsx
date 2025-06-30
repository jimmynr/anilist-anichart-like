
import { useEffect, useState } from "react"

import { Link } from "react-router-dom"

import { fetchAiringNextWeek } from "../../anilist-api/helpers"

import { getMainStudioName, media_genre_colors, getRandomInt } from "../../anilist-api/constants"

import Loader from "../commonComponents/loader"
import Title from "../commonComponents/title"

import { PiSmileyLight } from "react-icons/pi"
import { PiSmileySadLight } from "react-icons/pi"
import { PiSmileyMehLight } from "react-icons/pi"

const AiringSchedule = () => {

    const [airing, setAiring] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [week, setWeek] = useState([])
      

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchAiringNextWeek()
            const filteredResult = result.filter(airing => !airing.media.isAdult && airing.media.type === 'ANIME')
            .sort((a, b) => a.airingAt - b.airingAt)
            
            const dailyAiring = filteredResult.map(airing => {
                return {
                    ...airing
                    , date: new Date(airing.airingAt*1000).toLocaleString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })
                }
            })

            dailyAiring.forEach(airing => {
                if (!week.includes(airing.date)) {
                    let arrayOfD = week
                    arrayOfD.push(airing.date)
                    setWeek(arrayOfD)
                }
            })

            setAiring(dailyAiring)
        }

        fetchData()
    }, [])

    const capitalizeDate = date => {
        const part = date.split(' ')
        let capitalizeDate = []
        part.forEach(p => {
            if(!/^[+-]?(\d+(\.\d+)?|\.\d+)$/.test(p)) {
                capitalizeDate.push(p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
            } else {
                capitalizeDate.push(p)
            }
        })
        return capitalizeDate.join(' ')
    }

    useEffect(() => {
        if(airing && airing.length > 0) {
            setIsLoading(false)
        } else {
            setIsLoading(true)
        }
    }, [airing])

    const displayMedias = airings => {
        return airings.map((airing, index) => {
            
            let studioName = getMainStudioName(airing.media).join(', ')

            const desc = airing.media.description
            ? new DOMParser().parseFromString(airing.media.description, 'text/html').body.textContent || ''
            : ''

            const color = media_genre_colors[getRandomInt(media_genre_colors.length - 1)]

            return <div 
                        key={`airing-media-${index}`} 
                        className='w-full md:w-full lg:w-1/2 xl:w-1/3'
                    >
                        <div className='flex h-64 max-h-64 m-4 rounded-md'>
                            <div 
                                className='min-w-[185px]'
                                style={{ 
                                    backgroundImage: `url(${ airing.media.coverImage.large })`, 
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
                                            <Link to={`/media/${ airing.media.id }/${ airing.media.title.romaji }`}>
                                                { airing.media.title.romaji }
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
                                    <div className="min-h-[60px] flex flex-col">
                                        <div className='flex flex-row justify-between py-1 items-center'>
                                            <div className='text-xs'>Ep {airing.episode} à</div>
                                            {
                                                airing.media.averageScore && <div
                                                    className='font-bold px-4 flex flex-row gap-x-1 items-center'
                                                >
                                                    <span className="text-2xl">{
                                                        airing.media.averageScore >= 75 ? <PiSmileyLight color="#9CE53E" />
                                                        : airing.media.averageScore >= 60 && airing.media.averageScore < 75 ? <PiSmileyMehLight color="#EBB62D" />
                                                        : <PiSmileySadLight color="#EF5D5D" />
                                                    }</span>
                                                    <span className="text-xs">{ airing.media.averageScore } %</span>
                                                </div>
                                            }
                                        
                                        </div>
                                        <div className='text-lg font-bold mt-auto'>{ new Date(airing.airingAt * 1000).toLocaleString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) }</div>
                                    </div>
                                    <div className='text-xs overflow-y-auto max-h-20 mt-2 custom-scrollbar'>{ desc }</div>
                                </div>
                                <div 
                                    className='mt-4 p-2 bg-[#EFF7FB] absolute bottom-0 w-full flex flex-row flex-wrap justify-center gap-2'
                                >
                                    {
                                        airing.media.genres.map((genre, index) => {
                                            return (
                                                <div 
                                                    key={`airing-media-genre-${index}`}
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

    return (
        <div className="flex-grow">
            {
                isLoading ? <Loader header={`des prochaines sorties`} />
                : <>
                    <div className='p-10 md:p-20 lg:p-4 xl:p-10 flex flex-col gap-5 md:gap-5 lg:gap-3 xl:gap-5'>
                        {
                            week.map((day, index) => {

                                const dailyAiring = airing.filter(air => air.date === day)

                                return <div key={`airing-${index}`}>
                                    <Title title={capitalizeDate(day)} />                                
                                    <div className='flex flex-wrap mt-5'>
                                        { displayMedias(dailyAiring) }
                                    </div>      

                                </div>

                            })
                        }
                    </div>
                </>
            }
        </div>
    )
}

export default AiringSchedule