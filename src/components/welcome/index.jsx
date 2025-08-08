import { Outlet, useNavigate, useLocation, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"

import { searchIcon, navigationCloseIcon } from "../commonComponents/icons"

import FilterDropdown from "../commonComponents/dropdowns/filterDropdown"

import { genreOptions, yearOptions, seasonOptions, formatsOptions, statusOptions, tagOptions } from "../../anilist-api/constantsUtil"

import Label from "../commonComponents/headers/label"

import PageWrapper from "../commonComponents/displays/wrapper"

import ViewModes from "../commonComponents/displays/view"

import { FaTags } from "react-icons/fa6"

const Welcome = () => {  
    
    /* States */
    const [filters, setFilters] = useState({
        name: "",
        genres: [],
        tags: [],
        year: "",
        season: "",
        formats: [],
        status: ""
    })

    const [clearTags, setClearTags] = useState(false)
    /* States */

    const navigateTo = useNavigate()

    useEffect(() => {
        const queryParams = new URLSearchParams();

        const { name, genres, tags, year, season, formats, status } = filters

        if (name) queryParams.append("name", name.trim()) 
        else queryParams.delete("name")

        if (genres && genres.length > 0) queryParams.append("genres", genres.join(","))
        else queryParams.delete("genres")

        if (tags && tags.length > 0) queryParams.append("tags", tags.join(","))
        else queryParams.delete("tags")

        if (year) queryParams.append("year", year)
        else queryParams.delete("year")

        if (season) queryParams.append("season", season)
        else queryParams.delete("season")

        if (formats && formats.length > 0) queryParams.append("formats", formats.join(","))
        else queryParams.delete("formats")

        if (status) queryParams.append("status", status)
        else queryParams.delete("status")

        if (name || (Array.isArray(genres) && genres.length > 0) || (Array.isArray(tags) && tags.length > 0) || year || season || (Array.isArray(formats) && formats.length) > 0 || status) {
            queryParams.append("mode", "filter")
            navigateTo(`/search/anime?${queryParams.toString()}`, { replace: true })
        } else {
            navigateTo("/search/anime")
        }
    }, [filters])

    /* url */
    const location = useLocation()
    const [searchParam] = useSearchParams()

    const mode = searchParam.get("mode")
    /* url */

    let delay

    const startDelay = () => {
        delay = setTimeout(() => {
            setClearTags(false)
        }, 2000)
    }

    const cancelDelay = () => {
        clearTimeout(delay)
    }

    const addCloseIcon = e => {
        e.currentTarget.lastElementChild.classList.remove("hidden")
        cancelDelay()
        setClearTags(true)
    }

    const removeCloseIcon = e => {
        e.currentTarget.lastElementChild.classList.add("hidden")
        startDelay()
    }

    const clearAllTags = () => {
        setFilters({
            name: "",
            genres: [],
            tags: [],
            year: "",
            season: "",
            formats: [],
            status: ""
        })
    }

    const displayTags = () => {
        const { name, year, season, status, formats, genres, tags } = filters
        
        return <div className="flex flex-wrap gap-2 text-xs text-white font-semibold">
            {
                name && name !== "" && 
                <div 
                    onMouseEnter={e => addCloseIcon(e)}
                    onMouseLeave={e => removeCloseIcon(e)}
                    onClick={() => setFilters(prev => ({...prev, name: ""}))}
                    className="bg-[#41B1EA] rounded-sm pb-1 px-2 cursor-pointer">
                    Search: <span className="capitalize">{name.toLowerCase()}</span>
                    <span className="ml-2 hidden">x</span>
                </div>}
            {
                year && year !== "" && 
                <div 
                    onMouseEnter={e => addCloseIcon(e)}
                    onMouseLeave={e => removeCloseIcon(e)}
                    onClick={() => setFilters(prev => ({...prev, year: ""}))}
                    className="bg-[#41B1EA] rounded-sm pb-1 px-2 cursor-pointer">
                    {year}
                    <span className="ml-2 hidden">x</span>
                </div>
            }
            {
                season && season !== "" && 
                <div 
                    onMouseEnter={e => addCloseIcon(e)}
                    onMouseLeave={e => removeCloseIcon(e)}
                    onClick={() => setFilters(prev => ({...prev, season: ""}))}
                    className="capitalize bg-[#41B1EA] rounded-sm pb-1 px-2 cursor-pointer">
                    {season.toLowerCase()}
                    <span className="ml-2 hidden">x</span>
                </div>
            }
            {
                status && status !== "" && 
                <div 
                    onMouseEnter={e => addCloseIcon(e)}
                    onMouseLeave={e => removeCloseIcon(e)}
                    onClick={() => setFilters(prev => ({...prev, status: ""}))}
                    className="bg-[#41B1EA] rounded-sm pb-1 px-2 cursor-pointer">
                    {statusOptions.filter(s => s.value === status)[0].label}
                    <span className="ml-2 hidden">x</span>
                </div>}
            {
                Array.isArray(formats) && formats.length > 0 && formats.map((format, index) => (
                    <div 
                        onMouseEnter={e => addCloseIcon(e)}
                        onMouseLeave={e => removeCloseIcon(e)}
                        onClick={() => setFilters(prev => ({...prev, formats: prev.formats.filter(f => f !== format)}))}
                        key={index} 
                        className="bg-[#41B1EA] rounded-sm pb-1 px-2 cursor-pointer">
                        {formatsOptions.filter(f => f.value === format)[0].label}
                        <span className="ml-2 hidden">x</span>
                    </div>
                ))
            }
            {
                Array.isArray(genres) && genres.length > 0 && genres.map((genre, index) => (
                    <div 
                        onMouseEnter={e => addCloseIcon(e)}
                        onMouseLeave={e => removeCloseIcon(e)}
                        onClick={() => setFilters(prev => ({...prev, genres: prev.genres.filter(g => g !== genre)}))}
                        key={index} 
                        className="bg-[#41B1EA] rounded-sm pb-1 px-2 cursor-pointer">
                        {genreOptions.filter(g => g.value === genre)[0].label}
                        <span className="ml-2 hidden">x</span>
                    </div>
                ))
            }
            {
                Array.isArray(tags) && tags.length > 0 && tags.map((tag, index) => (
                    <div 
                        onMouseEnter={e => addCloseIcon(e)}
                        onMouseLeave={e => removeCloseIcon(e)}
                        onClick={() => setFilters(prev => ({...prev, tags: prev.tags.filter(t => t !== tag)}))}
                        key={index} 
                        className="bg-[#41B1EA] rounded-sm pb-1 px-2 cursor-pointer">
                        {tagOptions.filter(t => t.value === tag)[0].label}
                        <span className="ml-2 hidden">x</span>
                    </div>
                ))
            }
            {
                clearTags && <div 
                    onMouseEnter={() => {
                        setClearTags(true)
                        cancelDelay()
                    }}
                    onMouseLeave={() => startDelay()}
                    onClick={() => clearAllTags()}
                    className="bg-[#6e859e] rounded-sm pb-1 px-2 cursor-pointer">
                    Clear All
                    <span className="ml-2">x</span>
                </div>
            }
        </div>
    }

    return(
        <div className='bg-[#EDF1F5] dark:bg-[#0B1622] text-[#6e859e] flex flex-col items-center'>
            <PageWrapper>
                <div>
                    <div className="relative">
                        <div
                            className="*:text-[#6e859e] absolute top-1/2 -translate-y-2/3 lg:-translate-y-1/2 left-3"
                        >{searchIcon}</div>
                        <input
                            type="text"
                            className="text-[#6e859e] bg-white dark:bg-[#151F2E] px-10 rounded-sm w-full h-10 mb-2 lg:mb-0 shadow-lg"
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
                        <FilterDropdown state={filters} setState={setFilters} property="genres" collection={[...genreOptions, ...tagOptions]} allowsManyChoices={true} />
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

                {
                    location.pathname === "/search/anime" && mode === "filter" && <div className="flex items-center justify-between mt-10">
                        <div className="flex items-center gap-2 ml-5">
                            <FaTags color="#BCBEDC" size={18} />
                            { displayTags() }
                        </div>
                        <ViewModes />
                    </div>
                }
            </PageWrapper>

            <Outlet context={[filters, setFilters]} />

        </div>
    )
}

export default Welcome