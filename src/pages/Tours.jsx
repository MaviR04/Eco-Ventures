import React, { useState, useMemo } from "react";
import { useLoaderData, NavLink } from "react-router";
import TourCard from "../components/TourCard";
import { AnimatePresence, motion } from "motion/react";

function Tours() {
  const fetchedTours = useLoaderData();
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // debounce search term 
  const [debouncedSearch, setDebouncedSearch] = useState("");
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.toLowerCase());
    }, 300); 
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Filter tours by category + search
  const filteredTours = useMemo(() => {
    let tours =
      category === "All"
        ? fetchedTours
        : fetchedTours.filter((tour) => {
            if (category === "Hiking") return tour.category_id === 1;
            if (category === "Cycling") return tour.category_id === 2;
            if (category === "Nature Walks") return tour.category_id === 3;
            return true;
          });

    if (debouncedSearch) {
      tours = tours.filter((tour) =>
        tour.title.toLowerCase().includes(debouncedSearch)
      );
    }
    return tours;
  }, [category, debouncedSearch, fetchedTours]);

  return (
    <div className="">
      {/* Search bar */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 my-6 px-4 font-dmsans">
        <input
          type="text"
          placeholder="Search tours..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-800 dark:text-white"
        />

        {/* Category filter */}
        <div className="flex flex-wrap justify-center md:gap-4 gap-2 text-white">
          {["All", "Hiking", "Cycling", "Nature Walks"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                category === cat
                  ? "bg-blue-400 text-white"
                  : "bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tour list */}
      <motion.div className="flex flex-wrap justify-left pl-4 items-center gap-5">
        <AnimatePresence mode="wait">
          {filteredTours.length === 0 ? (
            <p>No tours found</p>
          ) : (
            filteredTours.map((tour) => (
              <NavLink key={tour.tour_id} to={`/tours/${tour.tour_id}`}>
                <TourCard tour={tour} />
              </NavLink>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Tours;
