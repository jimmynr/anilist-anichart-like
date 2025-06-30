import oopsSticker from '../../images/Oops.png'

import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {

    const navigateTo = useNavigate()

    const goToHome = () => {
        navigateTo('/')
    }

    return (
        <>
        <section className="bg-[#EDF1F5] flex-grow">
            <div className="flex flex-row p-5">
                <div className='flex justify-end'>
                    <img src={ oopsSticker } alt="Oops" className='w-1/2' />
                </div>
                <div className="w-full flex flex-col justify-center items-center text-[#BCBEDC]">
                    <div className="text-center text-9xl font-bold">404</div>
                    <div>Oups, la page que vous cherchez n'existe pas !</div>
                    <button 
                        className='mt-5 bg-[#2B2D42] font-bold px-5 py-2 rounded-lg border border-[#2B2D42]
                        hover:text-white hover:bg-gray-700 cursor-pointer'
                        onClick={goToHome}
                    >Revenir vers l'accueil</button>
                </div>        
            </div>
        </section>
        </>
    );
};

export default ErrorPage;
