import "./index.css"

const SingleMinCardsLoader = () => {

    return <div className="media--isloading w-1/3 p-1 sm:w-1/3 sm:p-1 md:w-1/4 md:p-2 lg:w-1/5 lg:p-2 mt-3">
        <div className="loading-image w-full aspect-[34/48] rounded-lg animated"></div>
        <div className="animated py-1 h-2.5 w-1/2 mt-2.5"></div>
    </div>
}

export default SingleMinCardsLoader
