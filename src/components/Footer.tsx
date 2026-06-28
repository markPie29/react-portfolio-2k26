import React from 'react';

const Footer = () => {
    return (
        <footer className="relative z-10 w-full py-20 bg-bg border-t border-white/10 mt-20 flex flex-col items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl md:text-4xl font-neutralfacebold text-white mb-4">Let's Connect</h2>
                <p className="text-gray-400 font-sans max-w-md mx-auto mb-8">
                    Feel free to reach out for collaborations or just a friendly hello.
                </p>
                <div className="flex gap-6 justify-center text-2xl text-gray-400">
                    <a href="#" className="hover:text-accent transition-colors duration-300">
                        <i className='bx bxl-facebook-circle'></i>
                    </a>
                    <a href="#" className="hover:text-accent transition-colors duration-300">
                        <i className='bx bxl-github' ></i>
                    </a>
                    <a href="#" className="hover:text-accent transition-colors duration-300">
                        <i className='bx bxl-linkedin-square'></i>
                    </a>
                    <a href="#" className="hover:text-accent transition-colors duration-300">
                        <i className='bx bxl-discord'></i>
                    </a>
                </div>
            </div>
            <div className="mt-16 text-sm text-gray-500 font-sans tracking-widest uppercase">
                &copy; 2026 Mark Angelo Isulat
            </div>
        </footer>
    );
};

export default Footer;
