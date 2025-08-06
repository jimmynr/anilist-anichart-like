
import { useContext } from "react"

import { displayContext } from "../../../context/displayContext"

import MinCardsLoader from "./minCardsLoader"
import MaxCardsLoader from "./maxCardsLoader"
import AvgCardsLoader from "./avgCardsLoader"

const CardsLoaderView = ({ main = true }) => {

    const { type } = useContext(displayContext)

    if (type === "MIN") return <MinCardsLoader main={main} />
    if (type === "AVG") return <AvgCardsLoader main={main} />
    if (type === "MAX") return <MaxCardsLoader main={main} />
}

export default CardsLoaderView
