import { Link } from "react-router-dom"

const Title = ({ title, isLink = false, path = "" }) => {
    return (
        isLink ? <Link className="px-4 text-2xl font-bold text-[#5C728A]" to={path}>{ title.toUpperCase() }</Link>
        : <div className="px-4 text-2xl font-bold text-[#5C728A]">{ title }</div>
    )
}

export default Title