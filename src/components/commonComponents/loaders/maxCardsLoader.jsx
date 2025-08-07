import "./index.css"

import PageWrapper from "../displays/wrapper"

import { useMediaQuery } from "react-responsive"

const MaxCardsLoader = ({ main = true }) => {

    const customMediaQuerie = useMediaQuery({ minWidth: 920 })

    const cardWidth = customMediaQuerie ? "w-1/2" : "w-full"

    const displayCards =  Array.from({ length: 6 }).map((_, index) => {
        const display = index % 3 !== 0

        return <div key={index} className={cardWidth}>           
            
            <div className="media--isloading w-full">
                <div className='flex h-64 max-h-64 m-4 rounded-md'>
                    <div className="loading-image w-full aspect-[34/48] rounded-lg"></div>
                    <div className="bg-white dark:bg-[#151F2E] w-full min-w-44 p-5 relative">
                        <div className="animated text-[#E0E8EF] dark:text-[#192A3C] text-xs font-medium mb-2.5 px-2.5 py-0.5 rounded-full w-fit">
                            Status
                        </div>
                        <div className="flex justify-between items-center mb-2.5">
                            <div className="animated py-1 h-2.5 w-2/4">
                            </div>
                            { 
                                display && <div className="flex items-center w-1/4 gap-x-1">
                                    <div className="animated py-1 h-5 w-5 rounded-full">
                                    </div>
                                    <div className="animated py-1 h-2.5 w-1/3">
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="animated h-4.5 w-2/4 mb-2.5"></div>
                        <div className="animated h-20 w-full"></div>  
                        <div className="mt-4 p-2 absolute bottom-0 left-0 w-full flex flex-wrap justify-center gap-2">
                            {
                                Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="animated text-[#E0E8EF] dark:text-[#192A3C] text-xs py-0.5 px-4 rounded-4xl">
                                        Genre
                                    </div>
                                ))
                            }
                        </div>                     
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

export default MaxCardsLoader
