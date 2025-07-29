import "./index.css"

import PageWrapper from "../displays/wrapper"

const AvgCardsLoader = ({ main = true }) => {

    const displayCards =  Array.from({ length: 6 }).map((_, index) => {
        const display = index % 3 !== 0

        return <div className="media--isloading flex items-center w-full mt-3 bg-white rounded-md p-2">
            <div className="loading-image w-16 h-24 md:w-18 md:h-26"></div>
            <div className="flex flex-col md:flex-row md:gap-x-4 px-4 w-full">
                <div className="flex flex-col gap-y-2 md:gap-y-4 w-full md:w-2/5 lg:1/2">
                    <div className="animated h-4.5 w-2/4 mb-2.5"></div>
                    <div className="flex gap-2 flex-wrap">
                        {
                            Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="animated text-[#E0E8EF] text-xs py-0.5 px-4 rounded-4xl">
                                    Genre
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="flex items-center flex-wrap md:ml-4 mt-2 md:mt-0 w-full md:w-3/5 lg:1/2">
                    { 
                        display && <div className="hidden md:flex gap-1 items-center mr-2 md:mr-0 md:w-1/5">
                            <div className="animated py-1 h-5 w-5 rounded-full">
                            </div>
                            <div className="animated py-1 h-2.5 w-1/3">
                            </div>
                        </div>
                    }
                    <div className="flex items-center gap-x-2 md:flex-col mr-2 md:mr-0 md:w-2/5">
                        <div className="animated h-2.5 w-10 md:w-1/2 mb-2.5"></div>
                        <div className="animated h-2.5 w-20 md:w-3/4 mb-2.5"></div>
                    </div>
                    <div className="flex items-center gap-x-2 md:flex-col mr-2 md:mr-0 md:w-2/5">
                        <div className="animated h-2.5 w-6 md:w-1/2 mb-2.5"></div>
                        <div className="animated h-2.5 w-15 md:w-3/4 mb-2.5"></div>
                    </div>
                </div>
            </div>
        </div>
    })

    return (
        main ? <PageWrapper>
            <div className="loading-header-text animated"></div>
            <div className="flex flex-wrap justify-start">
                { displayCards }
            </div>
        </PageWrapper>
        : <div className="flex flex-col mx-auto mt-10 w-full">
            <div className="flex flex-wrap justify-start">
                { displayCards }
            </div>
        </div>
    )
}

export default AvgCardsLoader
