import { nextIcon, previousIcon } from '../commonComponents/icons'

import Sort from '../commonComponents/sort'

import { Outlet, Link, useLocation } from 'react-router-dom'

import { seasonsCombination, seasonsEn, yearsCollection } from '../../anilist-api/constantsUtil'
import { setIcon } from '../../anilist-api/fonctionsUtil'

import { useState, useEffect } from 'react'

import { Tooltip } from 'react-tooltip'


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
                    return <>
                        <Link
                                key={index}
                                to={`/season/${link.season.toLowerCase()}/${link.year}`}
                                id={link.season.toLocaleLowerCase()}
                                className={`flex items-center gap-1
                                ${isCurrentSeason && !resetNavStyle ? "text-[#2B2D42]" : "text-white hover:text-[#2B2D42]"}`}
                                onClick={() => navigateToNewSeason(link)}
                        >
                            <div>{ setIcon(link.season) }</div>
                            { isCurrentSeason && !resetNavStyle && <div className='text-xs capitalize'>{seasonsEn[index].toLocaleLowerCase()}</div> }
                        </Link>
                    
                        <Tooltip
                            anchorSelect={`#${link.season.toLocaleLowerCase()}`}
                            content={link.season.toLocaleLowerCase()}
                            place='bottom-end'
                            className='capitalize'
                        />
                    </>
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