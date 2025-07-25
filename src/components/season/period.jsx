import { useOutletContext } from 'react-router-dom'

import { getMainStudioName, filterMedias } from '../../anilist-api/fonctionsUtil'

import { fetchMedias } from '../../anilist-api/api'

import React, { useState, useEffect } from 'react'

import { useLocation } from 'react-router-dom'

import Title from '../commonComponents/title'

import Loader from '../commonComponents/loader'

import MaxInfoCard from '../commonComponents/maxInfoCard'

const Period = ({ season, year }) => {

    const { sortCriteria } = useOutletContext()

    /* states */
    const [medias, setMedias] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isEmpty, setIsEmpty] = useState(false)
    /* states */

    /* Sort medias */
    useEffect(() => {
        const sortMediasBy = (criteria) => {
            let sortedMedias = []
            switch (criteria) {
                case "Title":
                    sortedMedias = [...medias].sort((a, b) => a.title.romaji.localeCompare(b.title.romaji))
                    setMedias(sortedMedias)
                    break
                case "Popularity":
                    sortedMedias = [...medias].sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                    setMedias(sortedMedias)
                    break
                case "Studio":
                    sortedMedias = [...medias].sort((a, b) => {                
                        return getMainStudioName(a).join(', ').localeCompare(getMainStudioName(b).join(', '))
                      })
                    
                    setMedias(sortedMedias)
                    break
                case "Date":
                    sortedMedias = [...medias].sort((a, b) =>
                        new Date(b.startDate.year, b.startDate.month || 0, b.startDate.day || 1) -
                        new Date(a.startDate.year, a.startDate.month || 0, a.startDate.day || 1)
                    )
                    setMedias(sortedMedias)
                    break
                case "Score":
                    sortedMedias = [...medias].sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
                    setMedias(sortedMedias)
                    break
                default:
                    break;
            }
        }

        sortMediasBy(sortCriteria)

    }, [sortCriteria])
    /* Sort medias */

    /* display medias' cards per format */
    const displayMedias = format => {
        return filterMedias(medias, format).map(media => <MaxInfoCard key={media.id} media={media} />)
    }
    /* display medias' cards per format */

    const location = useLocation()

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchMedias(1, 50, undefined, undefined, undefined, year ,season, undefined, undefined, true)

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

    return(
        <>
            {
                isLoading ? <Loader />
                : isEmpty ? <div
                    class="m-2 px-5 md:px-10 lg:px-10 xl:px-10 py-2 text-sm text-[#6e859e] font-bold rounded-md shadow-md"
                >No anime available for this season yet.</div>
                : <>
                    <div className='p-10 flex flex-col gap-5 md:gap-5 lg:gap-3 xl:gap-5'>
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
                                <Title title='TV Short' />
                                <div className='flex flex-wrap'>
                                    { displayMedias('TV_SHORT') }
                                </div>
                            </>)
                        }
                        {
                            medias.some(media => media.format === 'MOVIE') && (<>
                                <Title title='Movie' />
                                <div className='flex flex-wrap'>
                                    { displayMedias('MOVIE') }
                                </div>
                            </>)
                        }
                        {
                            medias.some(media => media.format === 'OVA' || media.format === 'ONA' || media.format === 'SPECIAL') && (<>
                                <Title title='OVA/ONA/Special' />
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

export default React.memo(Period)