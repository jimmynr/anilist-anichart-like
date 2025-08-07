import Footer from "../footer"
import NavBar from "../navBar"

import NavigationContext from "../../context/navigationContext"
import DisplayContext from "../../context/displayContext"

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

import DocumentationPage from "../info"
import DarkModeToggle   from "../commonComponents/darkMode"
import DarkModeContext from "../../context/darkModeContext"

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
    <div className="flex flex-col min-h-screen relative">
      <DarkModeContext>
        <DisplayContext>
          <NavigationContext>
            <Router>
              <NavBar />
              <div className="fixed top-5 right-5 z-50">
                <DarkModeToggle   />
              </div>
              <div className="bg-[#EDF1F5] dark:bg-[#0B1622] flex-grow py-30">
                <Routes>
                  <Route path="/" element={ <Navigate to="/search/anime" replace /> } />
                  <Route path="/search" element={ <Welcome /> }>
                    <Route index path="anime" element={ <Search />} />
                    <Route path="trending-now" element={ <SearchByFilter title="Trending now" filteredBy='ACTUAL_TRENDING' /> } />
                    <Route path="popular-this-season" element={ <SearchByFilter title="Popular this season" filteredBy='POPULAR_CURRENT_SEASON' /> } />
                    <Route path="upcoming" element={ <SearchByFilter title="Upcoming next season" filteredBy='POPULAR_NEXT_SEASON' /> } />
                    <Route path="all-time-popular" element={ <SearchByFilter title="All time popular" filteredBy='POPULAR_ALL_TIME' /> } />
                    <Route path="top-100" element={ <SearchByFilter title="Top 100 Anime" filteredBy='TOP_100' /> } />
                  </Route>
                  <Route path="/season" element={ <Season /> }>
                    { dispalyRoutes }
                  </Route>
                  <Route path="/media/:mediaId/:mediaName" element={ <Media /> } />
                  <Route path="/studio" element={ <Studio /> } />
                  <Route path="/studio/:studioId/:studioName" element={ <MediaPerStudio /> } />
                  <Route path="/airing" element={ <AiringSchedule />} />
                  <Route path="/doc" element={ <DocumentationPage />} />
                  <Route path="*" element={ <ErrorPage /> } />
                </Routes>
              </div>
              <Footer />
            </Router>
          </NavigationContext>
        </DisplayContext>
      </DarkModeContext>
    </div>
  )
}

export default App