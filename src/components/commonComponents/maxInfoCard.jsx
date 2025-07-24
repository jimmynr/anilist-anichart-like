import { getMainStudioName, formatDateEn, getRandomInt } from "../../anilist-api/fonctionsUtil"

import { colorsCollection, statusCollection } from "../../anilist-api/constantsUtil"

import { highScoreIcon, averageScoreIcon, lowScoreIcon } from "./icons"

import { Link } from "react-router-dom"

import { useMemo } from "react"

const MaxInfoCard = ({ media }) => {

    const studios = getMainStudioName(media).join(", ")

    const desc = media.description
            ? new DOMParser().parseFromString(media.description, 'text/html').body.textContent || ''
            : ''

    const releaseDate = ['NOT_YET_RELEASED', 'RELEASING'].includes(media.status) && media.nextAiringEpisode 
    ? `${ Math.floor(media.nextAiringEpisode?.timeUntilAiring / 86400) }d ${ Math.floor((media.nextAiringEpisode?.timeUntilAiring % 86400) / 3600) }h 
    ${ Math.floor((media.nextAiringEpisode?.timeUntilAiring % 3600) / 60)}min`
    : media.status === 'FINISHED' ? formatDateEn(media.startDate)
    : ''

    const color = useMemo(() => (colorsCollection[getRandomInt(colorsCollection.length - 1)]), [])

    const episodes = media.status === 'NOT_YET_RELEASED' && media.nextAiringEpisode ? `Ep ${ media.nextAiringEpisode?.episode || '?' } airing in`
    : media.status === 'RELEASING' && media.nextAiringEpisode ? `Ep ${ media.nextAiringEpisode?.episode || '?' }/${ media.episodes || '?' } airing in`
    : media.status === 'FINISHED' ? `${ media.episodes || '?' } eps`
    : ''

    return (
        <div
            className='w-full md:w-full lg:w-1/2 xl:w-1/3'
        >            
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
                            >{ studios }</div>
                        </div>
                    </div>  
                </div>

                <div className='relative w-full bg-white min-w-44'>
                    <div className='p-5 text-[#6e859e]'>
                        <div className='flex flex-col'>

                            <div 
                                className='text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full w-fit' 
                                style={{ backgroundColor: `${ statusCollection[media.status].color }` }}
                                
                            >
                                { statusCollection[media.status].label }
                            </div>

                            <div className="flex justify-between items-center">
                                <div className='text-xs py-1'>{ episodes }</div>
                                {
                                    media.averageScore && <div
                                        className='font-bold py-1 px-4 flex gap-1 items-center'
                                    >
                                        <span className="text-2xl">{
                                            media.averageScore >= 75 ? highScoreIcon
                                            : media.averageScore >= 60 && media.averageScore < 75 ? averageScoreIcon
                                            : lowScoreIcon
                                        }</span>
                                        <span className="text-xs">{ media.averageScore } %</span>
                                    </div>
                                }
                            </div>

                        </div>
                        <div className='text-lg font-bold'>{ releaseDate }</div>
                        <div className='text-xs overflow-y-auto max-h-20 mt-2 custom-scrollbar'>{ desc }</div>
                    </div>
                    <div 
                        className='mt-4 p-2 bg-[#EFF7FB] absolute bottom-0 w-full flex flex-wrap justify-center gap-2'
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
    )
}

export default MaxInfoCard
