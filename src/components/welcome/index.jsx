import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import { searchIcon, navigationCloseIcon } from "../commonComponents/icons"

import FilterDropdown from "../commonComponents/dropdowns/filterDropdown"

import { genreOptions, yearOptions, seasonOptions, formatsOptions, statusOptions } from "../../anilist-api/constantsUtil"

import Label from "../commonComponents/headers/label"

const Welcome = () => {  
    
    /* States */
    const [filters, setFilters] = useState({
        name: "",
        genres: [],
        year: "",
        season: "",
        formats: [],
        status: ""
    })
    /* States */

    const navigateTo = useNavigate()

    useEffect(() => {
        const queryParams = new URLSearchParams();

        const { name, genres, year, season, formats, status } = filters

        if (name) queryParams.append("name", name.trim()) 
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
        <div className='bg-[#EDF1F5] text-[#6e859e] flex flex-col items-center'>
            <div className="flex flex-col mx-auto px-2 w-full sm:w-[calc(100vw-10%)] md:w-[calc(100vw-5%)] lg:w-3/4 xl:w-3/4">
                <div>
                    <div className="relative">
                        <div
                            className="*:text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 left-3"
                        >{searchIcon}</div>
                        <input
                            type="text"
                            className="text-[#6e859e] bg-white px-10 rounded-sm w-full h-10 mb-2 lg:mb-0 shadow-lg"
                            placeholder="Search..."
                            value={filters.name}
                            onChange={e => setFilters(prev => ({...prev, name: e.target.value}))}
                        />
                        <div
                            className="text-xl text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 right-3
                            hover:border hover:rounded-sm"
                            onClick={() => setFilters(prev => ({...prev, name: ""}))}
                        >{navigationCloseIcon}</div>
                    </div>
                </div>

                <div className="flex justify-between gap-5 pt-2">
                    <div className="relative w-[170px]">
                        <Label name="Year" />
                        <FilterDropdown state={filters} setState={setFilters} property="year" collection={yearOptions} allowsManyChoices={false} />
                    </div>
                    <div className="relative w-[170px]">
                        <Label name="Season" />
                        <FilterDropdown state={filters} setState={setFilters} property="season" collection={seasonOptions} allowsManyChoices={false} />
                    </div>
                    <div className="relative w-[170px]">
                        <Label name="Genres" />
                        <FilterDropdown state={filters} setState={setFilters} property="genres" collection={genreOptions} allowsManyChoices={true} />
                    </div>
                    <div className="relative w-[170px]">
                        <Label name="Format" />
                        <FilterDropdown 
                            state={filters} 
                            setState={setFilters} 
                            property="formats" 
                            collection={formatsOptions.filter(f => f.value !== null)} 
                            allowsManyChoices={true} />
                    </div>
                    <div className="relative w-[170px]">
                        <Label name="Status" />
                        <FilterDropdown state={filters} setState={setFilters} property="status" collection={statusOptions} allowsManyChoices={false} />
                    </div>
                </div>
            </div>

            <Outlet />

        </div>
    )
}

export default Welcome