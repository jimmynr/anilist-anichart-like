import PageWrapper from "../commonComponents/displays/wrapper"

import { yearsCollection } from "../../anilist-api/constantsUtil"

import { fetchMediaByStudioId } from "../../anilist-api/api"

import { useParams } from "react-router-dom"

import { useContext, useEffect, useRef, useState } from "react"

import ViewModes from "../commonComponents/displays/view"
import CardsView from "../commonComponents/displays/viewInfoCard"

import Title from "../commonComponents/headers/title"
import Label from "../commonComponents/headers/label"
import CardsLoaderView from "../commonComponents/loaders/viewCardsLoader"
import CustomMenu from "../commonComponents/displays/customMenu"

import { displayContext } from "../../context/displayContext"

const MediaPerStudio = () => {

    const param = useParams()

    /* main states */
    const [studioName, setStudioName] = useState('')
    const [animes, setAnimes] = useState([]) 
    const [mediaType, setMediaType] = useState('ALL')
    const [isLoading, setIsLoading] = useState(true)
    /* main states */

    /* navigation' states */
    const [all, setAll] = useState("")
    const [tv, setTv] = useState("")
    const [tvShort, setTvShort] = useState("")
    const [movie, setMovie] = useState("")
    const [special, setSpecial] = useState("")
    const [other, setOther] = useState("")
    /* navigation' states */

    const resultRef = useRef(null)

    /* context */
    const { setType } = useContext(displayContext)
    /* context */

    useEffect(() => {
        setType("MAX")

        setStudioName(param.studioName)

        const fetchData = async () => {
            const result = await fetchMediaByStudioId(param.studioId)

            const uniqueResult = Array.from(
                new Map(result.map(media => [media.id, media])).values()
            )

            resultRef.current = uniqueResult
            setAnimes(uniqueResult.filter(media => media.type === 'ANIME' && !media.isAdult && media.seasonYear >= 2008))
        }

        fetchData()
    }, [])

    useEffect(() => {
        if((animes && animes.length > 0) || (resultRef.current && resultRef.current.length > 0)) {
            setIsLoading(false)

            setAll(animes.length)
            const tvNb = animes.filter(anime => anime.format === 'TV').length
            setTv(tvNb)
            const tvShortNb = animes.filter(anime => anime.format === 'TV_SHORT').length
            setTvShort(tvShortNb)
            const movieNb = animes.filter(anime => anime.format === 'MOVIE').length
            setMovie(movieNb)
            const specialNb = animes.filter(anime =>
                anime.format === 'ONA' ||
                anime.format === 'OVA' ||
                anime.format === 'SPECIAL'
            ).length
            setSpecial(specialNb)
            const otherNb = animes.filter(anime =>
                anime.format === 'MUSIC'
            ).length
            setOther(otherNb)
        } else {
            setIsLoading(true)
        }
    }, [animes, resultRef.current])

    const getAnimesPerYear = year => {
        let animesPerCategory = []

        switch (mediaType) {
            case 'TV':
                animesPerCategory = animes.filter(anime => anime.format === 'TV')
                break
            case 'TV_SHORT':
                animesPerCategory = animes.filter(anime => anime.format === 'TV_SHORT')
                break
            case 'MOVIE':
                animesPerCategory = animes.filter(anime => anime.format === 'MOVIE')
                break
            case 'ONA_OVA_SPECIAL':
                animesPerCategory = animes.filter(anime => 
                    anime.format === 'ONA' ||
                    anime.format === 'OVA' ||
                    anime.format === 'SPECIAL'
                )
                break
            case 'OTHER':
                animesPerCategory = animes.filter(anime => 
                    anime.format === 'MUSIC'
                )
                break
            default:
                animesPerCategory = animes
                break;
        }

        return animesPerCategory.filter(anime => anime.seasonYear === year)
    }

    /* Display medias' cards */
    const displayMedias = (medias, title) => {

        return <div className="mt-10">
            <Label name={title} />

            <div className="flex flex-wrap justify-start">
                { 
                    medias.map((media, index) => (<CardsView key={index} media={media} />)) 
                }
            </div>
        </div>
    }
    /* Display medias' cards */

    return <>
        <PageWrapper>
            <div className="flex flex-col md:flex-row md:justify-between items-center mb-10">
                <Title title={studioName} />
                <div className="flex items-center gap-x-2">
                    <CustomMenu
                        text="All"
                        count={all}
                        isActive={mediaType === 'ALL'}
                        handleClick={() => setMediaType('ALL') } />
                    <div className="border-r-2 h-4 border-[#6e859e] rotate-25"></div>
                    <CustomMenu
                        text="TV"
                        count={tv}
                        isActive={mediaType === 'TV'}
                        handleClick={() => setMediaType('TV') } />
                    <div className="border-r-2 h-4 border-[#6e859e] rotate-25"></div>
                    <CustomMenu
                        text="TV Short"
                        count={tvShort}
                        isActive={mediaType === 'TV_SHORT'}
                        handleClick={() => setMediaType('TV_SHORT') } />
                    <div className="border-r-2 h-4 border-[#6e859e] rotate-25"></div>
                    <CustomMenu
                        text="Movie"
                        count={movie}
                        isActive={mediaType === 'MOVIE'}
                        handleClick={() => setMediaType('MOVIE') } />
                    <div className="border-r-2 h-4 border-[#6e859e] rotate-25"></div>
                    <CustomMenu
                        text="OVA-ONA-Special"
                        count={special}
                        isActive={mediaType === 'ONA_OVA_SPECIAL'}
                        handleClick={() => setMediaType('ONA_OVA_SPECIAL') } />
                    <div className="border-r-2 h-4 border-[#6e859e] rotate-25"></div>
                    <CustomMenu
                        text="Music"
                        count={other}
                        isActive={mediaType === 'OTHER'}
                        handleClick={() => setMediaType('OTHER') } />
                </div>
            </div>
        </PageWrapper>
        {
            isLoading ? <CardsLoaderView />
            : <PageWrapper>
                <ViewModes />
                {
                    yearsCollection.map((year, index) => {
                        const animesPerYear = getAnimesPerYear(year)
                        return animesPerYear && animesPerYear.length > 0 && <div key={index}>
                            { displayMedias(animesPerYear, year) }
                        </div>
                    })
                }
            </PageWrapper>
        }
    </>

    
}

export default MediaPerStudio