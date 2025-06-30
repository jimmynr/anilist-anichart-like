import { Tooltip } from 'react-tooltip'

import { useNavigate } from 'react-router-dom'

const Search = () => {

    const navigateTo = useNavigate()

    return (
        <>
            <svg
                version="1.1"
                viewBox="0 0 19 19"
                className="icon svg-icon cursor-pointer outline-none focus:outline-non"
                style={{ height: '24px' }}
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                id='searchIcon'
                onClick={ () => navigateTo('/') }
            >
                <path d="M8.708 15.042a6.333 6.333 0 1 0 0-12.667 6.333 6.333 0 0 0 0 12.667zM16.625 16.625l-3.444-3.444" />
            </svg>
            <Tooltip
                anchorSelect='#searchIcon'
                content='Rechercher'
                place='bottom-end'
            />
        </>
    )
}

export default Search