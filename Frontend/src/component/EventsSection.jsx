import { ArrowUpRight } from "lucide-react";
import EventCard from "./EventCard";
import dividerImg from "../assets/div.png";
import { useEffect, useState } from "react";
import { api } from "../api/axios.js";
import { useNavigate } from "react-router-dom"; 
import Line from "../assets/line.svg"

const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      fetchAllEvents();
    } else {
      fetchEventsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/category/get");
      setCategories(response.data.data || []);

      fetchAllEvents();
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories");
      setLoading(false);
    }
  };

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/events");
     
      setEvents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const fetchEventsByCategory = async (categoryId) => {
    try {
      setLoading(true);
      const response = await api.get(`/events?category=${categoryId}`);
      console.log(response)
      setEvents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching events by category:", error);
      setError("Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSeeAll = () => {
   navigate("/events")
    
  };

  // this is handling category
  const handleCategoryClick = (categ) => {
    // Navigate to events page with category ID
    navigate(`/events?filter=${categ?._id}`);
  
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category?.name || "Uncategorized";
  };

  return (
    <section 
      className="relative bg-transparent text-white px-6 md:px-6 pt-10 bg-[radial-gradient(ellipse_at_center,_#4C2580_-100%,_#13092E_100%)]"
    >
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#6d4cff 1px, transparent 1px), linear-gradient(90deg, #6d4cff 1px, transparent 1px)",
          backgroundSize: "110px 300px",
        }}
      />

      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="absolute mr-10 xl:-mt-16 md:-right-12 md:top-16 max-md:hidden ">
          <img 
          className="w-450 "
          src={Line} alt="" />
        </div>
        {/* TOP HEADING */}
        <div className="flex flex-col items-center md:flex-row justify-between sm:mb-6 mx-10 relative lg:h-[123] ">
          {/* LEFT TEXT */}
          <div className="max-w-2xl ">
            <h2
              className="
                text-5xl sm:text-6xl text-center sm:text-start font-semibold mb-6
                bg-linear-to-r
                from-[#7070DE] via-[#FFFEFF] to-[#C8ABFE]
                bg-clip-text text-transparent
              "
              style={{ fontFamily: "Poppins" }}
            >
              Events List
            </h2>

            <p className="text-white text-sm text-center sm:text-normal md:text-base leading-relaxed mb-6 milonga">
              Experience a thrilling array of events, from mind-bending coding
              competitions to electrifying dance performances, and showcase your
              talents on a stage that embraces innovation.
            </p>
          </div>

          {/* RIGHT BUTTON */}
            <div className="relative h-full flex ">
              <button
                onClick={handleSeeAll} 
                className="flex items-center gap-2 bg-white text-black px-10 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors w-fit relative z-20 text-lg max-md:w-40"
              >
                See all <ArrowUpRight size={18}  className="font-bold"/>
              </button>
            </div>

        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-400">Loading events...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-red-400 mb-2">Error loading events</p>
              <p className="text-gray-400 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && !error && (
          <>
          <div className="
              grid
              grid-cols-2
              sm:grid-cols-2
              lg:grid-cols-3
              gap-2

              /* Mobile size control */
              w-[320px] h-[360px]
              mx-auto -mb-25 mt-5

              /* Reset size on tablet+ */
              sm:w-auto sm:h-auto sm:-mb-0 

              /* Existing desktop offsets */
              md:ml-12
              md:-mt-10
              lg:mt-2
              xl:mt-20
            "
          >
              {/* Display all categories */}
              {categories.slice(0, 9).map((categ, index) => (
                <div
                  key={categ._id}>
                  <EventCard
                    title={categ.name}
                    onClick={() => handleCategoryClick(categ)} 
                    isActive={selectedCategory === categ._id}
                  />
                </div>
              ))}
            </div>
          </>
        )}
        

      </div>

      <div className="absolute xl:-bottom-65 z-1 right-8 lg:right-5 lg:-bottom-50 md:-bottom-20 max-md:hidden">
        <img 
        src={Line} alt="" className="xl:w-350 lg:w-282 md:w-230" />
      </div>


      {/* DIVIDER IMAGE */}
      <div className="overflow-visible h-20 relative w-screen left-1/2 -translate-x-1/2 mt-15 pointer-events-none select-none z-10">
        <img src={dividerImg} alt="divider" className="w-full absolute -bottom-8 object-cover z-15" />
      </div>
    </section>
  );
};

export default EventsSection;