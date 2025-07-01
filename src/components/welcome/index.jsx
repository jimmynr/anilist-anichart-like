import { Outlet } from "react-router-dom"

const Welcome = () => {    

    return(
        <div className='bg-[#EDF1F5] flex-grow text-[#6e859e]'>

            <div className="p-10 md:p-20 lg:p-4 xl:p-10 flex flex-row gap-5 md:gap-5 lg:gap-3 xl:gap-5">
                <div>
                    <div>Rechercher</div>
                    <input type="text" className="bg-white" />
                </div>
                <div>
                    <div>Genres</div>
                    <input type="text" className="bg-white" />
                </div>
                <div>
                    <div>Année</div>
                    <input type="text" className="bg-white" />
                </div>
                <div>
                    <div>Saison</div>
                    <input type="text" className="bg-white" />
                </div>
                <div>
                    <div>Format</div>
                    <input type="text" className="bg-white" />
                </div>
                <div>
                    <div>Studio</div>
                    <input type="text" className="bg-white" />
                </div>
            </div>

            <Outlet />

        </div>
    )
}

export default Welcome