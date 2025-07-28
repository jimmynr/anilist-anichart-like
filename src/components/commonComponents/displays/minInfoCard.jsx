import { getRandomInt, getMainStudioName, capitalize, customMediaInfos, customAiringTimeText } from "../../../anilist-api/fonctionsUtil"

import { colorsCollection, formatsOptions } from "../../../anilist-api/constantsUtil"

import { Link } from "react-router-dom"

import { useMemo, forwardRef } from "react"

import { Tooltip } from "react-tooltip"

import Label from "../headers/label"

import { lowScoreIcon, averageScoreIcon, highScoreIcon } from "../icons"

const MinInfoCard = forwardRef(({media, rank = null}, ref) => {

    const color = useMemo(() => (colorsCollection[getRandomInt(colorsCollection.length - 1)]), [])

    let timeText = customAiringTimeText(media)

    const format = formatsOptions.filter(f => f.value === media.format)[0].label === "TV" 
    ? "TV Show" : formatsOptions.filter(f => f.value === media.format)[0].label

    let moreInfo = customMediaInfos(media)

    const desc = media.description
            ? new DOMParser().parseFromString(media.description, 'text/html').body.textContent || ''
            : ''

    return (
        <>
            <div ref={ref} className="w-1/3 p-1 sm:w-1/3 sm:p-1 md:w-1/4 md:p-2 lg:w-1/5 lg:p-2 mt-3">
                <Link
                    to={`/media/${ media.id }/${media.title.romaji}`}
                    className="mt-2 w-full h-fit relative"
                    data-tooltip-id={`media${media.id}`}
                >
                    { rank !== null && <div
                        className="absolute -top-2 -left-1.5 md:-top-3 md:-left-3 lg:-top-3 lg:-left-3 
                        font-bold text-white p-2 size-10 rounded-full flex justify-center items-center"
                        style={{ backgroundColor: color }}
                    ><span className="text-xs">#</span><span className="text-lg">{rank}</span></div> }
                    {/* ASPECT-RATIO */}
                    <div
                        className="w-full aspect-[34/48] rounded-lg"
                        style={{
                            backgroundImage: `url(${media.coverImage.large})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover"
                        }}
                    ></div>
                    <div
                        className='text-sm font-semibold w-full'
                        onMouseEnter={e => e.target.style.color = color}
                        onMouseLeave={e => e.target.style.color = '#6e859e'}
                    >{ media.title.romaji }</div>
                </Link>
            </div>
            <Tooltip
                id={`media${media.id}`}
                place='right-start'
                style={{ color: "#BCBEDC", borderRadius: "5px", zIndex: 1 }}
                opacity="1"
                className="min-w-[310px] max-w-[310px] min-h-[200px] max-h-[200px] relative"
            >
                <div className="flex items-center justify-between">
                    {
                        media.nextAiringEpisode !== null 
                        ? <div className="font-semibold text-xs">
                            Ep {media.nextAiringEpisode?.episode} airing in {timeText}
                        </div>
                        : media.season !== null && media.seasonYear !== null 
                        ? <Label size="xs" name={`${capitalize(media.season)} ${media.seasonYear}`} />
                        : <div className="text-xs w-2/3 overflow-y-auto max-h-20 custom-scrollbar">{desc}</div>                        
                    }
                    
                    {
                        media.averageScore && <div
                            className='font-semibold py-1 px-4 flex gap-1 items-center'
                        >
                            <span className="text-xl">{
                                media.averageScore >= 75 ? highScoreIcon
                                : media.averageScore >= 60 && media.averageScore < 75 ? averageScoreIcon
                                : lowScoreIcon
                            }</span>
                            <span className="text-xs">{ media.averageScore } %</span>
                        </div>
                    }
                </div>
                <div 
                    className='text-xs my-2 capitalize'
                    style={{ color: `${ color }` }}
                >{ getMainStudioName(media).join(", ") }</div>
                <div className="text-xs font-semibold">{format}{moreInfo}</div>
                <div 
                        className='mt-4 p-2 flex flex-wrap justify-center gap-2 absolute bottom-0 left-0 w-full'
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
            </Tooltip>
        </>
    )
})

export default MinInfoCard
