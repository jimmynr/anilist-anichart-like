import { getRandomInt } from "../../anilist-api/fonctionsUtil"

import { colorsCollection } from "../../anilist-api/constantsUtil"

import { Link } from "react-router-dom"

import { useMemo } from "react"

const MinInfoCard = ({ media }) => {

    const color = useMemo(() => (colorsCollection[getRandomInt(colorsCollection.length - 1)]), [])

    return (
        <Link
            to={`/media/${ media.id }/${media.title.romaji}`}
            className="mt-2 w-1/2 h-fit"
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
    )
}

export default MinInfoCard
