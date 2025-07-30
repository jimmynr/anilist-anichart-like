import { BsListUl } from "react-icons/bs"
import { BsFillGrid3X3GapFill } from "react-icons/bs"
import { BsFillGridFill } from "react-icons/bs"
import { BsFillGrid3X2GapFill } from "react-icons/bs"

import { useContext } from "react"

import { displayContext } from "../../../context/displayContext"

import { useLocation } from "react-router-dom"

const ViewModes = () => {

    const location = useLocation()
    const isAiringPage = location.pathname === "/airing"

    const { type, setType } = useContext(displayContext)

    return  !isAiringPage ? <div className="flex gap-x-4 justify-end pr-4">
        <BsFillGrid3X3GapFill 
            onClick={() => setType("MIN")}
            style={{ color: type === "MIN" ? "#2B2D42" : "#BCBEDC"}}
            className="text-2xl text-[#BCBEDC] hover:text-[#2B2D42] cursor-pointer" />
        <BsFillGridFill 
            onClick={() => setType("MAX")}
            style={{ color: type === "MAX" ? "#2B2D42" : "#BCBEDC"}}
            className="text-2xl text-[#BCBEDC] hover:text-[#2B2D42] cursor-pointer" />
        <BsListUl 
            onClick={() => setType("AVG")}
            style={{ color: type === "AVG" ? "#2B2D42" : "#BCBEDC"}}
            className="text-2xl text-[#BCBEDC] hover:text-[#2B2D42] cursor-pointer" />
    </div>
    : <div className="flex gap-x-4 justify-end pr-4">
        <BsFillGridFill 
            onClick={() => setType("MAX")}
            style={{ color: type === "MAX" ? "#2B2D42" : "#BCBEDC"}}
            className="text-2xl text-[#BCBEDC] hover:text-[#2B2D42] cursor-pointer" />
        <BsFillGrid3X2GapFill 
            onClick={() => setType("AIRING")}
            style={{ color: type === "AIRING" ? "#2B2D42" : "#BCBEDC"}}
            className="text-2xl text-[#BCBEDC] hover:text-[#2B2D42] cursor-pointer" />
    </div>
}

export default ViewModes