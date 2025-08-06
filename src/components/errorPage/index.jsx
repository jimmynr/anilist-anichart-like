import oopsSticker from '../../images/Oops.png'

import { useNavigate } from 'react-router-dom'

import PageWrapper from '../commonComponents/displays/wrapper'

const ErrorPage = () => {

    const navigateTo = useNavigate()

    const goToHome = () => {
        navigateTo('/')
    }

    return (
        <PageWrapper>
            <div className="flex flex-col items-center md:flex-row p-5 bg-white rounded-xl">
                <img src={ oopsSticker } alt="Oops" className='w-1/3' />
                <div className="w-full flex flex-col justify-center items-center text-[#BCBEDC]">
                    <div className="text-center text-9xl font-bold">404</div>
                    <div className='text-sm'>Oops! The page you're looking for doesn't exist.</div>
                    <button 
                        className='mt-5 bg-[#2B2D42] text-sm font-bold px-5 py-2 rounded-lg border border-[#2B2D42]
                        hover:text-white hover:bg-gray-700 cursor-pointer'
                        onClick={goToHome}
                    >Go back to the homepage</button>
                </div>        
            </div>
        </PageWrapper>
    );
};

export default ErrorPage
