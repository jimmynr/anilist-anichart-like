
import { forwardRef, useContext } from "react"

import { displayContext } from "../../../context/displayContext"

import MinInfoCard from "./minInfoCard"
import MaxInfoCard from "./maxInfoCard"
import AvgInfoCard from "./avgInfoCard"

const CardsView = forwardRef(({ media, rank = null }, ref) => {

    const { type } = useContext(displayContext)

    return type === "MIN" ? <MinInfoCard ref={ref} media={media} rank={rank} />
        : type === "MAX" ? <MaxInfoCard ref={ref} media={media} rank={rank} />
        : <AvgInfoCard ref={ref} media={media} rank={rank} />
})

export default CardsView
