import { Outlet } from "react-router-dom"

const Welcome = () => {    

    return(
        <div className='bg-[#EDF1F5] flex-grow text-[#6e859e]'>
            <Outlet />

        </div>
    )
}

export default Welcome