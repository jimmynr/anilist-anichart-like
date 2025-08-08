import { BsListUl } from "react-icons/bs"
import { BsFillGrid3X3GapFill } from "react-icons/bs"
import { BsFillGridFill } from "react-icons/bs"
import { BsFillGrid3X2GapFill } from "react-icons/bs"

import { useContext, useEffect, useState } from "react"

import { displayContext } from "../../../context/displayContext"
import { darkModeContext } from "../../../context/darkModeContext"

import { useLocation } from "react-router-dom"

const ViewModes = () => {
    const { isDarkMode } = useContext(darkModeContext)

    const [iconStyle, setIconStyle] = useState("")

    useEffect(() => {
        if (isDarkMode) setIconStyle("text-2xl fill-[#2B2D42] hover:fill-[#BCBEDC] cursor-pointer")
        else setIconStyle("text-2xl fill-[#BCBEDC] hover:fill-[#2B2D42] cursor-pointer")
    }, [isDarkMode])

    const location = useLocation()
    const isAiringPage = location.pathname === "/airing"

    const { type, setType } = useContext(displayContext)

    return  !isAiringPage ? <div className="flex gap-x-4 justify-end pr-4">
        <BsFillGrid3X3GapFill 
            onClick={() => setType("MIN")}
            style={{ fill: !isDarkMode ? (type === "MIN" ? "#2B2D42" : "#BCBEDC") : (type === "MIN" ? "#BCBEDC" : "#2B2D42")}}
            className={iconStyle} />
        <BsFillGridFill 
            onClick={() => setType("MAX")}
            style={{ fill: !isDarkMode ? (type === "MAX" ? "#2B2D42" : "#BCBEDC") : (type === "MAX" ? "#BCBEDC" : "#2B2D42")}}
            className={iconStyle} />
        <BsListUl 
            onClick={() => setType("AVG")}
            style={{ fill: !isDarkMode ? (type === "AVG" ? "#2B2D42" : "#BCBEDC") : (type === "AVG" ? "#BCBEDC" : "#2B2D42")}}
            className={iconStyle} />
    </div>
    : <div className="flex gap-x-4 justify-end pr-4">
        <BsFillGridFill 
            onClick={() => setType("MAX")}
            style={{ fill: !isDarkMode ? (type === "MAX" ? "#2B2D42" : "#BCBEDC") : (type === "MAX" ? "#BCBEDC" : "#2B2D42")}}
            className={iconStyle} />
        <BsFillGrid3X2GapFill 
            onClick={() => setType("AIRING")}
            style={{ fill: !isDarkMode ? (type === "AIRING" ? "#2B2D42" : "#BCBEDC") : (type === "AIRING" ? "#BCBEDC" : "#2B2D42")}}
            className={iconStyle} />
    </div>
}

export default ViewModes