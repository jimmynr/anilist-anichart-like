import { nextIcon, previousIcon } from '../commonComponents/icons'

import Sort from '../commonComponents/sort'

import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'

import { seasonsCombination, seasonsEn, yearsCollection } from '../../anilist-api/constantsUtil'
import { getCurrentSeason, setIcon } from '../../anilist-api/fonctionsUtil'

import { useState, useEffect, useRef } from 'react'

const Season = () => {

    const location = useLocation()

    const getCurrentSeasonFromUrl = () => {
        const urlInfos = location.pathname.split("/")
        return {
            season: urlInfos[2],
            year: Number(urlInfos[3])
        }
    }
    const currentSeasonFromUrl = getCurrentSeasonFromUrl()

    /* States */
    const [currentSeason, setCurrentSeason] = useState(currentSeasonFromUrl)
    const [resetNavStyle, setResetNavStyle] = useState(false)
    const [sortCriteria, setSortCriteria] = useState("Popularity")
    /* States */

    /* Add style to the active navigation according to the url */
    useEffect(() => {
        setCurrentSeason(getCurrentSeasonFromUrl())
    }, [location.pathname])
    /* Add style to the active navigation according to the url */

    /* Navigation to switch season and year */
    const changeYear = direction => {
        setCurrentSeason(prev => ({ ...prev, year: direction === "P" ? prev.year - 1 : prev.year + 1 }))
        setResetNavStyle(true)
    }

    const navigateToNewSeason = season => {
        setCurrentSeason(season)
        setResetNavStyle(false)
        setSortCriteria("Popularity")
    }

    const displaySeasonsNavigation = () => {

        const currentSeasonLinks = seasonsCombination.filter(sc => sc.year === currentSeason.year)

        return <>
            <button
                disabled={currentSeason.year === yearsCollection[yearsCollection.length - 1]}
                className='text-white cursor-pointer hover:text-[#2B2D42]'
                onClick={() => changeYear("P")}
            >{previousIcon}</button>
            { 
                currentSeasonLinks.map((link, index) => {
                    const isCurrentSeason = link.season === currentSeason.season.toUpperCase()
                    return <Link
                            key={index}
                            to={`/season/${link.season.toLowerCase()}/${link.year}`}
                            className={`flex items-center gap-1
                            ${isCurrentSeason && !resetNavStyle ? "text-[#2B2D42]" : "text-white hover:text-[#2B2D42]"}`}
                            onClick={() => navigateToNewSeason(link)}
                        >
                            <div>{ setIcon(link.season) }</div>
                            { isCurrentSeason && !resetNavStyle && <div className='text-xs capitalize'>{seasonsEn[index].toLocaleLowerCase()}</div> }
                
                        </Link>
                    }
                )
            }            
            <div className={`text-xs font-bold ${resetNavStyle ? "text-white" : "text-[#2B2D42]"}`}>[{currentSeason.year}]</div>
            <button 
                disabled={currentSeason.year === yearsCollection[0]}
                className='text-white cursor-pointer hover:text-[#2B2D42]'
                onClick={() => changeYear("N")}
            >{nextIcon}</button>
        </>
    } 

    const sortMediasBy = (criteria) => {
        setSortCriteria(criteria)
    }
    /* Navigation to switch season and year */

    /* Manage behavior after the user clicked the previous button */
    // const usePreviousPath = () => {
    //     const prevPathRef = useRef(null)
      
    //     useEffect(() => {
    //         prevPathRef.current = location.pathname
    //     }, [location.pathname])
      
    //     return prevPathRef.current
    // }

    // const previousPath = usePreviousPath()

    // // reset the navigation bar so that it does not display the year of the previous page
    // useEffect(() => {
    //     if (
    //         location.pathname.startsWith('/season') &&
    //         previousPath &&
    //         !previousPath.startsWith('/season')
    //     ) {
    //         setCurrentSeason(getCurrentSeason().year)
    //     } 
    // }, [location.pathname, previousPath])
    /* Manage behavior after the user clicked the previous button */

    return(
        <>        
            <div className='m-2 px-5 md:px-10 lg:px-10 xl:px-10 py-2 bg-[#41B1EA] font-bold rounded-md 
            flex justify-between items-center'>
                <div className='flex items-center gap-2 text-[#2B2D42]'>
                    <Sort sortMediasBy={sortMediasBy} />
                    <p className='text-xs'>{sortCriteria}</p>
                </div>
                <div className='flex items-center gap-2'>{displaySeasonsNavigation()}</div>
            </div>

            <Outlet context={{ sortCriteria }} />
        </>
    )
}

export default Season