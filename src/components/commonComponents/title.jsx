import { Link } from "react-router-dom"

const Title = ({ title, isLink, path }) => {
    return (
        isLink ? <Link className="text-3xl font-extrabold text-[#5C728A]" to={path}>{ title }</Link>
        : <div className="text-3xl font-extrabold text-[#5C728A]">{ title }</div>
    )
}

export default Title