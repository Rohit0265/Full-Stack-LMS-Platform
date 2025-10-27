// import React from 'react'
// import { assets } from '../../assets/assets/assets'

// const Fotter = () => {
//   return (
//     <div className='mt-10 w-full bg-black  h-70'>
//         <div className='flex flex-row justify-evenly pt-15 pr-30 pl-30'>
//         <div className='w-70'>
//             <div><img src={assets.logo_dark} alt="" width={100}/></div>
//             <p className='text-gray-300/80 pt-4'>Lorem ipsum dolor sit amet consectetur apisicing elit.<br/> Voluptatibus nam, o harum blanditiptates accusantium quia?</p>
//         </div>
//         <div className='w-70 text-gray-200'>
            
//             <h2 className='text-lg'>Company</h2>
//             <ul className='pt-4 pl-3 text-sm'>
//               <li className='pb-1'><a href="">Home</a></li>
//               <li className='pb-1'><a  href="">About Us</a></li>
//               <li className='pb-1'><a href="">Contact Us</a></li>
//               <li className='pb-1'><a  href="">Privacy Policy</a></li>
//             </ul>
//         </div>
//         <div className='w-70 hidden md:flex md:flex-col text-white'>
//           <h2 className='font-semibold'>Subscribe to our newsletter</h2>
//           <p className='pt-2 text-gray-200/90'>The latest news, articles, and resources, sent to your inbox weekly.</p>
//           <div className='pt-3 gap-2 flex'>
//           <input className='border w-45 pr-1 rounded-md pl-2' type="email" placeholder='Enter your mail'/>
//           <button className='pl-5 pr-5 pt-2 pb-2 bg-blue-600 rounded-md cursor-pointer'>Subscribe</button>

//           </div>
//         </div>
//         </div>

//         <div className='border mt-8 mr-50 ml-50 mx-auto mb-3 border-white'></div>
//         <p className='text-gray-200/80 text-center'>Copyright 2024 © GreatStack. All Right Reserved.</p>


//     </div>
//   )
// }

// export default Fotter

import React from 'react'
import { assets } from '../../assets/assets/assets'

const Footer = () => {
  return (
    // 1. Main container: Set background color and sufficient padding
    <div className='mt-10 w-full bg-black py-12 px-4 md:px-8'> 
        
        {/* 2. Content Wrapper: Use a responsive grid or flex to control column layout */}
        <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-x-12 lg:gap-x-16'>

            {/* Column 1: Logo & Description */}
            <div className='col-span-1 lg:col-span-1'> 
                <div><img src={assets.logo_dark} alt="Logo" width={100}/></div>
                <p className='text-gray-300/80 mt-4 text-sm'>
                    Lorem ipsum dolor sit amet consectetur apisicing elit. Voluptatibus nam, o harum blanditiptates accusantium quia?
                </p>
            </div>
            
            {/* Column 2: Company Links */}
            <div className='col-span-1 md:col-start-2 lg:col-start-3 text-gray-200'>
                <h2 className='text-lg font-bold mb-3'>Company</h2>
                <ul className='space-y-2 text-sm'>
                    <li><a href="#" className='hover:text-white transition duration-300'>Home</a></li>
                    <li><a href="#" className='hover:text-white transition duration-300'>About Us</a></li>
                    <li><a href="#" className='hover:text-white transition duration-300'>Contact Us</a></li>
                    <li><a href="#" className='hover:text-white transition duration-300'>Privacy Policy</a></li>
                </ul>
            </div>

            {/* Column 3: Subscribe/Newsletter (visible on MD and larger screens) */}
            <div className='col-span-1 md:col-span-2 lg:col-span-1 text-white mt-4 md:mt-0'> 
                <h2 className='font-semibold'>Subscribe to our newsletter</h2>
                <p className='pt-2 text-gray-200/90 text-sm'>The latest news, articles, and resources, sent to your inbox weekly.</p>
                
                {/* Email Input and Button */}
                <div className='pt-4 flex flex-col sm:flex-row gap-3'>
                    <input 
                        className='p-2 w-full sm:flex-1 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500' 
                        type="email" 
                        placeholder='Enter your email'
                    />
                    <button className='py-2 px-4 bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700 transition duration-300'>
                        Subscribe
                    </button>
                </div>
            </div>
        </div>

        {/* Separator Line */}
        <div className='border-t border-gray-700 mt-10 mb-6 max-w-7xl mx-auto'></div> 
        
        {/* Copyright */}
        <p className='text-gray-200/80 text-center text-sm'>Copyright 2024 © GreatStack. All Right Reserved.</p>
    </div>
  )
}

export default Footer