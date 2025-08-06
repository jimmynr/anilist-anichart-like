import { Link } from "react-router-dom"


const CustomMenu = ({ text, handleClick, isActive = false, count }) => {
    return <Link 
            className="group relative inline-block cursor-pointer text-[#6e859e] hover:text-[#41B1EA] text-center"
            onClick={handleClick}
            style={{ color: isActive ? "#41B1EA" : "#6e859e" }}>
        <div className="relative font-bold flex items-center">
            <div>{ text }</div>
            { count > 0 && <div className="hidden lg:block text-xs">({ count })</div> }
        </div>
        <span
            className="absolute bottom-0 left-1/2 h-[2px] w-0 bg-[#41B1EA] transition-all duration-300 group-hover:left-0 group-hover:w-full"
        />
    </Link>
}

export default CustomMenu
