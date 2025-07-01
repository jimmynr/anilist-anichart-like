import Footer from "../footer"
import NavBar from "../navBar"

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Welcome from "../welcome"
import Season from "../season"
import Period from "../season/period"
import ErrorPage from "../errorPage"
import Media from "../media"
import Studio from "../studio"
import MediaPerStudio from "../studio/mediaPerStudio"
import Search from "../welcome/search"
import SearchByFilter from "../welcome/searchByFilter"
import AiringSchedule from "../airing/airingSchedule"

import { seasonsCombinations, getCurrentSeason } from '../../anilist-api/constants'


import { fetchMediaByActualTrending, fetchMediaPopularThisSeason, fetchMediaAllTimePopular, fetchMediaTop100 } from "../../anilist-api/helpers"

const App = () => {

  const dispalyRoutes = seasonsCombinations.map((route, index) => {
    return(
      <>
        { getCurrentSeason().season === route.season 
          && getCurrentSeason().year === route.year
          && <Route index element={ <Period season={route.season} year={route.year} /> } /> }
        <Route 
          key={index} 
          path={`${route.season.toLowerCase()}/${route.year}`} 
          element={ <Period season={route.season} year={route.year} /> } 
        />
      </>
    )
  }) 

  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <NavBar />

        <Routes>
          <Route path="/" element={ <Navigate to="/search/anime" replace /> } />
          <Route path="/search" element={ <Welcome /> }>
            <Route index path="anime" element={ <Search />} />
            <Route path="trending-now" element={ <SearchByFilter title='Tendances actuelles' fetchData={fetchMediaByActualTrending} filteredBy='ACTUAL_TRENDING' /> } />
            <Route path="popular-this-season" element={ <SearchByFilter title='Populaires cette saison' fetchData={fetchMediaPopularThisSeason} filteredBy='POPULAR_CURRENT_SEASON' /> } />
            <Route path="upcoming" element={ <SearchByFilter title='Tendances à venir' fetchData={fetchMediaPopularThisSeason} filteredBy='POPULAR_NEXT_SEASON' /> } />
            <Route path="all-time-popular" element={ <SearchByFilter title='Top populaire - Tous les temps' fetchData={fetchMediaAllTimePopular} filteredBy='POPULAR_ALL_TIME' /> } />
            <Route path="top-100" element={ <SearchByFilter title='Top 100' fetchData={fetchMediaTop100} filteredBy='TOP_100' /> } />
          </Route>
          <Route path="/season" element={ <Season /> }>
            { dispalyRoutes }
          </Route>
          <Route path="/media/:mediaId/:mediaName" element={ <Media /> } />
          <Route path="/studio" element={ <Studio /> } />
          <Route path="/studio/:studioId/:studioName" element={ <MediaPerStudio /> } />
          <Route path="/airing" element={ <AiringSchedule />} />
          <Route path="*" element={ <ErrorPage /> } />
        </Routes>        

        <Footer />
      </Router>
    </div>
  )
}

export default App