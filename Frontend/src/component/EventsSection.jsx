import { ArrowUpRight } from "lucide-react";
import EventCard from "./EventCard";
import dividerImg from "../assets/div.png";
import { useEffect, useState } from "react";
import { api } from "../api/axios.js";
import { useNavigate } from "react-router-dom"; // Add this

const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const navigate = useNavigate(); // Add this for navigation

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
      //console.log(response);
      // Fetch all events initially
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
      console.log(response)
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
    fetchAllEvents();
    setSelectedCategory("all");
    
  };

  // Add this new function to handle category click
  const handleCategoryClick = (categoryId) => {
    // Navigate to events page with category ID
    navigate(`/events/category/${categoryId}`);
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category?.name || "Uncategorized";
  };

  return (
    <section className="relative bg-[#080131] text-white px-6 md:px-16 py-28 overflow-hidden border-8">
      {/* BACKGROUND GRID */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#4c1d95 1px, transparent 1px), linear-gradient(90deg, #4c1d95 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* TOP HEADING */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-16 gap-6 relative">
          {/* LEFT TEXT */}
          <div className="max-w-2xl md:-ml-6">
            <h2
              className="
                text-5xl md:text-6xl font-semibold mb-6
                bg-linear-to-r
                from-[#7070DE] via-[#FFFEFF] to-[#C8ABFE]
                bg-clip-text text-transparent
              "
              style={{ fontFamily: "Poppins" }}
            >
              Events List
            </h2>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
              Experience a thrilling array of events, from mind-bending coding
              competitions to electrifying dance performances, and showcase your
              talents on a stage that embraces innovation.
            </p>
          </div>

          {/* RIGHT BUTTON - Changed to navigate to all events page */}
          <div className="relative w-fit">
            <button
              onClick={handleSeeAll} // Changed this
              className="flex items-center gap-2 bg-white text-black px-7 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors w-fit relative z-20"
            >
              See all <ArrowUpRight size={18} />
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

        {/* Categories Grid - Display only categories */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Display all categories */}
              {categories.slice(0, 8).map((categ, index) => (
                <div
                  key={categ._id}
                  className={index % 2 ? "lg:translate-y-2" : ""}
                >
                  <EventCard
                    title={categ.name}
                    onClick={() => handleCategoryClick(categ._id)} // Changed this
                    isActive={selectedCategory === categ._id}
                  />
                </div>
              ))}
            </div>

            {/* Show "View More Categories" if there are more than 8 */}
            {categories.length > 8 && (
              <div className="text-center mt-10">
                <button 
                  onClick={() => navigate('/categories')}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors border border-white/20"
                >
                  View More Categories ({categories.length - 8} more)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* DIVIDER IMAGE */}
      <div className="relative w-screen left-1/2 -translate-x-1/2 mt-20 pointer-events-none select-none z-10">
        <img src={dividerImg} alt="divider" className="w-full object-cover" />
      </div>
    </section>
  );
};

export default EventsSection;