import React, { useEffect, useState } from 'react'
import MaxInfoCard from '../commonComponents/maxInfoCard'
import Loader from '../commonComponents/loader'
import { colorsCollection } from '../../anilist-api/constantsUtil'
import { getRandomInt } from '../../anilist-api/fonctionsUtil'

import { fetchMedias } from '../../anilist-api/api'
import { Link } from 'react-router-dom'

const Draft = () => {

    const [medias, setMedias] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchMedias(1, 5, undefined, undefined, undefined, undefined ,undefined, undefined, undefined, ["POPULARITY_DESC"], false)

            setMedias(result)
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (medias && medias.length > 0) setIsLoading(false)
        else setIsLoading(true)
    })

    const displayMedias = medias => {
        return medias.map((anime, index) => {
            const color = colorsCollection[getRandomInt(colorsCollection.length - 1)]
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

    return (
        !isLoading ? displayMedias(medias)
        : <Loader />
    )
}

export default Draft
