import { colorsCollection, formatsOptions, statusCollection } from "../../../anilist-api/constantsUtil"

import { getRandomInt, customMediaInfos, customAiringTimeText  } from "../../../anilist-api/fonctionsUtil"

import { Link } from "react-router-dom"

import { lowScoreIcon, averageScoreIcon, highScoreIcon } from "../icons"

const AvgInfoCard = ({ media, rank = null }) => {
    const color = colorsCollection[getRandomInt(colorsCollection.length - 1)]

    const format = formatsOptions.filter(f => f.value === media.format)[0].label === "TV" 
    ? "TV Show" : formatsOptions.filter(f => f.value === media.format)[0].label

    let moreInfo = customMediaInfos(media)

    let timeText = customAiringTimeText(media)

    return <div className="w-full mt-3 flex items-center gap-x-6">
        { rank !==  null && <div className="text-2xl font-extrabold w-10 flex items-center">
            <div className="text-sm">#</div>
            <div>{`${ rank }`}</div>
        </div> }
        <Link 
            to={`/media/${ media.id }/${ media.title.romaji }`} 
            className="flex items-center w-full bg-white rounded-md p-2"
        >
            <img src={ media.coverImage.medium } alt="Cover Image" className="w-16 h-24 md:w-18 md:h-26" />

            <div className="flex flex-col md:flex-row md:gap-x-4 px-4 w-full">
                <div className="flex flex-col gap-y-2 md:gap-y-4 w-full md:w-2/5 lg:1/2">
                    <div className="font-bold">{ media.title.romaji }</div>
                    <div className="flex gap-2 flex-wrap">
                        {
                            media.genres.map((genre, index) => {
                                return (
                                    <div
                                        key={index}
                                        className='text-xs text-white px-2 py-0.5 rounded-full'
                                        style={{ backgroundColor: `${ color }` }}
                                    >{genre.toLowerCase()}</div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flex items-center flex-wrap md:ml-4 mt-2 md:mt-0 font-semibold text-sm w-full md:w-3/5 lg:1/2 md:text-center">
                    {
                        media.averageScore && <div
                            className='flex gap-1 items-center mr-2 md:mr-0 md:w-1/5'
                        >
                            <span className="text-xl">{
                                media.averageScore >= 75 ? highScoreIcon
                                : media.averageScore >= 60 && media.averageScore < 75 ? averageScoreIcon
                                : lowScoreIcon
                            }</span>
                            <span>{ media.averageScore } %</span>
                        </div>
                    }
                    <div className="flex gap-x-2 md:flex-col items-center mr-2 md:mr-0 md:w-2/5">
                        <div>{ format }</div>
                        <div>{moreInfo !== null && moreInfo.slice(3)}</div>
                    </div>
                    {
                        media.nextAiringEpisode !== null ? <div className="flex gap-x-2 md:flex-col items-center mr-2 md:mr-0 md:w-2/5">
                            <div>Airing</div>
                            <div>Ep {media.nextAiringEpisode.episode} in {timeText}</div>
                        </div>
                        : media.season !== null && media.seasonYear !== null ?
                        <div className="flex gap-x-2 md:flex-col items-center mr-2 md:mr-0 md:w-2/5">
                            <div className="capitalize">{ media.season.toLowerCase() } { media.seasonYear }</div>
                            <div 
                                style={{ color: `${ statusCollection[media.status].color }` }}
                            >{ statusCollection[media.status].label }</div>
                        </div>
                        : <div></div>
                    }
                    
                </div>
            </div>
        </Link>
    </div>
}

export default AvgInfoCard
