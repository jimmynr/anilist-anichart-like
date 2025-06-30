
const Loader = ({ header }) => {
    return(
        <>
            <div className='flex justify-center mt-30'>
                <span className='loader'></span>
            </div>
            <div className="text-center mt-20 text-[#6e859e]">Récupération {header}...</div>
        </>
    )
}

export default Loader