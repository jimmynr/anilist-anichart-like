import Logo from '../logo'
import User from '../../images/User.gif'
import Menu from '../../images/Menu.png'

import { useState, useRef, useEffect } from 'react'

import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { useMediaQuery } from 'react-responsive'

import { seasonsCombinations, first_year, last_year, anime_season_en_fr, setIcon, getCurrentSeason } from '../../anilist-api/constants'

import './index.css'

const NavBar = () => {

    const location = useLocation()   
    const navigateTo = useNavigate()

    const [currentY, setCurrentY] = useState(getCurrentSeason().year)
    const [previousState, setPreviousState] = useState(false)
    const [nextState, setNextState] = useState(false) 
    const isMobile = useMediaQuery({ maxWidth: 950 })
    const [isHidden, setIsHidden] = useState(false)
    const [mediaHStyle, setMediaHStyle] = useState(true)

    // return the previous path
    const usePreviousPath = () => {
        const prevPathRef = useRef(null)
      
        useEffect(() => {
            prevPathRef.current = location.pathname
        }, [location.pathname])
      
        return prevPathRef.current
    }

    const previousPath = usePreviousPath()

    // reset the navigation bar so that it does not display the year of the previous page
    useEffect(() => {
        if (
            location.pathname.startsWith('/season') &&
            previousPath &&
            !previousPath.startsWith('/season')
        ) {
            setCurrentY(getCurrentSeason().year)
        }
    }, [location.pathname, previousPath])

    useEffect(() => {
        // test if the page is reloaded
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0 && navEntries[0].type === "reload" && location.pathname.includes('/season')) {
            navigateTo('/season')
        } else {
            // first load or normal navigation
        }
    }, [])

    useEffect(() => {
        setIsHidden(!isMobile)
    }, [isMobile])

    const iconPreviousRef = useRef(null)
    const iconNextRef = useRef(null)

    const handlePage = (direction) => {
        let newY = 0
        if(direction === 'previous') {
            newY = currentY - 1
            // enable iconNext
            iconNextRef.current.classList.add('text-[#BCBEDC]', 'hover:text-white', 'hover:cursor-pointer', 'hover:bg-gray-700')
            iconNextRef.current.classList.remove('brightness-0')
            setNextState(false)

            if(newY === first_year) {
                // disable iconPrevious
                iconPreviousRef.current.classList.add('brightness-0')
                iconPreviousRef.current.classList.remove('text-[#BCBEDC]', 'hover:text-white', 'hover:cursor-pointer', 'hover:bg-gray-700')
                setPreviousState(true)
            }
        } else {
            newY = currentY + 1

            // enable iconPrevious
            iconPreviousRef.current.classList.add('text-[#BCBEDC]', 'hover:text-white', 'hover:cursor-pointer', 'hover:bg-gray-700')
            iconPreviousRef.current.classList.remove('brightness-0')
            setPreviousState(false)

            if(newY === last_year) {
                // disable iconNext
                iconNextRef.current.classList.add('brightness-0')
                iconNextRef.current.classList.remove('text-[#BCBEDC]', 'hover:text-white', 'hover:cursor-pointer', 'hover:bg-gray-700')
                setNextState(true)
            }
        }

        setCurrentY(newY)
    }

    const dispalyArrow = direction => {

        const currentRef = direction === 'left' ? iconPreviousRef : iconNextRef
        const currentId = direction === 'left' ? 'previous' : 'next'
        const currentStyle = direction === 'left' 
        ? 'px-4 py-2 text-[#BCBEDC] hover:text-white hover:cursor-pointer hover:bg-gray-700' 
        : 'px-4 py-2 text-[#BCBEDC] hover:text-white hover:cursor-pointer hover:bg-gray-700 rotate-180'
        const currentState = direction === 'left' ? previousState : nextState

        return location.pathname.includes('/season') && <button 
            className={ currentStyle }
            onClick={() => handlePage(currentRef.current.id)}
            id={ currentId }
            ref={ currentRef }
            disabled={ currentState }
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                width={30}
                height={30}
                fill="currentColor"
            >
                <g>
                    <path d="M12,2A10,10,0,1,0,22,12,10.011,10.011,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,12,20Z"/>
                    <polygon points="13.293 7.293 8.586 12 13.293 16.707 14.707 15.293 11.414 12 14.707 8.707 13.293 7.293"/>
                </g>
            </svg>
        </button>
    }
    

    const displayNavs = (currentYear = currentY) => {

        return location.pathname.includes('/season') &&
        seasonsCombinations.map((comb, index) => {
            return comb.year === currentYear && (
                <div key={index} className='text-[#BCBEDC] font-bold'>
                    <Link to={`/season/${comb.season.toLowerCase()}/${comb.year}`}>
                        <div className='flex flex-col justify-center items-center px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>
                            <div>{ setIcon(comb.season) }</div>
                            <div className='text-sm'>{anime_season_en_fr[comb.season]}</div>
                            <div className='text-xs'>{comb.year}</div>
                        </div>
                    </Link>
                </div>
            )
        })
    } 

    const profileBtn = <button className='size-14 flex items-center justify-center'>
        <img 
            className="size-12 rounded-full hover:size-14" 
            src={User}
            alt="User" 
        />
    </button>

    return(
        isMobile 
        ? <header 
            className={`hover:bg-[#2B2D42] min-h-20 h-fit p-5 flex flex-col items-start justify-between
            ${ location.pathname.startsWith('/media') && mediaHStyle ? ' mediaHeader' : 'mediaHeaderMouseover'}`}
            onMouseEnter={() => setMediaHStyle(!mediaHStyle)}
            onMouseLeave={() => setMediaHStyle(!mediaHStyle)}
        >
            <div className='flex flex-row items-center justify-between w-full mb-4'>
                <div 
                    className='p-2 border-4 border-[#D2D2D4] rounded-md cursor-pointer'
                    onClick={() => setIsHidden(!isHidden)}
                >
                    <img src={ Menu } alt="Menu" className='size-6' />
                </div>               
                <div className="w-xs flex justify-center">
                    <NavLink 
                        to='/'
                    >
                        <Logo />
                    </NavLink>
                </div>
                { profileBtn }
            </div>

            {
                isHidden && 
                <div id='navigation' className='flex flex-col w-full'>
                    {
                        isMobile 
                        ? <>
                            <div className='flex flex-col justify-start text-[#BCBEDC] font-bold'>
                                <NavLink 
                                    to='/'
                                    className='text-white bg-[#11161D] px-4 py-2 rounded-md'
                                >
                                    Explorer
                                </NavLink>
                                <NavLink to='/season' className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>Saison</NavLink>
                                <NavLink to='/studio' className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>Studio</NavLink>
                                <NavLink to='/airing' className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>Planning</NavLink>
                                <NavLink to='/profil' className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>Profil</NavLink>
                            </div>
                            
                            <div className='flex flex-row justify-center items-center mt-5'>
                                { dispalyArrow('left') }
                                { displayNavs() }
                                { dispalyArrow('right') }
                            </div>
                        </> 
                        : <>
                            <div className='flex flex-row justify-center text-[#BCBEDC] font-bold'>
                                <NavLink 
                                    to='/'
                                    className='text-white bg-[#11161D] px-4 py-2 rounded-md'
                                >
                                    Explorer
                                </NavLink>
                                <NavLink to='/season' className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>Saison</NavLink>
                                <NavLink to='/studio' className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>Studio</NavLink>
                                <NavLink to='/airing' className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>Planning</NavLink>
                                <NavLink to='/profil' className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>Profil</NavLink>
                            </div>
                            
                            <div className='flex flex-row justify-center items-center mt-5'>
                                { dispalyArrow('left') }
                                { displayNavs() }
                                { dispalyArrow('right') }
                            </div>
                        </>
                    }                    
                </div>  
            }
        </header>

        : <header 
            className={`hover:bg-[#2B2D42] min-h-20 h-fit p-5 flex flex-row items-start justify-between 
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

            <div id='navigation' className='flex flex-col'>
                <div className='flex flex-row justify-center text-[#BCBEDC] font-bold'>
                    <NavLink 
                        to='/'
                        className='text-white bg-[#11161D] px-4 py-2 rounded-md'
                    >
                        Explorer
                    </NavLink>
                    <NavLink to='/season' className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>Saison</NavLink>
                    <NavLink to='/studio' className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>Studio</NavLink>
                    <NavLink to='/airing' className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>Planning</NavLink>
                    <NavLink to='/profil' className='px-4 py-2 hover:text-white hover:bg-gray-700 hover:rounded-md'>Profil</NavLink>
                </div>
                
                <div className='flex flex-row justify-center items-center mt-5'>
                    { dispalyArrow('left') }
                    { displayNavs() }
                    { dispalyArrow('right') }
                </div>                   
            </div>  
            
            { profileBtn }
        </header>
    )
}

export default NavBar