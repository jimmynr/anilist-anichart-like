import { useEffect, useState, useCallback } from "react"

import { Link } from "react-router-dom"

import { media_genre_colors, getRandomInt, getCurrentSeason, getNextSeason } from "../../anilist-api/constants"

import Loader from "../commonComponents/loader"
import Title from "../commonComponents/title"

import useInfiniteScroll from 'react-infinite-scroll-hook'

const SearchByFilter = ({ title, fetchData, filteredBy }) => {

    const [medias, setmedias] =  useState([])
    const [isLoading, setIsLoading] =  useState(true)

    // infinite scroll
    const [page, setPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const loadMore = useCallback(() => {

        setLoading(true)
        setError(null)

        const currentPage = page

        const handleResult = (data) => {
            console.log(data)
            setmedias(prev => [...prev, ...data.medias])
            setPage(prev => prev + 1)
            setHasNextPage(data.pageInfo.hasNextPage)
            setLoading(false)
        }

        const handleError = (err) => {
            setError(err)
            setLoading(false)
        }

        if (filteredBy === 'ACTUAL_TRENDING' || filteredBy === 'POPULAR_ALL_TIME' || filteredBy === 'TOP_100') {
            fetchData(currentPage, 50)
                .then(handleResult)
                .catch(handleError)
        }

        if (filteredBy === 'POPULAR_CURRENT_SEASON') {
            fetchData(currentPage, 50, getCurrentSeason().season, getCurrentSeason().year)
                .then(handleResult)
                .catch(handleError)
        }

        if (filteredBy === 'POPULAR_NEXT_SEASON') {
            fetchData(currentPage, 50, getNextSeason().season, getNextSeason().year)
                .then(handleResult)
                .catch(handleError)
        } 
        
    }, [page, filteredBy, fetchData])

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
    // infinite scroll

    useEffect(() => {
        const fetchInitial = async () => {
            let data
            if (filteredBy === 'ACTUAL_TRENDING' || filteredBy === 'POPULAR_ALL_TIME' || filteredBy === 'TOP_100') {
                data = await fetchData(1, 50)
            } else if (filteredBy === 'POPULAR_CURRENT_SEASON') {
                data = await fetchData(1, 50, getCurrentSeason().season, getCurrentSeason().year)
            } else if (filteredBy === 'POPULAR_NEXT_SEASON') {
                data = await fetchData(1, 50, getNextSeason().season, getNextSeason().year)
            }
            if (data) {
                setmedias(data.medias)
                setPage(2)
            }
        }
    
        fetchInitial().catch(err => console.log(err))
    }, [filteredBy, fetchData])

    useEffect(() => {
        if (medias && medias.length > 0) setIsLoading(false)
        else setIsLoading(true)
    }, [medias])

    const displayMedias = medias => {
    
        return medias.map((anime, index) => {
            const color = media_genre_colors[getRandomInt(media_genre_colors.length - 1)]
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

    return(
        <>
            {
                isLoading ? <Loader header='des tendances actuelles' />
                : <>
                    <Title isLink={false} title={title} />
                    <div className='p-10 md:p-20 lg:p-4 xl:p-10 flex flex-col gap-5 md:gap-5 lg:gap-3 xl:gap-5'>
                        <div className='flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row
                                    sm:flex-wrap md:flex-wrap lg:flex-wrap xl:flex-wrap p-4'>
                            { displayMedias(medias) }
                        </div>
                    </div>
                    {loading && <p className="text-center my-5">Chargement...</p>}
                    {error && <p className="text-center my-5">Erreur : {error.message}</p>}
                    {hasNextPage && !loading && <div ref={infiniteRef}></div>}
                </>
            }
        </>
    )
}

export default SearchByFilter