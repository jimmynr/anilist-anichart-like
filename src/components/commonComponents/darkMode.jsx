
import { DarkModeSwitch } from 'react-toggle-dark-mode'

import { useContext } from 'react'

import { darkModeContext } from '../../context/darkModeContext'

const DarkModeToggle = () => {
    const { isDarkMode, setDarkMode } = useContext(darkModeContext)

    const toggleDarkMode = (checked) => {
        setDarkMode(checked)
        localStorage.setItem("darkMode", checked)
    }

    return (
        <DarkModeSwitch
          checked={isDarkMode}
          onChange={toggleDarkMode}
          size={26}
          moonColor='#BCBEDC'
          sunColor='#41B1EA'
        />
    )
}

export default DarkModeToggle