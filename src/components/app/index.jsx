import Footer from "../footer"
import NavBar from "../navBar"
import NavigationContext from "../../context/navigationContext"

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

import { seasonsCombination } from '../../anilist-api/constantsUtil'


import { fetchMediaByActualTrending, fetchMediaPopularThisSeason, fetchMediaAllTimePopular, fetchMediaTop100 } from "../../anilist-api/helpers"
import Info from "../info"
import Draft from "../draft"

const App = () => {

  const dispalyRoutes = seasonsCombination.map((route, index) => {
    return(
      <>
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
      <NavigationContext>
        <Router>
          <NavBar />
          <div className="bg-[#EDF1F5] min-h-lvh pt-30">
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
              <Route path="/doc" element={ <Info />} />
              <Route path="/draft" element={ <Draft />} />
              <Route path="*" element={ <ErrorPage /> } />
            </Routes>
          </div>
          <Footer />
        </Router>
      </NavigationContext>
    </div>
  )
}

export default App