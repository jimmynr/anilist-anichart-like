import { useParams, Link } from "react-router-dom"

import { useState, useEffect } from "react"

import ReactPlayer from 'react-player'

import { fetchMedias } from "../../anilist-api/api"

import { fetchMediaPerMediaId, fetchMediaPerMediaTitle } from "../../anilist-api/helpers"

import { formatLabels, anime_season_en_fr, getRoleLabel } from "../../anilist-api/constants"

import { useMediaQuery } from 'react-responsive'

import BannerImg from '../../images/BannerImg.jpg'

import '../season/index.css'

import { FaHeart } from "react-icons/fa"

import Loader from "../commonComponents/loaders/loader"

import Alert from "../commonComponents/alert"

import { formatDateEn, getTrailerUrl, getMainStudioName } from "../../anilist-api/fonctionsUtil"

import { formatsOptions, statusOptions } from "../../anilist-api/constantsUtil"

const Media = () => {

    /* URL param */
    const pathParam = useParams()
    /* URL param */

    /* States */
    const [media, setMedia] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [navTo, setNavTo] = useState('BO')
    const [error, setError] = useState(false)
    /* States */

    /* Screen size/media querie */
    const isMobile = useMediaQuery({ maxWidth: 950 })
    const isTablet = useMediaQuery({ maxWidth: 1024 })
    /* Screen size/media querie */

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchMedias(1, 1, pathParam.mediaId, undefined, undefined, undefined, undefined, undefined, undefined, undefined, false)
            setMedia(result[0])
        }

        fetchData()
    }, [])

    useEffect(() => {
        if((media && media !== null) || (media === null && error)) {
            setIsLoading(false)
        } else {
            setIsLoading(true)
            setError(false)
        }
    }, [media, error])
 
    const displayBO = (media) => {
        return navTo === 'BO' ? (getTrailerUrl(media.trailer) === null ? <Alert message="No trailer found" />
        : <ReactPlayer 
            url={getTrailerUrl(media.trailer)}
            controls={true} 
        />) : ''
    }

    const displayEpisodes = (media) => {
        return navTo === 'EPISODES' ? media.streamingEpisodes.length === 0 ? <Alert message="No episodes found" />
        : media.streamingEpisodes.map((ep, index) => {
            return <Link 
                        key={index} 
                        to={ep.url} 
                        target="_blank"
                        className="relative max-w-[228px] block h-fit"
                    >
                    <img src={ep.thumbnail} alt="Episode thumbnail" width={228} height={100} />
                    <span 
                        className="absolute bottom-0 overflow-x-auto text-white text-xs w-full p-1"
                        style={{ backgroundColor: 'rgba(43, 45, 66, 0.5)'}}
                    >{ep.title}</span>
                </Link>
        }) : ''
    }

    const displayCharacters = media => {
        return navTo === 'CHARACTERS' ? media.characters.edges.length === 0 ? <Alert message="No information found about the characters" /> 
        : media.characters.edges.map((chara, index) => {

            return <div key={index} className="flex flex-row justify-between bg-white w-screen lg:min-w-1/2 mr-4">
                <div className="flex flex-row">
                    <div
                        style={{
                            backgroundImage: `url(${ chara.node.image.medium })`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: '50%'
                        }}
                        className="h-28 w-24"
                    >
                    </div>
                    <div className="flex flex-col justify-between p-4">
                        <div
                            className="text-sm font-bold"
                        >{chara.node.name.full}</div>
                        <div
                            className="text-xs capitalize"
                        >{chara.role.toLowerCase()}</div>
                    </div>
                </div>
                {
                    chara.voiceActors.length > 0 && <div className="flex">
                        <div
                            className="text-sm p-4"
                        >{chara.voiceActors[0].name.full}</div>
                        <div
                            style={{
                                backgroundImage: `url(${ chara.voiceActors[0].image.medium })`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                backgroundPosition: '50%'
                            }}
                            className="h-28 w-24"
                        > 
                        </div>
                    </div>
                }                
            </div>
        }) : ''
    }

    const coverImageSize = !isMobile && !isTablet ? 'w-[215px]' : ''

    const displayMediaDetails = media => {
        return <div className="w-screen lg:w-[215px]">
            {
                media.rankings.length > 0 && media.rankings.some(ranking => ranking.allTime && ranking.type === 'RATED') && 
                    <div className="text-xs bg-[#EDF1F5] lg:bg-white rounded-sm px-4 py-2 mb-2">
                        <span className="font-bold">
                            {`#${media.rankings.filter(ranking => ranking.allTime && ranking.type === 'RATED')[0].rank}`}
                        </span>                                    
                        &nbsp;highest rated of all time
                    </div>
            }

            {
                media.rankings.length > 0 && media.rankings.some(ranking => ranking.allTime && ranking.type === 'POPULAR') &&
                    <div className="text-xs bg-[#EDF1F5] lg:bg-white rounded-sm px-4 py-2 mb-2">
                        <span className="font-bold">
                            {`#${media.rankings.filter(ranking => ranking.allTime && ranking.type === 'POPULAR')[0].rank}`}
                        </span>                                    
                        &nbsp;most popular of all time
                    </div>
            }  

            <div className="bg-[#EDF1F5] lg:bg-white rounded-sm p-4 flex flex-row lg:flex-col gap-5 text-nowrap lg:text-wrap
             overflow-x-scroll lg:overflow-x-auto">
                <div>
                    <div className="text-sm font-bold">Format</div>
                    <div className="text-xs mb-2">{formatsOptions.filter(f => f.value === media.format)[0].label}</div>
                </div>
                <div>
                    <div className="text-sm font-bold">Episodes</div>
                    <div className="text-xs mb-2">{media.episodes || '?'}</div>
                </div>
                <div>
                    <div className="text-sm font-bold">Episode Duration</div>
                    <div className="text-xs mb-2">{media.duration || '?'} min</div>
                </div>
                <div>
                    <div className="text-sm font-bold">Status</div>
                    <div className="text-xs mb-2">{statusOptions.filter(s => s.value === media.status)[0].label}</div>
                </div>
                <div>
                    <div className="text-sm font-bold">Start Date</div>
                    <div className="text-xs mb-2">{formatDateEn(media.startDate) !== null ? formatDateEn(media.startDate) : '?'}</div>
                </div>
                <div>
                    <div className="text-sm font-bold">End Date</div>
                    <div className="text-xs mb-2">{formatDateEn(media.endDate) !== null ? formatDateEn(media.endDate) : '?'}</div>
                </div>
                <div>
                    <div className="text-sm font-bold">Season</div>
                    <div className="text-xs mb-2 capitalize">{media.season.toLowerCase()} {media.seasonYear}</div>
                </div>
                <div>
                    <div className="text-sm font-bold">Average Score</div>
                    <div className="text-xs mb-2">{media.averageScore || '?'} %</div>
                </div>
                <div>
                    <div className="text-sm font-bold">Popularity</div>
                    <div className="text-xs mb-2">{media.popularity}</div>
                </div>
                <div>
                    <div className="text-sm font-bold">Studios</div>
                    <div className="text-xs mb-2">
                        {
                            getMainStudioName(media).map((med, index) => <div key={index}>{med}</div>)
                        }
                    </div>
                </div>
                <div>
                    <div className="text-sm font-bold">Genres</div>
                    <div className="text-xs mb-2">
                        {                        
                            (!isMobile && !isTablet) ? media.genres.map((genre, index) => <div key={index}>{genre}</div>)
                            : <div>{media.genres.join(', ')}</div>
                        }
                    </div>
                </div>
                <div>
                    <div className="text-sm font-bold">Romaji</div>
                    <div className="text-xs mb-2">{media.title.romaji}</div>
                </div>
                <div>
                    <div className="text-sm font-bold">Anglais</div>
                    <div className="text-xs mb-2">{media.title.english}</div>
                </div>
                <div>
                    <div className="text-sm font-bold">Natif</div>
                    <div className="text-xs mb-2">{media.title.native}</div>
                </div>
            </div>
        </div>
    }

    return ( 
        <>
            {
                isLoading ? <Loader />
                : error ? <Alert message={`No information found for ${pathParam.mediaName}`} />
                : <>
                    { console.log(media) }
                    {
                        media.bannerImage !== null 
                        ? <div 
                            className="w-full h-[350px] absolute top-0"
                            style={{ backgroundImage: `url(${media.bannerImage})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", zIndex: -1 }}
                        ></div>
                        : <div 
                            className="w-full h-[350px] absolute top-0"
                            style={{ backgroundImage: `url(${BannerImg})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", zIndex: -1 }}
                        ></div>
                    }
                    <div className="flex flex-col text-[#6e859e]">
                        <div className="flex flex-col lg:flex-row mt-50">
                            <div className="w-full lg:w-1/3 flex flex-row gap-5 lg:gap-2
                            lg:flex-col items-end lg:items-center px-5">
                                <img 
                                    src={isMobile || isTablet ? media.coverImage.medium : media.coverImage.large} 
                                    alt="Cover image"  
                                    className={coverImageSize}
                                />
                                {/* <div className="flex gap-2 w-full lg:w-[215px]">
                                    <button
                                            className="bg-[#41B1EA] text-white px-6 py-2 rounded-sm my-2 cursor-pointer flex-1"
                                        >Add to my list</button>
                                    <button
                                         className="text-red-500 text-3xl rounded-sm cursor-pointer"
                                    >
                                        <FaHeart />
                                    </button>
                                </div> */}
                            </div>
                            <div className="w-full lg:w-2/3 flex items-end">
                                <div className="flex flex-col">
                                    <div className="text-xl font-bold px-5 lg:px-0 py-4">{media.title.romaji}</div>
                                    <div className="hidden lg:block text-sm pb-2">
                                        { 
                                            media.description !== null && (new DOMParser().parseFromString(media.description, 'text/html').body.textContent || '')
                                            .split('\n')
                                            .map((sentence, index) => {
                                                return (
                                                    <span key={index}>{sentence}<br key={`k-${index}`}/></span>
                                                )
                                            })
                                        }
                                    </div>
                                    {(isMobile || isTablet) && displayMediaDetails(media)}
                                    <div className="flex flex-row gap-10 lg:gap-20 mx-5 py-4 text-sm">
                                        <Link onClick={() => setNavTo('BO')}>Trailer</Link>
                                        <Link onClick={() => setNavTo('EPISODES')}>Episodes</Link>
                                        <Link onClick={() => setNavTo('CHARACTERS')}>Characters</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#EDF1F5] py-5 flex flex-col lg:flex-row">
                            <div className="w-1/3 flex flex-col items-center">                               
                                {!isMobile && !isTablet && displayMediaDetails(media)}
                            </div>
                            <div className="w-screen h-fit lg:w-2/3 flex flex-wrap gap-10 px-5 lg:px-0">
                                {displayBO(media)} 
                                {displayEpisodes(media)}
                                {displayCharacters(media)}
                            </div>
                        </div>
                    </div>
                </>
            }            
        </>
    )
}

export default Media
