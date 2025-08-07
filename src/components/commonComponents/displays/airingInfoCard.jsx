import { Link } from "react-router-dom"

const AiringInfoCard = ({ media, airingInfo = null }) => {

    return <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
        <Link
            to={`/media/${ media.id }/${ media.title.romaji }`}
            className="flex items-center bg-white dark:bg-[#2B2D42] rounded-md m-2"
        >
            <img src={ media.coverImage.medium } alt="Cover Image" className="w-12.5 h-16 min-w-12.5 min-h-16" />

            <div className="p-2 text-[#6e859e] hover:text-[#41B1EA] w-full min-w-0">
                <div className="text-sm font-bold truncate overflow-hidden overflow-ellipsis whitespace-nowrap">{ media.title.romaji }</div>
                <div className="text-xs font-semibold">{ `Ep ${airingInfo.episode} at ${
                    new Date(airingInfo.airingAt * 1000).toLocaleString('en-EN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                }` }</div>
            </div>
        </Link>
    </div>
}

export default AiringInfoCard
