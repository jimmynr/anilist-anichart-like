import { useContext } from "react"

import { displayContext } from "../../../context/displayContext"

import SingleMinCardsLoader from "./singleMinCardLoader"
import SingleMaxCardsLoader from "./singleMaxCardsLoader"

const ViewSingleCardsLoader = () => {

    const { type } = useContext(displayContext)

    return type === "MIN" ? <SingleMinCardsLoader />
    : <SingleMaxCardsLoader />
}

export default ViewSingleCardsLoader
