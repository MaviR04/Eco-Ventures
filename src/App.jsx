import { useState } from 'react'
import './App.css'
import masonryImages from './masonry.json' with {type:'json'}
import Masonry from './components/Masonry'
import SplitText from './components/SplitText'
import { motion } from 'motion/react'
import { NavLink } from 'react-router'

function App() {
  
  const {items} = masonryImages;
  console.log(items)

  return (
    <div>
      <div className="relative h-screen">
        <motion.img
          src="/images/SplashBanner.webp"
          alt=""
          className="absolute h-screen w-full object-cover rounded-b-2xl"
          style={{
            WebkitMaskImage: "radial-gradient(circle at top center, rgba(0,0,0,1) var(--maskSize), rgba(0,0,0,0) calc(var(--maskSize) + 20%))",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "top",
            WebkitMaskSize: "200% 200%",
            maskImage: "radial-gradient(circle at top center, rgba(0,0,0,1) var(--maskSize), rgba(0,0,0,0) calc(var(--maskSize) + 20%))",
            maskRepeat: "no-repeat",
            maskPosition: "top",
            maskSize: "200% 200%",
          }}
          initial={{ "--maskSize": "0%" }}
          animate={{ "--maskSize": "70%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <div>
          <SplitText
          text="Venture Where Your Heart Desires"
          className="text-2xl w-full md:text-6xl font-bold font-raleway text-center mt-10 "
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
        </div>
        <motion.p initial={{y:40, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:1, delay:0.5}} className="text-center relative z-1 md:text-xl text-sm md:backdrop-blur-sm backdrop-blur-xs font-dmsans mt-5 rounded-2xl p-4 w-3-4 ">
          Explore the untamed beauty of the UK on a journey that respects our planet. Our eco-friendly hiking and cycling tours are crafted to connect you with nature, from the misty Scottish Highlands to the serene Cotswold woodlands. Discover the wild heart of Britain, knowing every step you take leaves a positive footprint.
        </motion.p>
        <NavLink to="/tours" >
          <div className='relative z-1 mt-10 p-10'>
            <motion.button whileHover={{y:-10, scale:1.05}} className=" bg-emerald-500 font-semibold rounded-2xl cursor-pointer  absolute left-1/2 -translate-x-1/2 bottom-0 z-1 p-2 md:text-xl font-dmsans">Take your first steps</motion.button>
          </div>
        </NavLink>
      </div>

      
      <div className='mt-5 p-5 h-60'>
         <SplitText
          text="So much to explore, so little time"
          className="text-2xl w-full md:text-6xl font-bold font-raleway text-center mt-10  "
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
        <motion.p whileInView={{y:0, opacity:1, transition:{delay:0.2, duration:0.6 }}} initial={{y:20, opacity:0}} className="text-center font-dmsans md:text-xl test-md mb-8"> Some of the most incredible journeys start with a single step. turn the vast unknown into your next great adventure. </motion.p>
        <Masonry
          items={items}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={0.95}
          blurToFocus={true}
          colorShiftOnHover={true}
        />
      </div>
    </div>
  )
}



export default App
