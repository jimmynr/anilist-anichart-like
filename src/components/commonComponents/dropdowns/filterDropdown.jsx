import { useRef, useEffect, useState } from "react"

import { navigationCloseIcon, drowpDownIcon, checkedIcon } from "../icons"

const FilterDropdown = ({ state, setState, property, collection, allowsManyChoices }) => {
    const [open, setOpen] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [keyword, setKeyword] = useState("")
    const dropdownRef = useRef(null)

    /* Hide dropdown while clicking outside */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
              setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])
    /* Hide dropdown while clicking outside */

    /* return functions to handle all animation in relation with the dropdown */
    const handler = property => {
      return {
        /**
         * Selecting an option
         * Put the input's value into "" if there is a value
         * We're not typing anything
         * If the user is allowed to choose many options, add many options the user choose into the state 
         * Else, change the state's value according the unique choice
         */
        addFilter :
          item => {
            setKeyword("")
            setIsTyping(false)
            if (allowsManyChoices) {
              setState(prev => {
                  const alreadySelected = prev[property].includes(item.value)
                  const newItem = alreadySelected
                      ? prev[property].filter(p => p !== item.value)
                      : [...prev[property], item.value]
              
                  return {
                      ...prev,
                      [property]: newItem
                  }
              })
            } else if(property === "season") {
              if (!state.year)
                setState(prev => ({...prev, year: new Date().getFullYear(), [property]: item.value}))
              setState(prev => ({...prev, [property]: item.value}))
            } else {
              setState(prev => ({...prev, [property]: item.value}))
            }
        },
        /**
         * Removing a filter
         * If the user is allowed to choose many options, initialize the state to []
         * Else, if the property to update is year, check if the filter season has a value, if yes put into the state year
         * the actual year, else put ""
         * Finnaly, if the filter season is empty, put year into ""
         */
        resetFilter : () => {
            setKeyword("")
            if (allowsManyChoices) {
              setState(prev => prev = { ...prev, [property]: [] })
            } else if (property === "year") {
              setState(prev => ({...prev, year: prev.season !== "" ? new Date().getFullYear() : ""}))
            } else {
              setState(prev => ({...prev, [property]: ""}))
            }
        },
        /**
         * Add an icon checked near the selected elements
         */
        checkFilter : item => (
          allowsManyChoices ? state[property].includes(item.value) && <div>{checkedIcon}</div>
          : state[property].toString().trim().toLocaleLowerCase() === item.value.toString().toLocaleLowerCase() && <div>{checkedIcon}</div>),
        /**
         * Display the user' choices into the input
         * Else, show "Any"
         */
        displaySelectedFilter : () => {
          if (allowsManyChoices)
            return state[property] && state[property].length > 0 ? <div 
                    className="absolute left-3 top-1/2 -translate-y-2/3 lg:-translate-y-1/2 flex"
                >
                <div className="text-xs font-semibold text-[#2B2D42] bg-[#6e859e] rounded-full px-2">{state[property][0]}</div>
                { state[property].length > 1 && 
                <div className="ms-2 text-xs font-semibold text-[#2B2D42] bg-[#6e859e] rounded-full px-2">+{state[property].length - 1}</div> }
            </div>
            : state[property].length === 1 ? <div className="absolute left-3 top-1/2 -translate-y-2/3 lg:-translate-y-1/2 text-xs font-semibold text-[#2B2D42] bg-[#6e859e] rounded-full px-2">{state[property][0]}</div>
            : <div className="absolute left-3 top-1/2 -translate-y-2/3 lg:-translate-y-1/2 text-xs font-semibold px-2">Any</div>
          else 
            return state[property] && state[property].toString() !== "" 
            ? <div className="absolute left-3 top-1/2 -translate-y-2/3 lg:-translate-y-1/2 text-xs font-semibold text-[#2B2D42] bg-[#6e859e] rounded-full px-2">{state[property]}</div>
            : <div className="absolute left-3 top-1/2 -translate-y-2/3 lg:-translate-y-1/2 text-xs font-semibold px-2">Any</div>
        },
        /**
         * Update a state to verify if the user is typing or not
         * Then we can show the only options corresponding to the input
         */
        handleTyping : e => {
            setKeyword(e.target.value.trim())
            if (e.target.value.trim().length !== 0)
                setIsTyping(true)
            else 
                setIsTyping(false)
        }
      }
    }
    /* return functions to handle all animation in relation with the dropdown */

    /* dropdown constuctor */
    const displayDropdown = () => {

      return collection.filter(item => item.value.toString().toLocaleLowerCase().includes(keyword.toLocaleLowerCase())).map((item, index) => {
          return <div 
              key={index} 
              className="text-sm p-2 font-semibold cursor-pointer hover:text-white hover:bg-[#2B2D42] hover:rounded-md
              flex justify-between items-center capitalize"
              onClick={() => handler(property).addFilter(item)}
          >
              {item.label}
              {handler(property).checkFilter(item)}
          </div>
      })
  }
    /* dropdown constuctor */

    return <>
        <div className="relative w-full">
            <input
                type="text"
                className="text-[#6e859e] text-sm bg-white pl-5 pb-1 pr-10 rounded-sm w-full h-10 mb-2 lg:mb-0 min-w-[172px]
                shadow-lg"
                value={keyword}
                onClick={() => setOpen(true)}
                onChange={e => handler(property).handleTyping(e)}
            />

            {((!allowsManyChoices && !state[property]) || (allowsManyChoices && state[property].length === 0)) && <div 
                className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
                hover:border hover:rounded-sm cursor-pointer"
                onClick={() => setOpen(true)}
            >{drowpDownIcon}</div>
            }   

            {((!allowsManyChoices && state[property]) || (allowsManyChoices && state[property].length > 0)) && <>
                  <div 
                      className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
                      hover:border hover:rounded-sm cursor-pointer"
                      onClick={() => handler(property).resetFilter()}
                  >{navigationCloseIcon}</div>
              </>
            }       

            { !isTyping && handler(property).displaySelectedFilter() }
        </div>
        { 
        open && <div 
              ref={dropdownRef} 
              className="z-10 absolute mt-4 p-4 rounded-sm w-full bg-white max-h-80 overflow-y-auto custom-scrollbar shadow-lg">
                {displayDropdown()}
            </div>
        }
    </>
}

export default FilterDropdown
