import { Tooltip } from 'react-tooltip'

import { useState, useEffect, useRef } from 'react'

import { sortOptions } from '../../anilist-api/constants'

const Sort = ({ sortMediasBy }) => {

    const [hideSelect, setHideSelect] = useState(true)
    const [isSelected, setIsSelected] = useState(1)

    const selectRef = useRef(null)

    // clic outside and close select
    useEffect(() => {
        const handleClickOutside = (event) => {
          // Si on clique en dehors de la div référencée, on ferme
          if (selectRef.current && !selectRef.current.contains(event.target)) {
            setHideSelect(true);
          }
        };
    
        // Ajouter l'écouteur
        document.addEventListener("mousedown", handleClickOutside);
    
        // Nettoyer l'écouteur quand le composant est démonté
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (id) => {
        setIsSelected(id)

        sortMediasBy(id)

        setHideSelect(true)
    }

    const displaySortOptions = sortOptions.map((otpion, index) => {
        return (
            <div 
                key={index}
                className={ `hover:text-white hover:bg-[#41B1EA] py-1 px-10 cursor-pointer ${ isSelected === index ? 'text-[#41B1EA]' : '' }` }
                onClick={() => {
                    handleSelect(index)
                }}
            >{ otpion }</div>
        )
    })

    return (
        <div className='relative'>
            <svg
                version="1.1"
                viewBox="0 0 12 19"
                className="icon svg-icon svg-fill cursor-pointer outline-none focus:outline-non"
                style={{ height: '24px' }}
                fill="#fff"
                stroke="none"
                id='sortIcon'
                onClick={() => setHideSelect(!hideSelect)}
            >
                <g clipPath="url(#clip0)">
                <path d="M9.69 10.688H1.714c-1.518 0-2.287 1.918-1.208 3.039l3.987 4.156c.666.694 1.749.694 2.419 0l3.99-4.156c1.068-1.117.31-3.04-1.212-3.04zM5.7 16.625l-3.99-4.156h7.98L5.7 16.625zM1.71 8.312h7.977c1.517 0 2.287-1.918 1.207-3.039L6.908 1.117a1.666 1.666 0 0 0-2.419 0L.499 5.273C-.57 6.39.189 8.313 1.71 8.313zM5.7 2.375l3.99 4.156H1.71L5.7 2.375z" />
                </g>
                <defs>
                <clipPath id="clip0">
                    <path d="M0 0h11.4v19H0z" />
                </clipPath>
                </defs>
            </svg>
            <Tooltip
                anchorSelect='#sortIcon'
                content='Trier'
                place='right-end'
            />

            {
                !hideSelect && <div className='bg-white rounded-md py-1 text-sm mt-1 absolute z-10'>
                    <div 
                        className='flex flex-col text-[#BCBEDC]'
                        ref={selectRef}
                    >
                        { displaySortOptions }
                        {/* <div 
                            className='hover:text-white hover:bg-[#41B1EA] py-1 px-10 cursor-pointer'
                            onClick={e => {
                                sortMediasBy(e, mediasArray, 'TITLE_ROMAJI', selectRef.current)
                            }}
                        >Titre</div>
                        <div 
                            className='hover:text-white hover:bg-[#41B1EA] text-[#41B1EA] py-1 px-10 cursor-pointer'
                            onClick={e => {
                                sortMediasBy(e, mediasArray, 'POPULARITY_DESC', selectRef.current)
                            }}
                        >Popularité</div>
                        <div 
                            className='hover:text-white hover:bg-[#41B1EA] py-1 px-10 cursor-pointer'
                            onClick={e => {
                                sortMediasBy(e, mediasArray, 'STUDIO', selectRef.current)
                            }}
                        >Studio</div>
                        <div 
                            className='hover:text-white hover:bg-[#41B1EA] py-1 px-10 cursor-pointer'
                            onClick={e => {
                                sortMediasBy(e, mediasArray, 'START_DATE_DESC', selectRef.current)
                            }}
                        >Date</div> */}
                    </div>
                </div>
            }            
        </div>
    )
}

export default Sort