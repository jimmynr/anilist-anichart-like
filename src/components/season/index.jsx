import { nextIcon, previousIcon } from '../commonComponents/icons'

import Sort from '../commonComponents/dropdowns/sortDropdown'

import { Outlet, Link, useLocation } from 'react-router-dom'

import { seasonsCombination, seasonsEn, yearsCollection } from '../../anilist-api/constantsUtil'
import { setIcon } from '../../anilist-api/fonctionsUtil'

import { useState, useEffect, useContext } from 'react'

import { Tooltip } from 'react-tooltip'

import { navContext } from '../../context/navigationContext'

import { motion, AnimatePresence } from "motion/react"

import { useMediaQuery } from 'react-responsive'

const Season = () => {
    /* Screen size for mobile */
    const isMobile = useMediaQuery({ maxWidth: 720 })
    /* Screen size for mobile */

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

    /* Context */
    // behavior while scrolling and toggle button menu being clicked
    const navCtxt = useContext(navContext)
    const { showNavbar, isHidden } = navCtxt
    /* Context */

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
                    return <div key={index}>
                        <Link
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
                    </div>
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

    const navTopStyle = {
        top: isMobile && isHidden ? "3.75rem" 
        : isMobile && !isHidden ? "6.25rem"
        : "3.75rem" 
    }

    return(
        <>  
            <AnimatePresence>
                { showNavbar &&       
                    <motion.div 
                        key="navigationBar"
                        initial={{ marginLeft: "100%", opacity: 0, ...navTopStyle }}
                        animate={{ marginLeft: "8px", opacity: 1, ...navTopStyle }}
                        exit={{ marginLeft: "100%", opacity: 0, ...navTopStyle }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="my-2 px-5 md:px-10 lg:px-10 xl:px-10 py-2 bg-[#41B1EA] font-bold rounded-md flex justify-between items-center fixed w-full md:top-15 lg:top-15 xl:top-15 z-10"
                        style={navTopStyle}
                    >
                        <div className='flex items-center gap-2 text-[#2B2D42]'>
                            <Sort sortMediasBy={sortMediasBy} />
                            <p className='text-xs'>{sortCriteria}</p>
                        </div>
                        
                            <div                                 
                                className='flex items-center gap-2'
                            >{displaySeasonsNavigation()}</div> 
                    </motion.div>
                }
            </AnimatePresence>

            <Outlet context={{ sortCriteria }} />
        </>
    )
}

export default Season