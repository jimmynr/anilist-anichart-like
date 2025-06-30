
import { DarkModeSwitch } from 'react-toggle-dark-mode'

import { useState } from 'react'

const DarkMode = () => {
  const [isDarkMode, setDarkMode] = useState(false)

  const toggleDarkMode = (checked) => {
    setDarkMode(checked)
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

export default DarkMode