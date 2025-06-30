import { Link } from 'react-router-dom'

import DarkMode from './darkMode'

const Footer = () => {
    return(
        <footer className="bg-[#11161D] px-25 py-10 text-[#BCBEDC]">
            <div className='flex flex-row justify-between mb-6'>
                <div className='flex flex-row gap-4'>
                    <span className='underline font-bold'>Thème : </span>
                    <DarkMode />
                </div>
                <div className="flex flex-col gap-6">
                    <p className='underline font-bold'>Ressources :</p>
                    <p>
                        <Link to='https://anilist.co' target='_blank'>anilist.co</Link> 
                        &nbsp;&&nbsp;
                        <Link to='http://anichart.net' target='_blank'>anichart.net</Link>
                    </p>
                </div>
            </div>
            <p className='text-center font-bold'>&copy; neməsɪs</p>
        </footer>
    )
}

export default Footer