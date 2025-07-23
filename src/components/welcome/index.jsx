import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import { IoIosClose } from "react-icons/io"
import { IoIosSearch } from "react-icons/io"
import { IoIosArrowDown } from "react-icons/io"

import { anime_years, anime_seasons_en } from "../../anilist-api/constants"

const Welcome = () => {    

    const formats = [
        "TV",
        "MOVIE",
        "TV_SHORT",
        "SPECIAL",
        "OVA",
        "ONA",
        "MUSIC"
      ]

    const genres = [
        "Action",
        "Adventure",
        "Comedy",
        "Drama",
        "Ecchi",
        "Fantasy",
        "Horror",
        "Mahou Shoujo",
        "Mecha",
        "Music",
        "Mystery",
        "Psychological",
        "Romance",
        "Sci-Fi",
        "Slice of Life",
        "Sports",
        "Supernatural",
        "Thriller"
      ]

    const [filters, setFilters] = useState({
        name: "",
        genres: [],
        year: "",
        season: "",
        formats: [],
        status: ""
    })

    const statuses = [
        "FINISHED",       
        "RELEASING",      
        "NOT_YET_RELEASED", 
        "CANCELLED"       
    ]
      

    const navigateTo = useNavigate()

    // const [animationStudios, setAnimationStudios] = useState([])

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const result = await fetchAllStudios()
    //         console.log(result)
    //         setAnimationStudios(result.filter(r => r.isAnimationStudio).map(r => r.name))
    //     }

    //     fetchData()
    // }, [])

    useEffect(() => {
        const queryParams = new URLSearchParams();

        const { name, genres, year, season, formats, status } = filters

        if (name) queryParams.append("name", name) 
        else queryParams.delete("name")

        if (genres && genres.length > 0) queryParams.append("genres", genres.join(","))
        else queryParams.delete("genres")

        if (year) queryParams.append("year", year)
        else queryParams.delete("year")

        if (season) queryParams.append("season", season)
        else queryParams.delete("season")

        if (formats && formats.length > 0) queryParams.append("formats", formats.join(","))
        else queryParams.delete("formats")

        if (status) queryParams.append("status", status)
        else queryParams.delete("status")

        if (name || genres.length > 0 || year || season || formats.length > 0 || status) {
            queryParams.append("mode", "filter")
            navigateTo(`/search/anime?${queryParams.toString()}`, { replace: true })
        }
    }, [filters])

    return(
        <div className='bg-[#EDF1F5] flex-grow text-[#6e859e]'>

            <div className="p-10 md:p-20 lg:p-4 xl:p-10 flex flex-row gap-5 md:gap-5 lg:gap-3 xl:gap-5">
                <div>
                    <div>Rechercher</div>
                    <div className="relative">
                        <IoIosSearch 
                            className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 left-1
                            hover:border hover:rounded-sm"
                        />
                        <input
                            type="text"
                            className="text-[#6e859e] bg-white px-10 rounded-sm w-full h-8 mb-2 lg:mb-0"
                            value={filters.name}
                            onChange={e => setFilters(prev => ({...prev, name: e.target.value}))}
                        />
                        <IoIosClose
                            className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
                            hover:border hover:rounded-sm"
                            onClick={() => setFilters(prev => ({...prev, name: ""}))}
                        />
                    </div>
                </div>
                <div className="relative">
                    <div>Genres</div>
                    <div className="relative">
                        <input
                            type="text"
                            className="text-[#6e859e] bg-white pl-2 pr-10 rounded-sm w-full h-8 mb-2 lg:mb-0"
                            // onChange={e => setFilters(prev => ({...prev, genres: e.target.value}))}
                        />
                        { filters.genres && filters.genres.length === 0 && <IoIosArrowDown 
                                className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
                                hover:border hover:rounded-sm"
                            />
                        }
                        
                        { filters.genres && filters.genres.length > 0 &&
                            <IoIosClose
                                className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
                                hover:border hover:rounded-sm"
                                onClick={() => setFilters(prev => ({...prev, genres: []}))}
                            />
                        }           
                    </div>
                    <div className="absolute mt-2 p-2 rounded-sm w-full bg-white">
                        {
                            genres.map((genre, index) => {
                                return <div 
                                key={index} 
                                onClick={() =>
                                    setFilters(prev => {
                                      const alreadySelected = prev.genres.includes(genre)
                                      const newGenres = alreadySelected
                                        ? prev.genres.filter(g => g !== genre)
                                        : [...prev.genres, genre]
                                  
                                      return {
                                        ...prev,
                                        genres: newGenres
                                      }
                                    })
                                  }
                                >{genre}</div>
                            })
                        }
                    </div>
                </div>
                <div className="relative">
                    <div>Année</div>
                    <div className="relative">
                        <input
                            type="text"
                            className="text-[#6e859e] bg-white pl-2 pr-10 rounded-sm w-full h-8 mb-2 lg:mb-0"
                            // onChange={e => setFilters(prev => ({...prev, year: e.target.value}))}
                        />
                        { filters.year === "" && <IoIosArrowDown 
                                className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
                                hover:border hover:rounded-sm"
                            />
                        }
                        
                        { filters.year !== "" &&
                            <IoIosClose
                                className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
                                hover:border hover:rounded-sm"
                                onClick={() => setFilters(prev => ({...prev, year: prev.season !== "" ? new Date().getFullYear() : ""}))}
                            />
                        } 
                    </div>
                    <div className="absolute mt-2 p-2 rounded-sm w-full bg-white">
                        {
                            anime_years.map((year, index) => {
                                return <div 
                                key={index} 
                                onClick={() =>
                                    setFilters(prev => ({...prev, year}))
                                  }
                                >{year}</div>
                            })
                        }
                    </div>

                </div>
                <div className="relative">
                    <div>Saison</div>
                    <div className="relative">
                        <input
                            type="text"
                            className="text-[#6e859e] bg-white pl-2 pr-10 rounded-sm w-full h-8 mb-2 lg:mb-0"
                            // onChange={e => setFilters(prev => ({...prev, season: e.target.value}))}
                        />
                        { filters.season === "" && <IoIosArrowDown 
                                className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
                                hover:border hover:rounded-sm"
                            />
                        }
                        
                        { filters.season !== "" &&
                            <IoIosClose
                                className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
                                hover:border hover:rounded-sm"
                                onClick={() => setFilters(prev => ({...prev, season: ""}))}
                            />
                        } 
                    </div>
                    <div className="absolute mt-2 p-2 rounded-sm w-full bg-white">
                        {
                            anime_seasons_en.map((season, index) => {
                                return <div 
                                key={index} 
                                onClick={() =>
                                    setFilters(prev => ({...prev, season, year: prev.year === "" && new Date().getFullYear() }))
                                  }
                                >{season}</div>
                            })
                        }
                    </div>
                </div>
                <div className="relative">
                    <div>Format</div>
                    <div className="relative">
                        <input
                            type="text"
                            className="text-[#6e859e] bg-white pl-2 pr-10 rounded-sm w-full h-8 mb-2 lg:mb-0"
                            // onChange={e => setFilters(prev => ({...prev, formats: e.target.value}))}
                        />
                        { filters.formats && filters.formats.length === 0 && <IoIosArrowDown 
                                className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
                                hover:border hover:rounded-sm"
                            />
                        }
                        
                        { filters.formats && filters.formats.length > 0 &&
                            <IoIosClose
                                className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
                                hover:border hover:rounded-sm"
                                onClick={() => setFilters(prev => ({...prev, formats: []}))}
                            />
                        }           
                    </div>
                    <div className="absolute mt-2 p-2 rounded-sm w-full bg-white">
                        {
                            formats.map((format, index) => {
                                return <div 
                                key={index} 
                                onClick={() =>
                                    setFilters(prev => {
                                      const alreadySelected = prev.formats.includes(format)
                                      const newFormats = alreadySelected
                                        ? prev.formats.filter(f => f !== format)
                                        : [...prev.formats, format]
                                  
                                      return {
                                        ...prev,
                                        formats: newFormats
                                      }
                                    })
                                  }
                                >{format}</div>
                            })
                        }
                    </div>
                </div>
                {/* <div className="relative">
                    <div>Studio</div>
                    <div className="relative">
                        <input
                            type="text"
                            className="text-[#6e859e] bg-white pl-2 pr-10 rounded-sm w-full h-8 mb-2 lg:mb-0"
                            // onChange={e => setFilters(prev => ({...prev, studios: e.target.value}))}
                        />
                        { filters.studios && filters.studios.length === 0 && <IoIosArrowDown 
                                className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
                                hover:border hover:rounded-sm"
                            />
                        }
                        
                        { filters.studios && filters.studios.length > 0 &&
                            <IoIosClose
                                className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
                                hover:border hover:rounded-sm"
                                onClick={() => setFilters(prev => ({...prev, studios: []}))}
                            />
                        }           
                    </div>
                    <div className="absolute mt-2 p-2 rounded-sm w-full bg-white">
                        {
                            animationStudios && animationStudios.map((studio, index) => {
                                return <div 
                                key={index} 
                                onClick={() =>
                                    setFilters(prev => {
                                      const alreadySelected = prev.studios.includes(studio)
                                      const newStudios = alreadySelected
                                        ? prev.studios.filter(s => s !== studio)
                                        : [...prev.studios, studio]
                                  
                                      return {
                                        ...prev,
                                        studios: newStudios
                                      }
                                    })
                                  }
                                >{studio}</div>
                            })
                        }
                    </div>
                </div> */}
                <div className="relative">
                    <div>Statut</div>
                    <div className="relative">
                        <input
                            type="text"
                            className="text-[#6e859e] bg-white pl-2 pr-10 rounded-sm w-full h-8 mb-2 lg:mb-0"
                            // onChange={e => setFilters(prev => ({...prev, status: e.target.value}))}
                        />
                        { filters.status === "" && <IoIosArrowDown 
                                className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
                                hover:border hover:rounded-sm"
                            />
                        }
                        
                        { filters.status !== "" &&
                            <IoIosClose
                                className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-1
                                hover:border hover:rounded-sm"
                                onClick={() => setFilters(prev => ({...prev, status: ""}))}
                            />
                        } 
                    </div>
                    <div className="absolute mt-2 p-2 rounded-sm w-full bg-white">
                        {
                            statuses.map((status, index) => {
                                return <div 
                                key={index} 
                                onClick={() =>
                                    setFilters(prev => ({...prev, status}))
                                  }
                                >{status}</div>
                            })
                        }
                    </div>
                </div>
            </div>

            <Outlet />

        </div>
    )
}

export default Welcome