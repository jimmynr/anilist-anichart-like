import { useEffect, useState, useCallback, useRef, useContext } from "react"

import { fetchMediasWithPageInfo } from "../../anilist-api/api"

import { getCurrentSeason, getNextSeason, fillMissingCards } from "../../anilist-api/fonctionsUtil"

import CardsLoaderView from "../commonComponents/loaders/viewCardsLoader"
import SingleMinCardsLoader from "../commonComponents/loaders/singleMinCardLoader"
import Title from "../commonComponents/headers/title"

import useInfiniteScroll from 'react-infinite-scroll-hook'
import Alert from "../commonComponents/alert"

import PageWrapper from "../commonComponents/displays/wrapper"

import ViewModes from "../commonComponents/displays/view"
import CardsView from "../commonComponents/displays/viewInfoCard"

import { displayContext } from "../../context/displayContext"

const SearchByFilter = ({ title, filteredBy }) => {
    /* Context */
    const { type, setType } = useContext(displayContext)
    /* Context */

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
        setType("MIN")

        fetchData(page)
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
        
            console.log("Type reçu via contexte :", type)
        }
        setPage(prev => prev + 1)
    }
    /* fetch Medias per filter */

    const loadMore = useCallback(() => {
        setMissingCards(fillMissingCards(medias, containerRef, cardRef))

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
                        return <CardsView ref={cardRef} key={index} media={anime} rank={rank} />
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

    return(
        <>
            {
                isLoading ? <CardsLoaderView />
                : <PageWrapper 
                    ref={containerRef}>
                    <div className="flex justify-between items-center">
                        <Title title={title} />
                        <ViewModes />
                    </div>
                    { filteredBy === "TOP_100" ? displayMedias(medias, true) : displayMedias(medias) }
                    {loading && <CardsLoaderView main = {false} />}
                    {error && <Alert message={error.message} />}
                    {hasNextPage && !loading && <div ref={infiniteRef}></div>}
                </PageWrapper>
            }
        </>
    )
}

export default SearchByFilter