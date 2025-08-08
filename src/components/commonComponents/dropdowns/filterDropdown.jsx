import { useRef, useEffect, useState } from "react"

import { navigationCloseIcon, drowpDownIcon, checkedIcon } from "../icons"

const FilterDropdown = ({ state, setState, property, collection, allowsManyChoices }) => {
    const genresNb = state.genres.length + state.tags.length

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

    const addFilterUpdateState = (property, item) => {
      setState(prev => {
          const alreadySelected = Array.isArray(prev[property]) && prev[property].includes(item.value)
          const newPropertyArray = alreadySelected
              ? Array.isArray(prev[property]) && prev[property].filter(p => p !== item.value)
              : [...prev[property], item.value]
      
          return {
              ...prev,
              [property]: newPropertyArray
          }
      })
    }

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
          (e, item) => {
            setKeyword("")
            setIsTyping(false)

            if (allowsManyChoices) {
              if (property === "genres") {
                const propertyType = e.target.dataset.type
                propertyType === "genre" ? addFilterUpdateState("genres", item)
                : addFilterUpdateState("tags", item)
              } else {
                addFilterUpdateState(property, item)
                // setState(prev => {
                //     const alreadySelected = Array.isArray(prev[property]) && prev[property].includes(item.value)
                //     const updatedProperty = alreadySelected
                //         ? Array.isArray(prev[property]) && prev[property].filter(p => p !== item.value)
                //         : [...prev[property], item.value]
                
                //     return {
                //         ...prev,
                //         [property]: updatedProperty
                //     }
                // })
              }
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
              property === "genres" ? setState(prev => prev = { ...prev, genres: [], tags: [] })
              : setState(prev => prev = { ...prev, formats: [] })
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
          allowsManyChoices ? (state.formats.includes(item.value) || state.genres.includes(item.value) || state.tags.includes(item.value)) && <div>{checkedIcon}</div>
          : typeof state[property] === "string" && state[property].trim().toLowerCase() === item.value.toString().toLowerCase() && <div>{checkedIcon}</div>),
        /**
         * Display the user' choices into the input
         * Else, show "Any"
         */
        displaySelectedFilter : () => {

          if (allowsManyChoices)
            if (property === "formats" && state.formats.length > 0) {
              return <div 
                    className="absolute left-3 top-1/2 -translate-y-2/3 lg:-translate-y-1/2 flex"
                  >
                  <div className="text-xs font-semibold text-[#2B2D42] bg-[#6e859e] rounded-full px-2">
                    { collection.filter(f => f.value === state.formats[0])[0].label   }
                  </div>
                  { 
                    state.formats.length > 1 && <div className="ms-2 text-xs font-semibold text-[#2B2D42] bg-[#6e859e] rounded-full px-2">
                      +{state.formats.length - 1}
                    </div> 
                  }
                </div>
            } else  if (property === "genres" && (state.genres.length > 0 || state.tags.length > 0)) {
              let displayGenres

              if (state.genres.length > 0 && (state.tags.length > 0 || state.tags.length === 0)) {
                displayGenres = state.genres[0]
              } else if (state.genres.length === 0 && state.tags.length > 0) {
                displayGenres = state.tags[0]
              }

              return <div 
                  className="absolute left-3 top-1/2 -translate-y-2/3 lg:-translate-y-1/2 flex"
                >
                <div className="text-xs font-semibold text-[#2B2D42] bg-[#6e859e] rounded-full px-2">
                  { displayGenres }
                </div>
                { 
                  genresNb > 1 && <div className="ms-2 text-xs font-semibold text-[#2B2D42] bg-[#6e859e] rounded-full px-2">
                    +{genresNb - 1}
                  </div> 
                }
              </div>
            } else return <div className="absolute left-3 top-1/2 -translate-y-2/3 lg:-translate-y-1/2 text-xs font-semibold px-2">Any</div>
            
          else 
            return state[property] && state[property].toString() !== "" 
            ? <div className="absolute left-3 top-1/2 -translate-y-2/3 lg:-translate-y-1/2 text-xs font-semibold text-[#2B2D42] bg-[#6e859e] rounded-full px-2">
              {
                property === "status" ? collection.filter(s => s.value === state[property])[0].label
                : state[property]
              }
            </div>
            : <div className="absolute left-3 top-1/2 -translate-y-2/3 lg:-translate-y-1/2 text-xs font-semibold px-2">Any</div>
        },
        /**
         * Update a state to verify if the user is typing or not
         * Then we can show the only options corresponding to the input
         */
        handleTyping : e => {
            setKeyword(e.target.value)
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

        return collection.filter(item => item.label.toString().toLowerCase().includes(keyword.toLowerCase())).map((item, index) => {
            return <div 
                key={index}
                data-type={"type" in item ? item.type : ""} 
                className="text-sm p-2 font-semibold cursor-pointer hover:text-white hover:bg-[#2B2D42] hover:rounded-md
                flex justify-between items-center capitalize"
                onClick={e => handler(property).addFilter(e, item)}
            >
                {item.label}
                {handler(property).checkFilter(item)}
            </div>
        })
    }
    /* dropdown constuctor */

    const openDropdownIcon = <div 
        className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
        hover:border hover:rounded-sm cursor-pointer"
        onClick={() => setOpen(true)}
    >{drowpDownIcon}</div>

    const closeDropdownIcon = <div 
        className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
        hover:border hover:rounded-sm cursor-pointer"
        onClick={() => handler(property).resetFilter()}
    >{navigationCloseIcon}</div>

    return <>
        <div className="relative w-full">
            <input
                type="text"
                className="text-[#6e859e] text-sm bg-white dark:bg-[#151F2E] pl-5 pb-1 pr-10 rounded-sm w-full h-10 mb-2 lg:mb-0 min-w-[172px]
                shadow-lg"
                value={keyword}
                onClick={() => setOpen(true)}
                onChange={e => handler(property).handleTyping(e)}
                // onBlur={() => }
            />

            {/* Dispplay icon for opening dropdown*/}
            { (!allowsManyChoices && !state[property]) && openDropdownIcon }

            { property === "formats" && allowsManyChoices && state.formats.length === 0 && openDropdownIcon }

            { property === "genres" && allowsManyChoices && state.genres.length === 0 && state.tags.length === 0 && openDropdownIcon }
            {/* Dispplay icon for opening dropdown*/}

            {/* Dispplay icon for Closing dropdown*/}
            { (!allowsManyChoices && state[property]) && closeDropdownIcon }   

            { property === "formats" && allowsManyChoices && state.formats.length > 0 && closeDropdownIcon }

            { property === "genres" && allowsManyChoices && (state.genres.length > 0 || state.tags.length > 0) && closeDropdownIcon }  
            {/* Dispplay icon for Closing dropdown*/}  

            { !isTyping && handler(property).displaySelectedFilter() }
        </div>
        { 
        open && <div 
              ref={dropdownRef} 
              className="z-10 absolute mt-4 p-4 rounded-sm w-full bg-white dark:bg-[#151F2E] max-h-80 overflow-y-auto custom-scrollbar shadow-lg">
                {displayDropdown()}
            </div>
        }
    </>
}

export default FilterDropdown
