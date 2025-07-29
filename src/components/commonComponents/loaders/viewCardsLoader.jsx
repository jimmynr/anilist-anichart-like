
import { useContext } from "react"

import { displayContext } from "../../../context/displayContext"

import MinCardsLoader from "./minCardsLoader"
import MaxCardsLoader from "./maxCardsLoader"
import AvgCardsLoader from "./avgCardsLoader"

const CardsLoaderView = ({ main }) => {

    const { type } = useContext(displayContext)

    return type === "MIN" ? <MinCardsLoader main={main} />
        : type === "MAX" ? <MaxCardsLoader main={main} />
        : <AvgCardsLoader main={main} />
}

export default CardsLoaderView
