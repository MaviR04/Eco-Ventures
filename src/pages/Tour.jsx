import { useLoaderData } from "react-router";
import { motion } from "motion/react";
import { delay } from "motion";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router";
import { usePushSubscription } from "../hooks/usePushSubscriptions";
import api from "../axios"

const categoryMap = {
    1: 'Hiking',
    2: 'Cycling',
    3: 'Nature Walks',
};



function Tour() {
  const navigate = useNavigate();
  const { subscribe } = usePushSubscription();
  const { user, fetchWithAuth} = useContext(AuthContext);

  async function bookTour(tourId) {
    if (user) { 
      try {
        const data = await fetchWithAuth(`http://localhost:3000/api/bookings/${tourId}`, {
          method: "POST",
        });
        console.log("Booking successful:", data);

        try {
          const sub = await subscribe();
          console.log("Push subscription created:", sub);
        } catch (err) {
          console.error("Push subscription skipped:", err,);
        }
      } catch (err) {
        console.error("Booking failed:", err.message);
      }
    } else {
      navigate("/login");
    }
  }

      const tour = useLoaderData();

    console.log(tour);
    return ( 
    <div className="mt-10 pl-4">
        <h1 className="md:text-3xl text-xl font-bold font-raleway"> {tour.title}</h1>
        <div className="pl-2 pt-1 flex gap-2 items-center md:mt-4 mt-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5 md:size-6"
            >
                <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                <path
                fillRule="evenodd"
                d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                clipRule="evenodd"
                />
            </svg>
            <p className="font-dmsans text-md md:text-lg">
                {tour.itineraries.length}{" "}
                {tour.itineraries.length > 1 ? "Days" : "Day"}
            </p>
        </div>
        <div className="pl-2 pt-1 flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p className="font-dmsans text-md md:text-lg">
            {tour.available_slots > 0
              ? `Available Slots: `
              : "No slots available"}
            <span className="font-semibold">{tour.available_slots}</span>
          </p>
        </div>
        <div className="pl-2 pt-1 flex gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="CurrentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
            </svg>
            <p className="font-dmsans text-md md:text-lg">{categoryMap[tour.category_id]}</p>
        </div>
        <div className="pl-2 pt-1 flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p className="font-dmsans text-md md:text-lg">
            <span className="font-semibold">{tour.price}$</span> Per Adult
          </p>
        </div>

        <p className="pl-2 pt-4 font-dmsans md:text-lg">
            {tour.description}
        </p>
        <div className=" overflow-x-scroll mt-5">
            <div className="flex gap-4 justify-left scroll-smooth snap-center snap-mandatory">
                {tour.images.map((img)=>(
                    <img src={img.image_url} alt="" key={img.image_id} className="w-150 h-90 object-cover rounded-2xl"/>
                ))}
            </div>
        </div>
        <div className="divider md:my-10">

        </div>
        <h2 className="text-2xl font-raleway font-semibold mt-10">Itinerary</h2>
        <motion.ul className={tour.itineraries.length > 1 ? "steps steps-vertical w-full h-90" : "steps steps-vertical w-full"}>
            {tour.itineraries.map((day)=>(
                <motion.li initial={{y:20, opacity:0}} whileInView={{y:0, opacity:1, transition:{delay:day.itinerary_id/20} }} transitition={{type:'spring', duration:1, delay:2 }}  className="step step-primary" key={day.itinerary_id}>
                   <div>    
                        <h3 className="font-dmsans text-lg md:text-xl font-semibold text-left">
                            {day.day_title}  
                        </h3>
                         <p className="text-md text-left">{day.day_description} </p>
                   </div>
                </motion.li>
            ))}
        </motion.ul>
        <div className="flex justify-center">
             <button onClick={()=>bookTour(tour.tour_id)} className="my-10 btn btn-primary text-lg font-dmsans p-2">Book Now</button>
        </div>
       
    </div> );
}

export default Tour;