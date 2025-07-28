import "./minCardsLoader.css"

const SingleMinCardsLoader = () => {

    return <div className="w-1/3 p-1 sm:w-1/3 sm:p-1 md:w-1/4 md:p-2 lg:w-1/5 lg:p-2 mt-3">
        <div className="media--isloading w-full">
            <div className="loading-image w-full aspect-[34/48] rounded-lg"></div>
            <div className="loading-content">
                <div className="loading-text-container">
                    <div className="loading-main-text"></div>
                </div>
            </div>
        </div>
    </div>
}

export default SingleMinCardsLoader
