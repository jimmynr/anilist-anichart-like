import { getRandomInt, getMainStudioName, capitalize } from "../../anilist-api/fonctionsUtil"

import { colorsCollection, formatsOptions } from "../../anilist-api/constantsUtil"

import { Link } from "react-router-dom"

import { useMemo } from "react"

import { Tooltip } from "react-tooltip"

import Label from "../commonComponents/label"

import { lowScoreIcon, averageScoreIcon, highScoreIcon } from "./icons"

const MinInfoCard = ({ media }) => {

    const color = useMemo(() => (colorsCollection[getRandomInt(colorsCollection.length - 1)]), [])
    
    const days = media.nextAiringEpisode && Math.floor(media.nextAiringEpisode.timeUntilAiring / (60 * 60 * 24))
    const hours = media.nextAiringEpisode && Math.floor((media.nextAiringEpisode.timeUntilAiring % (60 * 60 * 24)) / (60 * 60))
    const minutes = media.nextAiringEpisode && Math.floor((media.nextAiringEpisode.timeUntilAiring % (60 * 60)) / 60)

    let timeText = "";

    if (days || hours || minutes) {
        if (days > 0 || hours > 0) {
            const parts = []
            if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`)
            if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`)
            timeText = parts.join(' and ')
        } else {
            timeText = `${minutes} minute${minutes > 1 ? 's' : ''}`
        }
    }

    const format = formatsOptions.filter(f => f.value === media.format)[0].label === "TV" 
    ? "TV Show" : formatsOptions.filter(f => f.value === media.format)[0].label

    let moreInfo = ""

    if (media.format === "MOVIE" && media.duration !== null) {
        const hours = Math.floor(media.duration / 60);
        const mins = media.duration % 60;

        if (hours > 0 && mins > 0) {
            moreInfo = ` ~ ${hours} hours, ${mins} minutes`;
        } else if (hours > 0) {
            moreInfo = ` ~ ${hours} hours`;
        } else {
            moreInfo = ` ~ ${mins} minutes`;
        }
    } else if (media.format !== "MOVIE" && media.episodes !== null){
        moreInfo = ` ~ ${media.episodes} episodes`
    }

    return (
        <>
            <Link
                to={`/media/${ media.id }/${media.title.romaji}`}
                className="mt-2 w-1/2 h-fit"
                data-tooltip-id={`media${media.id}`}
            >
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
            <Tooltip
                id={`media${media.id}`}
                place='right-start'
                style={{ color: "#BCBEDC", borderRadius: "5px" }}
                opacity="1"
                className="min-w-[300px] max-w-[300px] min-h-[200px] max-h-[200px] relative"
            >
                <div className="flex items-center justify-between">
                    {
                        media.nextAiringEpisode !== null 
                        ? <div className="font-semibold text-xs">
                            Ep {media.nextAiringEpisode.episode} airing in {timeText}
                        </div>
                        : media.season !== null && media.seasonYear !== null 
                        ? <Label size="xs" name={`${capitalize(media.season)} ${media.seasonYear}`} />
                        : <div></div>                        
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
}

export default MinInfoCard
