import { createContext, useState, useEffect } from "react"

export const navContext = createContext()

// animation of navigation bars' behavior whhile scrolling 
const NavigationContext = ({ children }) => {

    const [showNavbar, setShowNavbar] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    // on mobile viewport, test if the navigation links are hidden or not
    const [isHidden, setIsHidden] = useState(true)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
        
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                showNavbar && setShowNavbar(false)
            } else {
                // Scrolling up
                !showNavbar && setShowNavbar(true)
            }
        
            setLastScrollY(currentScrollY)
        }
    
        window.addEventListener('scroll', handleScroll)
    
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [lastScrollY])

    return (
        <navContext.Provider value={{ showNavbar, isHidden, setIsHidden }}>
            { children }
        </navContext.Provider>
    )
}

export default NavigationContext
