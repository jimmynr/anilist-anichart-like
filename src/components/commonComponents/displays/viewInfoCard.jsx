
import { forwardRef, useContext } from "react"

import { displayContext } from "../../../context/displayContext"

import MinInfoCard from "./minInfoCard"
import MaxInfoCard from "./maxInfoCard"
import AvgInfoCard from "./avgInfoCard"

import { useLocation } from "react-router-dom"
import AiringInfoCard from "./airingInfoCard"

const CardsView = forwardRef(({ media, rank = null, airingInfo = null }, ref) => {

    const location = useLocation()
    const isAiringPage = location.pathname === "/airing"

    const { type } = useContext(displayContext)

    return !isAiringPage ? (
            type === "MIN" ? <MinInfoCard ref={ref} media={media} rank={rank} />
            : type === "MAX" ? <MaxInfoCard ref={ref} media={media} rank={rank} airingInfo={airingInfo} />
            : <AvgInfoCard ref={ref} media={media} rank={rank} />
        )
        : (
            type === "MAX" ? <MaxInfoCard ref={ref} media={media} rank={rank} airingInfo={airingInfo} />
            : <AiringInfoCard media={media} airingInfo={airingInfo} />
        )
})

export default CardsView
