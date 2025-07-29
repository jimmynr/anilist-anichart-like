import { forwardRef } from "react"

const PageWrapper = forwardRef(({ children }, ref) => {
  return (
    <div ref={ref} className="flex flex-col mx-auto mt-10 w-full sm:w-[calc(100vw-10%)] md:w-[calc(100vw-5%)] lg:w-[calc(100vw-15%)] xl:w-3/4">
      { children }
    </div>
  )
})

export default PageWrapper
