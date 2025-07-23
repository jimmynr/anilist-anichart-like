import { infoIcon, navigationMenuIcon, navigationCloseIcon } from '../commonComponents/icons'

import { motion, AnimatePresence } from "motion/react"

import { getCurrentSeason } from '../../anilist-api/fonctionsUtil'

import Logo from '../logo'

import { useState } from 'react'

import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { useMediaQuery } from 'react-responsive'

import './index.css'

const NavBar = () => {
    /* Screen size for mobile */
    const isMobile = useMediaQuery({ maxWidth: 720 })
    /* Screen size for mobile */

    /* States */
    const [isHidden, setIsHidden] = useState(true)
    // add opacity &t 50% when on media page, else opacity 100%
    const [mediaHStyle, setMediaHStyle] = useState(true)
    /* States */    

    /* url and redirection */
    const location = useLocation()   
    const navigateTo = useNavigate()
    /* url and redirection */

    /* info/doc button */
    const infoBtn = <motion.button
            whileHover={{ scale: 1.2 }}
        >
            <Link 
                to="/doc" 
                className='text-[#41B1EA] border-b-1 rounded-full min-w-8 h-8 flex items-center justify-center'>
                {infoIcon}
            </Link>
        </motion.button>
    /* info/doc button */

    /* Main navigation links */
    const navigation = <div id='navigation' className='flex flex-col w-full'>
        <div className='flex justify-center text-[#BCBEDC] font-bold text-sm'>
            <NavLink to='/search/anime' className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>Search</NavLink>
            <NavLink to={`/season/${getCurrentSeason().season.toLocaleLowerCase()}/${getCurrentSeason().year}`} className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>Season</NavLink>
            <NavLink to='/studio' className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>Studio</NavLink>
            <NavLink to='/airing' className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>Airing</NavLink>
            <NavLink to='/404' className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>404</NavLink>
        </div>
    </div>
    /* Main navigation links */

    return(
        isMobile 
        ? <header 
            className={`hover:bg-[#2B2D42] h-fit py-1 px-5 flex flex-col items-end justify-between
            ${ location.pathname.startsWith('/media') && mediaHStyle ? ' mediaHeader' : 'mediaHeaderMouseover'}`}
            onMouseEnter={() => setMediaHStyle(!mediaHStyle)}
            onMouseLeave={() => setMediaHStyle(!mediaHStyle)}
        >
            <div className='flex flex-row items-center justify-between w-full'>
                <button 
                    className='text-white cursor-pointer'
                    onClick={() => setIsHidden(!isHidden)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={!isHidden ? "pause" : "play"}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.3 }}
                        >
                            {!isHidden ? navigationCloseIcon : navigationMenuIcon }
                        </motion.div>
                    </AnimatePresence>
                </button>               
                <div className="w-xs flex justify-center">
                    <Link to='/'>
                        <Logo />
                    </Link>
                </div>
                { infoBtn }
            </div>
            
            <AnimatePresence>
                { !isHidden && 
                    <motion.div
                        key="links"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden w-full"
                    >
                        {navigation}
                    </motion.div>
                }
            </AnimatePresence>
        </header>

        : <header 
            className={`hover:bg-[#2B2D42] h-fit py-1 px-5 flex items-center justify-between
            ${ location.pathname.startsWith('/media') && mediaHStyle ? ' mediaHeader' : 'mediaHeaderMouseover'}`}
            onMouseEnter={() => setMediaHStyle(!mediaHStyle)}
            onMouseLeave={() => setMediaHStyle(!mediaHStyle)}
        >
            <div className="w-xs flex justify-center">
                <NavLink 
                    to='/'
                >
                    <Logo />
                </NavLink>
            </div>

            { navigation }  
            
            { infoBtn }
        </header>
    )
}

export default NavBar