
import { useEffect, useState, useRef } from "react"

import { fetchAllStudios } from "../../anilist-api/constants"

import { IoIosClose } from "react-icons/io"

import { Link } from "react-router-dom"

import { HashLink } from 'react-router-hash-link'
import Loader from "../commonComponents/loader"

const Studio = () => {

    const [studios, setStudios] = useState([])
    const [keyword, setKeyword] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    const studiosRef = useRef([])

    const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
    const alphabetPart1 = [...'ABCDEFGHIJKLMN']
    const alphabetPart2 = [...'OPQRSTUVWXYZ&']

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchAllStudios()
            studiosRef.current = result
            setStudios(result)
        }

        fetchData()
    }, [])

    useEffect(() => {
        if((studios && studios.length > 0) || (studiosRef.current && studiosRef.current.length > 0)) {
            setIsLoading(false)
        } else {
            setIsLoading(true)
        }
    }, [studios])

    useEffect(() => {
        const updatedStudios = studiosRef.current.filter(studio => studio.name.toLowerCase().includes(keyword.toLowerCase()))

        setStudios(updatedStudios)
    }, [keyword])

    const displayStudiosStartingWithSpecialChara = studios => {
        const startsWithLetter = /^[a-zA-Z]/

        return studios.filter(studio => !startsWithLetter.test(studio.name)).map((studio, index) => {
            return <Link 
                key={index} 
                to={`/studio/${ studio.id }/${ studio.name }`}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-5 py-2 hover:px-0 hover:py-0 cursor-pointer"
            >
                <div 
                    className="bg-white rounded-sm h-full p-2 hover:bg-gray-700 hover:text-[#41B1EA]"
                >{studio.name}</div>
            </Link>
        })
    }

    const displayStudios = (studios, letter) => {
        
        return studios.filter(studio => 
            studio.name.toUpperCase().startsWith(letter)
        ).map((studio, index) => 
            <Link 
                key={index}
                to={`/studio/${ studio.id }/${ studio.name }`}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-5 py-2 hover:px-0 hover:py-0 cursor-pointer"
            >
                <div 
                    className="bg-white rounded-sm h-full p-2 hover:bg-gray-700 hover:text-[#41B1EA]"
                >{studio.name}</div>
            </Link>
        )
    }

    const displayAlphaNav = alpahbet => {
        return alpahbet.map((alpha, index) => {
            return <HashLink
                    smooth
                    to={`/studio/#section${ alpha === '&' ? 'Special' : alpha }`}
                    key={index}
                    className="p-2 hover:text-[#6e859e]"
                >{ alpha }</HashLink>
        })
    }

    return (
        <div className="flex flex-col flex-grow bg-[#EDF1F5] text-[#6e859e] px-10 pt-30 lg:pt-20 pb-10 relative">
            {
                isLoading ? <Loader header={`de la liste des studios d'animation`}/>
                :
                <>
                    <div className="flex justify-center">
                        <div
                            className='fixed top-30 lg:top-25 p-2 hover:bg-[#41B1EA] hover:text-white
                            rounded-sm shadow-lg z-50 font-bold text-xs flex flex-col lg:flex-row'
                        >
                            <div className="relative">
                                <input
                                    id="studioSearch"
                                    name="studioSearch"
                                    type="text"
                                    placeholder="Recherchez un studio..."
                                    className="text-[#6e859e] bg-white pl-2 pr-10 rounded-sm w-full h-8 mb-2 lg:mb-0"
                                    value={keyword}
                                    onChange={e => setKeyword(e.target.value)}
                                />
                                <IoIosClose
                                    className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
                                    hover:border hover:rounded-sm"
                                    onClick={() => setKeyword('')}
                                />
                            </div>
                            <div className="flex flex-row justify-center">
                                { displayAlphaNav(alphabetPart1) }
                            </div>
                            <div className="flex flex-row justify-center">
                                { displayAlphaNav(alphabetPart2) }
                            </div>
                        </div>
                    </div>
                    {
                        alphabet.map((letter, index) => (
                            <div key={index}>
                                {
                                    displayStudios(studios, letter).length > 0 && <>
                                        <div className="p-5 text-5xl font-bold" id={`section${ letter }`}>{letter}</div>
                                        <div className="flex flex-row flex-wrap text-center">
                                            { displayStudios(studios, letter) }
                                        </div>
                                    </>
                                }
                            </div>
                        ))
                    }
                    {
                        displayStudiosStartingWithSpecialChara(studios).length > 0 && <>
                            <div className="p-5 text-5xl font-bold" id="sectionSpecial">&</div>
                            <div className="flex flex-row flex-wrap text-center">{ displayStudiosStartingWithSpecialChara(studios) }</div>
                        </>
                    }
                </>                   
            }

        </div>
    )
}

export default Studio
