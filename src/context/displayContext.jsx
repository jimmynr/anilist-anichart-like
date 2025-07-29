import { createContext, useState } from "react"

export const displayContext = createContext()

const DisplayContext = ({ children }) => {

    const [type, setType] = useState("")

    return <displayContext.Provider value = {{ type, setType }}>
        { children }
    </displayContext.Provider>
}

export default DisplayContext