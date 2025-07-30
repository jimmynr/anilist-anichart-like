// import "./index.css"
// import SingleMinCardsLoader from "../commonComponents/loaders/singleMinCardLoader"
import AvgCardsLoader from "../commonComponents/loaders/avgCardsLoader"
import MaxCardsLoader from "../commonComponents/loaders/maxCardsLoader"
import MinCardsLoader from "../commonComponents/loaders/minCardsLoader"
import SingleMaxCardsLoader from "../commonComponents/loaders/singleMaxCardsLoader"

const Draft = () => {

    // const displayCards =  Array.from({ length: 10 }).map((_, index) => {
    //     return <div key={index} className="w-1/3 p-1 sm:w-1/3 sm:p-1 md:w-1/4 md:p-2 lg:w-1/5 lg:p-2 mt-3">
    //         <div className="media--isloading w-full">
    //             <div className="loading-image w-full aspect-[34/48] rounded-lg"></div>
    //             <div className="loading-content">
    //                 <div className="loading-text-container">
    //                     <div className="loading-main-text"></div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // })

    // return (
    //     <div className="flex flex-col mx-auto w-full sm:w-[calc(100vw-10%)] md:w-[calc(100vw-5%)] lg:w-3/4 xl:w-3/4">
    //         <div className="mt-10">
    //             <div className="loading-header-text"></div>
    //             <div className="flex flex-wrap justify-start">
    //                 { displayCards }
    //             </div>
    //         </div>
    //     </div>
    // )

    return <div>
        <SingleMaxCardsLoader />
        <AvgCardsLoader />
        <MinCardsLoader />
        <MaxCardsLoader />
    </div>
}

export default Draft
