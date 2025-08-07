import { createContext, useState, useEffect } from "react"

export const darkModeContext = createContext()

const DarkModeContext = ({ children }) => {
    const [isDarkMode, setDarkMode] = useState(false)

    useEffect(() => {
        const root = window.document.documentElement
        isDarkMode ? root.classList.add("dark")
        : root.classList.remove("dark")
    }, [isDarkMode])

    useEffect(() => {
        setDarkMode(localStorage.getItem("darkMode"))
    }, [])

    return <darkModeContext.Provider value={{ isDarkMode, setDarkMode }}>
        { children }
    </darkModeContext.Provider>
}

export default DarkModeContext