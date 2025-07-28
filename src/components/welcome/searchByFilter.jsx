import { useEffect, useState, useCallback, useRef } from "react"

import MinInfoCard from "../commonComponents/displays/minInfoCard"

import { fetchMediasWithPageInfo } from "../../anilist-api/api"

import { getCurrentSeason, getNextSeason } from "../../anilist-api/fonctionsUtil"

import MinCardsLoader from "../commonComponents/loaders/minCardsLoader"
import SingleMinCardsLoader from "../commonComponents/loaders/singleMinCardLoader"
import Title from "../commonComponents/headers/title"

import useInfiniteScroll from 'react-infinite-scroll-hook'
import Alert from "../commonComponents/alert"

const SearchByFilter = ({ title, filteredBy }) => {

    /* Ref for loader */
    //state 
    const [missingCards, setMissingCards] = useState(0)

    const containerRef = useRef(null)
    const cardRef = useRef(null)
    /* Ref for loader */

    /* main states */
    const [medias, setMedias] =  useState([])
    // main loader
    const [isLoading, setIsLoading] =  useState(true)
    /* main states */

    useEffect(() => {    
        fetchData()
        .catch(handleError)
    }, [])

    /* infinite scroll states */
    const [page, setPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(true)
    // infinite scroll loader
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    /* infinite scroll states */

    /* fetch Medias per filter */   

    const handleError = (err) => {
        setError(err)
        setLoading(false)
    }

    const fetchData = async (page) => {
        let data = []
        switch (filteredBy) {
            case "ACTUAL_TRENDING":
                data = await fetchMediasWithPageInfo(page, 50, undefined, undefined, undefined, undefined, undefined
                    , undefined, undefined, ["TRENDING_DESC"], false)
                break;
            case "POPULAR_CURRENT_SEASON":
                data = await fetchMediasWithPageInfo(page, 50, undefined, undefined, undefined, getCurrentSeason().year , getCurrentSeason().season
                ,undefined, undefined, ["POPULARITY_DESC"], false)
                break;
            case "POPULAR_NEXT_SEASON":
                data = await fetchMediasWithPageInfo(page, 50, undefined, undefined, undefined, getNextSeason().year , getNextSeason().season
                ,undefined, undefined, ["POPULARITY_DESC"], false)
                break;
            case "POPULAR_ALL_TIME":
                data = await fetchMediasWithPageInfo(page, 50, undefined, undefined, undefined, undefined , undefined
                    ,undefined, undefined, ["POPULARITY_DESC"], false)
                break;
            case "TOP_100":
                data = await fetchMediasWithPageInfo(page, 50, undefined, undefined, undefined, undefined , undefined
                    ,undefined, undefined, ["SCORE_DESC"], false)
                break;
        
            default:
                break;
        }
        
        if (page === 1) {
            setMedias(data.medias)
        } else {
            setMedias(prev => [...prev, ...data.medias])
            setHasNextPage(data.pageInfo.hasNextPage)
            setLoading(false)
        }
        setPage(prev => prev + 1)
    }
    /* fetch Medias per filter */

    const loadMore = useCallback(() => {

        setLoading(true)
        setError(null)

        fetchData(page)
        .catch(handleError)
        
    }, [page])

    const [infiniteRef] = useInfiniteScroll({
        loading,
        hasNextPage,
        onLoadMore: loadMore,
        // When there is an error, we stop infinite loading.
        // It can be reactivated by setting "error" state as undefined.
        disabled: Boolean(error),
        // `rootMargin` is passed to `IntersectionObserver`.
        // We can use it to trigger 'onLoadMore' when the sentry comes near to become
        // visible, instead of becoming fully visible on the screen.
        rootMargin: '0px 0px 400px 0px',
    })
    /* infinite scroll */

    /* Setting loader if needed */
    useEffect(() => {
        if (medias && medias.length > 0) setIsLoading(false)
        else setIsLoading(true)
    }, [medias])
    /* Setting loader if needed */

    /* Display medias' cards */
    const displayMedias = (medias, withRanking = false) => {

        return <div className="mt-10">
            <div className="flex flex-wrap justify-start">
                { 
                    medias.map((anime, index) => {

                        const rank = withRanking && index < 100 ? index + 1 : null
                        return <MinInfoCard ref={cardRef} key={index} media={anime} rank={rank} />
                    }) 
                }

                {
                    loading && missingCards !== 0 && Array.from({ length: missingCards })
                    .map((_, index) => (<SingleMinCardsLoader key={index} />))
                }
            </div>
        </div>
    }
    /* Display medias' cards */

    useEffect(() => {
        const totalCards = medias.length

        const containerWidth = containerRef.current?.getBoundingClientRect().width
        const cardWidth = cardRef.current?.getBoundingClientRect().width
        const cardsPerRow = Math.floor(containerWidth / cardWidth)

        const cardsOnLastRow = totalCards % cardsPerRow
        setMissingCards(cardsPerRow - cardsOnLastRow)
    }, [loading])

    return(
        <>
            {
                isLoading ? <MinCardsLoader />
                : <div 
                    ref={containerRef}
                    className="flex flex-col mx-auto mt-10 w-full sm:w-[calc(100vw-10%)] md:w-[calc(100vw-5%)] lg:w-3/4 xl:w-3/4">
                    <Title title={title} />
                    { filteredBy === "TOP_100" ? displayMedias(medias, true) : displayMedias(medias) }
                    {loading && <MinCardsLoader main = {false} />}
                    {error && <Alert message={error.message} />}
                    {hasNextPage && !loading && <div ref={infiniteRef}></div>}
                </div>
            }
        </>
    )
}

export default SearchByFilter